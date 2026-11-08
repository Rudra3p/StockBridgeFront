'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { clientAuth } from '@/lib/client-api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';

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
      const result = await clientAuth.login(data);

      if (!result.success || !result.data) {
        setServerError(result.error || 'Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      const role = result.data.user.role;

      // Redirect user by role as requested
      if (role === 'SELLER') {
        router.push('/seller/dashboard');
      } else if (role === 'BUYER') {
        router.push('/buyer/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch {
      setServerError('An unexpected error occurred during login. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-xl shadow-sm mb-4">
            SB
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Sign In to StockBridge
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your B2B inventory liquidation and buying account
          </p>
        </div>

        {/* Post-Registration Success Banner */}
        {registered && (
          <div
            role="status"
            className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-3"
          >
            <svg
              className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Registration successful!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your business has been registered with status PENDING. Please log in with your credentials.
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
            <svg
              className="h-5 w-5 text-rose-500 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Business Email Address *
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              spellCheck="false"
              {...register('email')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
              }`}
              placeholder="e.g. admin@stockbridge.local"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
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
            className="w-full flex items-center justify-center rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
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
              'Sign In'
            )}
          </button>

          <div className="text-center text-xs text-slate-600 pt-2">
            Don&apos;t have a business account yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-500 underline underline-offset-2"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
