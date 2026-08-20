import { getSQL } from '@/lib/db';

/**
 * Atomically decrement stock for all items in a paid order.
 * Uses the stock_decremented flag as a dedup guard so that if both
 * the verify endpoint and the webhook fire for the same payment,
 * stock is only decremented once.
 *
 * Returns true if stock was decremented, false if already done or order not eligible.
 */
export async function decrementStock(orderId: string): Promise<boolean> {
  const sql = getSQL();

  // Atomically claim the decrement — only one caller wins this UPDATE
  const claimed = await sql`
    UPDATE orders
    SET stock_decremented = true
    WHERE id = ${orderId}
      AND stock_decremented = false
      AND payment_status = 'paid'
    RETURNING id
  `;

  if (claimed.length === 0) {
    // Already decremented, or order not paid, or not found
    return false;
  }

  // Fetch the order's line items
  const items = await sql`
    SELECT product_variant_id, quantity
    FROM order_items
    WHERE order_id = ${orderId}
  `;

  // Decrement each variant's stock
  for (const item of items) {
    await sql`
      UPDATE product_variants
      SET stock_qty = GREATEST(stock_qty - ${item.quantity as number}, 0)
      WHERE id = ${item.product_variant_id}
    `;
  }

  console.log(`Order ${orderId}: stock decremented for ${items.length} variant(s)`);
  return true;
}
