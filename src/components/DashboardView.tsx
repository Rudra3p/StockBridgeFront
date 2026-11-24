'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse, Role } from '@/lib/types';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DashboardViewProps {
  expectedRole: Role;
  portalTitle: string;
}

interface SurplusLot {
  id: string;
  code: string;
  title: string;
  category: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  units: number;
  moq: number;
  originalPrice: number;
  discountedPrice: number;
  location: string;
  status: 'ACTIVE' | 'PENDING_QA' | 'IN_NEGOTIATION' | 'SOLD';
  brandMasked: boolean;
  image: string;
}

interface OfferItem {
  id: string;
  lotId: string;
  lotTitle: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  buyerName: string;
  sellerName: string;
  quantityRequested: number;
  offeredPricePerUnit: number;
  listedPricePerUnit: number;
  status: 'PENDING_REVIEW' | 'COUNTER_OFFERED' | 'ACCEPTED' | 'REJECTED';
  counterPrice?: number;
  timestamp: string;
}

interface EscrowOrder {
  id: string;
  orderNumber: string;
  lotTitle: string;
  totalAmount: number;
  units: number;
  sellerName: string;
  buyerName: string;
  escrowStatus: 'FUNDS_HELD' | 'DISPATCHED' | 'IN_48H_INSPECTION' | 'SETTLED';
  carrier: string;
  trackingNumber: string;
  inspectionHoursRemaining: number;
}

const INITIAL_LOTS: SurplusLot[] = [
  {
    id: 'lot-01',
    code: 'LOT-APP-8841',
    title: "Men's Combed Cotton Polo T-Shirts (Assorted Solid Colors)",
    category: 'APPAREL',
    grade: 'A',
    units: 1200,
    moq: 120,
    originalPrice: 850,
    discountedPrice: 320,
    location: 'Tirupur, Tamil Nadu',
    status: 'ACTIVE',
    brandMasked: true,
    image: '/images/grades/grade-a.jpg',
  },
  {
    id: 'lot-02',
    code: 'LOT-FTW-9104',
    title: "Athletic Running Shoes (Assorted Sizes UK 6-10)",
    category: 'FOOTWEAR',
    grade: 'B',
    units: 576,
    moq: 48,
    originalPrice: 2200,
    discountedPrice: 790,
    location: 'Agra, Uttar Pradesh',
    status: 'IN_NEGOTIATION',
    brandMasked: false,
    image: '/images/grades/grade-b.jpg',
  },
  {
    id: 'lot-03',
    code: 'LOT-HDW-4120',
    title: 'Industrial Heavy Duty Brass Ball Valves (1/2" & 3/4" BSP)',
    category: 'HARDWARE',
    grade: 'A',
    units: 2500,
    moq: 250,
    originalPrice: 420,
    discountedPrice: 195,
    location: 'Jamnagar, Gujarat',
    status: 'ACTIVE',
    brandMasked: false,
    image: '/images/grades/grade-a.jpg',
  },
  {
    id: 'lot-04',
    code: 'LOT-ELC-7719',
    title: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    category: 'ELECTRONICS',
    grade: 'C',
    units: 800,
    moq: 80,
    originalPrice: 650,
    discountedPrice: 240,
    location: 'Noida, Uttar Pradesh',
    status: 'ACTIVE',
    brandMasked: true,
    image: '/images/grades/grade-c.jpg',
  },
  {
    id: 'lot-05',
    code: 'LOT-ELC-3301',
    title: 'Unboxed Showroom Demo Audio Soundbars & Subwoofers',
    category: 'ELECTRONICS',
    grade: 'D',
    units: 140,
    moq: 10,
    originalPrice: 7500,
    discountedPrice: 2100,
    location: 'Bengaluru, Karnataka',
    status: 'PENDING_QA',
    brandMasked: false,
    image: '/images/grades/grade-d.jpg',
  },
];

const INITIAL_OFFERS: OfferItem[] = [
  {
    id: 'off-101',
    lotId: 'lot-02',
    lotTitle: 'Athletic Running Shoes (Assorted Sizes UK 6-10)',
    grade: 'B',
    buyerName: 'Metro Wholesale Liquidation LLP',
    sellerName: 'Apex Footwear Mills',
    quantityRequested: 240,
    offeredPricePerUnit: 710,
    listedPricePerUnit: 790,
    status: 'PENDING_REVIEW',
    timestamp: '2 hours ago',
  },
  {
    id: 'off-102',
    lotId: 'lot-01',
    lotTitle: "Men's Combed Cotton Polo T-Shirts",
    grade: 'A',
    buyerName: 'Bharat Bazaar Retailers',
    sellerName: 'Tirupur Knitwear Exporters',
    quantityRequested: 600,
    offeredPricePerUnit: 290,
    listedPricePerUnit: 320,
    status: 'COUNTER_OFFERED',
    counterPrice: 305,
    timestamp: 'Yesterday',
  },
  {
    id: 'off-103',
    lotId: 'lot-04',
    lotTitle: 'Smart LED Slim Ceiling Lights 18W',
    grade: 'C',
    buyerName: 'Deccan Electrical Traders',
    sellerName: 'Lumina Systems Pvt Ltd',
    quantityRequested: 400,
    offeredPricePerUnit: 230,
    listedPricePerUnit: 240,
    status: 'ACCEPTED',
    timestamp: '2 days ago',
  },
];

const INITIAL_ESCROW_ORDERS: EscrowOrder[] = [
  {
    id: 'esc-01',
    orderNumber: 'ESC-2026-904',
    lotTitle: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    totalAmount: 92000,
    units: 400,
    sellerName: 'Lumina Systems Pvt Ltd',
    buyerName: 'Deccan Electrical Traders',
    escrowStatus: 'IN_48H_INSPECTION',
    carrier: 'BlueDart Freight Logistics',
    trackingNumber: 'BD-8849-2091',
    inspectionHoursRemaining: 31,
  },
  {
    id: 'esc-02',
    orderNumber: 'ESC-2026-881',
    lotTitle: 'Industrial Heavy Duty Brass Ball Valves (1/2" & 3/4")',
    totalAmount: 97500,
    units: 500,
    sellerName: 'Gujarat Precision Castings',
    buyerName: 'National Hardware Supply Co.',
    escrowStatus: 'DISPATCHED',
    carrier: 'TCI Express Ground',
    trackingNumber: 'TCI-6601-9923',
    inspectionHoursRemaining: 48,
  },
];

export default function DashboardView({
  expectedRole,
  portalTitle,
}: DashboardViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'offers' | 'escrow' | 'profile'>('overview');

  // Interactive dashboard state
  const [lots, setLots] = useState<SurplusLot[]>(INITIAL_LOTS);
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [escrowOrders, setEscrowOrders] = useState<EscrowOrder[]>(INITIAL_ESCROW_ORDERS);

  // Create lot modal state
  const [createLotOpen, setCreateLotOpen] = useState(false);
  const [newLotTitle, setNewLotTitle] = useState('');
  const [newLotCategory, setNewLotCategory] = useState('APPAREL');
  const [newLotGrade, setNewLotGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [newLotUnits, setNewLotUnits] = useState('500');
  const [newLotMoq, setNewLotMoq] = useState('50');
  const [newLotOrigPrice, setNewLotOrigPrice] = useState('1200');
  const [newLotDiscPrice, setNewLotDiscPrice] = useState('450');
  const [newLotMaskBrand, setNewLotMaskBrand] = useState(true);
  const [newLotLocation, setNewLotLocation] = useState('Surat, Gujarat');

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const result = await clientAuth.getMe();
      if (isMounted) {
        if (result.authenticated && result.user) {
          setProfile(result.user);
        } else {
          router.push('/login');
        }
        setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await clientAuth.logout();
    router.push('/login');
    router.refresh();
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotTitle.trim()) return;

    const newLot: SurplusLot = {
      id: `lot-${Date.now()}`,
      code: `LOT-${newLotCategory.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newLotTitle.trim(),
      category: newLotCategory,
      grade: newLotGrade,
      units: parseInt(newLotUnits) || 100,
      moq: parseInt(newLotMoq) || 10,
      originalPrice: parseFloat(newLotOrigPrice) || 500,
      discountedPrice: parseFloat(newLotDiscPrice) || 200,
      location: newLotLocation || 'India',
      status: 'ACTIVE',
      brandMasked: newLotMaskBrand,
      image: `/images/grades/grade-${newLotGrade.toLowerCase()}.jpg`,
    };

    setLots([newLot, ...lots]);
    setCreateLotOpen(false);
    setNewLotTitle('');
    showToast(`Lot "${newLot.title.slice(0, 30)}..." published successfully!`);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'ACCEPTED' } : o))
    );
    showToast('Offer accepted! Escrow payment instructions dispatched to buyer.');
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'REJECTED' } : o))
    );
    showToast('Offer declined.');
  };

  const handleReleaseEscrow = (orderId: string) => {
    setEscrowOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, escrowStatus: 'SETTLED' } : o))
    );
    showToast('Inspection accepted! Escrow funds released to seller.');
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e65c00] border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium font-quicksand">Loading dashboard session...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const role = profile.role;
  const isPending = profile.organisation?.verificationStatus === 'PENDING';
  const isApproved = profile.organisation?.verificationStatus === 'APPROVED';

  // Calculate totals
  const totalInventoryValue = lots.reduce((acc, l) => acc + l.discountedPrice * l.units, 0);
  const activeLotCount = lots.filter((l) => l.status === 'ACTIVE').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'PENDING_REVIEW').length;
  const totalEscrowAmount = escrowOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      
      {/* ── Toast Notification ─────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white shadow-xl border border-slate-800 transition-all">
          <span className="h-2 w-2 rounded-full bg-[#e65c00]" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Modern Left Sidebar Navigation (Swiggy / Zepto / Amazon Seller Central standard) ── */}
      <DashboardSidebar
        role={role}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        badges={{
          offers: pendingOffersCount,
          escrow: escrowOrders.length,
          qa: lots.filter((l) => l.status === 'PENDING_QA').length,
        }}
        currentUser={{
          fullName: profile.fullName,
          email: profile.email,
          organisation: {
            legalName: profile.organisation?.legalName,
            gstNumber: profile.organisation?.gstNumber,
          },
        }}
        onLogout={handleLogout}
        actionButton={
          role === 'SELLER'
            ? {
                label: 'Create Surplus Lot',
                onClick: () => setCreateLotOpen(true),
              }
            : undefined
        }
      />

      {/* ── Operations Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sleek Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#e65c00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {portalTitle}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isApproved ? '✓ GST Verified' : '⏳ Verification In Progress'}
                </span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  GSTIN: {profile.organisation?.gstNumber || '27AABCS1429B1Z8'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold font-quicksand text-slate-900 mt-0.5">
                {profile.organisation?.legalName || profile.fullName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'SELLER' && (
              <button
                type="button"
                onClick={() => setCreateLotOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#e65c00] text-white text-xs font-bold font-quicksand px-3.5 py-2 rounded-lg hover:bg-[#c44e00] transition shadow-xs"
              >
                <span>+ Create Lot</span>
              </button>
            )}

            {role === 'BUYER' && (
              <Link
                href="/#marketplace"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold font-quicksand px-3.5 py-2 rounded-lg hover:bg-slate-800 transition shadow-xs"
              >
                <span>Marketplace</span>
                <span>→</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 font-quicksand"
            >
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </header>

        {/* ── Main Dashboard Workspace ───────────────────────────── */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Verification Status Callout (if pending) */}
        {isPending && (
          <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-5 shadow-sm text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200 text-amber-900 font-bold shrink-0">
                ⏳
              </span>
              <div>
                <h2 className="text-sm font-bold font-quicksand text-amber-950">
                  Business Verification In Progress
                </h2>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Our compliance team is verifying your GSTIN (<strong>{profile.organisation?.gstNumber}</strong>) and address documents. You can configure surplus listings and test private offer negotiations now. Live escrow checkout activates upon approval.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs font-mono font-semibold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200">
              <span>SLA: &lt; 24h</span>
            </div>
          </div>
        )}

        {/* ── TAB 1: OVERVIEW & TELEMETRY ───────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 KPI Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1 */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  <span>{role === 'SELLER' ? 'Active Surplus Lots' : 'Active Sourcing Bids'}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                  {role === 'SELLER' ? activeLotCount : offers.length}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-quicksand">
                  {role === 'SELLER'
                    ? `${lots.length} total catalogued lots`
                    : '2 offers currently accepted'}
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  <span>{role === 'SELLER' ? 'Inventory Face Value' : 'Potential Savings'}</span>
                  <span className="text-[#e65c00] font-bold">₹</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                  ₹{(totalInventoryValue / 100000).toFixed(1)} Lakhs
                </div>
                <p className="text-xs text-slate-500 mt-2 font-quicksand">
                  Avg 58% recovery against original MRP
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  <span>Pending Negotiations</span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#e65c00] font-bold text-[10px]">
                    Action Req.
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                  {pendingOffersCount}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-quicksand">
                  Inbound private bids within 48h SLA
                </p>
              </div>

              {/* Card 4 */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  <span>Protected Escrow</span>
                  <span className="text-emerald-600 font-bold">✓ SECURED</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                  ₹{(totalEscrowAmount / 100000).toFixed(2)} Lakhs
                </div>
                <p className="text-xs text-slate-500 mt-2 font-quicksand">
                  Held in licensed escrow partner account
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Surplus Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Recent Lots & Quick Action */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <h2 className="type-little text-slate-950 font-quicksand font-bold">
                        {role === 'SELLER' ? 'Recent Surplus Lots' : 'Recommended Surplus Inventory'}
                      </h2>
                      <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                        Graded against the 5-Tier Inspection Yardstick
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('listings')}
                      className="text-xs font-mono font-bold text-[#e65c00] hover:text-[#c44e00]"
                    >
                      View All ({lots.length}) →
                    </button>
                  </div>

                  {/* Lots list preview */}
                  <div className="space-y-4">
                    {lots.slice(0, 3).map((lot) => (
                      <div
                        key={lot.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={lot.image}
                            alt={lot.title}
                            className="h-14 w-14 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-400">
                                {lot.code}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black font-quicksand bg-slate-950 text-white">
                                Grade {lot.grade}
                              </span>
                              {lot.brandMasked && (
                                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  Brand Masked
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 font-quicksand mt-1 line-clamp-1">
                              {lot.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-quicksand">
                              {lot.units} units • MOQ: {lot.moq} • {lot.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                          <div className="text-sm font-black font-quicksand text-slate-950">
                            ₹{lot.discountedPrice}
                            <span className="text-xs text-slate-400 font-normal line-through ml-1.5">
                              ₹{lot.originalPrice}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#e65c00] font-bold">
                            {Math.round(((lot.originalPrice - lot.discountedPrice) / lot.originalPrice) * 100)}% Below MRP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured 4-Step Settlement Process Overview */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono mb-4">
                    StockBridge Trade Safety Architecture
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-mono font-bold text-slate-400 block mb-1">01. LOT AUDIT</span>
                      <p className="text-slate-700 font-quicksand">Ops team validates carton counts and photo yardstick compliance.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-mono font-bold text-slate-400 block mb-1">02. PRIVATE BID</span>
                      <p className="text-slate-700 font-quicksand">Make-offer negotiations keep discount tiers strictly confidential.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-mono font-bold text-emerald-600 block mb-1">03. ESCROW HOLD</span>
                      <p className="text-slate-700 font-quicksand">Buyer deposits funds in licensed escrow before seller dispatches.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-mono font-bold text-emerald-600 block mb-1">04. 48H SETTLEMENT</span>
                      <p className="text-slate-700 font-quicksand">Buyer conducts physical check; funds automatically release.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Escrow Orders & Compliance Card */}
              <div className="space-y-6">
                
                {/* Active Escrow Orders */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h2 className="type-little text-slate-950 font-quicksand font-bold">
                      Live Escrow Tracking
                    </h2>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-4">
                    {escrowOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {order.escrowStatus === 'IN_48H_INSPECTION' ? '48H INSPECTION' : order.escrowStatus}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 font-quicksand line-clamp-1">
                            {order.lotTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Amount: ₹{order.totalAmount.toLocaleString('en-IN')} • {order.units} units
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-quicksand">
                            Freight: {order.carrier}
                          </span>
                          <span className="font-mono font-bold text-emerald-700">
                            {order.inspectionHoursRemaining}h remaining
                          </span>
                        </div>

                        {order.escrowStatus === 'IN_48H_INSPECTION' && (
                          <button
                            type="button"
                            onClick={() => handleReleaseEscrow(order.id)}
                            className="w-full text-center text-xs font-bold font-quicksand py-2 px-3 rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition shadow-sm"
                          >
                            Release Escrow Funds →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Protection Status Card */}
                <div className="rounded-xl border border-slate-900 bg-slate-950 text-white p-6 shadow-sm">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#e65c00] font-bold block mb-1">
                    Guardrail Architecture
                  </span>
                  <h3 className="text-base font-bold font-quicksand text-white">
                    Confidential Liquidation Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-quicksand leading-relaxed">
                    Prevent wholesale discount leaks to your authorized retail partners. Your listings are protected by geo-fencing and anonymous brand masking.
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-quicksand">Geo-blocking status:</span>
                    <span className="font-mono font-bold text-emerald-400">ACTIVE ON HOME PIN</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: SURPLUS LOTS (CATALOG / SELLER INVENTORY) ──── */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="type-little text-slate-950 font-quicksand font-bold">
                  {role === 'SELLER' ? 'Manage Surplus Inventory Lots' : 'Available Wholesale Lots'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-quicksand">
                  All listings require complete photo inspection packs and condition grading.
                </p>
              </div>

              {role === 'SELLER' && (
                <button
                  type="button"
                  onClick={() => setCreateLotOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#e65c00] text-white text-xs sm:text-sm font-bold font-quicksand px-4 py-2.5 rounded-lg hover:bg-[#c44e00] transition shadow-sm self-start sm:self-auto"
                >
                  <span>+ New Surplus Lot</span>
                </button>
              )}
            </div>

            {/* Lots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Lot Image with Badges */}
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={lot.image}
                        alt={lot.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
                        {lot.code}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-black font-quicksand bg-[#e65c00] text-white shadow">
                          Grade {lot.grade}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-[10px] font-mono uppercase text-slate-300 block">
                          Location
                        </span>
                        <span className="text-xs font-semibold">{lot.location}</span>
                      </div>
                    </div>

                    {/* Lot Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                          {lot.category}
                        </span>
                        {lot.brandMasked && (
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Masked Brand
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-auto ${
                            lot.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {lot.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 font-quicksand line-clamp-2">
                        {lot.title}
                      </h3>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Available</span>
                          <span className="font-semibold text-slate-800">{lot.units} units</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Minimum Order</span>
                          <span className="font-semibold text-slate-800">{lot.moq} units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lot Price and CTA Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <div>
                      <div className="text-lg font-black font-quicksand text-slate-950">
                        ₹{lot.discountedPrice}
                        <span className="text-xs text-slate-400 line-through font-normal ml-1.5">
                          ₹{lot.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#e65c00]">
                        {Math.round(((lot.originalPrice - lot.discountedPrice) / lot.originalPrice) * 100)}% Discount
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Viewing lot details for ${lot.code}`)}
                      className="text-xs font-bold font-quicksand text-slate-950 hover:text-[#e65c00] transition"
                    >
                      Inspect Lot →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: OFFERS & NEGOTIATIONS ──────────────────────── */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="type-little text-slate-950 font-quicksand font-bold">
                {role === 'SELLER' ? 'Inbound Buyer Offers & Negotiations' : 'My Bids & Proposals'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                B2B surplus deals are negotiated confidentially. Offers below reserve price are filtered out.
              </p>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-white font-bold">
                        Grade {offer.grade}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : offer.status === 'COUNTER_OFFERED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : offer.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {offer.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        • {offer.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-quicksand text-slate-900">
                      {offer.lotTitle}
                    </h3>

                    <p className="text-xs text-slate-500 font-quicksand">
                      Counterparty: <strong className="text-slate-800">{role === 'SELLER' ? offer.buyerName : offer.sellerName}</strong>
                    </p>
                  </div>

                  {/* Price & Quantity Breakdown */}
                  <div className="flex items-center gap-8 text-xs font-quicksand border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0 md:px-8">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Quantity</span>
                      <span className="font-bold text-slate-900 text-sm">{offer.quantityRequested} units</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Listed Rate</span>
                      <span className="font-semibold text-slate-600 line-through">₹{offer.listedPricePerUnit}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Proposed Rate</span>
                      <span className="font-black text-slate-950 text-sm text-[#e65c00]">
                        ₹{offer.offeredPricePerUnit}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Total Value</span>
                      <span className="font-black text-slate-950 text-sm">
                        ₹{(offer.quantityRequested * offer.offeredPricePerUnit).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                    {offer.status === 'PENDING_REVIEW' && role === 'SELLER' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold font-quicksand text-xs hover:bg-emerald-700 transition shadow-sm"
                        >
                          Accept Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectOffer(offer.id)}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold font-quicksand text-xs hover:bg-slate-50 transition"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {offer.status === 'ACCEPTED' && (
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                        Proceeding to Escrow
                      </span>
                    )}

                    {offer.status === 'COUNTER_OFFERED' && (
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-blue-600 block">Counter: ₹{offer.counterPrice}/unit</span>
                        <span className="text-xs font-bold text-slate-700">Awaiting Response</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: ESCROW & DELIVERIES ────────────────────────── */}
        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="type-little text-slate-950 font-quicksand font-bold">
                Escrow & Settlement Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                Every trade is backed by partner escrow accounts. Funds are only released when the 48-hour inspection yardstick clears.
              </p>
            </div>

            <div className="space-y-6">
              {escrowOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">• Licensed Escrow Account</span>
                      </div>
                      <h3 className="text-lg font-bold font-quicksand text-slate-950">
                        {order.lotTitle}
                      </h3>
                      <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                        Seller: <strong>{order.sellerName}</strong> • Buyer: <strong>{order.buyerName}</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Escrow Hold Balance</span>
                      <span className="text-2xl font-black font-quicksand text-emerald-700">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 4-Phase Escrow Visual Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/70">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 block">PHASE 1</span>
                      <h4 className="text-xs font-bold font-quicksand text-emerald-950 mt-0.5">Payment Pre-Funded</h4>
                      <p className="text-[11px] text-emerald-700 mt-1">100% funds locked in escrow.</p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${order.escrowStatus === 'DISPATCHED' || order.escrowStatus === 'IN_48H_INSPECTION' || order.escrowStatus === 'SETTLED' ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className="text-[10px] font-mono font-bold text-slate-500 block">PHASE 2</span>
                      <h4 className="text-xs font-bold font-quicksand text-slate-950 mt-0.5">Dispatched & Verified</h4>
                      <p className="text-[11px] text-slate-600 mt-1">{order.carrier} ({order.trackingNumber})</p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${order.escrowStatus === 'IN_48H_INSPECTION' ? 'border-[#e65c00] bg-orange-50' : order.escrowStatus === 'SETTLED' ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className="text-[10px] font-mono font-bold text-[#e65c00] block">PHASE 3</span>
                      <h4 className="text-xs font-bold font-quicksand text-slate-950 mt-0.5">48h Physical Check</h4>
                      <p className="text-[11px] text-slate-600 mt-1">{order.inspectionHoursRemaining}h remaining on clock</p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${order.escrowStatus === 'SETTLED' ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className="text-[10px] font-mono font-bold text-slate-500 block">PHASE 4</span>
                      <h4 className="text-xs font-bold font-quicksand text-slate-950 mt-0.5">Settlement Release</h4>
                      <p className="text-[11px] text-slate-600 mt-1">{order.escrowStatus === 'SETTLED' ? 'Funds transferred to seller' : 'Auto-release upon check'}</p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500 font-quicksand">
                      Tracking code: <span className="font-mono font-bold text-slate-900">{order.trackingNumber}</span> via {order.carrier}
                    </span>

                    {order.escrowStatus === 'IN_48H_INSPECTION' ? (
                      <button
                        type="button"
                        onClick={() => handleReleaseEscrow(order.id)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold font-quicksand text-xs hover:bg-emerald-700 transition shadow-sm"
                      >
                        ✓ Accept Yardstick Inspection & Release Payment
                      </button>
                    ) : (
                      <span className="font-mono text-emerald-700 font-bold">
                        ✓ Escrow Settled & Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: ENTITY & KYC DETAILS ───────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="type-little text-slate-950 font-quicksand font-bold">
                Company & GST Verification Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                Official entity information registered with the StockBridge compliance team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Org Details Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
                  Registered Legal Entity
                </h3>
                <dl className="space-y-3 text-sm font-quicksand">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Legal Company Name:</dt>
                    <dd className="font-bold text-slate-900">{profile.organisation?.legalName || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Entity Category:</dt>
                    <dd className="font-semibold text-slate-800">{profile.organisation?.orgType || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">GSTIN / Tax ID:</dt>
                    <dd className="font-mono font-bold text-slate-900">{profile.organisation?.gstNumber || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Registered Office:</dt>
                    <dd className="text-right text-slate-800 font-medium">
                      {profile.organisation?.addressLine || 'Industrial Area'},<br />
                      {profile.organisation?.city}, {profile.organisation?.state} - {profile.organisation?.pinCode}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-1">
                    <dt className="text-slate-500">Verification Status:</dt>
                    <dd className="font-mono font-bold text-emerald-700">
                      {profile.organisation?.verificationStatus || 'VERIFIED'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Account Signatory & Protection Settings */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
                    Authorized Signatory
                  </h3>
                  <dl className="space-y-3 text-sm font-quicksand">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Full Name:</dt>
                      <dd className="font-bold text-slate-900">{profile.fullName}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Email Address:</dt>
                      <dd className="font-mono text-slate-800">{profile.email}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Phone Contact:</dt>
                      <dd className="font-mono text-slate-800">{profile.phone || '+91 98765 43210'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Trading Role:</dt>
                      <dd className="font-bold text-[#e65c00]">{profile.role}</dd>
                    </div>
                  </dl>
                </div>

                {/* Brand Geo-fencing Guardrails */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Brand Protection Guardrails
                  </h4>
                  <div className="space-y-2 text-xs font-quicksand">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">Anonymous Brand Name Masking</span>
                      <span className="font-mono font-bold text-emerald-600">ENABLED</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">Local Pin-code Geo-Blocker</span>
                      <span className="font-mono font-bold text-emerald-600">ENABLED</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ── CREATE SURPLUS LOT MODAL / SLIDE-OVER ─────────────── */}
      {createLotOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#e65c00] font-bold block">
                  Inventory Liquidation
                </span>
                <h3 className="text-lg font-bold font-quicksand text-slate-950">
                  Publish New Surplus Lot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateLotOpen(false)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Lot Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Cotton Polo T-Shirts (Assorted Sizes)"
                  value={newLotTitle}
                  onChange={(e) => setNewLotTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Category
                  </label>
                  <select
                    value={newLotCategory}
                    onChange={(e) => setNewLotCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  >
                    <option value="APPAREL">Apparel & Textiles</option>
                    <option value="FOOTWEAR">Footwear</option>
                    <option value="ELECTRONICS">Electronics & Lighting</option>
                    <option value="HARDWARE">Industrial Hardware</option>
                    <option value="FMCG">FMCG & Packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Condition Standard Grade
                  </label>
                  <select
                    value={newLotGrade}
                    onChange={(e) => setNewLotGrade(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  >
                    <option value="A">Grade A — Pristine New Current</option>
                    <option value="B">Grade B — Previous Season / Outdated</option>
                    <option value="C">Grade C — Outer Box Damage</option>
                    <option value="D">Grade D — Open-Box / Cosmetic</option>
                    <option value="E">Grade E — Industrial Salvage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Total Units Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLotUnits}
                    onChange={(e) => setNewLotUnits(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Minimum Order Quantity (MOQ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLotMoq}
                    onChange={(e) => setNewLotMoq(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Original Price (₹ per unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLotOrigPrice}
                    onChange={(e) => setNewLotOrigPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Surplus Discount Price (₹ per unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLotDiscPrice}
                    onChange={(e) => setNewLotDiscPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Dispatch Location (City, State)
                </label>
                <input
                  type="text"
                  required
                  value={newLotLocation}
                  onChange={(e) => setNewLotLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLotMaskBrand}
                    onChange={(e) => setNewLotMaskBrand(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#e65c00] focus:ring-[#e65c00]"
                  />
                  <span className="text-xs font-bold text-slate-800 font-quicksand">
                    Enable Anonymous Brand Masking (Recommended)
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 font-quicksand mt-1 ml-6">
                  Brand name is completely concealed until a verified buyer proposal is accepted.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateLotOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 font-quicksand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#e65c00] text-white text-xs font-bold font-quicksand hover:bg-[#c44e00] transition shadow-sm"
                >
                  Publish Surplus Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
