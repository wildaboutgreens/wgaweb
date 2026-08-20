import { Resend } from 'resend';
import { getSQL } from '@/lib/db';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface OrderForEmail {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  total_paise: number;
  purchase_type: string;
  subscription_frequency: string | null;
}

interface OrderItemForEmail {
  quantity: number;
  unit_price_paise: number;
  label: string;
  product_name: string;
}

/**
 * Send an order confirmation email via Resend.
 * Guards against double-sending by checking the confirmation_email_sent flag.
 * Returns true if email was sent, false if skipped (already sent or no email).
 */
export async function sendOrderConfirmation(
  orderId: string
): Promise<boolean> {
  const sql = getSQL();

  // Atomically check and set the email_sent flag to prevent duplicates
  const updated = await sql`
    UPDATE orders
    SET confirmation_email_sent = true
    WHERE id = ${orderId}
      AND confirmation_email_sent = false
      AND payment_status = 'paid'
    RETURNING id, customer_name, customer_email, customer_phone,
              delivery_address, total_paise, purchase_type,
              subscription_frequency
  `;

  if (updated.length === 0) {
    // Already sent, or order not paid, or order not found
    return false;
  }

  const order = updated[0] as unknown as OrderForEmail;

  if (!order.customer_email) {
    console.log(`Order ${orderId}: no customer email, skipping confirmation`);
    return false;
  }

  // Fetch order items with product info
  const items = await sql`
    SELECT oi.quantity, oi.unit_price_paise,
           pv.label, p.name AS product_name
    FROM order_items oi
    JOIN product_variants pv ON pv.id = oi.product_variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE oi.order_id = ${orderId}
  ` as unknown as OrderItemForEmail[];

  const fromEmail = process.env.FROM_EMAIL || 'orders@wildaboutgreens.com';

  // Build a simple plain-text + HTML email
  const itemLines = items.map(
    (item) =>
      `${item.product_name} (${item.label}) × ${item.quantity} — ₹${(item.unit_price_paise * item.quantity / 100).toFixed(2)}`
  );

  const totalFormatted = `₹${(order.total_paise / 100).toFixed(2)}`;
  const subscriptionNote =
    order.purchase_type === 'subscription'
      ? `\nThis is a ${order.subscription_frequency} subscription order.`
      : '';

  try {
    await getResend().emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Wild About Greens — Order Confirmed! 🌱`,
      html: `
        <h2>Thanks for your order, ${order.customer_name}!</h2>
        <p>We've received your payment of <strong>${totalFormatted}</strong>.</p>
        ${subscriptionNote ? `<p>${subscriptionNote}</p>` : ''}
        <h3>Order Details</h3>
        <ul>
          ${itemLines.map((line) => `<li>${line}</li>`).join('\n')}
        </ul>
        <p><strong>Total: ${totalFormatted}</strong></p>
        <h3>Delivery Address</h3>
        <p>${order.delivery_address}</p>
        <p>We'll deliver your fresh microgreens soon! 🌿</p>
        <hr />
        <p style="color: #888; font-size: 12px;">Wild About Greens — Fresh microgreens, delivered.</p>
      `,
    });

    console.log(`Order ${orderId}: confirmation email sent to ${order.customer_email}`);
    return true;
  } catch (error) {
    console.error(`Order ${orderId}: failed to send confirmation email`, error);
    // Don't throw — email failure shouldn't break the payment flow
    // Reset the flag so a retry can be attempted
    await sql`
      UPDATE orders SET confirmation_email_sent = false WHERE id = ${orderId}
    `;
    return false;
  }
}

// ─── Restaurant / Bulk Inquiry Notification ──────────────────────────────────

interface InquiryForEmail {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  email: string | null;
  message: string | null;
}

/**
 * Send a notification email to the business owner when a new
 * restaurant/bulk inquiry is submitted.
 */
export async function sendInquiryNotification(
  inquiry: InquiryForEmail
): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || 'orders@wildaboutgreens.com';
  // Send to the business owner's email (FROM_EMAIL doubles as the admin inbox for MVP)
  const toEmail = process.env.FROM_EMAIL || 'orders@wildaboutgreens.com';

  try {
    await getResend().emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `🏢 New Bulk Inquiry: ${inquiry.business_name}`,
      html: `
        <h2>New Restaurant / Bulk Inquiry</h2>
        <table style="border-collapse: collapse;">
          <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Business</td><td>${inquiry.business_name}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Contact</td><td>${inquiry.contact_name}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Phone</td><td>${inquiry.phone}</td></tr>
          ${inquiry.email ? `<tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Email</td><td>${inquiry.email}</td></tr>` : ''}
        </table>
        ${inquiry.message ? `<h3>Message</h3><p>${inquiry.message}</p>` : ''}
        <hr />
        <p style="color: #888; font-size: 12px;">Inquiry ID: ${inquiry.id}</p>
      `,
    });

    console.log(`Inquiry ${inquiry.id}: notification email sent`);
    return true;
  } catch (error) {
    console.error(`Inquiry ${inquiry.id}: failed to send notification`, error);
    return false;
  }
}
