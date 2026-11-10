'use client';

import Link from 'next/link';
import LogisticsDeliveryAnimation from './LogisticsDeliveryAnimation';

export default function HeroSection() {
  return (
    <section className="relative w-full border-b border-canvas bg-canvas py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
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
          <h1 className="type-main text-main font-quicksand font-bold">
            Where{' '}
            <span className="text-accent transition-colors duration-200">
              Factory Surplus
            </span>{' '}
            Meets Direct Volume Liquidity.
          </h1>

          {/* Action CTAs - Increased gap from heading */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-7 py-4 text-base font-bold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 font-quicksand"
            >
              Register Business (Sell or Buy)
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="#marketplace"
              className="inline-flex items-center justify-center rounded-xl border border-canvas bg-canvas px-7 py-4 text-base font-bold text-main shadow-xs transition hover:bg-canvas-subtle font-quicksand"
            >
              Browse Graded Lots
            </Link>
          </div>

          {/* Trust Anchors Strip - Increased gap from buttons */}
          <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-canvas grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block font-quicksand">
                Verification
              </span>
              <span className="text-xs font-bold text-main mt-0.5 block font-quicksand">
                GSTIN & KYC Verified
              </span>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block font-quicksand">
                Condition Standard
              </span>
              <span className="text-xs font-bold text-main mt-0.5 block font-quicksand">
                5-Grade Yardstick (A–E)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block font-quicksand">
                Payment Safety
              </span>
              <span className="text-xs font-bold text-main mt-0.5 block font-quicksand">
                Pre-funded Escrow
              </span>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block font-quicksand">
                Channel Protection
              </span>
              <span className="text-xs font-bold text-main mt-0.5 block font-quicksand">
                Masked & Geo-fenced
              </span>
            </div>
          </div>

        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN: CENTERED SQUARE LOGISTICS ANIMATION      */}
        {/* (No border outside square, pure orange accent, 4 phases) */}
        {/* ====================================================== */}
        <div className="w-full flex items-center justify-center">
          <LogisticsDeliveryAnimation />
        </div>

      </div>
    </section>
  );
}
