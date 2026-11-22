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
      {/* 6. BRAND PROTECTION & GUARDRAILS FOR SELLERS            */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a] bg-orange-950/60 px-3 py-1 rounded-md border border-orange-500/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a1a]" />
              Brand Protection Architecture
            </span>
            <h2 className="type-sub !text-white mt-4 font-quicksand font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl">
              Sell excess inventory without <span className="text-[#ff7a1a]">cannibalizing</span> your regular distribution network.
            </h2>
            <p className="type-body !text-slate-100 mt-3 font-quicksand leading-relaxed text-base sm:text-lg">
              We know brand owners and authorised distributors refuse to dump inventory on public websites because their regular retail clients will demand the same discount. StockBridge is built with three strict confidentiality layers:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-slate-800">
            <div className="space-y-2">
              <div className="font-bold type-little font-quicksand flex items-center gap-2 !text-white">
                <span className="text-xs font-mono font-bold text-[#ff7a1a] bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">01</span>
                <span className="text-white text-lg">Hidden Brand Name</span>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                List as &quot;Tier-1 Premium Footwear&quot; or &quot;Export Quality Apparel&quot;. Your brand name is completely hidden from public view and disclosed only after a verified buyer is accepted.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-bold type-little font-quicksand flex items-center gap-2 !text-white">
                <span className="text-xs font-mono font-bold text-[#ff7a1a] bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">02</span>
                <span className="text-white text-lg">Geographic Blocker</span>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                Block buyers in your home city or state from seeing or purchasing your surplus lots, ensuring local retail shops never see discounted stock.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-bold type-little font-quicksand flex items-center gap-2 !text-white">
                <span className="text-xs font-mono font-bold text-[#ff7a1a] bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">03</span>
                <span className="text-white text-lg">Channel Allow-lists</span>
              </div>
              <p className="type-body !text-slate-200 text-sm font-quicksand leading-relaxed">
                Restrict purchase eligibility exclusively to off-price liquidators, export traders, or institutional buyers—blocking online marketplace scrapers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. COMMON QUESTIONS (FAQ FROM REALITY CHECK)            */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden relative">
        <div className="text-center mb-10">
          <h2 className="type-sub text-slate-900 font-quicksand">
            Frequently Asked Questions
          </h2>
          <p className="type-body text-slate-500 mt-1 font-quicksand">
            Straightforward answers to the most common questions from businesses.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              Who is allowed to buy and sell on StockBridge?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              StockBridge is exclusively for registered businesses (manufacturers, wholesalers, distributors, retail shop owners, and corporate buyers). Every account must provide a valid GST/tax identification and business address before accessing wholesale trade functions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              How does the 48-hour inspection window work?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              When a shipment arrives, the buyer has 48 hours (up to 120 hours for large multi-pallet consignments) to inspect the goods against the lot&apos;s specified condition grade. If there is a grade mismatch or quantity shortage, the buyer uploads photo evidence, and the disputed amount remains frozen in escrow while operations arbitrates.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              Why make-offer negotiation instead of open auctions?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Open auctions require dozens of active simultaneous bidders to avoid selling goods at pennies. Make-offer negotiation allows a single serious buyer to bid against a seller&apos;s confidential hidden reserve price, protecting seller dignity and floor margins.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="type-little text-slate-900 font-quicksand">
              What are the platform fees?
            </h3>
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Sellers pay a standard 7% commission deducted only upon successful order settlement. Buyers pay a 1.5% buyer protection fee covering secure escrow handling and tax invoice generation. There are zero upfront listing fees for standard accounts.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. BOTTOM CTA STRIP                                     */}
      {/* ======================================================== */}
      <section className="w-full bg-accent py-16 px-4 sm:px-6 lg:px-8 text-white text-center transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="type-sub text-white font-quicksand">
            Ready to turn dead inventory into working capital?
          </h2>
          <p className="type-body text-white/90 mt-3 max-w-xl mx-auto font-quicksand">
            Join verified manufacturers, distributors, and retailers trading surplus inventory with complete trust and discretion.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 focus:outline-none font-quicksand"
            >
              Apply for Business Account
            </Link>
            <Link
              href="/grade-guide"
              className="w-full sm:w-auto rounded-xl border border-white/40 bg-black/10 px-8 py-3.5 text-base font-bold text-white transition hover:bg-black/20 font-quicksand"
            >
              Read the 5-Grade Manual
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
