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
  imageUrl: string;
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
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
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
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-quicksand">
            Recently Listed Graded Lots
          </h3>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#e65c00] hover:text-[#c44e00] transition font-quicksand"
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
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Product Image Box (~45% of card visual weight) with Badges */}
                <div className="relative w-full h-52 sm:h-56 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-md ${lot.gradeBadgeBg} ${lot.gradeBadgeColor}`}>
                      Grade {lot.grade} • {lot.gradeName}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded shadow-sm uppercase tracking-wider font-mono">
                      {lot.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                    <span className="text-xs font-bold text-white bg-[#e65c00] px-2 py-0.5 rounded shadow-md font-mono">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-3.5 sm:p-4">
                  {/* Title */}
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {lot.title}
                  </h4>

                  {/* Pricing Box: Discounted in Orange #e65c00, Original Muted (No Orange) */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-[#e65c00] font-mono">
                        {formatINR(lot.discountedPrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-semibold font-mono">
                        {formatINR(lot.originalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-quicksand truncate">
                      per {lot.unit.toLowerCase()} • Excl. GST
                    </span>
                  </div>

                  {/* Compressed Specifications Grid: Volume, MOQ, Location */}
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-quicksand space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Volume:</span>
                        <span className="font-bold text-slate-800 font-mono">{lot.totalQuantity.toLocaleString()} {lot.unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">MOQ:</span>
                        <span className="font-bold text-slate-800 font-mono">{lot.moq} {lot.unit}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[170px]">{lot.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
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
                  className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-[#e65c00] transition font-quicksand"
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
