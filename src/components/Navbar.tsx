'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfileResponse } from '@/lib/types';
import { clientAuth } from '@/lib/client-api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      const targetRole = pathname.startsWith('/partner') ? 'SELLER' : 'BUYER';
      const res = await clientAuth.getMe(targetRole);
      if (isMounted) {
        if (res.authenticated && res.user && res.user.role === targetRole) {
          setUser(res.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const targetRole = pathname.startsWith('/partner') ? 'SELLER' : 'BUYER';
    await clientAuth.logout(targetRole);
    setUser(null);
    setLoggingOut(false);
    router.push(targetRole === 'SELLER' ? '/partner/login' : '/login');
    router.refresh();
  };

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

  // Hide public consumer navbar in authenticated dashboards & admin operations
  const isDashboardRoute =
    (pathname.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname.startsWith('/partner/dashboard') ||
    pathname.startsWith('/seller/dashboard') ||
    pathname.startsWith('/buyer/dashboard') ||
    pathname === '/dashboard';

  if (isDashboardRoute) {
    return null;
  }

  const isPartnerRoute = pathname.startsWith('/partner');

  // =========================================================================
  // DEDICATED PARTNER NAVBAR (FOR /partner, /partner/register, /partner/login)
  // Contains only: Logo, Log In button, and Register button
  // =========================================================================
  if (isPartnerRoute) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Partner Brand Logo */}
          <Link
            href="/partner"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition hover:text-[#e65c00]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e65c00] text-white font-extrabold shadow-sm font-mono text-sm">
              SB
            </span>
            <div className="flex items-center gap-1.5 font-quicksand">
              <span className="font-bold text-slate-900 text-lg">StockBridge</span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#e65c00] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                PARTNER
              </span>
            </div>
          </Link>

          {/* Action Buttons: Just Register & Login */}
          <div className="flex items-center gap-3">
            {!loading && user && user.role === 'SELLER' ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/partner/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e65c00] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#c44e00] font-quicksand"
                >
                  <span>Partner Portal</span>
                  <span>→</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 font-quicksand"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/partner/login"
                  className="rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:text-[#e65c00] hover:bg-orange-50 font-quicksand"
                >
                  Log In
                </Link>
                <Link
                  href="/partner/register"
                  className="inline-flex items-center rounded-lg bg-[#e65c00] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#c44e00] font-quicksand"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // BUYER / PUBLIC CONSUMER NAVBAR (NO "Partner with Us" LINK)
  // =========================================================================
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-main transition hover:text-accent"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white font-extrabold shadow-sm">
            SB
          </span>
          <span>StockBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/#marketplace"
            className="text-sm font-medium text-slate-600 hover:text-main transition"
          >
            Marketplace
          </Link>
          <Link
            href="/grade-guide"
            className="text-sm font-medium text-slate-600 hover:text-main transition"
          >
            5-Grade Guide
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          {!loading && (
            <>
              {user && user.role === 'BUYER' ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-quicksand">
                      {user.fullName}
                    </span>
                  </div>

                  <Link
                    href="/buyer/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#e65c00] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#c44e00] font-quicksand"
                  >
                    <span>Buyer Dashboard</span>
                    <span>→</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 font-quicksand"
                  >
                    {loggingOut ? '...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-[#e65c00] hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 font-quicksand"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#e65c00]"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 text-sm">
            <Link
              href="/#marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-medium text-slate-700 hover:text-accent"
            >
              Marketplace
            </Link>
            <Link
              href="/grade-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-medium text-slate-700 hover:text-accent"
            >
              5-Grade Guide
            </Link>
          </div>

          {!loading && (
            <div className="flex flex-col gap-3 pt-3">
              {user && user.role === 'BUYER' ? (
                <>
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    href="/buyer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-[#e65c00] px-3 py-2 text-center text-sm font-bold text-white shadow-sm font-quicksand"
                  >
                    Buyer Dashboard →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={loggingOut}
                    className="w-full text-center text-sm font-medium text-rose-600 py-1"
                  >
                    {loggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white shadow-sm font-quicksand"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
