'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import JoinRevolutionSection from '@/components/JoinRevolutionSection';

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

interface TicketResult {
  ticket_number: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  request_type: string;
  created_at: string;
}

export default function ShippingAndReturnsClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<'exchange' | 'return'>('exchange');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketResult, setTicketResult] = useState<TicketResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleTurnstileScriptReady = useCallback(() => {
    setTurnstileReady(true);
  }, []);

  const renderTurnstile = useCallback(() => {
    if (!turnstileReady || !siteKey || !window.turnstile || !turnstileContainerRef.current) return;
    if (turnstileWidgetId.current) {
      try {
        window.turnstile.remove(turnstileWidgetId.current);
      } catch {
        /* ignore */
      }
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
    const cleanReason = reason.trim();

    if (!cleanOrderNumber) {
      setError('Please enter your order number.');
      return;
    }
    if (!cleanPhone || !cleanEmail) {
      setError('Both phone number and email address are required.');
      return;
    }
    if (!cleanReason || cleanReason.length < 10) {
      setError('Please provide a brief description (at least 10 characters) explaining why you are requesting an exchange or return.');
      return;
    }
    if (siteKey && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/returns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: cleanOrderNumber,
          phone: cleanPhone,
          email: cleanEmail,
          request_type: requestType,
          reason: cleanReason,
          turnstileToken: turnstileToken || 'dev-token',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit ticket. Please verify your order details.');
      } else {
        setTicketResult(data);
      }
    } catch {
      setError('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setTurnstileToken(null);
      renderTurnstile();
    }
  };

  const handleCopyTicket = (ticketNum: string) => {
    navigator.clipboard.writeText(ticketNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={handleTurnstileScriptReady}
        />
      )}

      <div className="bg-[#FAF6EF] min-h-screen text-[#151F19] pt-32 sm:pt-40 pb-20">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-4">
              Customer Care &amp; Quality Guarantee
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122A1F] tracking-tight mb-4">
              Shipping &amp; Returns
            </h1>
            <p className="text-[#151F19]/75 text-sm sm:text-base leading-relaxed">
              We stand by the freshness of our living microgreens. Review our morning delivery windows, transit guarantees, and 24-hour exchange guidelines below.
            </p>
          </div>

          {/* Policy Content Card */}
          <div className="bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-12 space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-[15px] text-[#151F19]/80">
            {/* Morning Harvest & Shipping Guidelines */}
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                Morning Harvest &amp; Shipping Guidelines
              </h2>
              <p className="mb-3">
                Wild About Greens fulfills morning harvest deliveries across designated serviceable delivery areas (Chandigarh, Mohali, and Panchkula):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#122A1F]">Morning Delivery Window:</strong> Deliveries take place during morning hours (7:00 AM – 1:00 PM) to ensure living greens reach you at peak vitality.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Cut-to-Order Freshness:</strong> Every tray is cut on indoor vertical racks after your order is confirmed, using mineral water, organic coco-peat, and clean air with zero pesticides.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Contact Readiness:</strong> Please ensure a valid 10-digit mobile number and reachable contact person are available to receive the package.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Post-Delivery Care:</strong> Microgreens must be promptly unpacked upon delivery and stored according to the provided care instructions (refrigerated at 4°C–7°C).
                </li>
              </ul>
            </section>

            {/* Return & Exchange Policy Guidelines */}
            <section className="bg-[#FAF6EF]/60 p-6 rounded-2xl border border-[#E4DDC8] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#122A1F]">
                Return &amp; Exchange Policy Guidelines
              </h2>
              <ul className="list-disc pl-5 space-y-2.5">
                <li>
                  <strong className="text-[#122A1F]">24-Hour Notice:</strong> Due to the perishable nature of fresh living greens, requests must be submitted within 24 hours of delivery.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Instant Fresh Replacement:</strong> For exchange requests, we include a freshly harvested replacement in the subsequent morning delivery run.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Refund Timeline:</strong> Approved refund requests are credited back to your original payment method (UPI/card/net banking) within 5–7 business days via Razorpay.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Living Produce Care:</strong> Greens must be kept refrigerated. Issues resulting from improper post-delivery storage beyond 24 hours are not eligible for replacement.
                </li>
              </ul>
            </section>

            {/* Ticket Submission Portal */}
            <section id="returns-portal" className="pt-4 border-t border-[#E4DDC8]/60">
              {ticketResult ? (
                <div className="max-w-xl mx-auto bg-[#FAF6EF] rounded-2xl border border-[#E4DDC8] p-6 sm:p-8 text-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-2xl flex items-center justify-center mx-auto mb-3">
                    ✓
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-1">
                    Ticket Raised Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#151F19]/75 mb-5">
                    Your request has been forwarded directly to our harvest manager. We will review your order details and reach out within 4–6 business hours.
                  </p>

                  <div className="bg-white rounded-xl border border-[#E4DDC8] p-4 text-left mb-5 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E4DDC8]">
                      <span className="text-[11px] uppercase font-bold text-[#1C3F2D] tracking-wide">Ticket ID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#122A1F]">{ticketResult.ticket_number}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyTicket(ticketResult.ticket_number)}
                          className="text-[11px] bg-[#FAF6EF] text-[#1C3F2D] border border-[#E4DDC8] px-2 py-0.5 rounded hover:border-[#1C3F2D] transition-colors cursor-pointer"
                        >
                          {copied ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#151F19]/55 block text-[11px]">Order Number</span>
                        <span className="font-mono font-medium text-[#122A1F]">{ticketResult.order_number}</span>
                      </div>
                      <div>
                        <span className="text-[#151F19]/55 block text-[11px]">Request Type</span>
                        <span className="capitalize font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                          {ticketResult.request_type}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#151F19]/55 block text-[11px]">Customer</span>
                        <span className="font-medium text-[#122A1F]">{ticketResult.customer_name || 'Customer'}</span>
                      </div>
                      <div>
                        <span className="text-[#151F19]/55 block text-[11px]">Contact Phone</span>
                        <span className="font-mono text-[#122A1F]">{ticketResult.customer_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/track-order"
                      className="px-5 py-2.5 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold hover:bg-[#122A1F] transition-all shadow-sm"
                    >
                      Track Order
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setTicketResult(null);
                        setReason('');
                      }}
                      className="px-5 py-2.5 rounded-full border border-[#1C3F2D] text-[#1C3F2D] text-xs font-semibold hover:bg-[#1C3F2D]/5 transition-colors cursor-pointer"
                    >
                      Raise Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-xl mx-auto bg-[#FAF6EF]/40 rounded-2xl border border-[#E4DDC8] p-5 sm:p-8">
                  <div className="mb-5 pb-3 border-b border-[#E4DDC8]">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#122A1F] mb-1">
                      Raise an Exchange / Return Request
                    </h3>
                    <p className="text-xs text-[#151F19]/60">
                      Please provide your order credentials for instant verification against our harvest database.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="orderNumber" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Order Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="orderNumber"
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="e.g. WAG-XXXXXXXX"
                        required
                        className="w-full px-4 py-2.5 bg-white border border-[#E4DDC8] rounded-xl text-sm font-mono uppercase tracking-wider text-[#151F19] placeholder:text-[#151F19]/40 focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                      />
                      <p className="text-[11px] text-[#151F19]/55 mt-1">Found in your email confirmation receipt</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 98XXXXXXXX"
                          required
                          className="w-full px-4 py-2.5 bg-white border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@example.com"
                          required
                          className="w-full px-4 py-2.5 bg-white border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Request Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                            requestType === 'exchange'
                              ? 'border-[#1C3F2D] bg-[#1C3F2D]/5 text-[#1C3F2D]'
                              : 'border-[#E4DDC8] bg-white text-[#151F19]/70 hover:bg-[#FAF6EF]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="requestType"
                            value="exchange"
                            checked={requestType === 'exchange'}
                            onChange={() => setRequestType('exchange')}
                            className="accent-[#1C3F2D]"
                          />
                          <span>🔄 Fresh Exchange</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                            requestType === 'return'
                              ? 'border-[#1C3F2D] bg-[#1C3F2D]/5 text-[#1C3F2D]'
                              : 'border-[#E4DDC8] bg-white text-[#151F19]/70 hover:bg-[#FAF6EF]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="requestType"
                            value="return"
                            checked={requestType === 'return'}
                            onChange={() => setRequestType('return')}
                            className="accent-[#1C3F2D]"
                          />
                          <span>↩️ Return &amp; Refund</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reason" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Reason for Return / Exchange <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please tell us what happened (e.g. damaged container in transit, wilted greens upon arrival, wrong variety delivered)..."
                        required
                        className="w-full px-4 py-2.5 bg-white border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Turnstile Container */}
                    {siteKey && (
                      <div className="flex justify-center pt-2">
                        <div ref={turnstileContainerRef} />
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-50/90 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2">
                        <span className="text-base leading-none">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || (!!siteKey && !turnstileToken)}
                      className="w-full bg-[#1C3F2D] hover:bg-[#122A1F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer mt-1"
                    >
                      {loading ? 'Verifying order & raising ticket...' : 'Raise Ticket'}
                    </button>
                  </form>

                  <div className="mt-4 pt-3 border-t border-[#E4DDC8] text-center">
                    <p className="text-[11px] text-[#151F19]/55">
                      🛡️ Our system validates your order number, phone, and email before raising a ticket.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}
