'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  Crosshair,
  X,
  ArrowRight,
  ChevronDown,
  Check,
  Package,
} from 'lucide-react';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse } from '@/lib/types';
import LogisticsDeliveryAnimation from './LogisticsDeliveryAnimation';

const POPULAR_HUBS = [
  { name: 'Surat', state: 'Gujarat', tag: 'Textiles & Synthetics', fast: '1-Day Dispatch' },
  { name: 'Bhiwandi', state: 'Maharashtra', tag: 'Mega Warehousing', fast: 'Western Hub' },
  { name: 'Tirupur', state: 'Tamil Nadu', tag: 'Knitwear & Apparel', fast: 'Export Seconds' },
  { name: 'Ahmedabad', state: 'Gujarat', tag: 'Chemicals & Denim', fast: 'High Volume' },
  { name: 'Agra', state: 'Uttar Pradesh', tag: 'Footwear & Leather', fast: 'North Central' },
  { name: 'Ludhiana', state: 'Punjab', tag: 'Woollens & Hardware', fast: 'Fast Clearance' },
];

const POPULAR_CATEGORIES = [
  { name: 'Cotton Polo T-Shirts', grade: 'Grade A', count: '12,000 pcs' },
  { name: 'Brass Ball Valves & Fittings', grade: 'Grade A OEM', count: '4,500 units' },
  { name: 'LED High-Bay Industrial Fixtures', grade: 'Grade B Excess', count: '1,800 units' },
  { name: 'Denim Fabric Rolls (Cancelled Export)', grade: 'Grade A', count: '8,000 meters' },
];

const ROTATING_PLACEHOLDERS = [
  "Search 'Cotton Polo T-Shirts (Grade A)'",
  "Search 'Surat Textile Mills (Export Excess)'",
  "Search 'Brass Industrial Valves (5,000 pcs)'",
  "Search 'Bhiwandi Electronics Logistics Hub'",
  "Search 'Cancelled Export Apparel Lots'",
  "Search 'Tirupur Knitwear Factory Seconds'",
  "Search 'Automotive Wiring Harness Spares'",
];

export default function HeroSection() {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [_loadingUser, setLoadingUser] = useState(true);

  // Search state
  const [selectedHub, setSelectedHub] = useState('All Hubs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycling placeholder like Swiggy / Zepto
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      const res = await clientAuth.getMe('BUYER');
      if (isMounted) {
        if (res.authenticated && res.user && res.user.role === 'BUYER') {
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
        return '/partner/dashboard';
      case 'BUYER':
        return '/buyer/dashboard';
      default:
        return '/buyer/dashboard';
    }
  };

  const executeSearch = (query: string, hub = selectedHub) => {
    const cleanQuery = query.trim();
    setIsDropdownOpen(false);

    if (!user) {
      // Unauthenticated: Direct action redirects to registration / marketplace
      const params = new URLSearchParams();
      if (cleanQuery) params.set('search', cleanQuery);
      if (hub && hub !== 'All Hubs') params.set('hub', hub);
      router.push(`/register?${params.toString()}`);
      return;
    }

    // Authenticated: route to buyer dashboard listings or overview map
    const targetDashboard = user.role === 'SELLER' ? '/partner/dashboard' : '/buyer/dashboard';
    const params = new URLSearchParams();
    params.set('tab', 'listings');
    if (cleanQuery) params.set('search', cleanQuery);
    if (hub && hub !== 'All Hubs') params.set('hub', hub);
    router.push(`${targetDashboard}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  // Swiggy-style "Locate Me" GPS trigger using Lucide Crosshair icon
  const handleLocateMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          // Auto-select nearest major Indian liquidation hub
          const lat = pos.coords.latitude;
          if (lat > 23) {
            setSelectedHub('Surat');
          } else if (lat > 18) {
            setSelectedHub('Bhiwandi');
          } else {
            setSelectedHub('Tirupur');
          }
        },
        () => {
          setIsLocating(false);
          setSelectedHub('Bhiwandi');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setSelectedHub('All Hubs');
    }
  };

  return (
    <section className="relative w-full border-b border-canvas bg-canvas py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[58%_42%] gap-10 lg:gap-8 items-center">
        
        {/* ====================================================== */}
        {/* LEFT COLUMN: HERO CONTENT + REFINED SEARCH BAR         */}
        {/* ====================================================== */}
        <div className="flex flex-col justify-center text-left lg:pr-4">
          
          {/* Main Title - Principles 12 (Text-Balance) & 3 (Tabular Nums) */}
          <h1 className="type-main text-main font-quicksand font-bold text-balance leading-tight">
            Source Verified{' '}
            <span className="text-[#e65c00] transition-colors duration-200">
              Factory Surplus
            </span>{' '}
            at <span className="tabular-nums font-mono font-bold">30% to 70%</span> Below Wholesale.
          </h1>

          {/* User Auth Action Pill (Compact) ONLY if logged in as BUYER */}
          {user && user.role === 'BUYER' && (
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/buyer/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e65c00] hover:underline font-quicksand"
              >
                <span>Currently logged in as {user.fullName} • Go to Buyer Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REFINED SEARCH BAR: 20% LOCATION | 60% SEARCH QUERY | 20% ACTION BUTTON   */}
          {/* ========================================================================= */}
          <div ref={searchContainerRef} className="mt-7 relative z-30">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl border-2 border-slate-300 shadow-xl hover:shadow-2xl focus-within:border-[#e65c00] focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300 min-h-[56px] overflow-hidden"
            >
              {/* 1. Location Segment (Exact 20% Width on Desktop) */}
              <div className="relative flex items-center px-3.5 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-200 w-full sm:w-[20%] shrink-0 bg-slate-50/70">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#e65c00] shrink-0 mr-1.5" />
                
                <div className="flex-1 min-w-0 relative flex items-center">
                  <select
                    id="hubSelect"
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    aria-label="Location hub"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 font-quicksand focus:outline-none cursor-pointer truncate appearance-none pr-4"
                  >
                    <option value="All Hubs">All India</option>
                    <option value="Surat">Surat</option>
                    <option value="Bhiwandi">Bhiwandi</option>
                    <option value="Tirupur">Tirupur</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Agra">Agra</option>
                    <option value="Ludhiana">Ludhiana</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none -ml-3.5" />
                </div>

                {/* Lucide Crosshair "Locate Me" Button */}
                <button
                  type="button"
                  onClick={handleLocateMe}
                  title="Detect nearest hub"
                  className="ml-1 p-1 rounded-md text-slate-400 hover:text-[#e65c00] hover:bg-orange-50 transition shrink-0"
                >
                  {isLocating ? (
                    <span className="animate-spin text-xs">...</span>
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* 2. Main Search Query Segment (Exact 60% Width on Desktop) */}
              <div className="relative flex items-center px-4 py-3 sm:py-0 w-full sm:w-[60%] flex-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-3" />
                
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full bg-transparent text-sm sm:text-base font-semibold font-quicksand text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition mr-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 3. High-Impact Action Button Segment (Exact 20% Width on Desktop) */}
              <button
                type="submit"
                className="w-full sm:w-[20%] flex items-center justify-center gap-1.5 px-4 py-3.5 sm:py-0 bg-[#e65c00] hover:bg-[#c44e00] text-white text-sm sm:text-base font-extrabold font-quicksand transition shrink-0 shadow-md active:scale-[0.99] tracking-wide"
              >
                <span>SEARCH</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </form>

            {/* ==================================================== */}
            {/* AUTOCOMPLETE & SUGGESTIONS DROPDOWN (LUCIDE ICONS)   */}
            {/* ==================================================== */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 text-left divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* Section A: Popular Hubs with Live Status */}
                <div className="pb-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#e65c00]" />
                      <span>POPULAR DISPATCH HUBS</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold font-mono flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Free OSM Transit Routing</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => {
                          setSelectedHub(hub.name);
                          executeSearch(searchQuery, hub.name);
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/60 transition text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 font-quicksand group-hover:text-[#e65c00]">
                            {hub.name}
                          </span>
                          <span className="text-[10px] font-mono text-orange-950 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-bold">
                            {hub.fast}
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-500 font-quicksand truncate">
                          {hub.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section B: Trending Surplus Lots */}
                <div className="pt-3.5">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 mb-2.5">
                    <Package className="w-3.5 h-3.5 text-[#e65c00]" />
                    <span>TRENDING SURPLUS MANIFESTS</span>
                  </span>

                  <div className="space-y-1.5">
                    {POPULAR_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setSearchQuery(cat.name);
                          executeSearch(cat.name);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 font-quicksand transition text-left group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#e65c00]" />
                          <span className="font-semibold text-slate-900 group-hover:text-[#e65c00] truncate">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {cat.grade}
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            {cat.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* POPULAR HUBS ROW BELOW SEARCH BAR                    */}
            {/* ==================================================== */}
            <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500 font-quicksand">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 shrink-0">
                POPULAR HUBS:
              </span>
              {POPULAR_HUBS.map((hub, idx) => (
                <React.Fragment key={hub.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHub(hub.name);
                      executeSearch('', hub.name);
                    }}
                    className="hover:text-[#e65c00] transition font-medium text-slate-600 hover:underline"
                  >
                    {hub.name}
                  </button>
                  {idx < POPULAR_HUBS.length - 1 && (
                    <span className="text-slate-300 font-mono" aria-hidden="true">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* Quick Register / Direct Action Banner Below Search */}
          {!user && (
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-quicksand">
                <span className="font-bold text-slate-900">New to StockBridge?</span>
                <span>Get verified in under 2 minutes for wholesale trade.</span>
              </div>
              <Link
                href="/register"
                className="font-bold text-[#e65c00] hover:underline font-quicksand flex items-center gap-1"
              >
                <span>Register Business Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN: SQUARE LOGISTICS ANIMATION (42% COL)    */}
        {/* ====================================================== */}
        <div className="w-full flex items-center justify-center">
          <LogisticsDeliveryAnimation />
        </div>

      </div>
    </section>
  );
}
