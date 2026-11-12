import Link from 'next/link';
import ColorStudio from '@/components/ColorStudio';
import HeroSection from '@/components/HeroSection';
import RecoveryCalculator from '@/components/RecoveryCalculator';
import GradeScaleExplorer from '@/components/GradeScaleExplorer';
import FeaturedLots from '@/components/FeaturedLots';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-canvas-subtle text-main selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* 60-30-10 COLOR PALETTE STUDIO (INTERACTIVE THEME PICKER) */}
      {/* ======================================================== */}
      <ColorStudio />

      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <HeroSection />

      {/* ======================================================== */}
      {/* 2. THE THREE LINKED PROBLEMS (SECTION 2 OF BLUEPRINT)    */}
      {/* ======================================================== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Subheading (H2: 42px desktop / 28px mobile) */}
          <h2 className="type-sub text-slate-900 font-quicksand font-bold">
            Excess stock is only the symptom.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700 font-bold text-sm mb-4 border border-rose-100 font-mono">
              01
            </div>
            {/* Little Heading (H3: 26px desktop / 20px mobile) */}
            <h3 className="type-little text-slate-900 mb-2 font-quicksand">
              Capital Frozen in Warehouse Rack Space
            </h3>
            {/* Paragraph (P: 16px / line-height: 1.618) */}
            <p className="type-body text-slate-600 font-quicksand">
              Inventory is working capital that has stopped working. Every month dead lines sit on warehouse pallets, they lose value, accrue storage costs, and prevent businesses from buying fast-moving goods.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-600 font-quicksand">
              Typical cost: 5% to 15% annual purchases lost to aging stock.
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold text-sm mb-4 border border-amber-100 font-mono">
              02
            </div>
            {/* Little Heading (H3: 26px desktop / 20px mobile) */}
            <h3 className="type-little text-slate-900 mb-2 font-quicksand">
              Information Asymmetry & Brand Fear
            </h3>
            {/* Paragraph (P: 16px / line-height: 1.618) */}
            <p className="type-body text-slate-600 font-quicksand">
              Sellers do not know who would pay fair recovery value for excess stock. Even worse, brands avoid public discounting out of fear that local customers or authorized distributors will demand the same markdown.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700 font-quicksand">
              Solution: Anonymous brand listings & competitor geo-blocking.
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm mb-4 border border-emerald-100 font-mono">
              03
            </div>
            {/* Little Heading (H3: 26px desktop / 20px mobile) */}
            <h3 className="type-little text-slate-900 mb-2 font-quicksand">
              Low Trust in Informal Bulk Trading
            </h3>
            {/* Paragraph (P: 16px / line-height: 1.618) */}
            <p className="type-body text-slate-600 font-quicksand">
              Informal WhatsApp bulk deals carry enormous risk. Buyers pay advance and receive damaged goods; sellers ship on credit and wait weeks for payment. StockBridge eliminates both with partner escrow.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 font-quicksand">
              Solution: Funds held in escrow until 48h physical inspection.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE RECOVERY CALCULATOR                      */}
      {/* ======================================================== */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RecoveryCalculator />
      </section>

      {/* ======================================================== */}
      {/* 4. THE 5-GRADE LOT SCALE EXPLORER                       */}
      {/* ======================================================== */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GradeScaleExplorer />
      </section>

      {/* ======================================================== */}
      {/* 5. LIVE MARKETPLACE SAMPLES (#marketplace)              */}
      {/* ======================================================== */}
      <section id="marketplace" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <FeaturedLots />
      </section>

      {/* ======================================================== */}
      {/* 6. HOW IT WORKS / ORDER LIFECYCLE (#how-it-works)        */}
      {/* ======================================================== */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-quicksand">
              The 4-Step Settlement Process
            </span>
            {/* Subheading (H2: 42px desktop / 28px mobile) */}
            <h2 className="type-sub text-slate-900 mt-3 font-quicksand">
              How a Structured Trade Works
            </h2>
            {/* Paragraph (P: 16px / line-height: 1.618) */}
            <p className="type-body text-slate-600 mt-2 font-quicksand">
              Rules, not informal promises, govern each step from lot verification to protected payment release.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <span className="text-3xl font-black text-slate-300 mb-4 font-mono">01</span>
              <h3 className="type-little text-slate-900 mb-1.5 font-quicksand">Structured Lot Listing</h3>
              <p className="type-body text-slate-600 font-quicksand text-sm">
                Seller defines cartons, total units, MOQ, and selects an A–E condition grade. Minimum 6 photos, packaging condition, and hidden reserve price are configured.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700 font-quicksand">
                • Ops QA review within 24 hours
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <span className="text-3xl font-black text-slate-300 mb-4 font-mono">02</span>
              <h3 className="type-little text-slate-900 mb-1.5 font-quicksand">Make-Offer Negotiation</h3>
              <p className="type-body text-slate-600 font-quicksand text-sm">
                Verified buyers propose bulk price and quantity. Offers below seller reserve are auto-rejected; offers above can be accepted or countered within a 48h window.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-700 font-quicksand">
                • Keeps private discounts confidential
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <span className="text-3xl font-black text-emerald-600 mb-4 font-mono">03</span>
              <h3 className="type-little text-slate-900 mb-1.5 font-quicksand">Protected Escrow Hold</h3>
              <p className="type-body text-slate-600 font-quicksand text-sm">
                Buyer deposits funds into a neutral licensed hold account. Seller sees &quot;Payment Secured&quot; and dispatches goods with packing video and weight proof.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-emerald-700 font-quicksand">
                • Seller is guaranteed funds before shipping
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <span className="text-3xl font-black text-emerald-600 mb-4 font-mono">04</span>
              <h3 className="type-little text-slate-900 mb-1.5 font-quicksand">48h Inspection & Settlement</h3>
              <p className="type-body text-slate-600 font-quicksand text-sm">
                Buyer inspects shipment against the specified grade guide. When accepted (or if 48h passes without dispute), funds are automatically released to the seller minus fee.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-emerald-700 font-quicksand">
                • Objective dispute resolution if mismatch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. BRAND PROTECTION & GUARDRAILS FOR SELLERS            */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-slate-900 bg-slate-900 p-8 sm:p-12 text-white">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded border border-emerald-800 font-quicksand">
              Brand Protection Architecture
            </span>
            <h2 className="type-sub text-white mt-4 font-quicksand">
              Sell excess inventory without cannibalizing your regular distribution network.
            </h2>
            <p className="type-body text-slate-300 mt-3 font-quicksand">
              We know brand owners and authorised distributors refuse to dump inventory on public websites because their regular retail clients will demand the same discount. StockBridge is built with three strict confidentiality layers:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div>
              <div className="text-emerald-400 font-bold mb-1 type-little font-quicksand">01. Hidden Brand Name</div>
              <p className="type-body text-slate-400 text-sm font-quicksand">
                List as &quot;Tier-1 Premium Footwear&quot; or &quot;Export Quality Apparel&quot;. Your brand name is completely hidden from public view and disclosed only after a verified buyer is accepted.
              </p>
            </div>
            <div>
              <div className="text-emerald-400 font-bold mb-1 type-little font-quicksand">02. Geographic Blocker</div>
              <p className="type-body text-slate-400 text-sm font-quicksand">
                Block buyers in your home city or state from seeing or purchasing your surplus lots, ensuring local retail shops never see discounted stock.
              </p>
            </div>
            <div>
              <div className="text-emerald-400 font-bold mb-1 type-little font-quicksand">03. Channel Allow-lists</div>
              <p className="type-body text-slate-400 text-sm font-quicksand">
                Restrict purchase eligibility exclusively to off-price liquidators, export traders, or institutional buyers—blocking online marketplace scrapers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. COMMON QUESTIONS (FAQ FROM REALITY CHECK)            */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
