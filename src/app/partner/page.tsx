import Link from 'next/link';

export const metadata = {
  title: 'Business Partner & Seller Portal | StockBridge',
  description: 'Liquidate surplus factory inventory confidentially without channel conflict. Enterprise liquidation partner for manufacturers, distributors, and brand owners.',
};

export default function PartnerPage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden bg-white text-main selection:bg-orange-100 selection:text-orange-900">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ff7a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#ff7a1a] mb-6">
              🏢 Enterprise Partner &amp; Liquidation Portal
            </div>
            
            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
              Turn excess inventory into <span className="text-[#ff7a1a]">liquid capital</span> without cannibalizing your dealer network.
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-slate-300 font-quicksand leading-relaxed">
              StockBridge provides brand owners, manufacturers, and master distributors a confidential B2B liquidation channel. Clear warehouse racks, recover working capital, and sell excess lots directly to pre-verified wholesale buyers.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/seller/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#ff7a1a] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] font-quicksand"
              >
                Apply as Business Partner
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#confidentiality"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-bold text-slate-200 transition hover:bg-slate-800 font-quicksand"
              >
                Confidentiality Framework
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Brand Name Protection</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff7a1a] font-mono">3x Faster</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Liquidation Speed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹0 Upfront</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Success-Only Commission</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Escrow Backed</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Guaranteed Payout Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. BRAND PROTECTION & CONFIDENTIALITY (Anchor #confidentiality) */}
      {/* ======================================================== */}
      <section id="confidentiality" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ff7a1a] font-mono">
            Zero Channel Conflict
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-quicksand text-slate-900 mt-2">
            Why Top Brands Partner with StockBridge
          </h2>
          <p className="mt-3 text-slate-600 font-quicksand text-base sm:text-lg">
            Traditional public websites leak discount pricing to your regular retail clients, destroying your trade price stability. StockBridge solves this with three proprietary safeguards:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-black text-[#ff7a1a] font-mono mb-4">1.</div>
            <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
              Hidden Brand Identity
            </h3>
            <p className="text-sm text-slate-600 font-quicksand leading-relaxed">
              List surplus lots under generalized categories (e.g. &quot;Tier-1 Consumer Electronics OEM&quot; or &quot;Export Footwear Factory&quot;). Your actual logo and company identity remain completely invisible until an authorized wholesale buyer is accepted.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-black text-[#ff7a1a] font-mono mb-4">2.</div>
            <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
              Geographic Geo-Fencing
            </h3>
            <p className="text-sm text-slate-600 font-quicksand leading-relaxed">
              Block entire cities, states, or distribution regions where your existing distributors operate. Prevent local retailers in your core territories from ever viewing or purchasing discounted factory lots.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-black text-[#ff7a1a] font-mono mb-4">3.</div>
            <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
              Channel Allow-Lists
            </h3>
            <p className="text-sm text-slate-600 font-quicksand leading-relaxed">
              Restrict buyer eligibility exclusively to non-conflicting channels such as off-price liquidators, export traders, or corporate institutions—strictly preventing e-commerce price undercutters.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW THE PARTNERSHIP PROCESS WORKS                    */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-900">
              The 4-Step Liquidation Workflow
            </h2>
            <p className="mt-2 text-slate-600 font-quicksand text-sm sm:text-base">
              A frictionless process built for supply chain leaders and finance directors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-orange-100 text-[#ff7a1a] font-bold text-sm mb-4">
                01
              </span>
              <h4 className="font-bold text-slate-900 font-quicksand mb-1">List &amp; Grade Lot</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Upload packing manifests and photos. Select the condition grade (Grade A through E) matching your lot condition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-orange-100 text-[#ff7a1a] font-bold text-sm mb-4">
                02
              </span>
              <h4 className="font-bold text-slate-900 font-quicksand mb-1">Set Reserve Price</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Control your bottom line. Receive binding offers from verified buyers with verified funds, with freedom to accept or counter.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-orange-100 text-[#ff7a1a] font-bold text-sm mb-4">
                03
              </span>
              <h4 className="font-bold text-slate-900 font-quicksand mb-1">Escrow Funded First</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Before you ship a single carton, the buyer deposits 100% of the deal amount into neutral escrow. Zero payment default risk.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-orange-100 text-[#ff7a1a] font-bold text-sm mb-4">
                04
              </span>
              <h4 className="font-bold text-slate-900 font-quicksand mb-1">Rapid Settlement</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Funds are released directly to your company bank account within 48 hours of delivery verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PARTNER FAQS                                         */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-900">
            Partner Questions &amp; Answers
          </h2>
          <p className="mt-1 text-slate-500 font-quicksand text-sm">
            Everything enterprise sellers need to know before onboarding.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 font-quicksand text-base">
              What are the fees for selling on StockBridge?
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
              We charge a flat 7% commission on successful order settlements. There are zero upfront listing fees, zero monthly software subscriptions, and zero fees if your lot does not sell.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 font-quicksand text-base">
              Who arranges logistics and transportation?
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
              Sellers can either use their own preferred commercial freight carrier (Ex-Works / FOB) or choose StockBridge integrated logistics partners who pick up palletized goods directly from your factory or warehouse.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 font-quicksand text-base">
              What kinds of surplus inventory can be liquidated?
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
              We accept factory overruns, canceled export orders, seasonal end-of-line stock, slow-moving SKUs, carton-damaged items, customer returns, and excess components across electronics, apparel, FMCG, industrial, and consumer goods.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. BOTTOM PARTNER CTA                                   */}
      {/* ======================================================== */}
      <section className="w-full bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-white">
            Ready to liquidate surplus stock and free up warehouse racks?
          </h2>
          <p className="text-slate-300 mt-3 max-w-xl mx-auto font-quicksand text-sm sm:text-base">
            Partner with StockBridge to turn idle inventory into liquid working capital with total brand protection.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/seller/register"
              className="w-full sm:w-auto rounded-xl bg-[#ff7a1a] px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#e65c00] font-quicksand"
            >
              Apply as Business Partner
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-8 py-3.5 text-base font-bold text-white transition hover:bg-slate-700 font-quicksand"
            >
              Partner Portal Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
