import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story — Wild About Greens',
  description: 'Learn how Wild About Greens grows living, nutrient-dense microgreens locally in the Tricity with pure water, non-GMO seeds, and zero chemicals.',
};

export default function OurStoryPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-3.5 py-1 bg-green-900/60 border border-green-600/50 rounded-full text-xs font-semibold uppercase tracking-wider text-green-200 mb-4">
            Our Journey &amp; Mission
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Grown with Love.<br />Delivered Alive.
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Wild About Greens was born from a simple passion: bringing the purest, most potent living nutrition straight from our vertical indoor farm to your dining table.
          </p>
        </div>
        {/* Subtle background decoration */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 bg-white"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
        />
      </section>

      {/* Section 1: The Spark */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest block mb-2">
              Chapter 01 &middot; The Problem
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Most vegetables travel hundreds of miles before reaching your plate.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By the time conventional produce sits through transit, cold storage, and supermarket shelves, it has lost up to 50% of its vital micronutrients, enzymes, and vibrant flavor.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We asked ourselves: <strong className="text-gray-900 font-semibold">what if greens were harvested just hours before you eat them?</strong> What if eating healthy wasn&apos;t a chore, but an explosion of real, peppery, fresh, earthy flavor? That quest led us to microgreens.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center border border-green-100 aspect-square shadow-sm">
            <span className="text-7xl mb-4">🌱</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Up to 40&times; More Nutrients</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Scientific studies show that young microgreen cotyledons contain exponentially higher concentrations of vitamins C, E, K, and beta-carotene than mature plants.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Our Growing Philosophy */}
      <section className="bg-green-50/70 border-y border-green-100/60 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest block mb-2">
              Chapter 02 &middot; Pure &amp; Clean
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How We Grow: Zero Compromise
            </h2>
            <p className="text-gray-600">
              We grow all our greens indoors under meticulously controlled, hospital-grade hygienic conditions in the Tricity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <span className="text-3xl mb-4 block">💧</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Purified RO Water</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Only multi-stage filtered, mineral-balanced water touches our seeds. No municipal contaminants or heavy metals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <span className="text-3xl mb-4 block">🌾</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Non-GMO Seeds</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We source heirloom, untreated seeds with documented high germination rates and unmatched nutritional genetics.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <span className="text-3xl mb-4 block">🚫</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Pesticides &amp; Fertilizers</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No chemical sprays, synthetic pesticides, or chemical enhancers. Clean greens you can eat straight from the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Tricity Local Promise */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-3xl text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-green-200 uppercase tracking-widest block mb-2">
              Hyper-Local &middot; Chandigarh &middot; Mohali &middot; Panchkula
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Harvested in the Morning. On Your Plate by Lunch.
            </h2>
            <p className="text-green-100 leading-relaxed">
              We don&apos;t ship across states. We focus 100% on our local Tricity community so that every single tray delivered is crisp, vibrant, and bursting with living life-force.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/products"
              className="btn-primary bg-white text-green-800 hover:bg-green-50 shadow-lg px-8 py-3.5 text-base font-bold"
            >
              Shop Fresh Harvest
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Customer Commitments */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Core Commitments</h2>
          <p className="text-gray-600 text-sm">What you can always count on from Wild About Greens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Peak Freshness</h3>
            <p className="text-sm text-gray-600">
              Greens are delivered living in eco-friendly trays or freshly cut within hours of delivery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Eco-Conscious Packaging</h3>
            <p className="text-sm text-gray-600">
              Minimal waste packaging that protects freshness while caring for our local environment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Chef &amp; Household Approved</h3>
            <p className="text-sm text-gray-600">
              Trusted by top Tricity gourmet kitchens, wellness enthusiasts, and health-conscious families alike.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
