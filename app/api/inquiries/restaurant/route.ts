import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';
import { sendInquiryNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();
    const { business_name, contact_name, phone, email, message } = body;

    if (!business_name || !contact_name || !phone) {
      return NextResponse.json(
        { error: 'business_name, contact_name, and phone are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO business_inquiries (business_name, contact_name, phone, email, message)
      VALUES (${business_name}, ${contact_name}, ${phone}, ${email || null}, ${message || null})
      RETURNING id
    `;

    // Notify Gaurav about the new inquiry (fire-and-forget)
    sendInquiryNotification({
      id: result[0].id as string,
      business_name,
      contact_name,
      phone,
      email: email || null,
      message: message || null,
    }).catch((err) =>
      console.error('Failed to send inquiry notification:', err)
    );

    return NextResponse.json(
      { message: 'Thank you for your inquiry! We will get back to you shortly.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('restaurant inquiry error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
