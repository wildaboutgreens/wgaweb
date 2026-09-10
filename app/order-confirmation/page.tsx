'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="mb-6">
        <span className="text-6xl">✅</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 mb-2">
        Your order has been placed successfully. We&apos;ll prepare your fresh microgreens right away.
      </p>
      {orderNumber && (
        <div className="my-6 inline-block bg-green-50 border-2 border-green-300 rounded-xl px-6 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
          <p className="text-2xl font-bold text-green-700 tracking-widest">{orderNumber}</p>
        </div>
      )}
      <p className="text-gray-600 mb-8">
        You&apos;ll receive a confirmation email shortly with your order details.
        Use your order number to{' '}
        <Link href="/track-order" className="text-green-700 underline hover:text-green-800">
          track your order
        </Link>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
        <Link href="/" className="btn-secondary">Back to Home</Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
