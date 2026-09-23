import Link from 'next/link';
import JoinRevolutionSection from '@/components/JoinRevolutionSection';

export const metadata = {
  title: 'Terms and Conditions | Wild About Greens',
  description: 'Terms of service, harvest guidelines, and delivery policies for Wild About Greens.',
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <div className="bg-[#FAF6EF] min-h-screen text-[#151F19] pt-32 sm:pt-40 pb-20">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-4">
              Terms of Service
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122A1F] tracking-tight mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-[#151F19]/75 text-sm sm:text-base leading-relaxed">
              Please read these terms and conditions carefully before ordering our fresh, living microgreens.
            </p>
          </div>

          {/* Terms Content Card */}
          <div className="bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-12 space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-[15px] text-[#151F19]/80">
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing this website, placing an order, or subscribing to our weekly microgreen harvest delivery, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                2. Fresh Harvest &amp; Perishable Goods Nature
              </h2>
              <p className="mb-3">
                Wild About Greens provides living, freshly cut-to-order microgreens grown on indoor vertical racks using mineral water, organic coco-peat, and clean air with zero pesticides.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Because our microgreens are freshly harvested living produce with finite shelf life, orders are prepared specifically for your scheduled delivery window.</li>
                <li>Microgreens must be promptly unpacked upon delivery and stored according to the provided care instructions (refrigerated at 4°C–7°C).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                3. Serviceable Areas &amp; Deliveries
              </h2>
              <p className="mb-3">
                We fulfill morning harvest deliveries across designated serviceable delivery areas.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deliveries take place during morning hours (7:00 AM – 1:00 PM) to ensure living greens reach you at peak vitality.</li>
                <li>Please ensure a valid 10-digit mobile number and reachable contact person are available to receive the package.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                4. Pricing &amp; Payments
              </h2>
              <p>
                All prices on the website are listed in Indian Rupees (₹) inclusive of applicable taxes. Payments are securely processed via Razorpay. We do not store sensitive card or bank details. Orders are confirmed only upon successful payment authorization.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                5. Weekly Subscriptions
              </h2>
              <p className="mb-3">
                Customers enrolled in weekly subscriptions receive designated trays according to their selected weekly schedule (e.g. 4-week, 8-week, or 12-week cycles):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You may pause or modify your upcoming subscription harvest day by contacting us at least 24 hours prior to the scheduled delivery day.</li>
                <li>Subscription cancellations are prorated based on completed deliveries.</li>
              </ul>
            </section>

            <section className="bg-[#FAF6EF]/60 p-6 rounded-2xl border border-[#E4DDC8]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                6. Returns, Exchanges &amp; Refunds Policy
              </h2>
              <p className="mb-4">
                We take immense pride in our harvest quality. However, due to the highly perishable nature of fresh living greens:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Return and exchange requests must be reported <strong className="text-[#122A1F]">within 24 hours of delivery</strong>.</li>
                <li>Eligible situations include damaged containers during transit, spoiled greens upon opening, or incorrect variety delivered.</li>
                <li>Approved claims are resolved with a free immediate fresh replacement in our next morning harvest or a full refund back to your original payment source.</li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/returns-and-exchange"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold hover:bg-[#122A1F] transition-all shadow-sm"
                >
                  <span>Go to Returns &amp; Exchange Portal</span>
                  <span>→</span>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                Wild About Greens shall not be liable for any indirect, incidental, or consequential damages resulting from improper storage of microgreens after delivery, failure to receive the delivery during the agreed window, or consumption against individual dietary allergies.
              </p>
            </section>

            <section className="pt-6 border-t border-[#E4DDC8]/60">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                8. Contact Information
              </h2>
              <p className="mb-3">For any inquiries or clarifications regarding these terms:</p>
              <p>Email: <a href="mailto:support@example.com" className="text-[#1C3F2D] font-medium underline">support@example.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+919800000000" className="text-[#1C3F2D] font-medium underline">+91 98XXXXXXXX</a></p>
            </section>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}
