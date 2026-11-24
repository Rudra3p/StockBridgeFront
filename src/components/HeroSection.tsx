'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse } from '@/lib/types';
import LogisticsDeliveryAnimation from './LogisticsDeliveryAnimation';

export default function HeroSection() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [_loadingUser, setLoadingUser] = useState(true);

  // Direct action search state
  const [searchMode, setSearchMode] = useState<'product' | 'hub'>('product');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      const res = await clientAuth.getMe();
      if (isMounted) {
        if (res.authenticated && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
        setLoadingUser(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'SELLER':
        return '/seller/dashboard';
      case 'BUYER':
        return '/buyer/dashboard';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (!user) {
      // Direct action if not logged in: route to register/login with search query
      router.push(`/register?query=${encodeURIComponent(query)}&mode=${searchMode}`);
      return;
    }

    // Direct action if logged in: route to appropriate dashboard map or listings
    if (searchMode === 'hub') {
      if (user.role === 'SELLER') {
        router.push(`/seller/dashboard?tab=overview&hub=${encodeURIComponent(query)}`);
      } else {
        router.push(`/buyer/dashboard?tab=overview&hub=${encodeURIComponent(query)}`);
      }
    } else {
      if (user.role === 'SELLER') {
        router.push(`/seller/dashboard?tab=listings&search=${encodeURIComponent(query)}`);
      } else {
        router.push(`/buyer/dashboard?tab=listings&search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleQuickChipClick = (chipQuery: string, mode: 'product' | 'hub') => {
    setSearchMode(mode);
    setSearchQuery(chipQuery);

    if (!user) {
      router.push(`/register?query=${encodeURIComponent(chipQuery)}&mode=${mode}`);
      return;
    }

    if (mode === 'hub') {
      router.push(user.role === 'SELLER' ? `/seller/dashboard?tab=overview&hub=${encodeURIComponent(chipQuery)}` : `/buyer/dashboard?tab=overview&hub=${encodeURIComponent(chipQuery)}`);
    } else {
      router.push(user.role === 'SELLER' ? `/seller/dashboard?tab=listings&search=${encodeURIComponent(chipQuery)}` : `/buyer/dashboard?tab=listings&search=${encodeURIComponent(chipQuery)}`);
    }
  };

  return (
    <section className="relative w-full border-b border-canvas bg-canvas py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* ======================================================== */}
      {/* 2-COLUMN HERO (60 : 40 RATIO ON DESKTOP, STACKED MOBILE) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 lg:gap-8 items-center">
        
        {/* ====================================================== */}
        {/* LEFT COLUMN: HEADING + DUAL REGISTRATION + SEARCH BAR   */}
        {/* ====================================================== */}
        <div className="flex flex-col justify-center text-left lg:pr-4">
          
          {/* MAIN HEADING */}
          <h1 className="type-main text-main font-quicksand font-bold">
            Source Verified{' '}
            <span className="text-accent transition-colors duration-200">
              Factory Surplus
            </span>{' '}
            at 30% to 70% Below Wholesale.
          </h1>

          {/* Role-Specific Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md transition hover:opacity-90 font-quicksand"
              >
                <span>Go to Your {user.role === 'SELLER' ? 'Seller Central' : user.role === 'ADMIN' ? 'Admin Console' : 'Buyer Hub'}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm transition hover:bg-slate-800 font-quicksand"
              >
                <span>Register Business</span>
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>

          {/* ==================================================== */}
          {/* DIRECT ACTION SEARCH (AMAZON / SWIGGY STYLE)        */}
          {/* ==================================================== */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg">
            {/* Search Type Switcher */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSearchMode('product')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-quicksand transition flex items-center gap-1.5 ${
                  searchMode === 'product'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>📦 Product / Overstock SKU</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchMode('hub')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-quicksand transition flex items-center gap-1.5 ${
                  searchMode === 'hub'
                    ? 'bg-[#e65c00] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>📍 Dispatch Hub / City Map</span>
              </button>
            </div>

            {/* Direct Action Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {searchMode === 'product' ? '🔍' : '📍'}
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchMode === 'product'
                      ? 'Search surplus lots (e.g. Polo T-Shirts, LED lights, Valves, Footwear)...'
                      : 'Search dispatch hub (e.g. Surat, Bhiwandi, Tirupur, Agra, Ahmedabad)...'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-quicksand text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent hover:opacity-90 text-white text-sm font-bold font-quicksand shadow-sm transition shrink-0 active:scale-[0.98]"
              >
                <span>{searchMode === 'product' ? 'Search Lots' : 'Locate Hub Map'}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-quicksand">
              <span className="text-slate-400 font-mono text-[11px]">Trending B2B:</span>
              <button
                type="button"
                onClick={() => handleQuickChipClick('Tirupur', 'hub')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition"
              >
                📍 Tirupur Hub
              </button>
              <button
                type="button"
                onClick={() => handleQuickChipClick('Bhiwandi', 'hub')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition"
              >
                📍 Bhiwandi Logistics
              </button>
              <button
                type="button"
                onClick={() => handleQuickChipClick('Surat', 'hub')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition"
              >
                📍 Surat Mills
              </button>
              <button
                type="button"
                onClick={() => handleQuickChipClick('Cotton Polo T-Shirts', 'product')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition"
              >
                📦 Polo T-Shirts
              </button>
              <button
                type="button"
                onClick={() => handleQuickChipClick('Brass Valves', 'product')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition"
              >
                📦 Brass Valves
              </button>
            </div>
          </div>

        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN: SQUARE LOGISTICS ANIMATION (40% COL)    */}
        {/* ====================================================== */}
        <div className="w-full flex items-center justify-center">
          <LogisticsDeliveryAnimation />
        </div>

      </div>
    </section>
  );
}
