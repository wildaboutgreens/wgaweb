import Link from 'next/link';
import JoinRevolutionSection from '@/components/JoinRevolutionSection';

export const metadata = {
  title: 'Shipping & Returns | Wild About Greens',
  description: 'Morning harvest delivery policies and 24-hour return & exchange guidelines for Wild About Greens.',
};

export default function ShippingAndReturnsPage() {
  return (
    <>
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
              We stand by the freshness of our living microgreens. Review our morning delivery windows, transit guarantees, and 24-hour return and replacement guidelines below.
            </p>
          </div>

          {/* Policy Content Card */}
          <div className="bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-12 space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-[15px] text-[#151F19]/80">
            {/* 1. Morning Harvest & Shipping Guidelines */}
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                1. Morning Harvest &amp; Shipping Guidelines
              </h2>
              <p className="mb-3">
                Wild About Greens fulfills morning harvest deliveries across all designated serviceable delivery areas:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#122A1F]">Morning Delivery Window:</strong> Deliveries take place during morning hours (7:00 AM – 1:00 PM) to ensure living greens reach you at peak vitality.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Cut-to-Order Freshness:</strong> Every tray is cut on indoor vertical racks after your order is confirmed, using mineral water, organic coco-peat, and clean air with zero pesticides.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Serviceable Areas:</strong> We deliver to designated pin codes. You can check serviceability by entering your delivery pin code during checkout or on any product page.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Contact Readiness:</strong> Please ensure a valid 10-digit mobile number and reachable contact person are available to receive the package during delivery.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Post-Delivery Care:</strong> Microgreens must be promptly unpacked upon delivery and stored according to the provided care instructions (refrigerated at 4°C–7°C).
                </li>
              </ul>
            </section>

            {/* 2. Return & Exchange Policy Guidelines */}
            <section className="bg-[#FAF6EF]/60 p-6 rounded-2xl border border-[#E4DDC8] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#122A1F]">
                2. Return &amp; Exchange Policy Guidelines
              </h2>
              <p className="text-xs sm:text-sm text-[#151F19]/75">
                We take immense pride in the vitality and quality of our harvest. Because living microgreens are perishable produce, our policies are designed to be fair, prompt, and transparent:
              </p>
              <ul className="list-disc pl-5 space-y-2.5">
                <li>
                  <strong className="text-[#122A1F]">24-Hour Notice:</strong> Due to the perishable nature of fresh living greens, all exchange or refund requests must be reported within 24 hours of delivery.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Eligible Scenarios:</strong> Claims are eligible for replacement or refund in the event of transit damage to the container, wilted greens upon arrival, or an incorrect variety delivered.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Instant Fresh Replacement:</strong> For exchange requests, we include a freshly harvested replacement tray in our subsequent morning delivery run at no extra charge.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Refund Timeline:</strong> Approved refund requests are credited back to your original payment method (UPI, debit/credit card, or net banking) within 5–7 business days via Razorpay.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Living Produce Storage:</strong> Greens must be kept refrigerated at 4°C–7°C. Issues arising from improper post-delivery storage beyond the 24-hour window are not eligible for exchange or refund.
                </li>
              </ul>
            </section>

            {/* 3. How to Request an Exchange or Refund */}
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                3. How to Request an Exchange or Refund
              </h2>
              <p className="mb-4">
                If you encounter any issue with your harvest upon delivery, our customer support team is here to resolve it swiftly:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#FAF6EF]/70 border border-[#E4DDC8]">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C3F2D] text-white text-xs font-bold mb-2">
                    1
                  </span>
                  <h4 className="font-semibold text-[#122A1F] text-sm mb-1">Take a Photo</h4>
                  <p className="text-xs text-[#151F19]/70 leading-relaxed">
                    Capture a clear photo of the delivered tray, label, and packaging showing the issue within 24 hours of delivery.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF6EF]/70 border border-[#E4DDC8]">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C3F2D] text-white text-xs font-bold mb-2">
                    2
                  </span>
                  <h4 className="font-semibold text-[#122A1F] text-sm mb-1">Contact Us</h4>
                  <p className="text-xs text-[#151F19]/70 leading-relaxed">
                    Message us on WhatsApp or Email with your Order Number (e.g. WAG-XXXXX) and the photo.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF6EF]/70 border border-[#E4DDC8]">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C3F2D] text-white text-xs font-bold mb-2">
                    3
                  </span>
                  <h4 className="font-semibold text-[#122A1F] text-sm mb-1">Quick Resolution</h4>
                  <p className="text-xs text-[#151F19]/70 leading-relaxed">
                    Our harvest team will inspect your request and dispatch a fresh replacement in the next morning run or process a refund.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Order Cancellations & Subscriptions */}
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                4. Cancellations &amp; Subscription Changes
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#122A1F]">Single Orders:</strong> Once an order is placed, harvesting and packaging begin specifically for your morning run. You may cancel an order prior to harvesting by contacting us immediately. Orders already harvested or dispatched cannot be cancelled.
                </li>
                <li>
                  <strong className="text-[#122A1F]">Subscription Modifications:</strong> Customers on weekly plans can pause, skip a delivery, or adjust their harvest schedule by notifying us at least 24 hours prior to the upcoming delivery day.
                </li>
              </ul>
            </section>

            {/* 5. Contact Customer Care */}
            <section className="pt-6 border-t border-[#E4DDC8]/60">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#122A1F] mb-3">
                5. Need Assistance?
              </h2>
              <p className="mb-4">
                Have questions about your delivery or need to report an issue with your order? Our customer care team is available to assist you:
              </p>
              <div className="bg-[#FAF6EF]/60 p-5 sm:p-6 rounded-2xl border border-[#E4DDC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <p>
                    <strong className="text-[#122A1F]">Email:</strong>{' '}
                    <a href="mailto:support@example.com" className="text-[#1C3F2D] font-medium underline">
                      support@example.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-[#122A1F]">Phone / WhatsApp:</strong>{' '}
                    <a href="tel:+919800000000" className="text-[#1C3F2D] font-medium underline">
                      +91 98XXXXXXXX
                    </a>
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#151F19]/60">
                    Operating Hours: Monday – Sunday, 7:00 AM – 7:00 PM
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-0">
                  <Link
                    href="/track-order"
                    className="px-4 py-2 rounded-full border border-[#1C3F2D] text-[#1C3F2D] text-xs font-semibold hover:bg-[#1C3F2D]/5 transition-colors"
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/contact-us"
                    className="px-4 py-2 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold hover:bg-[#122A1F] transition-all shadow-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}
