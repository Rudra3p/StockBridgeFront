import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-black">
                SB
              </span>
              <span>StockBridge</span>
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              A recovery-value and trust system for B2B surplus inventory. Liquidate aging stock, free up warehouse space, and buy graded lots below wholesale without brand damage.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 border border-slate-700">
                🛡️ 100% GST Verified
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 border border-slate-700">
                🔒 Escrow Protected
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 border border-slate-700">
                ⏱️ 48–120h Inspection
              </span>
            </div>
          </div>

          {/* Col 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-white transition">Apparel & Footwear</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Consumer Electronics</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Hardware & Industrial</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Packaged FMCG</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">All Active Graded Lots</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Trust System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust Architecture</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/grade-guide" className="hover:text-white transition">The 5-Grade Scale (A–E)</Link>
              </li>
              <li>
                <Link href="/grade-guide#expiry" className="hover:text-white transition">Expiry Overlays (X1–X4)</Link>
              </li>
              <li>
                <Link href="/grade-guide#guardrails" className="hover:text-white transition">Brand Protection Guardrails</Link>
              </li>
              <li>
                <Link href="/grade-guide#dispute" className="hover:text-white transition">Dispute Resolution Ladder</Link>
              </li>
              <li>
                <Link href="/grade-guide#escrow" className="hover:text-white transition">Protected Payment (Escrow)</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Portals & Legal</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-white transition">Seller Portal</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">Buyer Portal</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Business Registration</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Trading Rules & Policy</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Terms of Intermediary</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 StockBridge Marketplace Inc. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            StockBridge operates as a verified B2B intermediary. Funds held securely by licensed escrow partner.
          </p>
        </div>
      </div>
    </footer>
  );
}
