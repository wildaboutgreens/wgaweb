'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { formatPrice } from '@/lib/format';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_paise: number;
  variant_label: string;
  net_weight_grams: number;
  product_name: string;
  product_slug: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_pincode: string;
  total_paise: number;
  purchase_type: string;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
  items: OrderItem[];
}

const fulfillmentStatusStyles: Record<string, string> = {
  unfulfilled: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Called by <Script onReady> — guaranteed window.turnstile exists
  const handleTurnstileScriptReady = useCallback(() => {
    setTurnstileReady(true);
  }, []);

  // Render Turnstile widget once script and container are ready
  const renderTurnstile = useCallback(() => {
    if (!turnstileReady || !siteKey || !window.turnstile || !turnstileContainerRef.current) return;
    // Remove previous widget if any
    if (turnstileWidgetId.current) {
      try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* ignore */ }
    }
    turnstileContainerRef.current.innerHTML = '';
    turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
      theme: 'light',
    });
  }, [turnstileReady, siteKey]);

  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOrderNumber = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanOrderNumber || !cleanPhone || !cleanEmail) {
      setError('Please enter your order number, phone number, and email address.');
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      const query = new URLSearchParams({
        order_number: cleanOrderNumber,
        phone: cleanPhone,
        email: cleanEmail,
        turnstileToken: turnstileToken,
      });
      const res = await fetch(`/api/orders/lookup?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to look up order. Please try again.');
        setOrders([]);
      } else {
        setOrders(data);
        setSearched(true);
      }
    } catch {
      setError('Failed to connect to the server. Please check your internet connection.');
      setOrders([]);
    } finally {
      setLoading(false);
      // Reset Turnstile for next submission
      setTurnstileToken(null);
      renderTurnstile();
    }
  };

  return (
    <>
      {/* Turnstile script — Next.js <Script> ensures proper loading */}
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={handleTurnstileScriptReady}
        />
      )}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-4xl mb-3 block">📦</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Track Your Order</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter your order number, phone number, and email address to view the real time status of your harvest &amp; delivery.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Order Number *
            </label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. WAG-ABCD1234"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors uppercase tracking-wider"
              required
              maxLength={20}
            />
            <p className="text-xs text-gray-400 mt-1">
              Found in your confirmation email
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Turnstile CAPTCHA */}
          <div className="flex justify-center">
            <div ref={turnstileContainerRef} />
          </div>
          {!siteKey && (
            <p className="text-xs text-amber-600 text-center">
              CAPTCHA not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment.
            </p>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!!siteKey && !turnstileToken)}
            className="w-full btn-primary py-3 text-sm font-semibold"
          >
            {loading ? 'Looking up order...' : 'Track Order'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          For security, your order number, phone, and email must all match your order.
        </p>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-8">
              <span className="text-4xl mb-3 block">🔍</span>
              <h2 className="text-lg font-bold text-gray-900 mb-1">No Orders Found</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                We couldn&apos;t find any paid orders matching the provided details. Please double-check your order number, phone number, and email address, or reach out to us if you need help.
              </p>
              <Link href="/products" className="btn-secondary text-sm">
                Explore Microgreens
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Order
              </h2>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Top Bar */}
                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
                        <p className="font-mono text-sm font-bold text-green-700 tracking-wider">
                          {order.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Placed On</p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                        <p className="text-sm font-bold text-green-700">
                          {formatPrice(order.total_paise)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                            fulfillmentStatusStyles[order.fulfillment_status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.fulfillment_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          Delivery to Tricity Pincode:{' '}
                          <span className="font-medium text-gray-800">{order.delivery_pincode}</span>
                        </p>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🌿</span>
                              <div>
                                <Link
                                  href={`/products/${item.product_slug}`}
                                  className="font-medium text-sm text-gray-900 hover:text-green-700 transition-colors"
                                >
                                  {item.product_name}
                                </Link>
                                <p className="text-xs text-gray-500">
                                  {item.variant_label} ({item.net_weight_grams}g) &times; {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                              {formatPrice(item.unit_price_paise * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
    </>
  );
}
