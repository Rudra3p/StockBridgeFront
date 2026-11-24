'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface DemandRFQ {
  id: string;
  category: 'footwear' | 'apparel' | 'electronics' | 'hardware' | 'fmcg';
  categoryLabel: string;
  title: string;
  unitsNeeded: string;
  minGrade: 'A' | 'B' | 'C' | 'D';
  escrowLockedAmount: number;
  buyerType: string;
  location: string;
  hsnCode: string;
  daysActive: number;
}

const LIVE_DEMAND_RFQS: DemandRFQ[] = [
  {
    id: 'DEM-904',
    category: 'footwear',
    categoryLabel: 'Footwear & Shoes',
    title: 'Athletic Running Shoes & Sneakers (Assorted UK 6-10)',
    unitsNeeded: '500 – 1,200 Pairs',
    minGrade: 'B',
    escrowLockedAmount: 485000,
    buyerType: 'Verified Regional Retail Stockist',
    location: 'Agra, Uttar Pradesh',
    hsnCode: '640411',
    daysActive: 2,
  },
  {
    id: 'DEM-771',
    category: 'electronics',
    categoryLabel: 'Consumer Electronics',
    title: '18W Slim LED Ceiling Panels (Driver Inbuilt, Outer Box Dents OK)',
    unitsNeeded: '800 – 2,000 Units',
    minGrade: 'C',
    escrowLockedAmount: 240000,
    buyerType: 'Institutional Electrical Wholesaler',
    location: 'Bengaluru, Karnataka',
    hsnCode: '940540',
    daysActive: 1,
  },
  {
    id: 'DEM-319',
    category: 'apparel',
    categoryLabel: 'Apparel & Textiles',
    title: '100% Combed Cotton Bio-Washed T-Shirts (180 GSM Single Jersey)',
    unitsNeeded: '2,000 – 5,000 Pcs',
    minGrade: 'A',
    escrowLockedAmount: 525000,
    buyerType: 'Garment Export & Outlet Clearing House',
    location: 'Tirupur, Tamil Nadu',
    hsnCode: '610910',
    daysActive: 3,
  },
  {
    id: 'DEM-412',
    category: 'hardware',
    categoryLabel: 'Industrial Hardware',
    title: 'Heavy Duty Forged Brass Ball Valves (1/2" & 3/4" BSP Screwed)',
    unitsNeeded: '1,500 – 3,500 Units',
    minGrade: 'A',
    escrowLockedAmount: 495000,
    buyerType: 'Plumbing & Industrial Mill Store Distributor',
    location: 'Jamnagar, Gujarat',
    hsnCode: '848180',
    daysActive: 1,
  },
  {
    id: 'DEM-108',
    category: 'footwear',
    categoryLabel: 'Footwear & Shoes',
    title: 'Formal Genuine Leather Lace-Up Oxford Shoes (Brown/Black)',
    unitsNeeded: '300 – 600 Pairs',
    minGrade: 'A',
    escrowLockedAmount: 380000,
    buyerType: 'Chain Store Departmental Buyer',
    location: 'Kanpur, Uttar Pradesh',
    hsnCode: '640359',
    daysActive: 4,
  },
  {
    id: 'DEM-552',
    category: 'electronics',
    categoryLabel: 'Consumer Electronics',
    title: 'High-Speed 4K HDMI 2.1 Braided Cables (2m Length, Bulk Polybag)',
    unitsNeeded: '3,000 – 6,000 Pcs',
    minGrade: 'A',
    escrowLockedAmount: 330000,
    buyerType: 'IT Hardware & Peripheral Wholesaler',
    location: 'Nehru Place, New Delhi',
    hsnCode: '854442',
    daysActive: 2,
  },
  {
    id: 'DEM-620',
    category: 'apparel',
    categoryLabel: 'Apparel & Textiles',
    title: 'Heavyweight Denim Jeans (Stretch Cotton, Surplus Stitching Overruns)',
    unitsNeeded: '1,000 – 2,500 Pairs',
    minGrade: 'B',
    escrowLockedAmount: 650000,
    buyerType: 'Apparel Bazaar Retail Chain',
    location: 'Surat, Gujarat',
    hsnCode: '620342',
    daysActive: 3,
  },
  {
    id: 'DEM-834',
    category: 'fmcg',
    categoryLabel: 'FMCG & Packaging',
    title: 'Corrugated 5-Ply Shipping Cartons & Secondary Packaging Overruns',
    unitsNeeded: '10,000 – 25,000 Boxes',
    minGrade: 'A',
    escrowLockedAmount: 285000,
    buyerType: 'Third-Party Logistics Fulfillment Center',
    location: 'Bhiwandi, Maharashtra',
    hsnCode: '481910',
    daysActive: 5,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories', demand: '₹4.8 Cr+' },
  { id: 'footwear', label: '👟 Footwear', demand: '₹1.45 Cr' },
  { id: 'apparel', label: '👕 Apparel & Textiles', demand: '₹1.18 Cr' },
  { id: 'electronics', label: '💡 Consumer Electronics', demand: '₹94 L' },
  { id: 'hardware', label: '🔧 Industrial Hardware', demand: '₹82 L' },
  { id: 'fmcg', label: '📦 FMCG & Packaging', demand: '₹51 L' },
];

export default function PartnerPage() {
  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Recovery Calculator state
  const [calcInventoryValue, setCalcInventoryValue] = useState<number>(1000000);
  const [calcCategory, setCalcCategory] = useState<'footwear' | 'electronics' | 'apparel' | 'hardware'>('footwear');

  // Brand Guard Demo state
  const [maskBrand, setMaskBrand] = useState<boolean>(true);
  const [geoFencing, setGeoFencing] = useState<boolean>(true);
  const [channelLock, setChannelLock] = useState<boolean>(true);

  // Recovery Calculator dynamic computations
  const recoveryRates = {
    footwear: { rate: 0.62, label: '62% of Original Value', speed: '7–10 Days' },
    electronics: { rate: 0.54, label: '54% of Original Value', speed: '8–14 Days' },
    apparel: { rate: 0.58, label: '58% of Original Value', speed: '5–9 Days' },
    hardware: { rate: 0.71, label: '71% of Original Value', speed: '6–12 Days' },
  };

  const selectedRecovery = recoveryRates[calcCategory];
  const brokerScrapPayout = Math.round(calcInventoryValue * 0.15);
  const stockBridgePayout = Math.round(calcInventoryValue * selectedRecovery.rate);
  const extraRecoveredCapital = stockBridgePayout - brokerScrapPayout;

  // Filtered RFQs
  const filteredRFQs = useMemo(() => {
    return LIVE_DEMAND_RFQS.filter((rfq) => {
      const matchesCategory = selectedCategory === 'all' || rfq.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfq.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden bg-white text-main selection:bg-orange-100 selection:text-orange-950">

      {/* ======================================================== */}
      {/* 1. HERO SECTION: DIRECT ACTION & ONBOARDING (AMAZON/ZOMATO STYLE) */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#ff7a1a_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        
        {/* Subtle glow background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-mono font-bold text-[#ff7a1a]">
              🏭 B2B SURPLUS LIQUIDATION // AHMEDABAD • SURAT • TIRUPUR • AGRA • NOIDA
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              • Verified GSTIN Supply Chain Network
            </span>
          </div>

          {/* Main Hero Header */}
          <div className="max-w-4xl">
            <h1 className="font-quicksand font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12] text-white">
              Turn Aging Factory Surplus into{' '}
              <span className="text-[#ff7a1a]">Liquid Capital</span>. Zero Channel Conflict.
            </h1>
            <p className="mt-5 text-base sm:text-xl text-slate-300 font-quicksand leading-relaxed max-w-3xl">
              &ldquo;A recovery-value and trust system, not a discount website.&rdquo; Recover <strong>30% to 70%</strong> of inventory value directly from vetted bulk buyers—without cannibalizing your distributor network or leaking wholesale pricing.
            </p>
          </div>

          {/* ======================================================== */}
          {/* DIRECT ACTION BAR (AMAZON / ZOMATO / SWIGGY ONBOARDING)  */}
          {/* ======================================================== */}
          <div className="mt-10 max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Buyer Demand Search &amp; Liquidation Check
              </span>
              <span className="text-[#ff7a1a] font-bold hidden sm:inline-block">
                ₹4.8 Cr+ Verified Escrow Bids Active
              </span>
            </div>

            {/* Direct Input & Action Row */}
            <div className="flex flex-col md:flex-row items-stretch gap-2.5">
              
              {/* Category Select */}
              <div className="shrink-0 md:w-56">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-13 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-quicksand text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Athletic running shoes, 18W LED panels, 180 GSM cotton tees..."
                  className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-700 bg-slate-950 text-sm font-quicksand text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              {/* Direct Search Action Button */}
              <a
                href="#live-demand"
                className="h-13 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-quicksand font-bold text-sm flex items-center justify-center gap-2 transition shrink-0"
              >
                <span>Check Live Bids</span>
                <span className="text-xs bg-[#ff7a1a] text-white px-2 py-0.5 rounded font-mono font-bold">
                  {filteredRFQs.length} Lots
                </span>
              </a>

              {/* Direct Partner Registration Button (Amazon / Swiggy Style) */}
              <Link
                href="/seller/register"
                className="h-13 px-7 rounded-xl bg-[#ff7a1a] hover:bg-[#e65c00] text-white font-quicksand font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition shrink-0"
              >
                <span>Register as Partner</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Quick Filter Pills */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 shrink-0">Popular Categories:</span>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-quicksand transition ${
                    selectedCategory === cat.id
                      ? 'bg-orange-500/20 text-[#ff7a1a] border border-orange-500/50 font-bold'
                      : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label} <span className="opacity-60 font-mono text-[11px]">({cat.demand})</span>
                </button>
              ))}
            </div>

            {/* Micro Trust Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 100% Brand Masking
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Territory Geo-Fencing
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Escrow Pre-Funded
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 7% Success-Only Fee
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff7a1a] font-mono">3x Higher</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Recovery than scrap brokers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">7 to 14 Days</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Average liquidation cycle</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹0 Upfront</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Zero listing or monthly fee</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 4%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-quicksand mt-1">Dispute rate (5-grade standard)</div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE B2B BUYER DEMAND BOARD (FILTERABLE RFQs)         */}
      {/* ======================================================== */}
      <section id="live-demand" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#e65c00] text-xs font-mono font-bold mb-2">
              🔥 ACTIVE PRE-FUNDED ORDERS // READY TO TRANSACT
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-slate-900 tracking-tight">
              Verified Buyers Currently Seeking Surplus Inventory
            </h2>
            <p className="mt-2 text-slate-600 font-quicksand text-sm sm:text-base max-w-2xl">
              Unlike public classifieds, these buyers have already verified their GSTIN and have purchasing capital ready to deposit into StockBridge Escrow.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-900">{filteredRFQs.length}</strong> active demands
            </span>
            <Link
              href="/seller/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e65c00] hover:bg-[#cc5200] text-white text-xs font-bold font-quicksand shadow-sm transition"
            >
              Fulfill Surplus Stock →
            </Link>
          </div>
        </div>

        {/* RFQ Cards Grid */}
        {filteredRFQs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
            <p className="text-slate-600 font-quicksand text-base">No active buyer demand matching &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold font-mono text-[#e65c00] underline"
            >
              Reset filters to show all active demands
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Category & Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                      {rfq.categoryLabel}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Grade {rfq.minGrade}+ Eligible
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-quicksand font-bold text-base sm:text-lg text-slate-900 leading-snug mb-3">
                    {rfq.title}
                  </h3>

                  {/* Details Pill Strip */}
                  <div className="space-y-2 text-xs font-quicksand text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">Required Quantity:</span>
                      <strong className="text-slate-900 font-mono">{rfq.unitsNeeded}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">Buyer Hub:</span>
                      <strong className="text-slate-800">{rfq.location}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">Buyer Segment:</span>
                      <span className="text-slate-700 text-[11px] font-medium">{rfq.buyerType}</span>
                    </div>
                  </div>
                </div>

                {/* Escrow Value & CTA Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Ready Escrow Budget
                    </span>
                    <span className="text-lg font-extrabold font-mono text-[#e65c00]">
                      ₹{rfq.escrowLockedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    href={`/seller/register?ref=${rfq.id}&cat=${rfq.category}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-[#e65c00] text-white text-xs font-bold font-quicksand transition"
                  >
                    Match Stock →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE RECOVERY CALCULATOR WIDGET                */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-950 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
              CAPITAL RECOVERY COMPARISON // DATA FROM 80+ B2B INTERVIEWS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-white mt-2">
              Calculate What Your Dead Stock is Actually Worth
            </h2>
            <p className="mt-3 text-slate-300 font-quicksand text-sm sm:text-base">
              Scrap liquidators exploit your lack of buyer visibility, offering 10%–15% pennies on the rupee. StockBridge directly matches your graded lot with wholesale businesses who can immediately resell it.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 mb-2 uppercase">
                  1. Select Inventory Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['footwear', 'apparel', 'electronics', 'hardware'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCalcCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold font-quicksand capitalize transition ${
                        calcCategory === cat
                          ? 'bg-[#ff7a1a] text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for MRP */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                    2. Original Value / MRP of Idle Stock
                  </label>
                  <span className="text-lg font-extrabold font-mono text-[#ff7a1a]">
                    ₹{calcInventoryValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="5000000"
                  step="100000"
                  value={calcInventoryValue}
                  onChange={(e) => setCalcInventoryValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ff7a1a]"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                  <span>₹2 Lakhs</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs font-quicksand">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-mono">Liquidation Time:</span>
                  <strong className="text-white text-sm font-mono">{selectedRecovery.speed}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-mono">Settlement Terms:</span>
                  <strong className="text-emerald-400 text-sm font-mono">100% Escrow Verified</strong>
                </div>
              </div>

            </div>

            {/* Right Output Comparison Card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700/80 p-6 sm:p-7 space-y-5">
              
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Traditional Scrap Broker Offer (15%)
                </span>
                <span className="text-xl font-bold font-mono text-slate-400 line-through">
                  ₹{brokerScrapPayout.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-mono text-[#ff7a1a] uppercase tracking-wider font-bold block">
                  StockBridge Graded B2B Recovery ({selectedRecovery.label})
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                  ₹{stockBridgePayout.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs font-mono font-bold text-emerald-400 block">
                  Extra Working Capital Unlocked:
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                  +₹{extraRecoveredCapital.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href="/seller/register"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#ff7a1a] hover:bg-[#e65c00] py-3.5 text-sm font-bold text-white shadow-lg transition font-quicksand"
              >
                Liquidate This Lot Now →
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ANTI-CHANNEL CONFLICT SHIELD (INTERACTIVE DEMO)       */}
      {/* ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
            ZERO CHANNEL CONFLICT GUARANTEE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-slate-900 mt-2">
            Why Top Brands Sell on StockBridge Without Hurting Retail Dealers
          </h2>
          <p className="mt-3 text-slate-600 font-quicksand text-sm sm:text-base">
            Listing discounts on public websites causes dealers to complain and cancel orders. StockBridge enforces three proprietary enterprise guardrails:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Hidden Brand Identity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#e65c00] font-black font-mono text-lg">
                  1
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Default Enabled
                </span>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
                Hidden Brand Identity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-quicksand leading-relaxed">
                Your lot is displayed under generic nomenclature (e.g. &ldquo;Tier-1 Consumer Electronics OEM&rdquo;). Your trademark, logo, and legal entity remain 100% confidential until an escrow offer is binding.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              🛡️ Zero search engine scraping or dealer price leakage
            </div>
          </div>

          {/* 2. Geographic Geo-Fencing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#e65c00] font-black font-mono text-lg">
                  2
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Customizable
                </span>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
                Geographic Geo-Fencing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-quicksand leading-relaxed">
                Blacklist specific states, cities, or postal regions where your authorized distributors operate. Retailers in your core sales territories cannot see, search, or buy your surplus lots.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              📍 Block home states (e.g., Exclude Gujarat / Maharashtra)
            </div>
          </div>

          {/* 3. Channel Allow-Lists */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#e65c00] font-black font-mono text-lg">
                  3
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Strict Vetting
                </span>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-slate-900 mb-2">
                Channel Allow-Lists
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-quicksand leading-relaxed">
                Restrict bidding access exclusively to certified non-competing bulk buyers such as export clearing traders, corporate gifting houses, or rural liquidation chains. Zero e-commerce marketplace sellers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              🚫 Strict ban on Amazon/Flipkart undercutters
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE 5-GRADE LOT SCALE (PPT SLIDE 1 & 4)                */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
              STANDARDIZED QUALITY YARDSTICKS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-slate-900 mt-2">
              The 5-Grade Standardized Lot Scale
            </h2>
            <p className="mt-3 text-slate-600 font-quicksand text-sm sm:text-base">
              The secret to getting higher bids is eliminating buyer uncertainty. Every lot on StockBridge is certified against strict, standardized inspection yardsticks:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 font-black font-mono text-base flex items-center justify-center">
                  A
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  90%+ Value
                </span>
              </div>
              <h4 className="font-quicksand font-bold text-slate-900 text-base mb-1">Grade A: Factory Fresh</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Brand new overruns in original sealed master cartons with barcodes intact. Zero cosmetic or mechanical flaws.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-black font-mono text-base flex items-center justify-center">
                  B
                </span>
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  70%–85% Value
                </span>
              </div>
              <h4 className="font-quicksand font-bold text-slate-900 text-base mb-1">Grade B: Packaging Wear</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Pristine brand-new product inside, but outer retail packaging has minor shelf wear, shipping scuffs, or opened seals.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 font-black font-mono text-base flex items-center justify-center">
                  C
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  50%–65% Value
                </span>
              </div>
              <h4 className="font-quicksand font-bold text-slate-900 text-base mb-1">Grade C: Minor Flaws</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Fully functional with minor cosmetic blemishes, slight color deviations, or re-boxed packaging. Full utility intact.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-lg bg-orange-100 text-orange-800 font-black font-mono text-base flex items-center justify-center">
                  D
                </span>
                <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                  30%–45% Value
                </span>
              </div>
              <h4 className="font-quicksand font-bold text-slate-900 text-base mb-1">Grade D: Refurbished</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                Customer returns or factory-reconditioned stock. Tested and restored to working order with documented repairs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-lg bg-rose-100 text-rose-800 font-black font-mono text-base flex items-center justify-center">
                  E
                </span>
                <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Scrap / Parts
                </span>
              </div>
              <h4 className="font-quicksand font-bold text-slate-900 text-base mb-1">Grade E: Salvage / Parts</h4>
              <p className="text-xs text-slate-600 font-quicksand leading-relaxed">
                As-is raw salvage lot, non-working units, or spare component inventory for recycling and component harvesting.
              </p>
            </div>

          </div>

          <div className="mt-8 text-center">
            <Link
              href="/grade-guide"
              className="text-xs font-mono font-bold text-[#e65c00] hover:underline inline-flex items-center gap-1"
            >
              Explore Complete 5-Grade Inspection Manual &amp; Photo Yardsticks →
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. REAL PERSONAS: ASHA & DEV CASE STUDY (PPT SLIDE 2)     */}
      {/* ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
            B2B PILOT CASE STUDY // JG UNIVERSITY AHMEDABAD INCUBATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-slate-900 mt-2">
            Built for Real Sellers. Trusted by Real Buyers.
          </h2>
          <p className="mt-3 text-slate-600 font-quicksand text-sm sm:text-base">
            How StockBridge solved the classic deadlock between aging warehouse inventory and buyer transaction fear:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Asha's Persona Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-100 text-[#e65c00] px-4 py-1.5 rounded-bl-xl text-xs font-mono font-bold">
              The Seller Persona
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-quicksand text-lg">
                  AS
                </div>
                <div>
                  <h3 className="font-quicksand font-bold text-lg text-slate-900">Asha, Brand Master Distributor</h3>
                  <p className="text-xs text-slate-500 font-mono">Consumer Lifestyle Goods • Ahmedabad, Gujarat</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-quicksand leading-relaxed">
                <p>
                  <strong>The Challenge:</strong> Asha held 14 months of aging footwear stock occupying 2,400 sq.ft. of warehouse racks. Her existing retailers refused to buy at regular wholesale, but selling openly at discounts would trigger price-matching demands across her 180 store network.
                </p>
                <p>
                  <strong>StockBridge Resolution:</strong> Listed lot under Grade B with home-state geo-fencing. Stock was matched with an out-of-state outlet operator in Kanpur.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Recovered Capital:</span>
              <strong className="text-base text-[#e65c00]">₹4,14,750 (9 Days)</strong>
            </div>
          </div>

          {/* Dev's Persona Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-bl-xl text-xs font-mono font-bold">
              The Buyer Persona
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold font-quicksand text-lg">
                  DP
                </div>
                <div>
                  <h3 className="font-quicksand font-bold text-lg text-slate-900">Devendra, Wholesale Stockist</h3>
                  <p className="text-xs text-slate-500 font-mono">Bharat Bazaar Wholesale LLP • Surat, Gujarat</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-quicksand leading-relaxed">
                <p>
                  <strong>The Challenge:</strong> Devendra had lost ₹2.2 Lakhs to an advance-wire scam on WhatsApp where a seller shipped scrap plastic instead of electronic accessories. He needed below-wholesale inventory but refused to send advance payments.
                </p>
                <p>
                  <strong>StockBridge Resolution:</strong> Deposited funds into neutral StockBridge Escrow. Received 48 hours to physically inspect carton seals in Surat before funds were released.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Buyer Safety:</span>
              <strong className="text-base text-emerald-600">100% Escrow Protected + GST ITC</strong>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. HOW ONBOARDING WORKS (AMAZON / ZOMATO 3-STEP FLOW)     */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a1a]">
              FRICTIONLESS ONBOARDING IN 3 SIMPLE STEPS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-white mt-2">
              How Enterprise Liquidation Works
            </h2>
            <p className="mt-2 text-slate-400 font-quicksand text-sm sm:text-base">
              Built for supply chain managers, warehouse directors, and CFOs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#ff7a1a] font-black font-mono text-base">
                01
              </span>
              <h3 className="text-lg font-bold font-quicksand text-white">
                GSTIN &amp; Business KYC
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-quicksand leading-relaxed">
                Register with your business email, phone, and company GST number. Instant automated verification clears your account in under 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#ff7a1a] font-black font-mono text-base">
                02
              </span>
              <h3 className="text-lg font-bold font-quicksand text-white">
                Upload Manifest &amp; Set Reserve
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-quicksand leading-relaxed">
                Upload packing slips, select condition grade (A to E), choose brand masking or territory blocks, and set your private minimum reserve price.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#ff7a1a] font-black font-mono text-base">
                03
              </span>
              <h3 className="text-lg font-bold font-quicksand text-white">
                Escrow Pre-Funded &amp; Wire Settlement
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-quicksand leading-relaxed">
                Buyer deposits 100% funds into escrow before you dispatch. Upon physical inspection verification, cash is wired directly to your bank account.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              href="/seller/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#ff7a1a] hover:bg-[#e65c00] px-8 py-4 text-base font-bold text-white shadow-lg transition font-quicksand"
            >
              Start Partner Onboarding Now →
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. TRANSPARENT ECONOMICS & FEE SCHEDULE (PPT SLIDE 5)    */}
      {/* ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
            TRANSPARENT VALUE-BASED PRICING
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-quicksand text-slate-900 mt-2">
            Zero Upfront Cost. We Only Earn When You Get Paid.
          </h2>
          <p className="mt-2 text-slate-600 font-quicksand text-sm sm:text-base">
            No listing charges, no hidden subscription lock-ins, and zero auction fees if your lot remains unsold.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-quicksand">
              <thead className="bg-slate-900 text-white font-mono text-xs uppercase">
                <tr>
                  <th className="py-4 px-6">Service Attribute</th>
                  <th className="py-4 px-6 text-[#ff7a1a]">StockBridge Enterprise</th>
                  <th className="py-4 px-6 text-slate-400">Local Scrap Liquidators</th>
                  <th className="py-4 px-6 text-slate-400">Public Classifieds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-900">Capital Recovery %</td>
                  <td className="py-4 px-6 font-mono font-bold text-[#e65c00]">30% – 70% of MRP</td>
                  <td className="py-4 px-6 font-mono text-slate-500">10% – 15% (Rock Bottom)</td>
                  <td className="py-4 px-6 font-mono text-slate-500">Unpredictable</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-900">Listing / Setup Fees</td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-600">₹0 (Free Forever)</td>
                  <td className="py-4 px-6 font-mono text-slate-500">₹0 (Margin built-in)</td>
                  <td className="py-4 px-6 font-mono text-slate-500">₹1,500 – ₹5,000 / mo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-900">Success Commission</td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">Flat 7% of Settlement</td>
                  <td className="py-4 px-6 font-mono text-slate-500">Up to 40% hidden spread</td>
                  <td className="py-4 px-6 font-mono text-slate-500">Varies / Lead gen fees</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-900">Payment Security</td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-600">100% Pre-Funded Escrow</td>
                  <td className="py-4 px-6 font-mono text-slate-500">Unsecured Post-Dated Cheques</td>
                  <td className="py-4 px-6 font-mono text-rose-600">High Default Risk</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-slate-900">Brand Safety &amp; Geo-Block</td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-600">Included by Default</td>
                  <td className="py-4 px-6 font-mono text-rose-600">Zero (Dumped locally)</td>
                  <td className="py-4 px-6 font-mono text-rose-600">Zero (Indexed on Google)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PARTNER FAQS                                         */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-quicksand text-slate-900">
              Frequently Asked Partner Questions
            </h2>
            <p className="mt-1 text-slate-500 font-quicksand text-sm">
              Clear answers for supply chain leaders and finance directors.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900 font-quicksand text-base">
                How does StockBridge prevent my regular retail customers from seeing the discounted lot?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
                By combining <strong>Hidden Brand Identity</strong> (replacing company names with generic OEM categories) and <strong>Territory Geo-Fencing</strong> (blocking entire states or cities where your active distribution operates). Only vetted wholesale buyers from authorized channels outside your core zone can access the lot.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900 font-quicksand text-base">
                When and how do I receive payment for my inventory?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
                Before you dispatch, the buyer deposits 100% of the purchase amount into neutral StockBridge Escrow. Once the goods are delivered and the 48-hour inspection period passes without dispute, the escrow funds are transferred directly to your registered bank account via RTGS/NEFT.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900 font-quicksand text-base">
                Who arranges logistics, freight, and transport?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
                Sellers can either use their own preferred logistics provider on Ex-Works / FOB basis, or utilize StockBridge integrated transport partners who handle pallet pickup directly from your factory docks with GPS tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900 font-quicksand text-base">
                What categories of surplus inventory can be liquidated?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-quicksand leading-relaxed">
                We accept factory overruns, canceled export shipments, seasonal end-of-line stock, carton-damaged items, slow-moving SKUs, and excess components across Footwear, Apparel, Consumer Electronics, Industrial Hardware, and FMCG packaging.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. HIGH IMPACT BOTTOM CTA BANNER                        */}
      {/* ======================================================== */}
      <section className="w-full bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ff7a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-[#ff7a1a] mb-4">
            🚀 JOIN 80+ VERIFIED FACTORY SELLERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-quicksand text-white">
            Ready to Clear Warehouse Racks and Free Up Liquid Capital?
          </h2>
          <p className="text-slate-300 mt-3 max-w-xl mx-auto font-quicksand text-sm sm:text-base leading-relaxed">
            Onboard in under 2 minutes. Get binding, escrow-backed offers on your surplus inventory from verified wholesale buyers across India.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/seller/register"
              className="w-full sm:w-auto rounded-xl bg-[#ff7a1a] hover:bg-[#e65c00] px-8 py-4 text-base font-bold text-white shadow-xl transition font-quicksand"
            >
              Register as Business Partner
            </Link>
            <a
              href="#live-demand"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-bold text-slate-200 transition hover:bg-slate-800 font-quicksand"
            >
              Browse Active Demands
            </a>
          </div>

          <div className="mt-8 text-xs font-mono text-slate-500">
            StockBridge B2B Marketplace • Incubated at JG University, School of Engineering, Ahmedabad
          </div>
        </div>
      </section>

    </div>
  );
}
