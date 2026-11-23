import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import RecoveryCalculator from '@/components/RecoveryCalculator';
import GradeScaleExplorer from '@/components/GradeScaleExplorer';
import FeaturedLots from '@/components/FeaturedLots';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden bg-canvas-subtle text-main selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <HeroSection />


      {/* ======================================================== */}
      {/* 2. INTERACTIVE RECOVERY CALCULATOR                      */}
      {/* ======================================================== */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RecoveryCalculator />
      </section>

      {/* ======================================================== */}
      {/* 4. THE 5-GRADE LOT SCALE EXPLORER                       */}
      {/* ======================================================== */}
      <GradeScaleExplorer />

      {/* ======================================================== */}
      {/* 5. LIVE MARKETPLACE SAMPLES (#marketplace)              */}
      {/* ======================================================== */}
      <section id="marketplace" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 overflow-hidden relative">
        <FeaturedLots />
      </section>

      {/* ======================================================== */}
      {/* 5. BUYER TRADE PROTECTION & QUALITY GUARDRAILS          */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl">
            <h2 className="type-sub !text-white font-quicksand font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl">
              Source authentic factory surplus with <span className="text-[#ff7a1a]">zero quality risk</span> and protected escrow.
            </h2>
            <p className="type-body !text-slate-100 mt-3 font-quicksand leading-relaxed text-base sm:text-lg">
              We know wholesale buyers hesitate to buy liquidation lots because informal WhatsApp dealers often ship damaged junk or missing items. StockBridge protects buyers with three strict safety layers:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-slate-800">
            <div className="space-y-3">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#ff7a1a] font-quicksand leading-none mb-2">
                  1.
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-quicksand text-white leading-snug">
                  Pre-Funded Escrow Protection
                </h3>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                Your payment is never sent directly to the seller upfront. StockBridge holds all funds securely in neutral escrow until goods are delivered to your facility and physically verified.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#ff7a1a] font-quicksand leading-none mb-2">
                  2.
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-quicksand text-white leading-snug">
                  48-Hour Physical Inspection Window
                </h3>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                Open master cartons, inspect unit conditions, and cross-check manifests against the lot&apos;s 5-grade yardstick before a single rupee is released to the vendor.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#ff7a1a] font-quicksand leading-none mb-2">
                  3.
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-quicksand text-white leading-snug">
                  Direct Factory Invoices &amp; GST Credit
                </h3>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                100% verified B2B tax invoices with valid HSN codes for every lot. Claim full GST input tax credit (ITC) with zero grey-market or counterfeit risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. COMMON QUESTIONS (FAQ FOR WHOLESALE BUYERS)          */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden relative">
        <div className="text-center mb-10">
          <h2 className="type-sub text-slate-900 font-quicksand">
            Frequently Asked Questions
          </h2>
          <p className="type-body text-slate-500 mt-1 font-quicksand">
            Straightforward answers for retail store owners, wholesalers, and procurement managers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              Who is eligible to buy wholesale surplus on StockBridge?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              StockBridge is exclusively for registered businesses (retail shop owners, regional wholesalers, modern trade chains, and corporate procurement teams). A valid GSTIN/tax identification and business address are required during verification to access wholesale lots and pricing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              How does the 48-hour buyer inspection window work?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Once your consignment arrives at your facility, you have 48 hours (extended up to 120 hours for multi-pallet container consignments) to inspect the goods against the lot&apos;s manifest and guaranteed condition grade. If there is an undisclosed grade mismatch or shortage, upload photo evidence directly in your dashboard—the disputed payout remains frozen in escrow while our operations team arbitrates.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              Can I negotiate or make offers below the asking price?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Yes! You can purchase instantly at the listed lot price or submit a binding &quot;Make Offer&quot; proposal. Sellers receive your offer with verified proof of funds and can accept, counter, or decline within 24 hours without prolonged back-and-forth.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              What are the buyer fees and payment terms?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Browsing the marketplace and registering an account are completely free. Buyers pay a transparent 1.5% buyer protection fee at checkout, covering end-to-end escrow security, manifest verification, and automated GST tax invoicing. There are zero hidden markups or broker commissions.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. BOTTOM CTA STRIP                                     */}
      {/* ======================================================== */}
      <section className="w-full bg-accent py-16 px-4 sm:px-6 lg:px-8 text-white text-center transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="type-sub text-white font-quicksand">
            Ready to source high-margin surplus inventory for your store?
          </h2>
          <p className="type-body text-white/90 mt-3 max-w-xl mx-auto font-quicksand">
            Join thousands of verified retail shops, regional wholesalers, and trading firms sourcing verified surplus stock at 30% to 70% below wholesale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 focus:outline-none font-quicksand"
            >
              Create Business Account
            </Link>
            <Link
              href="#marketplace"
              className="w-full sm:w-auto rounded-xl border border-white/40 bg-black/10 px-8 py-3.5 text-base font-bold text-white transition hover:bg-black/20 font-quicksand"
            >
              Browse Graded Marketplace
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
