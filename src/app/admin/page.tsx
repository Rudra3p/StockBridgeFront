'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse, VerificationStatus, OrgType } from '@/lib/types';

interface OrganisationItem {
  id: string;
  legalName: string;
  orgType: OrgType;
  gstNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  verificationStatus: VerificationStatus;
  registeredAt: string;
}

interface LotQAItem {
  id: string;
  code: string;
  title: string;
  sellerName: string;
  category: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  units: number;
  askingPrice: number;
  originalPrice: number;
  brandMasked: boolean;
  photoAnglesCount: number;
  cartonSealVerified: boolean;
  barcodeVerified: boolean;
  status: 'PENDING_QA' | 'ACTIVE' | 'REJECTED';
  location: string;
}

interface EscrowTransaction {
  id: string;
  orderNumber: string;
  lotTitle: string;
  buyerName: string;
  sellerName: string;
  totalAmount: number;
  carrier: string;
  trackingNumber: string;
  status: 'FUNDS_HELD' | 'DISPATCHED' | 'IN_48H_INSPECTION' | 'SETTLED' | 'FROZEN_DISPUTE';
  hoursRemaining: number;
}

interface DisputeCase {
  id: string;
  caseNumber: string;
  orderNumber: string;
  lotTitle: string;
  buyerName: string;
  sellerName: string;
  disputeAmount: number;
  reason: string;
  evidenceSummary: string;
  filedAt: string;
  status: 'UNDER_ARBITRATION' | 'REFUNDED_PRO_RATA' | 'SELLER_PAID' | 'FULL_RETURN';
}

interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: 'SELLER' | 'BUYER' | 'ADMIN';
  orgName: string;
  enabled: boolean;
  createdAt: string;
}

// Initial Mock Datasets
const INITIAL_ORGS: OrganisationItem[] = [
  {
    id: 'org-101',
    legalName: 'Apex Footwear Mills Pvt Ltd',
    orgType: 'MANUFACTURER',
    gstNumber: '09AAACA1234A1Z5',
    contactPerson: 'Vikram Singhania',
    email: 'vikram@apexfootwear.com',
    phone: '+91 98220 11223',
    city: 'Agra',
    state: 'Uttar Pradesh',
    verificationStatus: 'PENDING',
    registeredAt: '2 hours ago',
  },
  {
    id: 'org-102',
    legalName: 'Bharat Bazaar Wholesale LLP',
    orgType: 'RETAILER',
    gstNumber: '27AABCB5678B1Z2',
    contactPerson: 'Devendra Patel',
    email: 'dev@bharatbazaar.in',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    state: 'Gujarat',
    verificationStatus: 'APPROVED',
    registeredAt: '1 day ago',
  },
  {
    id: 'org-103',
    legalName: 'Lumina Home Electronics Ltd',
    orgType: 'DISTRIBUTOR',
    gstNumber: '29ABCDE4321C1Z8',
    contactPerson: 'Suresh Menon',
    email: 'suresh@lumina.co.in',
    phone: '+91 99001 22334',
    city: 'Bengaluru',
    state: 'Karnataka',
    verificationStatus: 'PENDING',
    registeredAt: '3 hours ago',
  },
  {
    id: 'org-104',
    legalName: 'Tirupur Knitwear Export House',
    orgType: 'MANUFACTURER',
    gstNumber: '33AABCT9988D1Z4',
    contactPerson: 'Karthik Subramanian',
    email: 'karthik@tirupurtex.in',
    phone: '+91 94432 88776',
    city: 'Tirupur',
    state: 'Tamil Nadu',
    verificationStatus: 'APPROVED',
    registeredAt: '4 days ago',
  },
  {
    id: 'org-105',
    legalName: 'Shree Balaji Hardware Traders',
    orgType: 'WHOLESALER',
    gstNumber: '24AAECS9012E1Z9',
    contactPerson: 'Mahesh Shah',
    email: 'mahesh@balajitraders.com',
    phone: '+91 98250 33445',
    city: 'Jamnagar',
    state: 'Gujarat',
    verificationStatus: 'APPROVED',
    registeredAt: '1 week ago',
  },
];

const INITIAL_LOTS_QA: LotQAItem[] = [
  {
    id: 'qa-01',
    code: 'LOT-APP-8841',
    title: "Men's Combed Cotton Polo T-Shirts (Assorted Solid Colors)",
    sellerName: 'Tirupur Knitwear Export House',
    category: 'APPAREL',
    grade: 'A',
    units: 1200,
    askingPrice: 320,
    originalPrice: 850,
    brandMasked: true,
    photoAnglesCount: 8,
    cartonSealVerified: true,
    barcodeVerified: true,
    status: 'ACTIVE',
    location: 'Tirupur, Tamil Nadu',
  },
  {
    id: 'qa-02',
    code: 'LOT-FTW-9104',
    title: 'Athletic Running Shoes (Assorted Sizes UK 6-10)',
    sellerName: 'Apex Footwear Mills Pvt Ltd',
    category: 'FOOTWEAR',
    grade: 'B',
    units: 576,
    askingPrice: 790,
    originalPrice: 2200,
    brandMasked: false,
    photoAnglesCount: 6,
    cartonSealVerified: true,
    barcodeVerified: true,
    status: 'PENDING_QA',
    location: 'Agra, Uttar Pradesh',
  },
  {
    id: 'qa-03',
    code: 'LOT-ELC-7719',
    title: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    sellerName: 'Lumina Home Electronics Ltd',
    category: 'ELECTRONICS',
    grade: 'C',
    units: 800,
    askingPrice: 240,
    originalPrice: 650,
    brandMasked: true,
    photoAnglesCount: 7,
    cartonSealVerified: false,
    barcodeVerified: true,
    status: 'PENDING_QA',
    location: 'Noida, Uttar Pradesh',
  },
  {
    id: 'qa-04',
    code: 'LOT-HDW-4120',
    title: 'Industrial Heavy Duty Brass Ball Valves (1/2" & 3/4" BSP)',
    sellerName: 'Shree Balaji Hardware Traders',
    category: 'HARDWARE',
    grade: 'A',
    units: 2500,
    askingPrice: 195,
    originalPrice: 420,
    brandMasked: false,
    photoAnglesCount: 9,
    cartonSealVerified: true,
    barcodeVerified: true,
    status: 'ACTIVE',
    location: 'Jamnagar, Gujarat',
  },
];

const INITIAL_ESCROW_TXNS: EscrowTransaction[] = [
  {
    id: 'esc-01',
    orderNumber: 'ESC-2026-904',
    lotTitle: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    buyerName: 'Bharat Bazaar Wholesale LLP',
    sellerName: 'Lumina Home Electronics Ltd',
    totalAmount: 92000,
    carrier: 'BlueDart Ground Express',
    trackingNumber: 'BD-8849-2091',
    status: 'IN_48H_INSPECTION',
    hoursRemaining: 29,
  },
  {
    id: 'esc-02',
    orderNumber: 'ESC-2026-881',
    lotTitle: 'Industrial Heavy Duty Brass Ball Valves (1/2" & 3/4")',
    buyerName: 'National Engineering Supplies',
    sellerName: 'Shree Balaji Hardware Traders',
    totalAmount: 97500,
    carrier: 'TCI Freight Logistics',
    trackingNumber: 'TCI-6601-9923',
    status: 'DISPATCHED',
    hoursRemaining: 48,
  },
  {
    id: 'esc-03',
    orderNumber: 'ESC-2026-772',
    lotTitle: "Men's Combed Cotton Polo T-Shirts",
    buyerName: 'Metro Fashion Outlets',
    sellerName: 'Tirupur Knitwear Export House',
    totalAmount: 192000,
    carrier: 'V-Trans Express',
    trackingNumber: 'VT-4401-8890',
    status: 'SETTLED',
    hoursRemaining: 0,
  },
];

const INITIAL_DISPUTES: DisputeCase[] = [
  {
    id: 'disp-01',
    caseNumber: 'DSP-2026-004',
    orderNumber: 'ESC-2026-904',
    lotTitle: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    buyerName: 'Bharat Bazaar Wholesale LLP',
    sellerName: 'Lumina Home Electronics Ltd',
    disputeAmount: 14400,
    reason: '60 out of 800 units have internal glass cracks not disclosed in Grade C manifest.',
    evidenceSummary: '8 photos uploaded of cracked diffusers + unboxing video timestamped at POD.',
    filedAt: '4 hours ago',
    status: 'UNDER_ARBITRATION',
  },
];

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-01',
    fullName: 'StockBridge Administrator',
    email: 'admin@stockbridge.local',
    role: 'ADMIN',
    orgName: 'StockBridge Platform Admin Org',
    enabled: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'usr-02',
    fullName: 'Vikram Singhania',
    email: 'vikram@apexfootwear.com',
    role: 'SELLER',
    orgName: 'Apex Footwear Mills Pvt Ltd',
    enabled: true,
    createdAt: '2026-11-23',
  },
  {
    id: 'usr-03',
    fullName: 'Devendra Patel',
    email: 'dev@bharatbazaar.in',
    role: 'BUYER',
    orgName: 'Bharat Bazaar Wholesale LLP',
    enabled: true,
    createdAt: '2026-11-20',
  },
  {
    id: 'usr-04',
    fullName: 'Karthik Subramanian',
    email: 'karthik@tirupurtex.in',
    role: 'SELLER',
    orgName: 'Tirupur Knitwear Export House',
    enabled: true,
    createdAt: '2026-11-15',
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active admin module
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'lots' | 'escrow' | 'disputes' | 'users'>('overview');

  // Interactive Admin state
  const [organisations, setOrganisations] = useState<OrganisationItem[]>(INITIAL_ORGS);
  const [lotsQA, setLotsQA] = useState<LotQAItem[]>(INITIAL_LOTS_QA);
  const [escrowTxns, setEscrowTxns] = useState<EscrowTransaction[]>(INITIAL_ESCROW_TXNS);
  const [disputes, setDisputes] = useState<DisputeCase[]>(INITIAL_DISPUTES);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      const res = await clientAuth.getMe();
      if (isMounted) {
        if (res.authenticated && res.user && res.user.role === 'ADMIN') {
          setCurrentUser(res.user);
          setAuthLoading(false);
        } else {
          // If not authenticated as ADMIN, redirect to /admin/login immediately
          router.replace('/admin/login');
        }
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await clientAuth.logout();
    router.push('/admin/login');
    router.refresh();
  };

  // 1. KYC Actions
  const handleUpdateKycStatus = (orgId: string, status: VerificationStatus) => {
    setOrganisations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, verificationStatus: status } : o))
    );
    showToast(`Organisation status updated to ${status}`);
  };

  // 2. Lot QA Actions
  const handleApproveLot = (lotId: string) => {
    setLotsQA((prev) =>
      prev.map((l) => (l.id === lotId ? { ...l, status: 'ACTIVE' } : l))
    );
    showToast('Lot approved and published to Live Graded Marketplace!');
  };

  const handleRejectLot = (lotId: string) => {
    setLotsQA((prev) =>
      prev.map((l) => (l.id === lotId ? { ...l, status: 'REJECTED' } : l))
    );
    showToast('Lot rejected and returned to seller for revision.');
  };

  // 3. Escrow Actions
  const handleForceReleaseEscrow = (orderId: string) => {
    setEscrowTxns((prev) =>
      prev.map((e) => (e.id === orderId ? { ...e, status: 'SETTLED', hoursRemaining: 0 } : e))
    );
    showToast('Escrow funds released to seller corporate account.');
  };

  const handleFreezeEscrow = (orderId: string) => {
    setEscrowTxns((prev) =>
      prev.map((e) => (e.id === orderId ? { ...e, status: 'FROZEN_DISPUTE' } : e))
    );
    showToast('Escrow locked due to inspection dispute escalation.');
  };

  // 4. Dispute Resolution Actions
  const handleResolveDispute = (dispId: string, resolution: 'REFUNDED_PRO_RATA' | 'SELLER_PAID' | 'FULL_RETURN') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === dispId ? { ...d, status: resolution } : d))
    );
    showToast(`Dispute resolved via arbitration: ${resolution.replace(/_/g, ' ')}`);
  };

  // 5. User Account Actions
  const handleToggleUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, enabled: !u.enabled } : u))
    );
    showToast('User account status updated.');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff7a1a] border-t-transparent" />
          <p className="text-sm font-mono text-slate-400">Loading Admin Control Console...</p>
        </div>
      </div>
    );
  }

  // Calculate platform totals
  const totalGMV = 4820000;
  const totalEscrowHeld = escrowTxns
    .filter((e) => e.status !== 'SETTLED')
    .reduce((acc, e) => acc + e.totalAmount, 0);
  const pendingKycCount = organisations.filter((o) => o.verificationStatus === 'PENDING').length;
  const pendingQACount = lotsQA.filter((l) => l.status === 'PENDING_QA').length;
  const activeDisputeCount = disputes.filter((d) => d.status === 'UNDER_ARBITRATION').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-950 selection:text-orange-200">
      
      {/* ── Toast Notification ─────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm text-white shadow-2xl border border-slate-700 transition-all">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a1a] animate-pulse" />
          <span className="font-mono text-xs sm:text-sm">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-3 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Top Header / Admin Identity Bar ──────────────────────── */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff7a1a] text-white font-extrabold shadow-sm font-mono text-sm">
                SB
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-quicksand font-bold text-lg text-white">
                    StockBridge Admin Console
                  </h1>
                  <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff7a1a]">
                    MASTER ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {currentUser?.fullName} ({currentUser?.email})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/profile"
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-mono font-bold text-[#ff7a1a] hover:bg-orange-500/20 transition"
              >
                ⚙️ Admin Profile
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white transition"
              >
                ↗ Buyer Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-900/50 bg-rose-950/40 px-3 py-1.5 text-xs font-mono text-rose-300 hover:bg-rose-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── Sub Navigation Tabs ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-mono border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Executive Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kyc'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🏢 Enterprise KYC
            {pendingKycCount > 0 && (
              <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 text-[10px]">
                {pendingKycCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lots')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'lots'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Lot QA &amp; Grading
            {pendingQACount > 0 && (
              <span className="rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 px-1.5 py-0.2 text-[10px]">
                {pendingQACount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'escrow'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🔒 Escrow Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚖️ Dispute Arbitration
            {activeDisputeCount > 0 && (
              <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 text-[10px]">
                {activeDisputeCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#ff7a1a] text-[#ff7a1a]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            👥 Accounts &amp; Roles
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body ──────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ======================================================== */}
        {/* 1. EXECUTIVE OVERVIEW MODULE                             */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Total Platform GMV
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
                  ₹{(totalGMV).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs font-mono text-emerald-400">
                  +18.4% monthly velocity
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Active Escrow In Hold
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#ff7a1a] font-mono mt-2">
                  ₹{totalEscrowHeld.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs font-mono text-slate-400">
                  Secured across 2 delivery orders
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Estimated Platform Revenue (8.5%)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
                  ₹{Math.round(totalGMV * 0.085).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs font-mono text-slate-400">
                  7% Seller Fee + 1.5% Buyer Protection
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Dispute Rate
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-2">
                  2.1%
                </div>
                <div className="mt-2 text-xs font-mono text-emerald-400">
                  ✓ Target below 4.0%
                </div>
              </div>
            </div>

            {/* Quick Action Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">KYC Review</span>
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold font-quicksand text-white mt-2">
                    {pendingKycCount} Enterprise Accounts Pending
                  </h3>
                  <p className="text-xs text-slate-400 font-quicksand mt-1">
                    New manufacturers and wholesalers submitted GSTIN documents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('kyc')}
                  className="mt-4 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 text-left"
                >
                  Review GST Certificates →
                </button>
              </div>

              <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#ff7a1a] uppercase">Lot Inspection QA</span>
                    <span className="h-2 w-2 rounded-full bg-[#ff7a1a] animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold font-quicksand text-white mt-2">
                    {pendingQACount} Graded Lots Awaiting Sign-off
                  </h3>
                  <p className="text-xs text-slate-400 font-quicksand mt-1">
                    Verify photo angles, master carton seals, and brand masking before publication.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('lots')}
                  className="mt-4 text-xs font-mono font-bold text-[#ff7a1a] hover:text-orange-400 underline underline-offset-4 text-left"
                >
                  Audit Lot Submissions →
                </button>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase">Arbitration Ladder</span>
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold font-quicksand text-white mt-2">
                    {activeDisputeCount} Active Inspection Dispute
                  </h3>
                  <p className="text-xs text-slate-400 font-quicksand mt-1">
                    Buyer raised Grade C condition discrepancy within the 48-hour delivery window.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('disputes')}
                  className="mt-4 text-xs font-mono font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4 text-left"
                >
                  Open Arbitration Desk →
                </button>
              </div>
            </div>

            {/* Architecture & Blueprint Reference (JG University) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase mb-2">
                <span>Architecture Specification</span>
                <span>•</span>
                <span className="text-[#ff7a1a]">Slide 9 &amp; 10 Back-Office Ledger</span>
              </div>
              <h3 className="text-base font-bold font-quicksand text-white">
                Modular Monolith Operations Interface (Spring Boot + PostgreSQL)
              </h3>
              <p className="text-xs text-slate-400 font-quicksand mt-1 max-w-3xl leading-relaxed">
                This administrative operations hub coordinates the double-entry escrow ledger, 5-grade verification tolerances, seller brand masking policies, and dispute ladder decisions.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ENTERPRISE KYC & GSTIN VERIFICATION                   */}
        {/* ======================================================== */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-quicksand text-white">
                  Enterprise GST &amp; Business KYC Verification
                </h2>
                <p className="text-xs text-slate-400 font-quicksand mt-0.5">
                  Review and verify registered businesses before granting wholesale marketplace trade access.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Total Enterprises: <strong className="text-white">{organisations.length}</strong>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Organisation Legal Name</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">GSTIN</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Contact Person</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {organisations.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-bold text-white font-quicksand text-sm">
                        {org.legalName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {org.orgType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#ff7a1a] font-bold">
                        {org.gstNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {org.city}, {org.state}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        <div>{org.contactPerson}</div>
                        <div className="text-[11px] text-slate-500">{org.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            org.verificationStatus === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : org.verificationStatus === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {org.verificationStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        {org.verificationStatus !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateKycStatus(org.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-[11px] transition"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {org.verificationStatus !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateKycStatus(org.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] transition"
                          >
                            ✕ Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. LOT INSPECTION & QA APPROVAL                          */}
        {/* ======================================================== */}
        {activeTab === 'lots' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-quicksand text-white">
                  Lot Quality Assurance &amp; 5-Grade Verification
                </h2>
                <p className="text-xs text-slate-400 font-quicksand mt-0.5">
                  Verify manifest tolerances, minimum 6 photo angles, and brand masking before lot is listed publicly.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Pending Inspection: <strong className="text-orange-400">{pendingQACount}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lotsQA.map((lot) => (
                <div
                  key={lot.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-orange-500/20 text-[#ff7a1a] font-bold font-mono text-xs border border-orange-500/30">
                          {lot.grade}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{lot.code}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          lot.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : lot.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {lot.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-quicksand text-white mb-1">
                      {lot.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                      Seller: <span className="text-slate-300 font-bold">{lot.sellerName}</span> ({lot.location})
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono mb-4">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Lot Volume</span>
                        <span className="text-white font-bold">{lot.units} Units</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Asking Price</span>
                        <span className="text-emerald-400 font-bold">₹{lot.askingPrice}/unit</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Wholesale MRP</span>
                        <span className="text-slate-400 line-through">₹{lot.originalPrice}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Photo Count</span>
                        <span className="text-white">{lot.photoAnglesCount} Verified Angles</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Seal Intact</span>
                        <span className={lot.cartonSealVerified ? 'text-emerald-400' : 'text-amber-400'}>
                          {lot.cartonSealVerified ? '✓ Verified' : '⚠ Disclosed Damaged'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Brand Obfuscation</span>
                        <span className="text-white">
                          {lot.brandMasked ? '🔒 Masked' : 'Public'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    {lot.status !== 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleApproveLot(lot.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition"
                      >
                        ✓ Approve for Marketplace
                      </button>
                    )}
                    {lot.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleRejectLot(lot.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800 hover:bg-rose-900 text-rose-300 font-mono font-bold text-xs transition"
                      >
                        ✕ Reject Lot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. ESCROW LEDGER & INSPECTION WINDOW MONITOR             */}
        {/* ======================================================== */}
        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-quicksand text-white">
                  Neutral Escrow &amp; 48-Hour Inspection Monitor
                </h2>
                <p className="text-xs text-slate-400 font-quicksand mt-0.5">
                  Track orders in transit, delivery confirmations, and the 48-hour physical inspection escrow window.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold">
                Escrow In Hold: ₹{totalEscrowHeld.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Order ID</th>
                    <th className="px-5 py-3.5">Lot Description</th>
                    <th className="px-5 py-3.5">Buyer</th>
                    <th className="px-5 py-3.5">Seller</th>
                    <th className="px-5 py-3.5">Escrow Amount</th>
                    <th className="px-5 py-3.5">Escrow Status</th>
                    <th className="px-5 py-3.5 text-right">Arbitration Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {escrowTxns.map((esc) => (
                    <tr key={esc.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {esc.orderNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-quicksand max-w-xs truncate">
                        {esc.lotTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{esc.buyerName}</td>
                      <td className="px-5 py-3.5 text-slate-300">{esc.sellerName}</td>
                      <td className="px-5 py-3.5 font-bold text-[#ff7a1a]">
                        ₹{esc.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            esc.status === 'SETTLED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : esc.status === 'FROZEN_DISPUTE'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : esc.status === 'IN_48H_INSPECTION'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {esc.status}
                          {esc.hoursRemaining > 0 && ` (${esc.hoursRemaining}h)`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        {esc.status !== 'SETTLED' && (
                          <button
                            type="button"
                            onClick={() => handleForceReleaseEscrow(esc.id)}
                            className="px-2.5 py-1 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-[11px] transition"
                          >
                            Release Escrow
                          </button>
                        )}
                        {esc.status !== 'FROZEN_DISPUTE' && esc.status !== 'SETTLED' && (
                          <button
                            type="button"
                            onClick={() => handleFreezeEscrow(esc.id)}
                            className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] transition"
                          >
                            Freeze Escrow
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. DISPUTE ARBITRATION LADDER DESK                       */}
        {/* ======================================================== */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-quicksand text-white">
                  Dispute Arbitration Ladder Desk
                </h2>
                <p className="text-xs text-slate-400 font-quicksand mt-0.5">
                  Arbitrate claims filed during the 48-hour inspection period against the 5-Grade specification manual.
                </p>
              </div>
              <div className="text-xs font-mono text-rose-400">
                Active Cases: <strong>{activeDisputeCount}</strong>
              </div>
            </div>

            {disputes.map((disp) => (
              <div
                key={disp.id}
                className="rounded-xl border border-rose-900/60 bg-slate-900/80 p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-rose-400 text-sm">
                      {disp.caseNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Order: {disp.orderNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Filed: {disp.filedAt}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-[#ff7a1a]">
                    Disputed Escrow: ₹{disp.disputeAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-2">
                    <span className="text-slate-400 uppercase font-bold block">Case Information</span>
                    <p className="text-slate-200 font-quicksand text-sm font-semibold">
                      {disp.lotTitle}
                    </p>
                    <p className="text-slate-400">
                      Buyer: <strong className="text-white">{disp.buyerName}</strong>
                    </p>
                    <p className="text-slate-400">
                      Seller: <strong className="text-white">{disp.sellerName}</strong>
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <span className="text-rose-400 uppercase font-bold block">Buyer Claim &amp; Evidence</span>
                    <p className="text-slate-300 font-quicksand">
                      &quot;{disp.reason}&quot;
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Evidence: {disp.evidenceSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    Status: <strong className="text-white">{disp.status.replace(/_/g, ' ')}</strong>
                  </span>

                  {disp.status === 'UNDER_ARBITRATION' ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResolveDispute(disp.id, 'REFUNDED_PRO_RATA')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs transition"
                      >
                        1. Issue Pro-Rata Refund (₹14,400 to Buyer)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveDispute(disp.id, 'SELLER_PAID')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition"
                      >
                        2. Dismiss Claim (Pay Seller)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveDispute(disp.id, 'FULL_RETURN')}
                        className="px-3 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-mono font-bold text-xs transition"
                      >
                        3. Authorize Full Lot Return
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      ✓ Resolution Executed on Escrow Ledger
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. USER ACCOUNTS & ACCESS CONTROL                        */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-quicksand text-white">
                  Registered User Accounts &amp; Access Control
                </h2>
                <p className="text-xs text-slate-400 font-quicksand mt-0.5">
                  Manage login privileges and roles across buyer, seller, and administrator accounts.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Total Users: <strong className="text-white">{users.length}</strong>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Organisation</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5">Access</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-bold text-white font-quicksand text-sm">
                        {usr.fullName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{usr.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            usr.role === 'ADMIN'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : usr.role === 'SELLER'
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-quicksand">
                        {usr.orgName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{usr.createdAt}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.enabled
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {usr.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUser(usr.id)}
                          className={`px-2.5 py-1 rounded font-bold text-[11px] transition ${
                            usr.enabled
                              ? 'bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300'
                              : 'bg-emerald-700/80 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          {usr.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
