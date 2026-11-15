'use client';

import React from 'react';
import Link from 'next/link';

interface GradeItem {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  code: string;
  name: string;
  discount: string;
  oneLiner: string;
  tolerance: string;
  packaging: string;
  buyer: string;
  image: string;
  imageAlt: string;
}

const GRADES_DATA: GradeItem[] = [
  {
    grade: 'A',
    code: 'SPEC // 01-A',
    name: 'New, Current Line',
    discount: '10% – 25% BELOW WHOLESALE',
    oneLiner: 'Factory-sealed master cartons. 100% first-quality retail ready. Direct surplus from order cancellations or over-runs.',
    tolerance: 'Zero defects. Pristine retail mint.',
    packaging: 'Factory sealed master cartons',
    buyer: 'Boutiques & mainstream retail outlets',
    image: '/images/grades/grade-a.jpg',
    imageAlt: 'Pristine factory-sealed warehouse pallet inventory',
  },
  {
    grade: 'B',
    code: 'SPEC // 02-B',
    name: 'New, Outdated Season',
    discount: '25% – 45% BELOW WHOLESALE',
    oneLiner: 'Factory-sealed inventory from discontinued SKUs, previous colourways, or superseded packaging. Zero functional defects.',
    tolerance: 'Zero functional or cosmetic flaws.',
    packaging: 'Original sealed cartons; older model codes',
    buyer: 'Value retailers & online marketplace sellers',
    image: '/images/grades/grade-b.jpg',
    imageAlt: 'Overstock sealed inventory in warehouse racking',
  },
  {
    grade: 'C',
    code: 'SPEC // 03-C',
    name: 'Packaging Damage',
    discount: '40% – 60% BELOW WHOLESALE',
    oneLiner: 'Crushed, dented, or torn outer master cartons. Products inside are 100% complete, undamaged, and factory-tested.',
    tolerance: 'Outer packaging only. Product is 100% mint.',
    packaging: 'Dented, torn, or plain re-boxed cartons',
    buyer: 'Local bazaar traders & unbox retailers',
    image: '/images/grades/grade-c.jpg',
    imageAlt: 'Outer carton package with crushed corner or dented edges',
  },
  {
    grade: 'D',
    code: 'SPEC // 04-D',
    name: 'Open-Box / Minor Cosmetic',
    discount: '55% – 75% BELOW WHOLESALE',
    oneLiner: 'Showroom display units and customer returns. Fully inspected and verified functional with minor cosmetic marks disclosed.',
    tolerance: 'Minor cosmetic blemishes; 100% tested.',
    packaging: 'Open-box, repackaged, or palletized loose',
    buyer: 'Refurbishers & clearance liquidators',
    image: '/images/grades/grade-d.jpg',
    imageAlt: 'Warehouse technician inspecting open-box stock with scanner',
  },
  {
    grade: 'E',
    code: 'SPEC // 05-E',
    name: 'As-Is / Industrial Salvage',
    discount: '70%+ AS-IS RECOVERY',
    oneLiner: 'Untested bulk gaylords, raw pallets, and excess manufacturing stock sold strictly for scrap, parts, or component rework.',
    tolerance: 'Untested raw bulk. Verified weight only.',
    packaging: 'Raw gaylord bulk bins & mixed pallets',
    buyer: 'Recyclers & industrial salvagers',
    image: '/images/grades/grade-e.jpg',
    imageAlt: 'Industrial scrap and mixed salvage inventory bins',
  },
];

export default function GradeScaleExplorer() {
  const gradeA = GRADES_DATA[0];
  const gradeB = GRADES_DATA[1];
  const gradeC = GRADES_DATA[2];
  const gradeD = GRADES_DATA[3];
  const gradeE = GRADES_DATA[4];

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#e65c00]" />
            Trust Architecture • Section 7.2
          </div>
          <h2 className="type-sub text-slate-950 font-quicksand font-bold tracking-tight">
            The 5-Grade Standardized Lot Scale
          </h2>
          <p className="type-body text-slate-600 mt-2 max-w-2xl font-quicksand">
            Physical condition yardsticks. Every lot is verified against strict inspection criteria to eliminate WhatsApp surprises, lowball offers, and return disputes.
          </p>
        </div>

        <Link
          href="/grade-guide"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e65c00] hover:text-[#c44e00] transition self-start md:self-end font-mono"
        >
          <span>Inspection Manual</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* UNEVEN ASYMMETRIC GRID (Agency & Real Business Aesthetic) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* GRADE A (Primary Flagship / Hero Anchor Card: 7 Cols)    */}
        {/* ======================================================== */}
        <div className="group lg:col-span-7 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row">
          {/* Real Photo with Technical Overlay */}
          <div className="sm:w-1/2 relative bg-slate-900 overflow-hidden min-h-[220px] sm:min-h-[300px]">
            <img
              src={gradeA.image}
              alt={gradeA.imageAlt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/30" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
              {gradeA.code}
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 block">
                Condition Standard
              </span>
              <span className="text-xs font-semibold">100% Factory Sealed</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="sm:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-950 text-white font-black text-xl font-quicksand shadow-sm">
                  {gradeA.grade}
                </span>
                <span className="text-[11px] font-bold font-mono text-[#e65c00] bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                  {gradeA.discount}
                </span>
              </div>

              <h3 className="type-little text-slate-950 font-quicksand font-bold">
                {gradeA.name}
              </h3>

              <p className="type-body text-slate-600 mt-2 text-sm leading-relaxed font-quicksand">
                {gradeA.oneLiner}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Defect</span>
                <span className="font-medium text-slate-900">{gradeA.tolerance}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Packaging</span>
                <span className="font-medium text-slate-900">{gradeA.packaging}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Channel</span>
                <span className="font-medium text-slate-900">{gradeA.buyer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRADE B (Offset Secondary Anchor: 5 Cols, Staggered)      */}
        {/* ======================================================== */}
        <div className="group lg:col-span-5 lg:translate-y-2 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col">
          {/* Real Photo (Landscape orientation) */}
          <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
            <img
              src={gradeB.image}
              alt={gradeB.imageAlt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
              {gradeB.code}
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 block">
                Condition Standard
              </span>
              <span className="text-xs font-semibold">Superseded / Overstock</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800 text-white font-black text-lg font-quicksand">
                  {gradeB.grade}
                </span>
                <span className="text-[11px] font-bold font-mono text-[#e65c00] bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                  {gradeB.discount}
                </span>
              </div>

              <h3 className="type-little text-slate-950 font-quicksand font-bold">
                {gradeB.name}
              </h3>

              <p className="type-body text-slate-600 mt-2 text-sm leading-relaxed font-quicksand">
                {gradeB.oneLiner}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Defect</span>
                <span className="font-medium text-slate-900">{gradeB.tolerance}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Packaging</span>
                <span className="font-medium text-slate-900">{gradeB.packaging}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Channel</span>
                <span className="font-medium text-slate-900">{gradeB.buyer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRADE C (Packaging Damage: 4 Cols, Compact Frame)        */}
        {/* ======================================================== */}
        <div className="group lg:col-span-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col">
          {/* Photo showing dented box */}
          <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
            <img
              src={gradeC.image}
              alt={gradeC.imageAlt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
              {gradeC.code}
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 block">
                Condition Standard
              </span>
              <span className="text-xs font-semibold">Box Dents / Mint Inside</span>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-amber-700 text-white font-black text-lg font-quicksand">
                  {gradeC.grade}
                </span>
                <span className="text-[11px] font-bold font-mono text-[#e65c00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {gradeC.discount}
                </span>
              </div>

              <h3 className="type-little text-slate-950 font-quicksand font-bold">
                {gradeC.name}
              </h3>

              <p className="type-body text-slate-600 mt-2 text-sm leading-relaxed font-quicksand">
                {gradeC.oneLiner}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Defect</span>
                <span className="font-medium text-slate-900">{gradeC.tolerance}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Packaging</span>
                <span className="font-medium text-slate-900">{gradeC.packaging}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Channel</span>
                <span className="font-medium text-slate-900">{gradeC.buyer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRADE D (Open-Box & Tested: 4 Cols, Vertical Rhythm)     */}
        {/* ======================================================== */}
        <div className="group lg:col-span-4 lg:-translate-y-1 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col">
          {/* Photo showing open box technician inspection */}
          <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
            <img
              src={gradeD.image}
              alt={gradeD.imageAlt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
              {gradeD.code}
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 block">
                Condition Standard
              </span>
              <span className="text-xs font-semibold">Inspected & Tested</span>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-orange-700 text-white font-black text-lg font-quicksand">
                  {gradeD.grade}
                </span>
                <span className="text-[11px] font-bold font-mono text-[#e65c00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {gradeD.discount}
                </span>
              </div>

              <h3 className="type-little text-slate-950 font-quicksand font-bold">
                {gradeD.name}
              </h3>

              <p className="type-body text-slate-600 mt-2 text-sm leading-relaxed font-quicksand">
                {gradeD.oneLiner}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Defect</span>
                <span className="font-medium text-slate-900">{gradeD.tolerance}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Packaging</span>
                <span className="font-medium text-slate-900">{gradeD.packaging}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-700">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Channel</span>
                <span className="font-medium text-slate-900">{gradeD.buyer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRADE E (Industrial Salvage: 4 Cols, Dark Contrast)      */}
        {/* ======================================================== */}
        <div className="group lg:col-span-4 lg:translate-y-2 rounded-xl border border-slate-900 bg-slate-950 text-white overflow-hidden shadow-sm hover:border-slate-700 hover:shadow-md transition-all duration-300 flex flex-col">
          {/* Photo showing salvage raw pallet */}
          <div className="relative w-full h-44 bg-black overflow-hidden">
            <img
              src={gradeE.image}
              alt={gradeE.imageAlt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
              {gradeE.code}
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                Condition Standard
              </span>
              <span className="text-xs font-semibold">Bulk As-Is / Salvage</span>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-white text-slate-950 font-black text-lg font-quicksand">
                  {gradeE.grade}
                </span>
                <span className="text-[11px] font-bold font-mono text-[#e65c00] bg-orange-950/60 px-2 py-0.5 rounded border border-orange-900">
                  {gradeE.discount}
                </span>
              </div>

              <h3 className="type-little text-white font-quicksand font-bold">
                {gradeE.name}
              </h3>

              <p className="type-body text-slate-400 mt-2 text-sm leading-relaxed font-quicksand">
                {gradeE.oneLiner}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between text-slate-300">
                <span className="font-mono text-slate-500 uppercase text-[10px]">Defect</span>
                <span className="font-medium text-slate-200">{gradeE.tolerance}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-300">
                <span className="font-mono text-slate-500 uppercase text-[10px]">Packaging</span>
                <span className="font-medium text-slate-200">{gradeE.packaging}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-300">
                <span className="font-mono text-slate-500 uppercase text-[10px]">Channel</span>
                <span className="font-medium text-slate-200">{gradeE.buyer}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
