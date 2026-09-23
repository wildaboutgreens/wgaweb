import JoinRevolutionSection from '@/components/JoinRevolutionSection';

export const metadata = {
  title: 'Privacy Policy | Wild About Greens',
  description: 'Learn how Wild About Greens protects and manages your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-[#FAF6EF] min-h-screen text-[#151F19] pt-32 sm:pt-40 pb-20">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-4">
              Transparency &amp; Trust
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122A1F] tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#151F19]/75 text-sm sm:text-base leading-relaxed">
              We respect your privacy and are committed to protecting the personal information you share with us when ordering fresh living microgreens.
            </p>
          </div>

          {/* Policy Content Card */}
          <div className="bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-12 space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-[15px] text-[#151F19]/80">
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-3">
                When you browse our website, subscribe to our newsletter, place an order, or raise a support ticket, we may collect the following personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-[#122A1F]">Contact Information:</strong> Full name, phone number, and email address.</li>
                <li><strong className="text-[#122A1F]">Delivery Details:</strong> Street address, landmark, and serviceable delivery pincode.</li>
                <li><strong className="text-[#122A1F]">Order History:</strong> Microgreen varieties, tray weights, subscription frequencies, and payment identifiers.</li>
                <li><strong className="text-[#122A1F]">Technical Data:</strong> Device type, browser information, and IP address collected for fraud prevention and rate limiting.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                2. How We Use Your Information
              </h2>
              <p className="mb-3">We collect and use your data strictly for legitimate operational needs:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fulfilling daily morning harvests and coordinating delivery to your doorstep.</li>
                <li>Sending order receipts, live harvest tracking updates, and delivery confirmations via email.</li>
                <li>Managing recurring subscription deliveries and renewal schedules.</li>
                <li>Resolving customer support inquiries, returns, and exchange requests.</li>
                <li>Sending seasonal microgreen recipes and farm updates if you have opted into our newsletter.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                3. Payment Security &amp; Third-Party Processors
              </h2>
              <p>
                We do not store or process sensitive debit or credit card numbers, UPI PINs, or bank account credentials on our servers. All financial transactions are securely processed through <strong className="text-[#122A1F]">Razorpay</strong>, an RBI-licensed, PCI-DSS Level 1 compliant payment gateway.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                4. Cookies &amp; Bot Prevention
              </h2>
              <p>
                Our store uses essential session cookies to remember items in your cart, preserve active customer sessions, and secure checkout forms. We also use <strong className="text-[#122A1F]">Cloudflare Turnstile</strong> to protect customer order lookup, newsletter signups, and return ticket submissions from automated spam and abuse without invasive tracking.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                5. Data Sharing &amp; Non-Disclosure
              </h2>
              <p>
                We never sell, rent, or trade your personal information to third-party data brokers or marketing agencies. Your information is only shared with trusted operational partners directly involved in delivering your order (e.g. logistics delivery drivers and transactional email services).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                6. Your Rights &amp; Data Corrections
              </h2>
              <p>
                You may request a copy of the personal information we hold about you or request corrections to your delivery details at any time. You can also unsubscribe from our email newsletter with a single click using the link included in every newsletter email.
              </p>
            </section>

            <section className="pt-6 border-t border-[#E4DDC8]/60">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                7. Contact Us Regarding Privacy
              </h2>
              <p className="mb-4">
                If you have questions, feedback, or data privacy requests, our team is ready to assist:
              </p>
              <div className="bg-[#FAF6EF]/60 p-4 rounded-2xl border border-[#E4DDC8]/60 text-xs sm:text-sm space-y-1">
                <p><strong className="text-[#122A1F]">Wild About Greens Customer Care</strong></p>
                <p>Email: <a href="mailto:support@example.com" className="text-[#1C3F2D] font-medium underline">support@example.com</a></p>
                <p>Phone: <a href="tel:+919800000000" className="text-[#1C3F2D] font-medium underline">+91 98XXXXXXXX</a></p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}
