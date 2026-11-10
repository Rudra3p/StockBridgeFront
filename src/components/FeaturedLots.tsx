import React from 'react';
import Link from 'next/link';

interface LotItem {
  id: string;
  title: string;
  category: string;
  grade: 'A' | 'B' | 'C' | 'D';
  gradeName: string;
  gradeBadgeColor: string;
  gradeBadgeBg: string;
  originalPrice: number;
  discountedPrice: number;
  unit: string;
  totalQuantity: number;
  moq: number;
  location: string;
  brandHidden: boolean;
  reasonForSurplus: string;
}

const SAMPLE_LOTS: LotItem[] = [
  {
    id: 'lot-apparel-01',
    title: "Men's Combed Cotton Polo T-Shirts (Assorted Solid Colors)",
    category: 'APPAREL',
    grade: 'A',
    gradeName: 'New, Current',
    gradeBadgeColor: 'text-emerald-700 border-emerald-300',
    gradeBadgeBg: 'bg-emerald-50',
    originalPrice: 850,
    discountedPrice: 320,
    unit: 'PCS',
    totalQuantity: 1200,
    moq: 120,
    location: 'Tirupur, Tamil Nadu',
    brandHidden: true,
    reasonForSurplus: 'Export Order Cancellation',
  },
  {
    id: 'lot-footwear-02',
    title: "Women's Lightweight Athletic Running Shoes (Assorted Sizes UK 4-8)",
    category: 'FOOTWEAR',
    grade: 'B',
    gradeName: 'New, Outdated',
    gradeBadgeColor: 'text-blue-700 border-blue-300',
    gradeBadgeBg: 'bg-blue-50',
    originalPrice: 1999,
    discountedPrice: 650,
    unit: 'PAIRS',
    totalQuantity: 576,
    moq: 48,
    location: 'Agra, Uttar Pradesh',
    brandHidden: false,
    reasonForSurplus: 'Previous Season Colourway',
  },
  {
    id: 'lot-hardware-03',
    title: 'Industrial Heavy Duty Brass Ball Valves (1/2" & 3/4" BSP)',
    category: 'HARDWARE',
    grade: 'A',
    gradeName: 'New, Current',
    gradeBadgeColor: 'text-emerald-700 border-emerald-300',
    gradeBadgeBg: 'bg-emerald-50',
    originalPrice: 420,
    discountedPrice: 195,
    unit: 'UNITS',
    totalQuantity: 2500,
    moq: 250,
    location: 'Jamnagar, Gujarat',
    brandHidden: false,
    reasonForSurplus: 'Over-production Run',
  },
  {
    id: 'lot-elec-04',
    title: 'Smart LED Slim Panel Ceiling Lights 18W (Outer Box Dents)',
    category: 'ELECTRONICS',
    grade: 'C',
    gradeName: 'Box Damage',
    gradeBadgeColor: 'text-amber-700 border-amber-300',
    gradeBadgeBg: 'bg-amber-50',
    originalPrice: 650,
    discountedPrice: 240,
    unit: 'PCS',
    totalQuantity: 800,
    moq: 80,
    location: 'Bengaluru, Karnataka',
    brandHidden: true,
    reasonForSurplus: 'Transit Carton Crushed (Units Tested)',
  },
];

export default function FeaturedLots() {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Live Verified Marketplace
          </span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Recently Listed Graded Lots
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Real surplus inventories from verified manufacturers and distributors ready for bulk dispatch.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition"
        >
          View all active lots & filter by MOQ →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SAMPLE_LOTS.map((lot) => {
          const discountPercent = Math.round(
            ((lot.originalPrice - lot.discountedPrice) / lot.originalPrice) * 100
          );

          return (
            <div
              key={lot.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${lot.gradeBadgeBg} ${lot.gradeBadgeColor}`}>
                    Grade {lot.grade} • {lot.gradeName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {lot.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                  {lot.title}
                </h4>

                {/* Reason tag */}
                <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <span className="text-slate-400">Reason:</span>
                  <span className="font-medium text-slate-700 truncate">{lot.reasonForSurplus}</span>
                </div>

                {/* Pricing Box */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatINR(lot.discountedPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatINR(lot.originalPrice)}
                    </span>
                    <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Price per {lot.unit.toLowerCase()} • Excl. GST
                  </span>
                </div>

                {/* Lot Quantities & MOQ */}
                <div className="mt-3.5 space-y-1 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Lot Volume:</span>
                    <span className="font-semibold text-slate-800">{lot.totalQuantity.toLocaleString()} {lot.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min. Order (MOQ):</span>
                    <span className="font-semibold text-slate-800">{lot.moq} {lot.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-700 truncate">{lot.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {lot.brandHidden ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium" title="Brand protected by seller confidentiality rule">
                    🔒 Brand Discretion
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    ✓ Verified Dispatch
                  </span>
                )}

                <Link
                  href="/register"
                  className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-emerald-700 transition"
                >
                  Make Offer →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
