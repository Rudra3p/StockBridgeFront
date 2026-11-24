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

export interface BuyerLocationInfo {
  city: string;
  state: string;
  gstin: string;
  address: string;
  lat: number;
  lon: number;
  transitKm: number;
  estimatedDays: string;
  taxType: 'INTRASTATE_CGST_SGST' | 'INTERSTATE_IGST';
}

export interface SurplusLot {
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

export interface OfferItem {
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
  buyerLocation?: BuyerLocationInfo;
}

export interface EscrowOrder {
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
  buyerLocation?: BuyerLocationInfo;
}

export interface DisputeItem {
  id: string;
  orderNumber: string;
  lotTitle: string;
  buyerName: string;
  buyerLocation: BuyerLocationInfo;
  disputeAmount: number;
  totalOrderAmount: number;
  reason: string;
  reportedAt: string;
  status: 'PENDING_SELLER_ACTION' | 'PRO_RATA_SETTLED' | 'FIELD_INSPECTION_REQUESTED' | 'EVIDENCE_SUBMITTED';
  photoCount: number;
}

export interface SettlementBankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'CURRENT' | 'CC_OD';
  settlementStatus: 'VERIFIED';
}

// Initial Mock Datasets
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
    buyerLocation: {
      city: 'Bhiwandi',
      state: 'Maharashtra',
      gstin: '27AABCM8821B1Z3',
      address: 'Plot 42, Bhiwandi Logistics Corridor, Thane, Maharashtra 421302',
      lat: 19.2967,
      lon: 73.0631,
      transitKm: 270,
      estimatedDays: '1-2 Days',
      taxType: 'INTERSTATE_IGST',
    },
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
    buyerLocation: {
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '24AAABB1122C1Z4',
      address: 'B-14, Naroda Industrial Estate, Ahmedabad, Gujarat 382330',
      lat: 23.0734,
      lon: 72.6586,
      transitKm: 255,
      estimatedDays: '1 Day',
      taxType: 'INTRASTATE_CGST_SGST',
    },
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
    buyerLocation: {
      city: 'Hyderabad',
      state: 'Telangana',
      gstin: '36AABCD9988D1Z9',
      address: 'Shop 18, Kattedan Commercial Wholesale Hub, Hyderabad 500077',
      lat: 17.3218,
      lon: 78.4412,
      transitKm: 790,
      estimatedDays: '3 Days',
      taxType: 'INTERSTATE_IGST',
    },
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
    buyerLocation: {
      city: 'Hyderabad',
      state: 'Telangana',
      gstin: '36AABCD9988D1Z9',
      address: 'Shop 18, Kattedan Commercial Wholesale Hub, Hyderabad 500077',
      lat: 17.3218,
      lon: 78.4412,
      transitKm: 790,
      estimatedDays: '3 Days',
      taxType: 'INTERSTATE_IGST',
    },
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
    buyerLocation: {
      city: 'Bengaluru',
      state: 'Karnataka',
      gstin: '29ABCDE1234F1Z5',
      address: 'Warehouse 9, Peenya Industrial Area 2nd Phase, Bengaluru 560058',
      lat: 13.0285,
      lon: 77.5186,
      transitKm: 1240,
      estimatedDays: '3-4 Days',
      taxType: 'INTERSTATE_IGST',
    },
  },
];

const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: 'DISP-2026-081',
    orderNumber: 'ESC-2026-904',
    lotTitle: 'Smart LED Slim Ceiling Lights 18W (Outer Carton Dents)',
    buyerName: 'Deccan Electrical Traders',
    buyerLocation: {
      city: 'Hyderabad',
      state: 'Telangana',
      gstin: '36AABCD9988D1Z9',
      address: 'Shop 18, Kattedan Commercial Wholesale Hub, Hyderabad 500077',
      lat: 17.3218,
      lon: 78.4412,
      transitKm: 790,
      estimatedDays: '3 Days',
      taxType: 'INTERSTATE_IGST',
    },
    disputeAmount: 18400,
    totalOrderAmount: 92000,
    reason: 'Buyer unpacked outer cartons during 48h check and found 24 internal diffusers cracked.',
    reportedAt: '4 hours ago',
    status: 'PENDING_SELLER_ACTION',
    photoCount: 4,
  },
];

const INITIAL_BANK_DETAILS: SettlementBankDetails = {
  accountHolder: 'Apex Footwear & Garments Corp Pvt Ltd',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '•••• •••• •••• 9812',
  ifscCode: 'HDFC0000128',
  accountType: 'CURRENT',
  settlementStatus: 'VERIFIED',
};

export default function DashboardView({
  expectedRole: _expectedRole,
  portalTitle,
}: DashboardViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'offers' | 'escrow' | 'disputes' | 'profile'>('overview');

  // Interactive dashboard state
  const [lots, setLots] = useState<SurplusLot[]>(INITIAL_LOTS);
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [escrowOrders, setEscrowOrders] = useState<EscrowOrder[]>(INITIAL_ESCROW_ORDERS);
  const [disputes, setDisputes] = useState<DisputeItem[]>(INITIAL_DISPUTES);
  const [bankDetails, setBankDetails] = useState<SettlementBankDetails>(INITIAL_BANK_DETAILS);

  // Single Lot Creation Modal
  const [createLotOpen, setCreateLotOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('APPAREL');
  const [newGrade, setNewGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [newUnits, setNewUnits] = useState(500);
  const [newMoq, setNewMoq] = useState(50);
  const [newOriginalPrice, setNewOriginalPrice] = useState(1200);
  const [newDiscountedPrice, setNewDiscountedPrice] = useState(450);
  const [newBrandMasked, setNewBrandMasked] = useState(true);
  const [newLocation, setNewLocation] = useState('Surat, Gujarat');

  // Bulk CSV Upload Modal
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkParsedLots, setBulkParsedLots] = useState<SurplusLot[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Free OpenStreetMap Buyer Location Modal
  const [selectedBuyerLocation, setSelectedBuyerLocation] = useState<(BuyerLocationInfo & { buyerName: string; lotTitle?: string; orderNumber?: string }) | null>(null);

  // Counter-Offer Modal State
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [activeOfferForCounter, setActiveOfferForCounter] = useState<OfferItem | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');

  // Bank Edit Modal
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState<SettlementBankDetails>(INITIAL_BANK_DETAILS);

  // Filter state for listings
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

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

  // 1. Single Lot Creation
  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLot: SurplusLot = {
      id: `lot-${Date.now()}`,
      code: `LOT-${newCategory.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      category: newCategory,
      grade: newGrade,
      units: Number(newUnits) || 100,
      moq: Number(newMoq) || 10,
      originalPrice: Number(newOriginalPrice) || 500,
      discountedPrice: Number(newDiscountedPrice) || 200,
      location: newLocation || 'Surat, Gujarat',
      status: 'ACTIVE',
      brandMasked: newBrandMasked,
      image: `/images/grades/grade-${newGrade.toLowerCase()}.jpg`,
    };

    setLots([newLot, ...lots]);
    setCreateLotOpen(false);
    setNewTitle('');
    showToast(`Lot "${newLot.title.slice(0, 30)}..." published successfully!`);
  };

  // 2. Bulk CSV Sample Generator
  const handleDownloadSampleCsv = () => {
    const headers = "Title,Category,Grade,Units,MOQ,OriginalPrice,DiscountedPrice,Location,BrandMasked\n";
    const sampleRows = [
      `"Combed Cotton Round Neck T-Shirts (Assorted Sizes)",APPAREL,A,1500,150,750,280,"Tirupur, Tamil Nadu",TRUE`,
      `"Synthetic Athletic Running Shoes (Sizes UK 6-10)",FOOTWEAR,B,480,48,2400,850,"Agra, Uttar Pradesh",FALSE`,
      `"Industrial Brass Ball Valves 1/2 Inch BSP",HARDWARE,A,3000,300,380,175,"Jamnagar, Gujarat",FALSE`,
      `"Slim Panel 18W LED Ceiling Downlights (Outer Carton Wear)",ELECTRONICS,C,600,60,590,210,"Noida, Uttar Pradesh",TRUE`
    ].join("\n");

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stockbridge_bulk_surplus_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded sample CSV template.');
  };

  // 3. Bulk CSV Parser
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFileName(file.name);
    setBulkError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setBulkError('The selected file is empty.');
          return;
        }

        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
        if (lines.length < 2) {
          setBulkError('CSV file must have at least 1 header row and 1 data row.');
          return;
        }

        const parsed: SurplusLot[] = [];
        // skip header
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          // regex to split by comma ignoring commas inside quotes
          const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
          const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());

          if (cleanCols.length >= 8) {
            const title = cleanCols[0];
            const category = cleanCols[1].toUpperCase();
            const gradeRaw = cleanCols[2].toUpperCase();
            const grade: 'A' | 'B' | 'C' | 'D' | 'E' = ['A', 'B', 'C', 'D', 'E'].includes(gradeRaw)
              ? (gradeRaw as any)
              : 'B';
            const units = parseInt(cleanCols[3]) || 100;
            const moq = parseInt(cleanCols[4]) || 10;
            const originalPrice = parseFloat(cleanCols[5]) || 500;
            const discountedPrice = parseFloat(cleanCols[6]) || 200;
            const location = cleanCols[7] || 'India';
            const brandMasked = cleanCols[8] ? cleanCols[8].toLowerCase() === 'true' : true;

            parsed.push({
              id: `bulk-lot-${Date.now()}-${i}`,
              code: `LOT-${category.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
              title,
              category,
              grade,
              units,
              moq,
              originalPrice,
              discountedPrice,
              location,
              status: 'ACTIVE',
              brandMasked,
              image: `/images/grades/grade-${grade.toLowerCase()}.jpg`,
            });
          }
        }

        if (parsed.length === 0) {
          setBulkError('Could not parse any valid rows. Please check format against the template.');
        } else {
          setBulkParsedLots(parsed);
        }
      } catch {
        setBulkError('Error reading CSV file format.');
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmBulkImport = () => {
    if (bulkParsedLots.length === 0) return;
    setLots((prev) => [...bulkParsedLots, ...prev]);
    showToast(`Successfully imported ${bulkParsedLots.length} surplus lots to live inventory!`);
    setBulkUploadOpen(false);
    setBulkParsedLots([]);
    setBulkFileName('');
  };

  // 4. Offer Actions
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

  const handleOpenCounterModal = (offer: OfferItem) => {
    setActiveOfferForCounter(offer);
    setCounterPriceInput(String(Math.round((offer.offeredPricePerUnit + offer.listedPricePerUnit) / 2)));
    setCounterModalOpen(true);
  };

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferForCounter) return;

    const price = parseFloat(counterPriceInput);
    if (!price || price <= 0) return;

    setOffers((prev) =>
      prev.map((o) =>
        o.id === activeOfferForCounter.id
          ? { ...o, status: 'COUNTER_OFFERED', counterPrice: price }
          : o
      )
    );
    setCounterModalOpen(false);
    setActiveOfferForCounter(null);
    showToast(`Counter-proposal of ₹${price}/unit dispatched to ${activeOfferForCounter.buyerName}!`);
  };

  // 5. Escrow Actions
  const handleReleaseEscrow = (orderId: string) => {
    setEscrowOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, escrowStatus: 'SETTLED' } : o))
    );
    showToast('Inspection accepted! Escrow funds released to seller bank account.');
  };

  // 6. Dispute Actions (Seller Desk)
  const handleAcceptProRata = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'PRO_RATA_SETTLED' } : d))
    );
    showToast('Pro-rata discount approved! Remainder escrow funds released to your bank.');
  };

  const handleSubmitEvidence = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'EVIDENCE_SUBMITTED' } : d))
    );
    showToast('Dispatch video & manifest evidence forwarded to StockBridge arbitration.');
  };

  const handleRequestFieldInspection = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'FIELD_INSPECTION_REQUESTED' } : d))
    );
    showToast('Requested StockBridge third-party physical inspector visit at buyer facility.');
  };

  // 7. Save Bank Account
  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setBankDetails(bankForm);
    setBankModalOpen(false);
    showToast('Settlement bank account updated & verified via penny-drop check.');
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
  const isApproved = profile.organisation?.verificationStatus === 'APPROVED';

  // Calculate totals
  const totalInventoryValue = lots.reduce((acc, l) => acc + l.discountedPrice * l.units, 0);
  const activeLotCount = lots.filter((l) => l.status === 'ACTIVE').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'PENDING_REVIEW').length;
  const totalEscrowAmount = escrowOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingDisputesCount = disputes.filter((d) => d.status === 'PENDING_SELLER_ACTION').length;

  // Filter lots
  const filteredLots = lots.filter((l) => {
    if (selectedGradeFilter !== 'ALL' && l.grade !== selectedGradeFilter) return false;
    if (selectedCategoryFilter !== 'ALL' && l.category !== selectedCategoryFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      {/* ── Toast Notification ─────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white shadow-xl border border-slate-800 transition-all">
          <span className="h-2 w-2 rounded-full bg-[#e65c00] animate-pulse" />
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
          disputes: pendingDisputesCount,
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
              <>
                <button
                  type="button"
                  onClick={() => setBulkUploadOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold font-quicksand px-3.5 py-2 rounded-lg transition shadow-2xs"
                >
                  <span>📥 Bulk CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreateLotOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-[#e65c00] text-white text-xs font-bold font-quicksand px-3.5 py-2 rounded-lg hover:bg-[#c44e00] transition shadow-xs"
                >
                  <span>+ Create Lot</span>
                </button>
              </>
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
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 1: OVERVIEW & LIQUIDATION METRICS                      */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Action Required Banner for Seller */}
              {(pendingOffersCount > 0 || pendingDisputesCount > 0) && role === 'SELLER' && (
                <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-lg shadow-sm">
                      ⚡
                    </span>
                    <div>
                      <h3 className="text-sm font-bold font-quicksand text-slate-950">
                        {pendingOffersCount + pendingDisputesCount} Immediate Action Items Pending
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {pendingOffersCount > 0 && `${pendingOffersCount} new buyer proposals awaiting price response. `}
                        {pendingDisputesCount > 0 && `${pendingDisputesCount} 48h inspection claim requiring resolution.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {pendingOffersCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('offers')}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-bold font-quicksand hover:bg-slate-800 transition"
                      >
                        Review Offers ({pendingOffersCount}) →
                      </button>
                    )}
                    {pendingDisputesCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('disputes')}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold font-quicksand hover:bg-orange-700 transition"
                      >
                        Review Claims ({pendingDisputesCount}) →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                    <span>{role === 'SELLER' ? 'Active Listed Lots' : 'Catalog Units'}</span>
                    <span className="text-[#e65c00] font-bold">📦</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                    {activeLotCount} Lots
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-quicksand">
                    {lots.reduce((acc, l) => acc + l.units, 0).toLocaleString('en-IN')} units total
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                    <span>{role === 'SELLER' ? 'Total Recovery Value' : 'Procurement Value'}</span>
                    <span className="text-emerald-600 font-bold">₹</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                    ₹{(totalInventoryValue / 100000).toFixed(2)} L
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-quicksand">
                    Avg 58% capital recovery against MRP
                  </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                    <span>Inbound Negotiations</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#e65c00] font-bold text-[10px]">
                      {pendingOffersCount} Active
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                    {pendingOffersCount}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-quicksand">
                    Private bids within 48h SLA
                  </p>
                </div>

                {/* Card 4 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                    <span>Secured In Escrow</span>
                    <span className="text-emerald-600 font-bold">✓ LOCKED</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-quicksand text-slate-950">
                    ₹{(totalEscrowAmount / 100000).toFixed(2)} L
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-quicksand">
                    Funds in licensed escrow accounts
                  </p>
                </div>
              </div>

              {/* Main Workspace 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Recent Surplus Lots */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div>
                        <h2 className="type-little text-slate-950 font-quicksand font-bold">
                          {role === 'SELLER' ? 'Active Surplus Listings' : 'Recommended Wholesale Inventory'}
                        </h2>
                        <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                          Standardized against 5-grade lot specification yardstick
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {role === 'SELLER' && (
                          <button
                            type="button"
                            onClick={() => setBulkUploadOpen(true)}
                            className="text-xs font-bold font-quicksand px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                          >
                            📥 Bulk CSV
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveTab('listings')}
                          className="text-xs font-mono font-bold text-[#e65c00] hover:text-[#c44e00]"
                        >
                          View All ({lots.length}) →
                        </button>
                      </div>
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

                  {/* Buyer Logistics & Dispatch Corridor Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-sm font-bold text-slate-950 font-quicksand">
                          Buyer Commercial Hubs & Dispatch Transit Map
                        </h2>
                        <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                          View verified buyer destinations and freight transit routes across India
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        🗺️ OpenStreetMap Powered (Free)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span>{offer.buyerLocation?.city}, {offer.buyerLocation?.state}</span>
                              <span className="text-emerald-600 font-bold">~{offer.buyerLocation?.transitKm} km</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 font-quicksand line-clamp-1">
                              {offer.buyerName}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-mono mt-1">
                              GSTIN: {offer.buyerLocation?.gstin.slice(0, 10)}...
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              offer.buyerLocation &&
                              setSelectedBuyerLocation({
                                ...offer.buyerLocation,
                                buyerName: offer.buyerName,
                                lotTitle: offer.lotTitle,
                              })
                            }
                            className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:border-orange-500 hover:text-[#e65c00] text-slate-700 text-[11px] font-mono font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <span>📍 View Hub Map</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Live Escrow & Settlement */}
                <div className="space-y-6">
                  {/* Escrow Orders Summary */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <h2 className="type-little text-slate-950 font-quicksand font-bold">
                        Live Escrow Deliveries
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
                              {order.inspectionHoursRemaining}h left
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.buyerLocation && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedBuyerLocation({
                                    ...order.buyerLocation!,
                                    buyerName: order.buyerName,
                                    orderNumber: order.orderNumber,
                                  })
                                }
                                className="flex-1 py-1.5 px-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-mono text-slate-700 font-bold transition"
                              >
                                📍 Delivery Map
                              </button>
                            )}

                            {order.escrowStatus === 'IN_48H_INSPECTION' && (
                              <button
                                type="button"
                                onClick={() => handleReleaseEscrow(order.id)}
                                className="flex-1 text-center text-xs font-bold font-quicksand py-1.5 px-2 rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition shadow-sm"
                              >
                                Release →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payout Bank Summary Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Settlement Bank Account
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ VERIFIED
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-slate-900">
                        {bankDetails.bankName}
                      </h4>
                      <p className="text-xs font-mono text-slate-600 mt-0.5">
                        A/C: {bankDetails.accountNumber} • IFSC: {bankDetails.ifscCode}
                      </p>
                      <p className="text-[11px] text-slate-400 font-quicksand mt-1">
                        Automated NEFT/RTGS settlement (T+1 post 48h check)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setBankForm(bankDetails);
                        setBankModalOpen(true);
                      }}
                      className="text-xs font-bold font-quicksand text-[#e65c00] hover:underline"
                    >
                      Update Bank Account Details →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 2: MY SURPLUS LOTS (INVENTORY & BULK IMPORT)          */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="type-little text-slate-950 font-quicksand font-bold">
                    {role === 'SELLER' ? 'Surplus Inventory Lots' : 'Wholesale Graded Catalog'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                    Standardized 5-tier lot grading with OEM brand protection guardrails.
                  </p>
                </div>

                {role === 'SELLER' && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBulkUploadOpen(true)}
                      className="inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold font-quicksand px-4 py-2.5 rounded-lg transition shadow-2xs"
                    >
                      <span>📥 Bulk CSV Import</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateLotOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-[#e65c00] text-white text-xs sm:text-sm font-bold font-quicksand px-4 py-2.5 rounded-lg hover:bg-[#c44e00] transition shadow-sm"
                    >
                      <span>+ New Surplus Lot</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 text-xs font-quicksand">
                <span className="font-bold text-slate-700">Filter by Grade:</span>
                {['ALL', 'A', 'B', 'C', 'D', 'E'].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGradeFilter(grade)}
                    className={`px-3 py-1.5 rounded-lg font-bold font-mono transition ${
                      selectedGradeFilter === grade
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {grade === 'ALL' ? 'All Grades' : `Grade ${grade}`}
                  </button>
                ))}

                <span className="mx-2 text-slate-300 hidden sm:inline">|</span>

                <span className="font-bold text-slate-700">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 outline-hidden bg-white"
                >
                  <option value="ALL">All Categories</option>
                  <option value="APPAREL">Apparel & Textiles</option>
                  <option value="FOOTWEAR">Footwear & Leather</option>
                  <option value="HARDWARE">Hardware & Industrial</option>
                  <option value="ELECTRONICS">Electronics & Appliances</option>
                </select>

                <span className="ml-auto text-xs font-mono text-slate-400">
                  Showing {filteredLots.length} of {lots.length} lots
                </span>
              </div>

              {/* Lots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLots.map((lot) => (
                  <div
                    key={lot.id}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-slate-100">
                        <img
                          src={lot.image}
                          alt={lot.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-xs font-black font-quicksand bg-slate-950 text-white shadow-sm">
                            Grade {lot.grade}
                          </span>
                          {lot.brandMasked && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-sm">
                              Brand Masked
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2 py-1 rounded bg-black/75 text-white font-mono text-[10px]">
                            {lot.location}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                          <span>{lot.code}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                            <span className="text-[10px] font-mono text-slate-400 block">Available Units</span>
                            <span className="font-semibold text-slate-800">{lot.units} units</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">Minimum Order (MOQ)</span>
                            <span className="font-semibold text-slate-800">{lot.moq} units</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                      <div>
                        <div className="text-lg font-black font-quicksand text-slate-950">
                          ₹{lot.discountedPrice}
                          <span className="text-xs text-slate-400 line-through font-normal ml-1.5">
                            ₹{lot.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#e65c00]">
                          {Math.round(((lot.originalPrice - lot.discountedPrice) / lot.originalPrice) * 100)}% Below MRP
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Inspection certificate for ${lot.code} is available.`)}
                        className="text-xs font-bold font-quicksand text-slate-950 hover:text-[#e65c00] transition"
                      >
                        Inspect Spec →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 3: INBOUND OFFERS & NEGOTIATIONS                      */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="type-little text-slate-950 font-quicksand font-bold">
                  {role === 'SELLER' ? 'Inbound Buyer Offers & Counter-Negotiation Desk' : 'My Bids & Proposals'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                  Negotiate terms privately before payment is deposited into escrow. Check buyer commercial location and transit times.
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

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-quicksand">
                        <span>
                          Buyer: <strong className="text-slate-800">{offer.buyerName}</strong>
                        </span>
                        {offer.buyerLocation && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{offer.buyerLocation.city}, {offer.buyerLocation.state} (~{offer.buyerLocation.transitKm} km)</span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBuyerLocation({
                                  ...offer.buyerLocation!,
                                  buyerName: offer.buyerName,
                                  lotTitle: offer.lotTitle,
                                })
                              }
                              className="text-xs font-mono font-bold text-[#e65c00] hover:underline inline-flex items-center gap-1"
                            >
                              📍 View Hub Map
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Breakdown */}
                    <div className="flex items-center gap-6 text-xs font-quicksand border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0 md:px-6">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Quantity</span>
                        <span className="font-bold text-slate-900 text-sm">{offer.quantityRequested} units</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Asking Rate</span>
                        <span className="font-semibold text-slate-600 line-through">₹{offer.listedPricePerUnit}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Proposed Rate</span>
                        <span className="font-black text-slate-950 text-sm text-[#e65c00]">
                          ₹{offer.offeredPricePerUnit}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Gross Value</span>
                        <span className="font-black text-slate-950 text-sm">
                          ₹{(offer.quantityRequested * offer.offeredPricePerUnit).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                      {offer.status === 'PENDING_REVIEW' && role === 'SELLER' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold font-quicksand text-xs hover:bg-emerald-700 transition shadow-sm"
                          >
                            Accept Deal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenCounterModal(offer)}
                            className="px-3.5 py-2 rounded-lg bg-orange-500 text-white font-bold font-quicksand text-xs hover:bg-orange-600 transition shadow-sm"
                          >
                            Counter-Offer
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

                      {offer.status === 'COUNTER_OFFERED' && (
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                            Counter Proposed: ₹{offer.counterPrice}/unit
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 font-quicksand">Awaiting Buyer Confirmation</p>
                        </div>
                      )}

                      {offer.status === 'ACCEPTED' && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                          ✓ Proceeding to Escrow Deposit
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 4: ESCROW DISPATCHES & SETTLEMENT ORDERS              */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'escrow' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="type-little text-slate-950 font-quicksand font-bold">
                  Escrow Vault & Order Dispatches
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                  All transaction funds are deposited into licensed partner escrow accounts before dispatch.
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
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-quicksand mt-0.5">
                          <span>Buyer: <strong>{order.buyerName}</strong></span>
                          {order.buyerLocation && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBuyerLocation({
                                  ...order.buyerLocation!,
                                  buyerName: order.buyerName,
                                  orderNumber: order.orderNumber,
                                })
                              }
                              className="font-mono text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              📍 View Delivery Destination Map
                            </button>
                          )}
                        </div>
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
                          ✓ Escrow Settled & Dispatched to Bank Account
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 5: DISPUTE RESOLUTION & INSPECTION CLAIMS DESK         */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="type-little text-slate-950 font-quicksand font-bold">
                    Dispute Resolution & Inspection Claims Desk
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                    Resolve buyer-flagged quality discrepancies within the 48-hour inspection window.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    {pendingDisputesCount} Active Claim Requiring Action
                  </span>
                </div>
              </div>

              {disputes.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
                  <p className="text-sm font-bold font-quicksand text-slate-700">No active inspection claims.</p>
                  <p className="text-xs text-slate-400 mt-1">All fulfilled surplus deliveries have passed inspection.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {disputes.map((disp) => (
                    <div
                      key={disp.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {disp.id}
                            </span>
                            <span className="text-xs font-mono text-slate-500">Order Ref: {disp.orderNumber}</span>
                            <span className="text-xs font-mono text-slate-400">• Reported {disp.reportedAt}</span>
                          </div>
                          <h3 className="text-base font-bold font-quicksand text-slate-950">
                            {disp.lotTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-quicksand mt-1">
                            <span>Claimed by: <strong>{disp.buyerName}</strong></span>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBuyerLocation({
                                  ...disp.buyerLocation,
                                  buyerName: disp.buyerName,
                                  orderNumber: disp.orderNumber,
                                })
                              }
                              className="text-xs font-mono font-bold text-[#e65c00] hover:underline"
                            >
                              📍 View Buyer Facility Map
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Disputed Escrow Sum</span>
                          <span className="text-xl font-black font-mono text-rose-600">
                            ₹{disp.disputeAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            of ₹{disp.totalOrderAmount.toLocaleString('en-IN')} total order
                          </span>
                        </div>
                      </div>

                      {/* Claim Details Box */}
                      <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 text-xs font-quicksand space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-950 uppercase font-mono text-[10px]">
                            Inspection Discrepancy Note:
                          </span>
                          <span className="font-mono text-slate-500">
                            📷 {disp.photoCount} Carton Inspection Photos Attached
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {disp.reason}
                        </p>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-quicksand">Current Resolution Status:</span>
                        <span className="font-mono font-bold px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {disp.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Concrete Seller Resolution Actions */}
                      {disp.status === 'PENDING_SELLER_ACTION' ? (
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => handleAcceptProRata(disp.id)}
                            className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-quicksand text-xs font-bold text-left transition"
                          >
                            <span className="block text-emerald-800 mb-0.5">Option 1: Accept 10% Credit</span>
                            <span className="text-[11px] text-emerald-700 font-normal">
                              Release partial ₹9,200 discount. Remaining ₹82,800 immediately released to your bank.
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSubmitEvidence(disp.id)}
                            className="p-3.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-950 font-quicksand text-xs font-bold text-left transition"
                          >
                            <span className="block text-blue-800 mb-0.5">Option 2: Submit Dispatch QA Video</span>
                            <span className="text-[11px] text-blue-700 font-normal">
                              Upload warehouse packing barcode footage to prove seal integrity at pickup.
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestFieldInspection(disp.id)}
                            className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 font-quicksand text-xs font-bold text-left transition"
                          >
                            <span className="block text-slate-800 mb-0.5">Option 3: Request Field Agent</span>
                            <span className="text-[11px] text-slate-600 font-normal">
                              Dispatch third-party StockBridge auditor to buyer hub for independent count.
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
                          ✓ Action submitted. Arbitration desk review in progress.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 6: BUSINESS KYC & BANK DETAILS                         */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="type-little text-slate-950 font-quicksand font-bold">
                  Enterprise Profile & Settlement Settings
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-quicksand mt-0.5">
                  Verified GSTIN compliance documents and your bank account for automated escrow payouts.
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
                      <dd className="font-semibold text-slate-800">{profile.organisation?.orgType || 'MANUFACTURER'}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">GSTIN / Tax ID:</dt>
                      <dd className="font-mono font-bold text-slate-900">{profile.organisation?.gstNumber || '24AAACA1234A1Z5'}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Registered Dispatch Office:</dt>
                      <dd className="text-right text-slate-800 font-medium">
                        {profile.organisation?.addressLine || 'Plot 88, GIDC Industrial Estate'},<br />
                        {profile.organisation?.city || 'Surat'}, {profile.organisation?.state || 'Gujarat'} - {profile.organisation?.pinCode || '395002'}
                      </dd>
                    </div>
                    <div className="flex justify-between pt-1">
                      <dt className="text-slate-500">Verification Status:</dt>
                      <dd className="font-mono font-bold text-emerald-700">
                        ✓ APPROVED & GST VERIFIED
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Settlement Bank Details Card (100% Critical for Seller) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Escrow Payout Settlement Account
                      </h3>
                      <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                        Funds from completed orders auto-credit to this corporate bank account.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      ✓ ACTIVE
                    </span>
                  </div>

                  <dl className="space-y-3 text-sm font-quicksand">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Beneficiary Name:</dt>
                      <dd className="font-bold text-slate-900">{bankDetails.accountHolder}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Bank Name:</dt>
                      <dd className="font-bold text-slate-900">{bankDetails.bankName}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">Corporate Account:</dt>
                      <dd className="font-mono font-bold text-slate-900">{bankDetails.accountNumber}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">IFSC Code:</dt>
                      <dd className="font-mono font-bold text-slate-900">{bankDetails.ifscCode}</dd>
                    </div>
                    <div className="flex justify-between pt-1">
                      <dt className="text-slate-500">Settlement Cycle:</dt>
                      <dd className="font-mono text-emerald-700 font-bold">
                        T+1 Automated NEFT / RTGS
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBankForm(bankDetails);
                        setBankModalOpen(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold font-quicksand transition shadow-2xs"
                    >
                      ✏️ Update Settlement Bank Account
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: SINGLE SURPLUS LOT CREATION MODAL                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      {createLotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="type-sub text-slate-950 font-quicksand font-bold">
                  List New Surplus Inventory Lot
                </h3>
                <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                  Standardized 5-grade lot specification. Brand name can be masked for tier-1 protection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateLotOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Lot Title & Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combed Cotton Polo T-Shirts (Assorted Sizes & Colors)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] focus:ring-1 focus:ring-[#e65c00] outline-hidden font-quicksand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Product Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] focus:ring-1 focus:ring-[#e65c00] outline-hidden font-quicksand bg-white"
                  >
                    <option value="APPAREL">Apparel & Textiles</option>
                    <option value="FOOTWEAR">Footwear & Leather</option>
                    <option value="ELECTRONICS">Electronics & Appliances</option>
                    <option value="HARDWARE">Hardware & Industrial Parts</option>
                    <option value="FMCG">Packaged Goods (Non-Perishable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Standardized Grade *
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] focus:ring-1 focus:ring-[#e65c00] outline-hidden font-quicksand bg-white font-bold"
                  >
                    <option value="A">Grade A • Brand New / Factory Mint (100% Intact)</option>
                    <option value="B">Grade B • Surplus Overstock (Packaging Shelf-Worn)</option>
                    <option value="C">Grade C • Minor Box Damage / QC Seconds</option>
                    <option value="D">Grade D • Open-Box / Customer Return Inspected</option>
                    <option value="E">Grade E • Salvage / Component Harvesting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Total Units *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    MOQ (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newMoq}
                    onChange={(e) => setNewMoq(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Discount Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDiscountedPrice}
                    onChange={(e) => setNewDiscountedPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand font-bold text-[#e65c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Dispatch Warehouse Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhiwandi, Maharashtra or Tirupur, Tamil Nadu"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBrandMasked}
                    onChange={(e) => setNewBrandMasked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#e65c00] focus:ring-[#e65c00]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-quicksand">
                      Shield OEM Brand Identity (Brand Masking)
                    </span>
                    <p className="text-[11px] text-slate-500 font-quicksand mt-0.5">
                      Check this to prevent public brand dilution. The catalog shows specifications and grade, but obscures original labels from unverified retail shoppers.
                    </p>
                  </div>
                </label>
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

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: BULK CSV / EXCEL LOT IMPORTER                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      {bulkUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="type-sub text-slate-950 font-quicksand font-bold">
                  Bulk Surplus Inventory Importer (.CSV)
                </h3>
                <p className="text-xs text-slate-500 font-quicksand mt-0.5">
                  Upload multiple SKUs from your ERP / Excel spreadsheet in a single batch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBulkUploadOpen(false);
                  setBulkParsedLots([]);
                  setBulkError(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Step 1: Download Sample Template */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-orange-50/70 border border-orange-200 text-xs">
                <div>
                  <span className="font-bold text-orange-950 block font-quicksand">
                    Step 1: Download Standardized Bulk Template
                  </span>
                  <p className="text-orange-800 font-quicksand mt-0.5">
                    Pre-configured with columns: Title, Category, Grade (A-E), Units, MOQ, Original Price, Discount Price, Location, BrandMasked.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-2 rounded-lg bg-white border border-orange-300 text-[#e65c00] font-bold font-mono hover:bg-orange-100 transition whitespace-nowrap self-start sm:self-auto shadow-2xs"
                >
                  📥 Download Template (.CSV)
                </button>
              </div>

              {/* Step 2: Upload File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-2">
                  Step 2: Select Your Prepared CSV File
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#e65c00] transition cursor-pointer bg-slate-50">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#e65c00] file:text-white hover:file:bg-[#c44e00]"
                  />
                  {bulkFileName && (
                    <p className="mt-2 text-xs font-mono text-emerald-600 font-bold">
                      ✓ Loaded: {bulkFileName}
                    </p>
                  )}
                </div>
                {bulkError && (
                  <p className="text-xs text-rose-600 font-mono mt-2">
                    ⚠️ {bulkError}
                  </p>
                )}
              </div>

              {/* Step 3: Preview Parsed Lots */}
              {bulkParsedLots.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 font-quicksand">
                      Step 3: Preview Valid Lots ({bulkParsedLots.length} detected)
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">
                      ✓ All grades & prices validated
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs font-quicksand">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase sticky top-0">
                        <tr>
                          <th className="p-2.5">Grade</th>
                          <th className="p-2.5">Title</th>
                          <th className="p-2.5">Units</th>
                          <th className="p-2.5">MOQ</th>
                          <th className="p-2.5">Recovery ₹</th>
                          <th className="p-2.5">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkParsedLots.map((lot, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-bold text-slate-900">
                              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white text-[10px]">
                                Grade {lot.grade}
                              </span>
                            </td>
                            <td className="p-2.5 font-bold text-slate-900 line-clamp-1 max-w-[200px]">{lot.title}</td>
                            <td className="p-2.5 font-mono">{lot.units}</td>
                            <td className="p-2.5 font-mono">{lot.moq}</td>
                            <td className="p-2.5 font-mono font-bold text-[#e65c00]">₹{lot.discountedPrice}</td>
                            <td className="p-2.5 text-slate-500">{lot.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBulkUploadOpen(false);
                    setBulkParsedLots([]);
                    setBulkError(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 font-quicksand"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={bulkParsedLots.length === 0}
                  onClick={handleConfirmBulkImport}
                  className="px-5 py-2.5 rounded-lg bg-[#e65c00] disabled:bg-slate-300 text-white text-xs font-bold font-quicksand hover:bg-[#c44e00] transition shadow-sm"
                >
                  Import {bulkParsedLots.length} Lots to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: FREE OPENSTREETMAP BUYER HUB & TRANSIT VIEWER       */}
      {/* ════════════════════════════════════════════════════════════ */}
      {selectedBuyerLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  OpenStreetMap Verified Business Facility
                </span>
                <h3 className="type-sub text-slate-950 font-quicksand font-bold mt-1">
                  {selectedBuyerLocation.buyerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBuyerLocation(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Address & GST Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-quicksand space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Commercial Warehouse Address:</span>
                  <span className="font-mono text-slate-500">GSTIN: {selectedBuyerLocation.gstin}</span>
                </div>
                <p className="text-slate-700">
                  {selectedBuyerLocation.address}
                </p>
              </div>

              {/* Free OpenStreetMap Interactive Frame */}
              <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                <iframe
                  title="Buyer Location OpenStreetMap"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedBuyerLocation.lon - 0.035}%2C${selectedBuyerLocation.lat - 0.025}%2C${selectedBuyerLocation.lon + 0.035}%2C${selectedBuyerLocation.lat + 0.025}&layer=mapnik&marker=${selectedBuyerLocation.lat}%2C${selectedBuyerLocation.lon}`}
                />
              </div>

              {/* Freight Logistics & Tax Intel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-quicksand">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Road Distance</span>
                  <span className="font-black text-slate-950 font-mono text-sm mt-0.5 block">
                    ~{selectedBuyerLocation.transitKm} km
                  </span>
                  <span className="text-[11px] text-slate-500">via National Highway Corridor</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Freight Carrier ETA</span>
                  <span className="font-black text-emerald-700 font-mono text-sm mt-0.5 block">
                    {selectedBuyerLocation.estimatedDays}
                  </span>
                  <span className="text-[11px] text-slate-500">BlueDart / TCI Freight</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">GST Treatment</span>
                  <span className="font-black text-slate-950 font-mono text-sm mt-0.5 block">
                    {selectedBuyerLocation.taxType === 'INTRASTATE_CGST_SGST' ? 'Intrastate' : 'Interstate'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {selectedBuyerLocation.taxType === 'INTRASTATE_CGST_SGST' ? 'CGST (9%) + SGST (9%)' : 'IGST (18%)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selectedBuyerLocation.lat}&mlon=${selectedBuyerLocation.lon}#map=14/${selectedBuyerLocation.lat}/${selectedBuyerLocation.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-[#e65c00] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in Full OpenStreetMap.org ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedBuyerLocation(null)}
                  className="px-4 py-2 rounded-lg bg-slate-950 text-white font-quicksand font-bold text-xs hover:bg-slate-800 transition"
                >
                  Close Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 4: COUNTER-OFFER RATE MODAL                            */}
      {/* ════════════════════════════════════════════════════════════ */}
      {counterModalOpen && activeOfferForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h3 className="type-sub text-slate-950 font-quicksand font-bold">
              Submit Counter-Offer
            </h3>
            <p className="text-xs text-slate-500 font-quicksand mt-0.5">
              Propose a revised rate per unit to <strong>{activeOfferForCounter.buyerName}</strong>.
            </p>

            <form onSubmit={handleSendCounterOffer} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-quicksand space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lot:</span>
                  <span className="font-bold text-slate-900">{activeOfferForCounter.lotTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-slate-900">{activeOfferForCounter.quantityRequested} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Listed Asking Price:</span>
                  <span className="font-mono text-slate-600">₹{activeOfferForCounter.listedPricePerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer Proposed Rate:</span>
                  <span className="font-mono font-bold text-rose-600">₹{activeOfferForCounter.offeredPricePerUnit}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Your Counter-Price Per Unit (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold font-mono text-[#e65c00] focus:border-[#e65c00] outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-quicksand">
                  Net deal value at this rate: ₹{(Number(counterPriceInput || 0) * activeOfferForCounter.quantityRequested).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCounterModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 font-quicksand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-orange-600 text-white text-xs font-bold font-quicksand hover:bg-orange-700 transition shadow-sm"
                >
                  Send Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 5: UPDATE SETTLEMENT BANK ACCOUNT                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h3 className="type-sub text-slate-950 font-quicksand font-bold">
              Update Escrow Settlement Bank Account
            </h3>
            <p className="text-xs text-slate-500 font-quicksand mt-0.5">
              Escrow funds auto-transfer here once buyer finishes 48h physical lot inspection.
            </p>

            <form onSubmit={handleSaveBankDetails} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Corporate Beneficiary Name *
                </label>
                <input
                  type="text"
                  required
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.bankName}
                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#e65c00] outline-hidden font-quicksand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.ifscCode}
                    onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#e65c00] outline-hidden uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-quicksand mb-1">
                  Corporate Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#e65c00] outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-quicksand text-emerald-800">
                🔒 Bank credentials undergo instant automated penny-drop validation before activating payout routing.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBankModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 font-quicksand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#e65c00] text-white text-xs font-bold font-quicksand hover:bg-[#c44e00] transition shadow-sm"
                >
                  Save & Verify Bank Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
