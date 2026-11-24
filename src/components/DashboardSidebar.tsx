'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export type PortalRole = 'ADMIN' | 'SELLER' | 'BUYER';

export interface DashboardSidebarProps {
  role: PortalRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  badges?: {
    kyc?: number;
    qa?: number;
    disputes?: number;
    offers?: number;
    escrow?: number;
    users?: number;
  };
  backendStatus?: {
    connected: boolean;
    latencyMs?: number;
  };
  onSyncBackend?: () => void;
  syncingBackend?: boolean;
  currentUser?: {
    fullName?: string;
    email?: string;
    organisation?: {
      legalName?: string;
      gstNumber?: string;
    };
  } | null;
  onLogout?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function DashboardSidebar({
  role,
  activeTab,
  onTabChange,
  badges,
  backendStatus,
  onSyncBackend,
  syncingBackend,
  currentUser,
  onLogout,
  actionButton,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role metadata
  const roleConfig = {
    ADMIN: {
      badge: 'MASTER ADMIN',
      badgeColor: 'bg-orange-50 text-[#e65c00] border-orange-200',
      portalTitle: 'Admin Console',
      subTitle: 'Platform Operations & Escrow',
      themeBg: 'bg-white text-slate-900 border-slate-200',
      navItems: [
        {
          key: 'overview',
          label: 'Executive Overview',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'kyc',
          label: 'Enterprise KYC',
          badge: badges?.kyc,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'lots',
          label: 'Lot QA & Catalog',
          badge: badges?.qa,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'escrow',
          label: 'Escrow Ledger',
          badge: badges?.escrow,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'disputes',
          label: 'Dispute Arbitration',
          badge: badges?.disputes,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'users',
          label: 'User Accounts',
          badge: badges?.users,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          href: '/admin',
        },
        {
          key: 'profile',
          label: 'Admin Profile & Security',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          href: '/admin/profile',
        },
      ],
    },
    SELLER: {
      badge: 'SELLER CENTRAL',
      badgeColor: 'bg-orange-50 text-[#e65c00] border-orange-200',
      portalTitle: 'StockBridge Partner',
      subTitle: 'Surplus Liquidation Desk',
      themeBg: 'bg-white text-slate-900 border-slate-200',
      navItems: [
        {
          key: 'overview',
          label: 'Overview & Metrics',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
        {
          key: 'listings',
          label: 'My Surplus Lots',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
        {
          key: 'offers',
          label: 'Bids & Counter-Offers',
          badge: badges?.offers,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
        {
          key: 'escrow',
          label: 'Escrow Dispatches',
          badge: badges?.escrow,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
        {
          key: 'disputes',
          label: 'Inspection Claims',
          badge: badges?.disputes,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
        {
          key: 'profile',
          label: 'Business KYC & Bank',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          href: '/seller/dashboard',
        },
      ],
    },
    BUYER: {
      badge: 'WHOLESALE BUYER',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      portalTitle: 'StockBridge Buyer',
      subTitle: 'Wholesale Procurement Desk',
      themeBg: 'bg-white text-slate-900 border-slate-200',
      navItems: [
        {
          key: 'overview',
          label: 'Buyer Overview',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          href: '/buyer/dashboard',
        },
        {
          key: 'listings',
          label: 'Graded Catalog',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          href: '/buyer/dashboard',
        },
        {
          key: 'offers',
          label: 'My RFQs & Offers',
          badge: badges?.offers,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          href: '/buyer/dashboard',
        },
        {
          key: 'escrow',
          label: '48H Inspection Escrow',
          badge: badges?.escrow,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          href: '/buyer/dashboard',
        },
        {
          key: 'profile',
          label: 'Enterprise KYC',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          href: '/buyer/dashboard',
        },
      ],
    },
  }[role];

  const handleNavClick = (item: { key: string; href?: string }) => {
    setMobileOpen(false);
    if (onTabChange) {
      // In-page tab switching for dashboard tabs
      if (item.href === pathname || !item.href || (item.key && item.key !== 'profile')) {
        onTabChange(item.key);
        if (item.href === pathname || !item.href || (item.key && item.key !== 'profile')) {
          return;
        }
      }
    }
    if (item.href && item.href !== pathname) {
      router.push(item.href);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-white text-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a1a] to-[#e65c00] text-white font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
              SB
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-quicksand font-bold text-base text-slate-900 tracking-tight">
                  StockBridge
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${roleConfig.badgeColor}`}>
                  {roleConfig.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-[170px]">
                {roleConfig.portalTitle}
              </p>
            </div>
          </Link>

          {/* Live Backend Connection Indicator */}
          {backendStatus && (
            <div className="mt-3.5 flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono">
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span className={backendStatus.connected ? 'text-emerald-700 font-bold truncate' : 'text-amber-700 font-bold truncate'}>
                  {backendStatus.connected ? 'Backend Live' : 'Standalone'}
                </span>
                {backendStatus.latencyMs !== undefined && (
                  <span className="text-slate-500 text-[10px]">({backendStatus.latencyMs}ms)</span>
                )}
              </div>
              {onSyncBackend && (
                <button
                  type="button"
                  onClick={onSyncBackend}
                  disabled={syncingBackend}
                  className="text-[#e65c00] hover:text-orange-700 font-bold text-[10px] uppercase ml-1 transition"
                  title="Sync data with Spring Boot backend"
                >
                  {syncingBackend ? '...' : 'Sync'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Button (e.g. + Create Surplus Lot) */}
        {actionButton && (
          <div className="px-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                actionButton.onClick();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e65c00] hover:bg-[#cc5200] py-2.5 px-4 text-xs font-bold text-white shadow-sm transition active:scale-[0.98]"
            >
              <span>+</span>
              <span>{actionButton.label}</span>
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {roleConfig.navItems.map((item) => {
              const isActive =
                item.key === activeTab ||
                (item.href === pathname && (!activeTab || item.key === 'profile'));

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold font-quicksand transition group text-left ${
                    isActive
                      ? 'bg-orange-50 text-[#e65c00] font-bold border border-orange-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#e65c00]' : 'text-slate-400 group-hover:text-slate-700'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                        isActive
                          ? 'bg-[#e65c00] text-white border-transparent'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Sign Out */}
      <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/60">
        {/* User Card */}
        {currentUser && (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="h-8 w-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-mono font-bold text-[#e65c00] uppercase shrink-0">
              {currentUser.fullName ? currentUser.fullName.slice(0, 2) : 'SB'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate font-quicksand">
                {currentUser.fullName || 'Admin User'}
              </p>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                {currentUser.email || 'user@stockbridge.com'}
              </p>
            </div>
          </div>
        )}

        {/* Public marketplace link */}
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition"
        >
          <span>↗ Public Marketplace</span>
          <span className="text-slate-400">Site</span>
        </Link>

        {role === 'SELLER' && (
          <Link
            href="/partner"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-mono text-[#e65c00] hover:text-orange-700 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition"
          >
            <span>🤝 Partner Program</span>
            <span className="text-[10px]">Info</span>
          </Link>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono text-rose-600 border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Header (Visible on screens < md) ────────── */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 text-slate-900 shadow-2xs">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff7a1a] to-[#e65c00] text-white font-extrabold text-xs">
            SB
          </span>
          <span className="font-quicksand font-bold text-sm tracking-tight">StockBridge</span>
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${roleConfig.badgeColor}`}>
            {roleConfig.badge}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
          aria-label="Toggle navigation drawer"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile Drawer Backdrop ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer (Slide in) ────────────────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:hidden shadow-xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      {/* ── Desktop Permanent Left Sidebar (md and up) ─────────── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 select-none shadow-2xs">
        {navContent}
      </aside>
    </>
  );
}
