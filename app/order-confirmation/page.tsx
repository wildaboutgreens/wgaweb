'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

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
      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          Order ID: <code className="bg-gray-100 px-2 py-1 rounded">{orderId}</code>
        </p>
      )}
      <p className="text-gray-600 mb-8">
        You&apos;ll receive a confirmation email shortly with your order details.
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
