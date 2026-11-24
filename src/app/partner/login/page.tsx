'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { clientAuth } from '@/lib/client-api';

function PartnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'partner';

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const result = await clientAuth.login({
        ...data,
        role: 'SELLER',
      });

      if (!result.success || !result.data) {
        setServerError(result.error || 'Invalid partner email or password');
        setIsSubmitting(false);
        return;
      }

      // Always send partner login directly to partner dashboard
      router.push('/partner/dashboard');
      router.refresh();
    } catch {
      setServerError('An unexpected error occurred during partner sign-in. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e65c00] text-white font-extrabold text-xl shadow-sm mb-4">
            🏭
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-100 text-[#e65c00] mb-2 uppercase tracking-wider">
            SELLER CENTRAL
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-quicksand">
            Partner Sign In
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-quicksand">
            Access your factory surplus lots, bids, and 100% pre-funded escrow settlements.
          </p>
        </div>

        {/* Verification Success Message - Green is permitted for verification alerts */}
        {registered && (
          <div
            role="status"
            className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-3"
          >
            <span className="text-emerald-600 font-bold text-lg">✓</span>
            <div>
              <p className="font-semibold">Partner Registration Submitted!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your factory/godown account is recorded with status PENDING. Please sign in below.
              </p>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-rose-50 p-4 border border-rose-200 text-sm text-rose-800 flex items-start gap-3"
          >
            <span className="text-rose-500 font-bold">⚠️</span>
            <p className="text-xs">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 mb-1 font-quicksand"
            >
              Corporate / Partner Email *
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              spellCheck="false"
              {...register('email')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] min-h-[44px] ${
                errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
              }`}
              placeholder="e.g. director@apexmills.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 mb-1 font-quicksand"
            >
              Account Password *
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] min-h-[44px] ${
                errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center rounded-xl bg-[#e65c00] py-3.5 px-4 text-sm font-bold text-white shadow-md transition hover:bg-[#c44e00] focus:outline-none focus:ring-2 focus:ring-[#e65c00] focus:ring-offset-2 disabled:opacity-60 min-h-[44px] active:scale-[0.98] font-quicksand"
          >
            {isSubmitting ? (
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
                Signing In...
              </span>
            ) : (
              'Sign In to Seller Central →'
            )}
          </button>

          <div className="text-center text-xs text-slate-600 pt-2 space-y-2.5 font-quicksand">
            <div>
              New surplus liquidator?{' '}
              <Link
                href="/partner/register"
                className="font-bold text-[#e65c00] hover:underline"
              >
                Register as Business Partner
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Wholesale Buyer?{' '}
              <Link
                href="/login"
                className="font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                Go to Wholesale Buyer Login →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PartnerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e65c00] border-t-transparent" />
        </div>
      }
    >
      <PartnerLoginForm />
    </Suspense>
  );
}
