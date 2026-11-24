'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  ArrowRight,
  Lock,
  MapPin,
  Building2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Truck,
  EyeOff,
  Boxes,
  Clock,
  Sparkles,
} from 'lucide-react';

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
  imageUrl: string;
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
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories', demand: '₹4.8 Cr+' },
  { id: 'footwear', label: 'Footwear & Shoes', demand: '₹1.45 Cr' },
  { id: 'apparel', label: 'Apparel & Textiles', demand: '₹1.18 Cr' },
  { id: 'electronics', label: 'Consumer Electronics', demand: '₹94 L' },
  { id: 'hardware', label: 'Industrial Hardware', demand: '₹82 L' },
  { id: 'fmcg', label: 'FMCG & Packaging', demand: '₹51 L' },
];

export default function PartnerPage() {
  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Recovery Calculator state
  const [calcInventoryValue, setCalcInventoryValue] = useState<number>(1000000);
  const [calcCategory, setCalcCategory] = useState<'footwear' | 'electronics' | 'apparel' | 'hardware'>('footwear');

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
    <div className="flex flex-col w-full max-w-full overflow-x-hidden bg-white text-slate-900 selection:bg-orange-100 selection:text-orange-950 font-quicksand">

      {/* ======================================================== */}
      {/* 1. HERO SECTION: MINIMALIST B2B EDITORIAL SPLIT          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#e65c00_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-[#ff7a1a]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>B2B ENTERPRISE SURPLUS LIQUIDATION</span>
              </div>

              <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12] text-white">
                Turn Aging Factory Surplus Into{' '}
                <span className="text-[#ff7a1a]">Liquid Capital</span>. Zero Channel Conflict.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl">
                A verified recovery-value network connecting manufacturers, mills, and master distributors directly with pre-funded bulk buyers. Recover <strong>30% to 70%</strong> of inventory value without cannibalizing your retail dealer network.
              </p>

              {/* Action Bar */}
              <div className="pt-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 shadow-2xl backdrop-blur-md space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    
                    {/* Category Select */}
                    <div className="shrink-0 sm:w-48">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-12 rounded-xl border border-slate-700 bg-slate-950 px-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search surplus inventory or industrial lot..."
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-950 text-xs sm:text-sm font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                      />
                    </div>

                    {/* Check Bids */}
                    <a
                      href="#live-demand"
                      className="h-12 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shrink-0"
                    >
                      <span>Check Bids</span>
                      <span className="text-xs bg-[#ff7a1a] text-white px-2 py-0.5 rounded font-mono font-bold">
                        {filteredRFQs.length}
                      </span>
                    </a>
                  </div>

                  {/* Primary Registration / Login Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <Link
                      href="/partner/register"
                      className="w-full sm:flex-1 h-12 rounded-xl bg-[#e65c00] hover:bg-[#cc5200] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition"
                    >
                      <span>Register as Business Partner</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/partner/login"
                      className="w-full sm:w-auto px-6 h-12 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Partner Sign In</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust Checkmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-300 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Brand Masking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Territory Geo-Fencing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Escrow Pre-Funded</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7% Success-Only Fee</span>
                </div>
              </div>

            </div>

            {/* Right Photography Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85"
                  alt="StockBridge Modern Distribution Warehouse"
                  className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover filter brightness-90 contrast-105 group-hover:scale-102 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white">
                    ₹4.8 Cr+ Verified Bids Active
                  </span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Active Dispatch Hubs
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Ahmedabad • Surat • Tirupur • Agra • Noida
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-[#ff7a1a] text-xs font-mono font-bold shrink-0">
                    80+ Mills Connected
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff7a1a] font-mono">3x Higher</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Recovery than scrap brokers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">7 to 14 Days</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Average liquidation cycle</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹0 Upfront</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Zero listing or monthly fee</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 4%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Dispute rate (5-grade standard)</div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE B2B BUYER DEMAND BOARD (WITH AUTHENTIC PHOTOS)   */}
      {/* ======================================================== */}
      <section id="live-demand" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#e65c00] text-xs font-mono font-bold mb-2">
              <Boxes className="w-3.5 h-3.5" />
              <span>LIVE INDUSTRIAL PROCUREMENT DEMANDS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Wholesale Buyers Seeking Surplus Inventory
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-xl">
              Real purchase orders ready for immediate dispatch. Escrow deposits are held before shipment release.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-900">{filteredRFQs.length}</strong> active demands
            </span>
            <Link
              href="/partner/register"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e65c00] hover:bg-[#cc5200] text-white text-xs font-bold shadow-sm transition"
            >
              Fulfill Surplus Stock →
            </Link>
          </div>
        </div>

        {/* RFQ Cards Grid with Real Product Photography */}
        {filteredRFQs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
            <p className="text-slate-600 text-base">No active buyer demand matching &ldquo;{searchQuery}&rdquo;.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Real Product Photo Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rfq.imageUrl}
                      alt={rfq.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      {rfq.categoryLabel}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm">
                      Grade {rfq.minGrade}+ Eligible
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {rfq.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Qty Needed:</span>
                        <strong className="text-slate-900 text-[11px]">{rfq.unitsNeeded}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Buyer Hub:</span>
                        <strong className="text-slate-800 text-[11px] truncate max-w-[120px]">{rfq.location}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Segment:</span>
                        <span className="text-slate-700 text-[10px] truncate max-w-[120px]">{rfq.buyerType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Escrow Value and Action */}
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Escrow Budget
                    </span>
                    <span className="text-base font-extrabold font-mono text-[#e65c00]">
                      ₹{rfq.escrowLockedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    href={`/partner/register?ref=${rfq.id}&cat=${rfq.category}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#e65c00] text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
              CAPITAL RECOVERY METRICS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Calculate What Your Idle Stock is Actually Worth
            </h2>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              Local brokers offer scrap prices (10%–15%). StockBridge connects you directly with bulk reselling stockists.
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
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition ${
                        calcCategory === cat
                          ? 'bg-[#e65c00] text-white shadow-md'
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
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-mono">Liquidation Window:</span>
                  <strong className="text-white text-sm font-mono">{selectedRecovery.speed}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-mono">Settlement Terms:</span>
                  <strong className="text-emerald-400 text-sm font-mono">100% Escrow Secured</strong>
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
                href="/partner/register"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#e65c00] hover:bg-[#cc5200] py-3.5 text-sm font-bold text-white shadow-lg transition"
              >
                Liquidate This Lot Now →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ANTI-CHANNEL CONFLICT SHIELD (WITH REAL INSPECTION PHOTO) */}
      {/* ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Photography */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80"
                alt="Factory Inspection Dock Barcode Masking"
                className="w-full h-[400px] object-cover group-hover:scale-103 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[#ff7a1a] font-mono font-bold text-[11px] uppercase">
                    Automated Brand Shield
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Physical grade verification and digital brand masking keep your brand identity and pricing 100% confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Explanations */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#e65c00] text-xs font-mono font-bold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>ZERO CHANNEL CONFLICT GUARANTEE</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Liquidate Excess Lots Without Damaging Dealer Relationships
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Dumping surplus on public consumer websites triggers distributor revolt and forces price-matching. StockBridge protects your brand with three institutional guardrails:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-100 text-[#e65c00] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Hidden Brand Identity</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Your lot is listed under generic OEM classification (e.g., &ldquo;Tier-1 Consumer Electronics OEM&rdquo;). Trademark, logo, and entity remain confidential until an escrow offer is binding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-100 text-[#e65c00] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Territory Geo-Fencing</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Blacklist specific states or postal regions where your primary distributors operate. Retailers in your core sales territories cannot see, search, or bid on your inventory.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-100 text-[#e65c00] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Vetted Channel Allow-Lists</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Bidding access is restricted to verified non-competing bulk buyers (export clearing houses, institutional buyers, corporate gifting). Strict ban on consumer e-commerce undercutters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HUMAN TOUCH: REAL PERSONAS & CASE STUDIES             */}
      {/* ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 border-y border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold mb-2">
            <span>REAL BUSINESS VOICES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Real Sellers. Trusted by Real Buyers.
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            How neutral escrow and standardized grading solved the traditional deadlock of B2B surplus liquidation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Asha's Persona Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                  alt="Asha - Brand Master Distributor"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shrink-0 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Asha, Brand Master Distributor</h3>
                  <p className="text-xs text-slate-500 font-mono">Consumer Lifestyle Goods • Ahmedabad, Gujarat</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  alt="Devendra - Wholesale Stockist"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-200 shrink-0 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Devendra, Wholesale Stockist</h3>
                  <p className="text-xs text-slate-500 font-mono">Bharat Bazaar Wholesale LLP • Surat, Gujarat</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
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
      {/* 6. THE 5-GRADE STANDARDIZED LOT SCALE                    */}
      {/* ======================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
            STANDARDIZED QUALITY YARDSTICKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            The 5-Grade Standardized Lot Scale
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Strict physical inspection standards eliminating condition ambiguity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 font-black font-mono text-base flex items-center justify-center">
                A
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                90%+ Value
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Grade A: Factory Fresh</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Brand new overruns in original sealed master cartons with barcodes intact. Zero cosmetic or mechanical flaws.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-black font-mono text-base flex items-center justify-center">
                B
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                70%–85% Value
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Grade B: Packaging Wear</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pristine brand-new product inside, but outer retail packaging has minor shelf wear, shipping scuffs, or opened seals.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 font-black font-mono text-base flex items-center justify-center">
                C
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                50%–65% Value
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Grade C: Minor Flaws</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully functional with minor cosmetic blemishes, slight color deviations, or re-boxed packaging. Full utility intact.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="h-8 w-8 rounded-lg bg-orange-100 text-orange-800 font-black font-mono text-base flex items-center justify-center">
                D
              </span>
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                30%–45% Value
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Grade D: Refurbished</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer returns or factory-reconditioned stock. Tested and restored to working order with documented repairs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-rose-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="h-8 w-8 rounded-lg bg-rose-100 text-rose-800 font-black font-mono text-base flex items-center justify-center">
                E
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Scrap / Parts
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Grade E: Salvage / Parts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              As-is raw salvage lot, non-working units, or spare component inventory for recycling and component harvesting.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/grade-guide"
            className="text-xs font-mono font-bold text-[#e65c00] hover:underline inline-flex items-center gap-1"
          >
            <span>Explore Complete 5-Grade Inspection Manual</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. TRANSPARENT PRICING & VALUE COMPARISON                */}
      {/* ======================================================== */}
      <section className="w-full py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e65c00]">
              TRANSPARENT VALUE-BASED PRICING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Zero Upfront Cost. We Only Earn When You Get Paid.
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm">
              No listing fees, no subscriptions, zero charges if your lot remains unsold.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white font-mono text-xs uppercase">
                  <tr>
                    <th className="py-3.5 px-5">Attribute</th>
                    <th className="py-3.5 px-5 text-[#ff7a1a]">StockBridge Enterprise</th>
                    <th className="py-3.5 px-5 text-slate-400">Local Scrap Liquidators</th>
                    <th className="py-3.5 px-5 text-slate-400">Public Classifieds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Capital Recovery</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-[#e65c00]">30% – 70% of MRP</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">10% – 15% (Rock Bottom)</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">Unpredictable</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Listing / Setup Fees</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-emerald-600">₹0 (Free Forever)</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">₹0 (Spread built-in)</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">₹1,500 – ₹5,000 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Success Fee</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">Flat 7% of Settlement</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">Up to 40% hidden spread</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">Lead generation charges</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Payment Security</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-emerald-600">100% Pre-Funded Escrow</td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">Unsecured Post-Dated Cheques</td>
                    <td className="py-3.5 px-5 font-mono text-rose-600">High Default Risk</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Brand Safety &amp; Geo-Block</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-emerald-600">Default Included</td>
                    <td className="py-3.5 px-5 font-mono text-rose-600">Zero (Dumped locally)</td>
                    <td className="py-3.5 px-5 font-mono text-rose-600">Zero (Indexed on Google)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. HIGH IMPACT BOTTOM CTA BANNER                         */}
      {/* ======================================================== */}
      <section className="w-full bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e65c00_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-[#ff7a1a]">
            <span>CONNECT WITH VERIFIED BULK BUYERS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Clear Warehouse Racks and Free Up Liquid Capital?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Onboard your factory or distribution hub in under 2 minutes. Receive binding, escrow-secured offers from verified wholesale buyers across India.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/partner/register"
              className="w-full sm:w-auto rounded-xl bg-[#e65c00] hover:bg-[#cc5200] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition"
            >
              Register as Business Partner
            </Link>
            <a
              href="#live-demand"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
            >
              Browse Active Demands
            </a>
          </div>

          <div className="pt-6 text-xs font-mono text-slate-500">
            StockBridge B2B Marketplace • Incubated at JG University, School of Engineering, Ahmedabad
          </div>
        </div>
      </section>

    </div>
  );
}
