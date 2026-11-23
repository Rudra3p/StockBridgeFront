import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '5-Grade Quality & Trust Yardstick | StockBridge',
  description:
    'The official B2B grading specification manual for surplus inventory: Grade A to E definitions, expiry overlays (X1–X4), brand protection guardrails, and escrow dispute settlement.',
};

export default function GradeGuidePage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ff7a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-mono font-bold text-[#ff7a1a] mb-6">
              SPEC // OFFICIAL SPECIFICATION MANUAL V2.4
            </div>

            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
              The StockBridge <span className="text-[#ff7a1a]">5-Grade</span> Quality &amp; Trust Yardstick.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-quicksand leading-relaxed">
              Every surplus lot on StockBridge is cataloged using an objective 5-grade physical yardstick and verified photo manifests. This standard eliminates guesswork, protects wholesale margins, and governs all escrow inspection arbitrations.
            </p>

            {/* Quick-Jump Section Navigation */}
            <div className="mt-8 flex flex-wrap gap-2 pt-4">
              <a
                href="#scale"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition"
              >
                01. 5-Grade Scale (A–E) ↓
              </a>
              <a
                href="#expiry"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition"
              >
                02. Expiry Overlays (X1–X4) ↓
              </a>
              <a
                href="#guardrails"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition"
              >
                03. Brand Guardrails ↓
              </a>
              <a
                href="#dispute"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition"
              >
                04. Dispute Ladder ↓
              </a>
              <a
                href="#escrow"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-[#ff7a1a] hover:text-[#ff7a1a] transition"
              >
                05. Escrow Hold ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION: THE 5-GRADE SCALE (Anchor #scale)            */}
      {/* ======================================================== */}
      <section id="scale" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
            Specification 01
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-950 mt-1">
            The 5-Grade Physical Condition Scale
          </h2>
          <p className="mt-2 text-slate-600 font-quicksand text-base">
            Every lot listed on the marketplace must be accurately classified into one of five strictly-defined condition grades. Sellers must adhere to photo verification requirements for each tier.
          </p>
        </div>

        {/* Grade Deep-Dive Cards */}
        <div className="space-y-8">
          
          {/* Grade A */}
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-2xl font-quicksand shadow-sm">
                  A
                </span>
                <div>
                  <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                    SPEC // 01-A • TOP TIER RETAIL MINT
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-quicksand text-slate-900">
                    New, Current Line
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
                10% – 25% BELOW WHOLESALE
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Physical Condition</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Factory-sealed master cartons. Pristine, first-quality retail ready. Inventory is identical to active distributor deliveries, originating strictly from canceled purchase orders, export overruns, or factory buffers.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Packaging &amp; Tolerance</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Original manufacturer tape and strapping intact. Zero cosmetic or functional defects allowed. Unit packaging must be clean, crisp, and ready for high-end boutique or department store display.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Inspection Requirements</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Seller must provide: Master carton exterior photos (4 sides), factory barcode label scan, and factory tape seal intact verification.
                </p>
              </div>
            </div>
          </div>

          {/* Grade B */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-2xl font-quicksand shadow-sm">
                  B
                </span>
                <div>
                  <div className="text-xs font-mono text-blue-700 font-bold uppercase tracking-wider">
                    SPEC // 02-B • OUTDATED PACKAGING OR SEASON
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-quicksand text-slate-900">
                    New, Outdated Season / Discontinued SKU
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center self-start sm:self-auto rounded-full bg-blue-50 px-3.5 py-1 text-xs font-mono font-bold text-blue-800 border border-blue-200">
                25% – 45% BELOW WHOLESALE
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Physical Condition</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  100% brand new, sealed merchandise. Discontinued SKUs, previous-generation packaging designs, or earlier seasonal colorways. No changes in internal product functionality or durability.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Packaging &amp; Tolerance</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Original sealed cartons with older artwork or superseded EAN barcodes. Minor shelf dust on exterior master carton allowed, but unit boxes inside must be undamaged and factory-sealed.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Target Channels</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Value retail shops, regional discount chains, e-commerce reseller storefronts, and off-price outlets seeking high velocity margin.
                </p>
              </div>
            </div>
          </div>

          {/* Grade C */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-white font-extrabold text-2xl font-quicksand shadow-sm">
                  C
                </span>
                <div>
                  <div className="text-xs font-mono text-amber-700 font-bold uppercase tracking-wider">
                    SPEC // 03-C • PACKAGING DEFECT ONLY
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-quicksand text-slate-900">
                    Packaging Damage (Contents Mint)
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center self-start sm:self-auto rounded-full bg-amber-50 px-3.5 py-1 text-xs font-mono font-bold text-amber-800 border border-amber-200">
                40% – 60% BELOW WHOLESALE
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Physical Condition</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Master carton has sustained transit impact (crushed corners, tears, or punctured exterior). The merchandise inside is 100% complete, unblemished, and tested intact with full internal styrofoam/blister protection.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Packaging &amp; Tolerance</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Carton damage tolerance up to 30% structural deformation of outer packaging. Zero tolerance for physical denting or cracking on the product itself.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Target Channels</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Local wholesale markets, bazaar merchants, and unbox electronics retailers where goods are displayed unpackaged in counter showcases.
                </p>
              </div>
            </div>
          </div>

          {/* Grade D */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600 text-white font-extrabold text-2xl font-quicksand shadow-sm">
                  D
                </span>
                <div>
                  <div className="text-xs font-mono text-purple-700 font-bold uppercase tracking-wider">
                    SPEC // 04-D • TESTED FUNCTIONAL
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-quicksand text-slate-900">
                    Open-Box / Minor Cosmetic Blemish
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center self-start sm:self-auto rounded-full bg-purple-50 px-3.5 py-1 text-xs font-mono font-bold text-purple-800 border border-purple-200">
                55% – 75% BELOW WHOLESALE
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Physical Condition</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Store display items, customer returns, or opened inspection units. Every single unit is power-tested and verified 100% operational. Minor surface hairline scuffs or scratches are permissible and disclosed in the lot manifest.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Packaging &amp; Tolerance</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Repackaged in plain white/brown boxes or securely palletized in bulk bins. Essential accessories, cables, and power bricks must be included unless explicitly marked &quot;Bare Unit&quot;.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Target Channels</span>
                <p className="text-slate-800 font-quicksand leading-relaxed">
                  Professional refurbishers, warranty replacement centers, second-hand electronics dealers, and clearance liquidation counters.
                </p>
              </div>
            </div>
          </div>

          {/* Grade E */}
          <div className="rounded-2xl border-2 border-slate-800 bg-[#0a0f1d] p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff7a1a] text-white font-extrabold text-2xl font-quicksand shadow-sm">
                  E
                </span>
                <div>
                  <div className="text-xs font-mono text-[#ff7a1a] font-bold uppercase tracking-wider">
                    SPEC // 05-E • RAW SALVAGE &amp; COMPONENTS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-quicksand text-white">
                    As-Is / Industrial Salvage
                  </h3>
                </div>
              </div>
              <div className="inline-flex items-center self-start sm:self-auto rounded-full bg-orange-950/80 px-3.5 py-1 text-xs font-mono font-bold text-orange-300 border border-orange-800">
                70%+ AS-IS RECOVERY
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Physical Condition</span>
                <p className="text-slate-200 font-quicksand leading-relaxed">
                  Untested bulk gaylords, raw factory pallet lots, production line scrap, and non-functional returned units. Sold strictly &quot;As-Is, Where-Is&quot; for spare parts harvesting, component rework, or material recycling.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Packaging &amp; Tolerance</span>
                <p className="text-slate-200 font-quicksand leading-relaxed">
                  Raw gaylord cartons, wooden crates, or loose stacked pallets. No condition warranty applies; verified exclusively by gross pallet weight and approximate SKU manifests.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Target Channels</span>
                <p className="text-slate-200 font-quicksand leading-relaxed">
                  E-waste recyclers, component recovery shops, metal scrap processors, and certified industrial rework facilities.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Comparison Summary Table */}
        <div className="mt-14 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-mono uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Grade</th>
                <th className="px-5 py-3.5">Condition Summary</th>
                <th className="px-5 py-3.5">Packaging</th>
                <th className="px-5 py-3.5">Cosmetic Defect</th>
                <th className="px-5 py-3.5">Target Discount</th>
                <th className="px-5 py-3.5">Inspection Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-quicksand text-xs sm:text-sm">
              <tr className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-emerald-700">Grade A</td>
                <td className="px-5 py-3 text-slate-900">New, Current Line Overrun</td>
                <td className="px-5 py-3 text-slate-600">Factory Sealed Master Box</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600">0%</td>
                <td className="px-5 py-3 text-slate-900 font-semibold">10% – 25% off Wholesale</td>
                <td className="px-5 py-3 font-mono">48 Hours</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-blue-700">Grade B</td>
                <td className="px-5 py-3 text-slate-900">New, Superseded Season</td>
                <td className="px-5 py-3 text-slate-600">Original Sealed Cartons</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600">0%</td>
                <td className="px-5 py-3 text-slate-900 font-semibold">25% – 45% off Wholesale</td>
                <td className="px-5 py-3 font-mono">48 Hours</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-amber-700">Grade C</td>
                <td className="px-5 py-3 text-slate-900">Packaging Transit Damage</td>
                <td className="px-5 py-3 text-slate-600">Crushed / Dented Cartons</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600">0% (Product Mint)</td>
                <td className="px-5 py-3 text-slate-900 font-semibold">40% – 60% off Wholesale</td>
                <td className="px-5 py-3 font-mono">48 Hours</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-purple-700">Grade D</td>
                <td className="px-5 py-3 text-slate-900">Open-Box / Display Returns</td>
                <td className="px-5 py-3 text-slate-600">Repackaged / Plain Box</td>
                <td className="px-5 py-3 font-mono font-bold text-amber-600">&lt; 5% Surface Marks</td>
                <td className="px-5 py-3 text-slate-900 font-semibold">55% – 75% off Wholesale</td>
                <td className="px-5 py-3 font-mono">48 Hours</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-[#ff7a1a]">Grade E</td>
                <td className="px-5 py-3 text-slate-900">As-Is Raw Salvage</td>
                <td className="px-5 py-3 text-slate-600">Raw Pallet / Gaylord Bin</td>
                <td className="px-5 py-3 font-mono text-rose-600">Untested / Broken</td>
                <td className="px-5 py-3 text-slate-900 font-semibold">70%+ Salvage Recovery</td>
                <td className="px-5 py-3 font-mono">Weight Check Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECTION: EXPIRY OVERLAYS (Anchor #expiry)             */}
      {/* ======================================================== */}
      <section id="expiry" className="w-full py-20 bg-white border-t border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
              Specification 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-950 mt-1">
              Shelf-Life &amp; Expiry Overlays (X1 – X4)
            </h2>
            <p className="mt-2 text-slate-600 font-quicksand text-base">
              For dated categories (packaged food, pharmaceuticals, cosmetics, chemical formulations, and industrial sealants), condition grades are paired with mandatory expiration tags.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                    CODE: X1
                  </span>
                  <span className="text-xs font-mono text-slate-400">12+ MONTHS</span>
                </div>
                <h3 className="font-bold text-slate-900 font-quicksand text-lg mb-2">
                  Full Shelf Life
                </h3>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  More than 12 months remaining until Best-Before / Expiry Date. Qualifies for mainstream retail supermarket shelves and regional distributor warehouses.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-emerald-700 font-semibold">
                ✓ Full Wholesale Distribution Eligible
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-xs">
                    CODE: X2
                  </span>
                  <span className="text-xs font-mono text-slate-400">6–12 MONTHS</span>
                </div>
                <h3 className="font-bold text-slate-900 font-quicksand text-lg mb-2">
                  Standard Shelf Life
                </h3>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  Between 6 and 12 months remaining. Ample runway for discount department stores, convenience chains, and quick-turn bulk institutional buyers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-blue-700 font-semibold">
                ✓ Quick-Turn Discount Stores Eligible
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-mono font-bold text-xs">
                    CODE: X3
                  </span>
                  <span className="text-xs font-mono text-slate-400">3–6 MONTHS</span>
                </div>
                <h3 className="font-bold text-slate-900 font-quicksand text-lg mb-2">
                  Short Shelf Life
                </h3>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  Between 3 and 6 months remaining. Priced with steep markdown. Best suited for high-density bazaar clearance, promotional flash sales, and food banks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-amber-700 font-semibold">
                ✓ High Velocity Flash-Sale Only
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-mono font-bold text-xs">
                    CODE: X4
                  </span>
                  <span className="text-xs font-mono text-slate-400">&lt; 3 MONTHS</span>
                </div>
                <h3 className="font-bold text-slate-900 font-quicksand text-lg mb-2">
                  Critical Expiration
                </h3>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  Under 90 days of remaining viability. Sold exclusively with strict buyer liability waivers for immediate redistribution or component extraction.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-rose-700 font-semibold">
                ⚠ Mandatory Immediate Clearance
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION: BRAND GUARDRAILS (Anchor #guardrails)       */}
      {/* ======================================================== */}
      <section id="guardrails" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
              Specification 03
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-quicksand text-white mt-1">
              Brand Protection Architecture
            </h2>
            <p className="mt-3 text-slate-300 font-quicksand leading-relaxed text-sm sm:text-base">
              StockBridge solves the fatal flaw of informal liquidation: regular retail clients discovering cheap stock online. We enforce three technical guardrails on every listed lot:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-slate-800">
            <div className="space-y-3">
              <div className="text-3xl font-black text-[#ff7a1a] font-mono">
                1.
              </div>
              <h3 className="text-lg font-bold font-quicksand text-white">
                Hidden Brand Name
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-quicksand leading-relaxed">
                Lots appear publicly under generic descriptors (&quot;Tier-1 Air Conditioning Manufacturer&quot; or &quot;Export Cotton Apparel Mill&quot;). The actual registered trademark is hidden until an offer is accepted from a vetted buyer.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-black text-[#ff7a1a] font-mono">
                2.
              </div>
              <h3 className="text-lg font-bold font-quicksand text-white">
                Geographic Geo-Fencing
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-quicksand leading-relaxed">
                Sellers can geo-block home states, metropolitan districts, or primary distributor zones. Retail shops in your active territories will never see or purchase discounted surplus lots.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-black text-[#ff7a1a] font-mono">
                3.
              </div>
              <h3 className="text-lg font-bold font-quicksand text-white">
                Channel Allow-Lists
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-quicksand leading-relaxed">
                Restrict who can bid: exclude consumer marketplace sellers (Amazon/Flipkart resellers) and permit only verified export traders, corporate liquidators, or discount bazaars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SECTION: DISPUTE LADDER (Anchor #dispute)             */}
      {/* ======================================================== */}
      <section id="dispute" className="w-full py-20 bg-white border-t border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
              Specification 04
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-950 mt-1">
              The 4-Step Dispute Resolution Ladder
            </h2>
            <p className="mt-2 text-slate-600 font-quicksand text-base">
              If delivered goods fail to match the listing grade or manifest quantity, our dispute ladder resolves the discrepancy objectively with zero emotional friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#ff7a1a] font-mono font-bold text-xs mb-4">
                  01
                </span>
                <h4 className="font-bold text-slate-900 font-quicksand text-base mb-2">
                  Inspection Flag
                </h4>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  Buyer reports discrepancy within the 48-hour inspection window. Must upload timestamped carton photos, SKU barcodes, and discrepancy description via the Buyer Dashboard.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-slate-500">
                Trigger: Within 48 hours of POD
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#ff7a1a] font-mono font-bold text-xs mb-4">
                  02
                </span>
                <h4 className="font-bold text-slate-900 font-quicksand text-base mb-2">
                  Automatic Escrow Freeze
                </h4>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  The disputed transaction amount is frozen in neutral escrow instantly. Neither party can withdraw the funds while the StockBridge Operations team opens the case file.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-rose-600 font-semibold">
                Safety: 100% Funds Secured
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#ff7a1a] font-mono font-bold text-xs mb-4">
                  03
                </span>
                <h4 className="font-bold text-slate-900 font-quicksand text-base mb-2">
                  Yardstick Arbitration
                </h4>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  StockBridge arbitrates comparing origin inspection photos with buyer evidence against the 5-Grade specification manual tolerances. No subjective opinions permitted.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-slate-500">
                Turnaround: Under 24 Business Hours
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#ff7a1a] font-mono font-bold text-xs mb-4">
                  04
                </span>
                <h4 className="font-bold text-slate-900 font-quicksand text-base mb-2">
                  Settlement Release
                </h4>
                <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                  If grade mismatch is confirmed: pro-rata refund deducted or full lot returned at seller freight expense. If confirmed conforming: escrow released immediately to seller.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-mono text-emerald-700 font-semibold">
                Outcome: Binding Resolution
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. SECTION: PROTECTED PAYMENT ESCROW (Anchor #escrow)    */}
      {/* ======================================================== */}
      <section id="escrow" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
            Specification 05
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-slate-950 mt-1">
            Protected Payment &amp; Escrow Mechanics
          </h2>
          <p className="mt-2 text-slate-600 font-quicksand text-base">
            Trade with total financial security. We eliminate the twin risks of B2B surplus: buyers getting scammed by informal brokers, and sellers not getting paid after dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold font-mono text-blue-700 mb-4">
              FOR WHOLESALE BUYERS
            </div>
            <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-3">
              How Escrow Protects Your Capital
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 font-quicksand">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>No direct upfront wire to sellers:</strong> Your funds stay in a neutral banking escrow account until physical receipt.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>48-Hour Inspection Period:</strong> Open master cartons, count SKUs, and verify grade consistency before any payment release.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Guaranteed GST Tax Invoices:</strong> 100% valid HSN codes and B2B invoices to claim your input tax credit (ITC).</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold font-mono text-[#ff7a1a] mb-4">
              FOR BUSINESS PARTNERS &amp; SELLERS
            </div>
            <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-3">
              How Escrow Protects Your Cash Flow
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 font-quicksand">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>100% Pre-Funded Orders:</strong> You never load a transport truck without verified funds already locked in escrow.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Zero Bad-Debt / Default Risk:</strong> Eliminates non-paying buyers, dishonored cheques, and endless credit follow-ups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Automated Payout Release:</strong> Funds deposit directly into your corporate bank account 48h after delivery sign-off.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. BOTTOM CTA STRIP                                     */}
      {/* ======================================================== */}
      <section className="w-full bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-white">
            Ready to trade graded surplus with complete confidence?
          </h2>
          <p className="text-slate-300 mt-3 max-w-xl mx-auto font-quicksand text-sm sm:text-base">
            Join verified manufacturers, wholesalers, and retail chains trading overstock with zero quality ambiguity.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:opacity-90 font-quicksand"
            >
              Create Business Account
            </Link>
            <Link
              href="/#marketplace"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-900 px-8 py-3.5 text-base font-bold text-white transition hover:bg-slate-800 font-quicksand"
            >
              Browse Active Marketplace Lots
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
