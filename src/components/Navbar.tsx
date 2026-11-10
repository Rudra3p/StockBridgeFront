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
      const res = await clientAuth.getMe();
      if (isMounted) {
        if (res.authenticated && res.user) {
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
    await clientAuth.logout();
    setUser(null);
    setLoggingOut(false);
    router.push('/login');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'SELLER':
        return '/seller/dashboard';
      case 'BUYER':
        return '/buyer/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-canvas bg-canvas/95 backdrop-blur transition-colors duration-200">
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
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-main transition"
          >
            How It Works
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href={getDashboardLink()}
                    className="text-sm font-medium text-slate-700 hover:text-accent transition"
                  >
                    Dashboard
                  </Link>

                  <div className="h-4 w-px bg-slate-200" />

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-main">
                      {user.fullName}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                      {user.role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 disabled:opacity-60"
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:text-main hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Register Business
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
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
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
              className="py-1 font-medium text-slate-700 hover:text-emerald-600"
            >
              Marketplace
            </Link>
            <Link
              href="/grade-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-medium text-slate-700 hover:text-emerald-600"
            >
              5-Grade Guide
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-medium text-slate-700 hover:text-emerald-600"
            >
              How It Works
            </Link>
          </div>

          {!loading && (
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email} • {user.role}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-slate-700 hover:text-emerald-600 py-1"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={loggingOut}
                    className="w-full text-left text-sm font-medium text-rose-600 py-1"
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
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
                    className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-emerald-700"
                  >
                    Register Business
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
