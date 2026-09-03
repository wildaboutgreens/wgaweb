'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { formatPrice } from '@/lib/format';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

// Serviceable pincodes: Chandigarh (160xxx), Mohali/Zirakpur (140xxx)
function isServiceablePincode(pincode: string): boolean {
  return /^(160|140)\d{3}$/.test(pincode);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPaise, clearCart } = useCartStore();
  const total = totalPaise();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay Checkout.js
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.replace('/cart');
    }
  }, [items.length, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isServiceablePincode(form.pincode)) {
      setError('Sorry, we only deliver to Chandigarh, Mohali, and Panchkula.');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          purchaseType: 'one_time',
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email || undefined,
          deliveryAddress: form.address,
          deliveryPincode: form.pincode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError(data.error || 'Some items are out of stock. Please update your cart.');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKey || !razorpayLoaded) {
        setError('Payment system is not ready. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: rzpKey,
        order_id: data.razorpayOrderId || data.razorpay_order_id,
        amount: data.amount,
        currency: data.currency,
        name: 'Wild About Greens',
        description: 'Fresh Microgreens Order',
        prefill: {
          name: form.name,
          contact: form.phone,
          email: form.email || undefined,
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-confirmation?orderId=${verifyData.orderId || data.orderId}`);
            } else {
              setError('Payment verification failed. If you were charged, please contact us.');
              setLoading(false);
            }
          } catch {
            setError('Payment verification failed. If you were charged, please contact us.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Your cart is still saved — you can try again anytime.');
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch {
      setError('Failed to connect to our server. Please check your connection and try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Fill in your delivery details and proceed to payment.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text" id="name" name="name" value={form.name} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Your full name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="10-digit mobile number"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
          <input
            type="email" id="email" name="email" value={form.email} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="For order confirmation"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
          <textarea
            id="address" name="address" value={form.address} onChange={handleChange} rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            placeholder="Full delivery address"
          />
        </div>

        {/* Pincode */}
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text" id="pincode" name="pincode" value={form.pincode} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="6-digit delivery pincode"
            maxLength={6}
          />
          <p className="text-xs text-gray-400 mt-1">We deliver to Chandigarh, Mohali & Panchkula only.</p>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between">
                <span className="text-gray-600">
                  {item.productName} ({item.variantLabel}) × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.pricePaise * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-3 pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-green-700">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </button>

        <p className="text-center text-xs text-gray-400">
          Secured by Razorpay. You&apos;ll be redirected to a secure payment page.
        </p>
      </form>
    </main>
  );
}
