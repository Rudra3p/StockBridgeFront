'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* ======================================================== */}
      {/* 2-COLUMN HERO (60 : 40 RATIO ON DESKTOP, STACKED MOBILE) */}
      {/* Desktop: Left (60%) = Heading + CTAs + Trust anchors      */}
      {/*          Right (40%) = Clean Gray Canvas Block           */}
      {/* Mobile:  Top = Heading + CTAs, Bottom = Gray Block       */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12 items-center">
        
        {/* ====================================================== */}
        {/* LEFT COLUMN: PURE HEADING + CTAs + TRUST ANCHORS       */}
        {/* (No AI pill on top, No paragraph)                      */}
        {/* ====================================================== */}
        <div className="flex flex-col justify-center text-left">
          
          {/* MAIN HEADING - Golden Ratio Main (54px desktop / 34px mobile) Quicksand Bold */}
          <h1 className="type-main text-slate-900 font-quicksand font-bold">
            Where{' '}
            <span className="text-emerald-700">
              Factory Surplus
            </span>{' '}
            Meets Direct Volume Liquidity.
          </h1>

          {/* Action CTAs - Increased gap from heading */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 font-quicksand"
            >
              Register Business (Sell or Buy)
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="#marketplace"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 font-quicksand"
            >
              Browse Graded Lots
            </Link>
          </div>

          {/* Trust Anchors Strip - Increased gap from buttons */}
          <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-quicksand">
                Verification
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block font-quicksand">
                GSTIN & KYC Verified
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-quicksand">
                Condition Standard
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block font-quicksand">
                5-Grade Yardstick (A–E)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-quicksand">
                Payment Safety
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block font-quicksand">
                Pre-funded Escrow
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-quicksand">
                Channel Protection
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block font-quicksand">
                Masked & Geo-fenced
              </span>
            </div>
          </div>

        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN: CLEAN GRAY CANVAS BLOCK                 */}
        {/* (Pure gray canvas, no animation, ready for future)    */}
        {/* ====================================================== */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full min-h-[380px] lg:min-h-[440px] rounded-2xl bg-slate-200/80 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative overflow-hidden group hover:border-slate-400">
            {/* Subtle architectural corner markers */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-400 tracking-wider">
              ┌ CANVAS_BLOCK_RIGHT
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-400 tracking-wider">
              40% SPLIT ┐
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] text-slate-400 tracking-wider">
              └ RATIO: 60:40
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[10px] text-slate-400 tracking-wider">
              READY ┘
            </div>

            {/* Center Canvas Icon & Notice */}
            <div className="flex flex-col items-center justify-center max-w-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-300/80 flex items-center justify-center text-slate-500">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-700 font-quicksand">
                  Right-Side Canvas Block
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-quicksand font-normal leading-relaxed">
                  Clean gray canvas reserved for your future custom visual, interactive prototype, or product graphic.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-300/70 text-slate-700 font-mono text-[11px] font-semibold">
                <span>Blank Canvas • 60:40 Ratio Locked</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
