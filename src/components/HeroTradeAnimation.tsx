'use client';

import { useState, useEffect } from 'react';

interface HeroTradeAnimationProps {
  aspectRatioClass?: string;
}

const PIPELINE_STEPS = [
  {
    step: '01',
    tag: 'INTAKE & MASKING',
    title: 'Grade Verification & Shielding',
    status: 'ACTIVE',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    metrics: [
      { label: 'Lot Identifier', value: 'LOT-SB-9482' },
      { label: 'Grading Protocol', value: 'Grade A (Pristine)' },
      { label: 'Brand Identity', value: 'Masked (Discreet)' },
      { label: 'Market Restriction', value: 'State Excl. Active' },
    ],
    highlight: 'Primary retail channels shielded from secondary market conflict.',
  },
  {
    step: '02',
    tag: 'RESERVE MATCHING',
    title: 'Confidential Make-Offer Engine',
    status: 'MATCHED',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    metrics: [
      { label: 'Seller Reserve Floor', value: '₹18,50,000' },
      { label: 'Verified Buyer Offer', value: '₹21,20,000' },
      { label: 'Recovery Margin', value: '+47.6% of MRP' },
      { label: 'Scrap Broker Baseline', value: '₹9,80,000 (-54%)' },
    ],
    highlight: 'No open public auctions. Price discretion strictly maintained.',
  },
  {
    step: '03',
    tag: 'ESCROW VAULT',
    title: 'Pre-Funded Irrevocable Escrow',
    status: 'LOCKED',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    metrics: [
      { label: 'Vault Deposit', value: '₹21,20,000 (100%)' },
      { label: 'Custody Account', value: 'ICICI Settlement Node' },
      { label: 'Blind Dispatch E-Way', value: 'EW-9821-DEL-BLR' },
      { label: 'Payment Default Risk', value: '0.00% Guaranteed' },
    ],
    highlight: 'Buyer funds locked before seller releases custody of inventory.',
  },
  {
    step: '04',
    tag: 'SETTLEMENT',
    title: '48-Hour Inspection & Release',
    status: 'CLEARED',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    metrics: [
      { label: 'Inspection Window', value: '48 Hours' },
      { label: 'Physical Grade Audit', value: 'Verified 100% Match' },
      { label: 'Payout Execution', value: 'T+0 Direct NEFT' },
      { label: 'GST Tax Credit', value: 'GSTR-1 Matched' },
    ],
    highlight: 'Zero returns post-acceptance. Final settlement complete.',
  },
];

export default function HeroTradeAnimation({ aspectRatioClass = 'aspect-auto' }: HeroTradeAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance step every 4.5 seconds with live progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalMs = 45;
    const totalStepMs = 4500;
    const increment = (intervalMs / totalStepMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStepIndex((step) => (step + 1) % PIPELINE_STEPS.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeStep = PIPELINE_STEPS[currentStepIndex];

  return (
    <div
      className={`w-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl flex flex-col justify-between ${aspectRatioClass}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Grid Pattern & Subtle Ambient Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <div className="relative z-10 px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            Automated Settlement Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
            ICICI / HDFC Escrow Node
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
          >
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
        </div>
      </div>

      {/* Dynamic Progress Indicator */}
      <div className="w-full bg-slate-800/60 h-1 relative">
        <div
          className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-1 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Middle Interactive Stage Canvas */}
      <div className="relative z-10 p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Stage Header & Status */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
                STAGE {activeStep.step} / 04
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                {activeStep.tag}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mt-1.5 font-quicksand tracking-tight">
              {activeStep.title}
            </h3>
          </div>
          <span
            className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border ${activeStep.badgeColor}`}
          >
            ● {activeStep.status}
          </span>
        </div>

        {/* Live Animated Flow Diagram (Node A -> Hub -> Node B) */}
        <div className="relative py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-800/90 overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono">
            {/* Seller Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border transition-all ${
                  currentStepIndex === 0
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                SEL
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Enterprise Seller</span>
            </div>

            {/* Connecting Animated Circuit Line 1 */}
            <div className="flex-1 mx-2 relative flex items-center justify-center">
              <div className="w-full h-0.5 bg-slate-700 relative overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-emerald-400 to-transparent ${
                    currentStepIndex >= 0 ? 'animate-flow-beam' : ''
                  }`}
                />
              </div>
              <span className="absolute -top-3.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {currentStepIndex === 0 ? 'Grade Verified' : 'Reserve Met'}
              </span>
            </div>

            {/* Escrow Clearing Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border transition-all ${
                  currentStepIndex === 1 || currentStepIndex === 2
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                ESC
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Escrow Vault</span>
            </div>

            {/* Connecting Animated Circuit Line 2 */}
            <div className="flex-1 mx-2 relative flex items-center justify-center">
              <div className="w-full h-0.5 bg-slate-700 relative overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-indigo-400 to-transparent ${
                    currentStepIndex >= 2 ? 'animate-flow-beam' : ''
                  }`}
                />
              </div>
              <span className="absolute -top-3.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {currentStepIndex >= 3 ? 'Funds Released' : '48h Hold'}
              </span>
            </div>

            {/* Buyer Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border transition-all ${
                  currentStepIndex === 3
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                BUY
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Verified Buyer</span>
            </div>
          </div>
        </div>

        {/* Real Metrics Grid (2x2) */}
        <div className="grid grid-cols-2 gap-2.5">
          {activeStep.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
            >
              <div className="text-[11px] font-mono text-slate-400">{m.label}</div>
              <div className="text-sm font-semibold text-slate-100 font-mono mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Highlight Callout */}
        <div className="px-3.5 py-2.5 rounded-lg bg-slate-900/90 border-l-2 border-emerald-500 text-xs text-slate-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-quicksand font-normal text-slate-300 text-[12px]">{activeStep.highlight}</span>
        </div>
      </div>

      {/* Step Switcher Buttons at Bottom */}
      <div className="relative z-10 px-4 py-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-1 sm:gap-2">
        {PIPELINE_STEPS.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              setCurrentStepIndex(idx);
              setProgress(0);
            }}
            className={`flex-1 py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
              currentStepIndex === idx
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-[11px]'
            }`}
          >
            <div className="font-mono text-[10px] sm:text-xs">
              {s.step} <span className="hidden md:inline font-sans">{s.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
