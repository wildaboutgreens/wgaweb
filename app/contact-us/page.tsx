'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanPhone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      setError('Please provide a message with at least 10 characters.');
      return;
    }
    if (siteKey && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: subject === 'b2b' ? `Culinary Partner / ${cleanName}` : `Customer Inquiry (${subject})`,
          contact_name: cleanName,
          phone: cleanPhone,
          email: cleanEmail || null,
          message: `[Topic: ${subject.toUpperCase()}] ${cleanMessage}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network connection error. Please try calling or emailing us directly.');
    } finally {
      setSubmitting(false);
      setTurnstileToken(null);
      renderTurnstile();
    }
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
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-4">
              We&apos;re Here to Help
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122A1F] tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-[#151F19]/75 text-sm sm:text-base leading-relaxed">
              Have questions about our living microgreens, subscription schedules, or custom restaurant harvests? Reach out and our harvest team will respond promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Contact Cards Column */}
            <div className="lg:col-span-5 space-y-4">
              {/* Card 1: Direct Support */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center text-lg mb-4 text-[#1C3F2D]">
                  📞
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Phone &amp; WhatsApp
                </h3>
                <p className="text-xs text-[#151F19]/65 mb-3">
                  Direct line to our harvest dispatch manager for orders, queries, and quick delivery updates.
                </p>
                <a
                  href="tel:+919800000000"
                  className="inline-block font-mono text-base font-bold text-[#1C3F2D] hover:underline"
                >
                  +91 98XXXXXXXX
                </a>
              </div>

              {/* Card 2: Email */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center text-lg mb-4 text-[#1C3F2D]">
                  ✉️
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-[#151F19]/65 mb-3">
                  For general inquiries, subscription adjustments, or chef collaboration decks.
                </p>
                <a
                  href="mailto:support@example.com"
                  className="font-medium text-sm text-[#1C3F2D] hover:underline"
                >
                  support@example.com
                </a>
              </div>

              {/* Card 3: Harvest & Delivery Hours */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center text-lg mb-4 text-[#1C3F2D]">
                  🌱
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Harvest &amp; Delivery Window
                </h3>
                <p className="text-xs text-[#151F19]/65 leading-relaxed">
                  Morning cut-and-deliver runs: <strong className="text-[#122A1F]">7:00 AM – 1:00 PM</strong> daily across all serviceable locations.
                </p>
              </div>

              {/* Quick links to self-service portals */}
              <div className="bg-[#1C3F2D]/5 rounded-3xl border border-[#1C3F2D]/15 p-6 space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#1C3F2D] tracking-wider">
                  Self-Service Shortcuts
                </h4>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/track-order"
                    className="flex items-center justify-between text-xs font-semibold text-[#122A1F] hover:text-[#1C3F2D] bg-white px-3.5 py-2.5 rounded-xl border border-[#E4DDC8] transition-colors"
                  >
                    <span>Track Your Live Order</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/returns-and-exchange"
                    className="flex items-center justify-between text-xs font-semibold text-[#122A1F] hover:text-[#1C3F2D] bg-white px-3.5 py-2.5 rounded-xl border border-[#E4DDC8] transition-colors"
                  >
                    <span>Raise Return or Exchange Ticket</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-10">
              {submitted ? (
                <div className="py-12 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-3xl flex items-center justify-center mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#122A1F] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[#151F19]/75 max-w-md mx-auto mb-6">
                    Thank you for reaching out. A member of our harvest team will get back to you within a few business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold hover:bg-[#122A1F] transition-all shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 pb-4 border-b border-[#E4DDC8]/60">
                    <h2 className="font-serif text-2xl font-bold text-[#122A1F] mb-1">
                      Send a Direct Message
                    </h2>
                    <p className="text-xs text-[#151F19]/60">
                      Fill out the form below and we will get back to you via WhatsApp or email.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Your Name"
                        required
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactPhone" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactPhone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 98XXXXXXXX"
                          required
                          className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="contactEmail" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Email Address
                        </label>
                        <input
                          id="contactEmail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@example.com"
                          className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contactSubject" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Inquiry Topic <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contactSubject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Existing Order Question</option>
                        <option value="subscription">Subscription Delivery Assistance</option>
                        <option value="b2b">Chef / Restaurant Supply Partnership</option>
                        <option value="feedback">Feedback &amp; Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contactMessage" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contactMessage"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message or inquiry here..."
                        required
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Turnstile Container */}
                    {siteKey && (
                      <div className="flex justify-center pt-2">
                        <div ref={turnstileContainerRef} />
                      </div>
                    )}

                    {error && (
                      <div className="p-3.5 bg-red-50/90 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                        <span className="text-base leading-none">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || (!!siteKey && !turnstileToken)}
                      className="w-full bg-[#1C3F2D] hover:bg-[#122A1F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer mt-2"
                    >
                      {submitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}
