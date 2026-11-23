'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RecoveryCalculator() {
  const [budget, setBudget] = useState<number>(500000); // 5 Lakhs INR default

  // Route A: Traditional Wholesale Distribution (15% trade margin off MRP)
  const traditionalTurnover = Math.round(budget / 0.85);
  const traditionalProfit = traditionalTurnover - budget;

  // Route B: StockBridge Graded Surplus Sourcing (~50% below wholesale, 2.2x retail turnover)
  const surplusTurnover = Math.round(budget * 2.2);
  const buyerFee = Math.round(budget * 0.015); // 1.5% buyer escrow protection fee
  const surplusProfit = surplusTurnover - (budget + buyerFee);

  // Extra margin unlocked
  const extraProfit = surplusProfit - traditionalProfit;
  const percentageGain = Math.round((extraProfit / traditionalProfit) * 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#e65c00] border border-orange-200 font-mono">
            Wholesale Economics Model
          </span>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-quicksand">
            Calculate Your Retail Profit Margin
          </h3>
          <p className="mt-1 text-sm text-slate-500 font-quicksand">
            Compare sourcing margins through conventional wholesale distributors versus StockBridge&apos;s verified surplus lots.
          </p>
        </div>

        {/* Input slider */}
        <div className="w-full lg:w-80 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Sourcing Capital:</span>
            <span className="font-bold text-slate-900 text-sm font-mono">{formatCurrency(budget)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={2500000}
            step={50000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#e65c00]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
            <span>₹1 Lakh</span>
            <span>₹12.5 Lakhs</span>
            <span>₹25 Lakhs</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route A: Traditional Wholesale */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">Standard Wholesale Distribution</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium font-mono">15% Margin</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 font-quicksand">{formatCurrency(traditionalProfit)}</span>
              <span className="text-xs text-slate-500 block mt-1 font-quicksand">
                Estimated profit on {formatCurrency(traditionalTurnover)} retail turnover
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-quicksand">
              <li className="flex items-center gap-2 text-slate-600">
                ✕ Thin retail margins squeezed by authorized distributor tiers
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                ✕ Rigid MOQ requirements with no bulk discount negotiation
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                ✕ Advance payments with no return window for damaged packaging
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 font-mono">
            Capital efficiency: <span className="font-semibold text-slate-700">~1.17x turnover</span>
          </div>
        </div>

        {/* Route B: StockBridge Graded Surplus Marketplace */}
        <div className="rounded-xl border-2 border-[#e65c00] bg-orange-50/20 p-5 flex flex-col justify-between relative shadow-sm">
          <div className="absolute -top-3 right-4 bg-[#e65c00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm font-mono">
            +{percentageGain}% Extra Margin
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e65c00] font-mono">StockBridge Verified Surplus</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-[#e65c00] font-semibold font-mono">50%+ Margin</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#e65c00] font-quicksand">{formatCurrency(surplusProfit)}</span>
              <span className="text-xs text-slate-500 block mt-1 font-quicksand">
                Estimated profit on {formatCurrency(surplusTurnover)} retail turnover
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-700 font-quicksand">
              <li className="flex items-center gap-2 text-slate-900 font-medium">
                ✓ Sourced 30% to 70% below wholesale direct from factory overstock
              </li>
              <li className="flex items-center gap-2 text-slate-900 font-medium">
                ✓ 5-Grade certified inspection yardstick with verified photo packs
              </li>
              <li className="flex items-center gap-2 text-slate-900 font-medium">
                ✓ 48-Hour physical inspection window backed by licensed escrow hold
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-orange-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 font-mono">
              Net Gain: <span className="text-[#e65c00]">+{formatCurrency(extraProfit)}</span>
            </span>
            <Link
              href="#marketplace"
              className="inline-flex items-center text-xs font-bold text-[#e65c00] hover:text-[#c44e00] underline underline-offset-4 font-quicksand"
            >
              Browse available lots →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
