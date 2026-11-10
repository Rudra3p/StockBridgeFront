'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RecoveryCalculator() {
  const [costValue, setCostValue] = useState<number>(1000000); // 10 Lakhs INR default

  // Broker dump recovery ~ 25%
  const brokerRecovery = Math.round(costValue * 0.25);

  // StockBridge recovery ~ 42% average net of commission
  const stockbridgeGross = Math.round(costValue * 0.45);
  const commission = Math.round(stockbridgeGross * 0.07);
  const stockbridgeNet = stockbridgeGross - commission;

  // Extra cash recovered
  const extraCash = stockbridgeNet - brokerRecovery;
  const percentageGain = Math.round((extraCash / brokerRecovery) * 100);

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Interactive Economics Model
          </span>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Calculate Your Recovered Working Capital
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Compare what you recover through informal scrap brokers versus StockBridge's graded B2B marketplace.
          </p>
        </div>

        {/* Input slider */}
        <div className="w-full lg:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Dead Inventory Cost:</span>
            <span className="font-bold text-slate-900 text-sm">{formatCurrency(costValue)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={5000000}
            step={50000}
            value={costValue}
            onChange={(e) => setCostValue(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>₹1 Lakh</span>
            <span>₹25 Lakhs</span>
            <span>₹50 Lakhs</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route A: Local Scrap Broker */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Traditional Broker / Liquidator</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-medium">Lowball Offer</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(brokerRecovery)}</span>
              <span className="text-xs text-slate-500 block mt-1">~25% asset recovery value</span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 text-rose-700 font-medium">
                ✕ Single buyer monopoly; no competing bids
              </li>
              <li className="flex items-center gap-2 text-rose-700 font-medium">
                ✕ Brand dumped into local market near existing customers
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                • Informal cash transaction with minimal paperwork
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-rose-200/60 text-xs text-slate-500">
            Cost lost: <span className="font-semibold text-rose-600">{formatCurrency(costValue - brokerRecovery)}</span>
          </div>
        </div>

        {/* Route B: StockBridge Graded Marketplace */}
        <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/40 p-5 flex flex-col justify-between relative shadow-sm">
          <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            +{percentageGain}% Extra Capital
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">StockBridge Structured Lot</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Verified B2B</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-emerald-700">{formatCurrency(stockbridgeNet)}</span>
              <span className="text-xs text-slate-500 block mt-1">Net cash after 7% platform fee</span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2 text-emerald-800 font-medium">
                ✓ Competing bids from hundreds of verified retail buyers
              </li>
              <li className="flex items-center gap-2 text-emerald-800 font-medium">
                ✓ Hidden brand name & local competitor blocking rules
              </li>
              <li className="flex items-center gap-2 text-emerald-800 font-medium">
                ✓ Escrow-protected payment secured before truck dispatch
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">
              Gain: +{formatCurrency(extraCash)}
            </span>
            <Link
              href="/register"
              className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
            >
              List your surplus lot →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
