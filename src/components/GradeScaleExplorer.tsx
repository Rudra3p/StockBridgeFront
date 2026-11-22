'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─── Grade Data ─────────────────────────────────────────────────── */
const GRADES = [
  {
    grade: 'A',
    code: 'SPEC // 01-A',
    name: 'New, Current Line',
    discount: '10% – 25% BELOW WHOLESALE',
    oneLiner:
      'Factory-sealed master cartons. 100% first-quality retail ready. Surplus exclusively from order cancellations or over-runs.',
    tolerance: 'Zero defects. Pristine retail mint.',
    packaging: 'Factory sealed master cartons',
    buyer: 'Boutiques & mainstream retail outlets',
    image: '/images/grades/grade-a.jpg',
    widthClass: 'w-[440px] sm:w-[500px]',
    isDark: false,
  },
  {
    grade: 'B',
    code: 'SPEC // 02-B',
    name: 'New, Outdated Season',
    discount: '25% – 45% BELOW WHOLESALE',
    oneLiner:
      'Brand new, factory-sealed discontinued SKUs or previous colourways. Superseded packaging with zero functional or cosmetic flaws.',
    tolerance: 'Zero functional or cosmetic flaws.',
    packaging: 'Original sealed cartons; older SKU codes',
    buyer: 'Value retailers & online marketplace sellers',
    image: '/images/grades/grade-b.jpg',
    widthClass: 'w-[420px] sm:w-[460px]',
    isDark: false,
  },
  {
    grade: 'C',
    code: 'SPEC // 03-C',
    name: 'Packaging Damage',
    discount: '40% – 60% BELOW WHOLESALE',
    oneLiner:
      'Dented, crushed, or torn outer master cartons. Products inside are 100% complete, undamaged, and factory-tested.',
    tolerance: 'Outer carton only. Product is 100% mint.',
    packaging: 'Dented, torn, or plain re-boxed cartons',
    buyer: 'Local bazaar traders & unbox retailers',
    image: '/images/grades/grade-c.jpg',
    widthClass: 'w-[400px] sm:w-[440px]',
    isDark: false,
  },
  {
    grade: 'D',
    code: 'SPEC // 04-D',
    name: 'Open-Box / Minor Cosmetic',
    discount: '55% – 75% BELOW WHOLESALE',
    oneLiner:
      'Showroom display units and customer returns. Every item inspected and verified functional with minor cosmetic marks disclosed.',
    tolerance: 'Minor cosmetic blemishes; 100% tested.',
    packaging: 'Open-box, repackaged, or palletized loose',
    buyer: 'Refurbishers & clearance liquidators',
    image: '/images/grades/grade-d.jpg',
    widthClass: 'w-[400px] sm:w-[440px]',
    isDark: false,
  },
  {
    grade: 'E',
    code: 'SPEC // 05-E',
    name: 'As-Is / Industrial Salvage',
    discount: '70%+ AS-IS RECOVERY',
    oneLiner:
      'Untested bulk gaylords, raw pallets, and excess manufacturing stock sold strictly for scrap, parts, or component rework.',
    tolerance: 'Untested raw bulk. Verified weight only.',
    packaging: 'Raw gaylord bulk bins & mixed pallets',
    buyer: 'Recyclers & industrial salvagers',
    image: '/images/grades/grade-e.jpg',
    widthClass: 'w-[420px] sm:w-[460px]',
    isDark: true,
  },
];

export default function GradeScaleExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    async function initScroll() {
      // Dynamic import to guarantee safe client-only evaluation
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const track = trackRef.current;
      const progressBar = progressBarRef.current;
      if (!container || !track) return;

      ctx = gsap.context(() => {
        // Calculate the exact horizontal distance needed to scroll all cards into view
        const getScrollDistance = () => {
          return Math.max(0, track.scrollWidth - (container.clientWidth || window.innerWidth));
        };

        // Horizontal translation animation
        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
        });

        // Optional progress bar scrub
        if (progressBar) {
          gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top top+=64',
              end: () => `+=${getScrollDistance()}`,
              scrub: 0.5,
            },
          });
        }

        // Main pinning ScrollTrigger
        ScrollTrigger.create({
          trigger: container,
          start: 'top top+=64', // aligns directly below the 64px sticky navbar
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1, // smooth fluid scrubbing
          animation: horizontalTween,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        });
      }, container);
    }

    // Lock window horizontal scroll to 0 at all times
    const enforceZeroScrollX = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };
    window.addEventListener('scroll', enforceZeroScrollX, { passive: true });

    initScroll();

    return () => {
      window.removeEventListener('scroll', enforceZeroScrollX);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-full bg-white border-y border-slate-200 overflow-hidden"
    >
      {/* ── Section Header (Pinned Top Bar) ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#e65c00]" />
            Trust Architecture • Section 7.2
          </div>
          <h2 className="type-sub text-slate-950 font-quicksand font-bold tracking-tight">
            The 5-Grade Standardized Lot Scale
          </h2>
          <p className="type-body text-slate-600 mt-1 max-w-2xl font-quicksand text-sm sm:text-base">
            Physical condition yardsticks. Every lot is verified against strict inspection criteria to eliminate WhatsApp surprises, lowball offers, and return disputes.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e65c00] animate-pulse" />
            <span>Scroll vertically to advance grades</span>
          </div>
          <Link
            href="/grade-guide"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e65c00] hover:text-[#c44e00] transition font-mono"
          >
            Inspection Manual →
          </Link>
        </div>
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────── */}
      <div className="w-full h-1 bg-slate-100 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-[#e65c00] origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── Horizontal Track ─────────────────────────────────────── */}
      <div className="py-6 sm:py-8 overflow-hidden w-full max-w-full">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 sm:gap-8 px-4 sm:px-8 lg:px-16 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {GRADES.map((g, index) => (
            <div
              key={g.grade}
              className={`flex-shrink-0 flex flex-col rounded-xl overflow-hidden border shadow-sm transition-shadow duration-300 ${g.widthClass} ${
                g.isDark
                  ? 'bg-slate-950 text-white border-slate-900 shadow-slate-950/20'
                  : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              {/* Inspection Photo */}
              <div className="relative w-full h-56 sm:h-64 bg-slate-900 overflow-hidden shrink-0">
                <img
                  src={g.image}
                  alt={`Grade ${g.grade} - ${g.name}`}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Top Code Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-[11px] font-mono text-white px-2.5 py-0.5 rounded border border-white/20">
                  {g.code}
                </div>

                {/* Slide Number */}
                <div className="absolute top-3 right-3 font-mono text-white/60 text-xs bg-black/50 px-2 py-0.5 rounded">
                  0{index + 1} / 05
                </div>

                {/* Grade Badge over image bottom */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  <span
                    className={`h-10 w-10 flex items-center justify-center rounded-lg font-black text-xl font-quicksand shadow-md ${
                      g.isDark
                        ? 'bg-white text-slate-950'
                        : g.grade === 'A'
                        ? 'bg-slate-950 text-white'
                        : g.grade === 'B'
                        ? 'bg-slate-800 text-white'
                        : g.grade === 'C'
                        ? 'bg-amber-700 text-white'
                        : 'bg-orange-700 text-white'
                    }`}
                  >
                    {g.grade}
                  </span>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-white/70">
                      Standard Tier
                    </span>
                    <span className="block text-sm font-bold text-white font-quicksand leading-tight">
                      {g.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <span
                    className={`inline-flex text-[11px] font-bold font-mono px-2.5 py-1 rounded border mb-3 ${
                      g.isDark
                        ? 'text-[#e65c00] bg-orange-950/60 border-orange-900'
                        : 'text-[#e65c00] bg-orange-50 border-orange-200'
                    }`}
                  >
                    {g.discount}
                  </span>

                  <p
                    className={`text-sm leading-relaxed font-quicksand ${
                      g.isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {g.oneLiner}
                  </p>
                </div>

                {/* Specs Box */}
                <div
                  className={`mt-5 pt-4 space-y-2 text-xs border-t ${
                    g.isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`font-mono uppercase text-[10px] shrink-0 ${
                        g.isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Tolerance
                    </span>
                    <span
                      className={`font-medium text-right ${
                        g.isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      {g.tolerance}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`font-mono uppercase text-[10px] shrink-0 ${
                        g.isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Packaging
                    </span>
                    <span
                      className={`font-medium text-right ${
                        g.isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      {g.packaging}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`font-mono uppercase text-[10px] shrink-0 ${
                        g.isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Channel
                    </span>
                    <span
                      className={`font-medium text-right ${
                        g.isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      {g.buyer}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* End CTA Card */}
          <div
            className="flex-shrink-0 flex flex-col justify-center items-start rounded-xl border border-slate-200 bg-slate-50 p-8 sm:p-10 w-[340px] sm:w-[380px]"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              Blueprint Section 7.2
            </span>
            <h3 className="type-little text-slate-950 font-quicksand font-bold mb-3">
              Full Inspection Manual & Checklist
            </h3>
            <p className="text-sm text-slate-600 font-quicksand mb-6 leading-relaxed">
              Every grade mandates minimum 6 photo angles, carton barcode tags, and packaging integrity tests before lot listing approval.
            </p>
            <Link
              href="/grade-guide"
              className="inline-flex items-center gap-2 bg-slate-950 text-white text-xs sm:text-sm font-bold font-quicksand px-5 py-3 rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              <span>Explore Grade Guide</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer Navigation Strip ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>[01] Grade A — Pristine</span>
        <span className="hidden sm:inline">↓ Continue scrolling to advance marketplace</span>
        <span>[05] Grade E — Salvage</span>
      </div>
    </section>
  );
}
