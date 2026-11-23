'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rudra090207@gmail.com');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await clientAuth.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Invalid administrator email or password');
        setSubmitting(false);
        return;
      }

      if (res.data.user.role !== 'ADMIN') {
        setErrorMessage('Access Denied: This gateway requires Master Administrator privileges.');
        setSubmitting(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('An unexpected error occurred during administrative login.');
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('rudra090207@gmail.com');
    setPassword('1234567890');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 selection:bg-orange-950 selection:text-orange-200">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-[#ff7a1a] mb-4">
            🛡️ OPERATIONS // AUTH GATEWAY
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-quicksand">
            StockBridge Admin Gateway
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-quicksand">
            Enter your credentials to access the central operations &amp; dispute console.
          </p>
        </div>

        {/* Credentials Quick-Fill Hint */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Default Administrator</span>
            <span className="text-[#ff7a1a] font-bold">rudra090207@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition"
          >
            Auto-Fill
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg bg-rose-500/10 p-4 border border-rose-500/30 text-xs text-rose-300 font-mono flex items-start gap-2.5"
          >
            <span className="text-rose-400 font-bold shrink-0">✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono font-bold text-slate-300 mb-1"
            >
              ADMIN EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              placeholder="admin@stockbridge.local"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono font-bold text-slate-300 mb-1"
            >
              ADMIN PASSWORD
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              placeholder="••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center rounded-lg bg-[#ff7a1a] py-3 px-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] disabled:opacity-60 font-quicksand"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Sign In to Operations Console'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-300 transition"
          >
            ← Return to Public Marketplace
          </Link>
        </div>

      </div>
    </div>
  );
}
