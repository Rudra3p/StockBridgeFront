'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface GradeInfo {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  badgeColor: string;
  badgeBg: string;
  discountRange: string;
  definition: string;
  packagingCondition: string;
  defectTolerance: string;
  idealBuyer: string;
}

const GRADES: GradeInfo[] = [
  {
    grade: 'A',
    name: 'New, Current Line',
    badgeColor: 'text-emerald-700 border-emerald-300',
    badgeBg: 'bg-emerald-50',
    discountRange: '10% – 25% below wholesale',
    definition: 'Brand new, unused, factory-sealed original packaging, current season design with all accessories and intact tags. Excess purely from over-ordering or cancellations.',
    packagingCondition: 'Original factory sealed; pristine master cartons',
    defectTolerance: 'Zero defects. 100% first-quality retail ready.',
    idealBuyer: 'Boutiques, mainstream retail stores, multi-brand outlets.',
  },
  {
    grade: 'B',
    name: 'New, Outdated / Previous Season',
    badgeColor: 'text-blue-700 border-blue-300',
    badgeBg: 'bg-blue-50',
    discountRange: '25% – 45% below wholesale',
    definition: 'Brand new and factory-sealed, but discontinued SKU, previous-season colourway, or superseded packaging. No functional or cosmetic defects.',
    packagingCondition: 'Original sealed cartons; old branding or model codes',
    defectTolerance: 'Zero functional defects. Unused and mint condition.',
    idealBuyer: 'Value retailers, online marketplace sellers, discount department stores.',
  },
  {
    grade: 'C',
    name: 'New, Packaging Damage',
    badgeColor: 'text-amber-700 border-amber-300',
    badgeBg: 'bg-amber-50',
    discountRange: '40% – 60% below wholesale',
    definition: 'New and completely unused items, but outer master cartons or individual retail boxes are dented, crushed, or missing. Products inside are 100% complete.',
    packagingCondition: 'Dented, torn, or re-boxed in plain brown cartons',
    defectTolerance: 'Product itself is undamaged and fully functional.',
    idealBuyer: 'Local neighbourhood retailers, unbox sellers, bazaar traders.',
  },
  {
    grade: 'D',
    name: 'Open-Box / Minor Cosmetic',
    badgeColor: 'text-orange-700 border-orange-300',
    badgeBg: 'bg-orange-50',
    discountRange: '55% – 75% below wholesale',
    definition: 'Unsealed, customer inspection returns, showroom display units, or items with minor cosmetic imperfections clearly photographed and disclosed.',
    packagingCondition: 'Open box, repackaged, or unboxed palletized lots',
    defectTolerance: 'Minor cosmetic marks; full testing verified.',
    idealBuyer: 'Refurbishers, thrift outlets, clearance liquidators.',
  },
  {
    grade: 'E',
    name: 'As-Is / Industrial Salvage',
    badgeColor: 'text-purple-700 border-purple-300',
    badgeBg: 'bg-purple-50',
    discountRange: '70%+ below wholesale',
    definition: 'Untested, mixed condition batches, customer return pallets, or excess raw manufacturing materials. Sold strictly for scrap, rework, or component harvesting.',
    packagingCondition: 'Bulk gaylord boxes, raw pallets, uncounted bulk',
    defectTolerance: 'No guarantees beyond verified carton count or net weight.',
    idealBuyer: 'Recyclers, industrial rework shops, parts salvagers.',
  },
];

export default function GradeScaleExplorer() {
  const [selectedGrade, setSelectedGrade] = useState<GradeInfo>(GRADES[0]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
          Trust Architecture • Section 7.2
        </span>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          The 5-Grade Standardized Lot Scale
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Eliminate guesswork and informal WhatsApp disputes. Every lot listed on StockBridge is certified and inspected against a shared 5-tier yardstick.
        </p>
      </div>

      {/* Grade Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {GRADES.map((item) => {
          const isSelected = selectedGrade.grade === item.grade;
          return (
            <button
              key={item.grade}
              type="button"
              onClick={() => setSelectedGrade(item)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`h-5 w-5 rounded-md flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-white/20 text-white' : item.badgeBg + ' ' + item.badgeColor}`}>
                {item.grade}
              </span>
              <span>{item.name.split(',')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Grade Deep-Dive Card */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <span className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-2xl border ${selectedGrade.badgeBg} ${selectedGrade.badgeColor}`}>
              {selectedGrade.grade}
            </span>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{selectedGrade.name}</h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Typical pricing: {selectedGrade.discountRange}
              </span>
            </div>
          </div>

          <Link
            href="/grade-guide"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 self-start sm:self-auto"
          >
            View full photo standards manual →
          </Link>
        </div>

        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
          {selectedGrade.definition}
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">Packaging Requirement</span>
            <span className="mt-1 font-semibold text-slate-800 block">{selectedGrade.packagingCondition}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">Defect Tolerance</span>
            <span className="mt-1 font-semibold text-slate-800 block">{selectedGrade.defectTolerance}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">Ideal Buyer Channel</span>
            <span className="mt-1 font-semibold text-slate-800 block">{selectedGrade.idealBuyer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
