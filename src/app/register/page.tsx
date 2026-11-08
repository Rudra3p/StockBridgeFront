'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { clientAuth } from '@/lib/client-api';
import { OrgType, Role } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'SELLER',
      orgType: 'WHOLESALER',
      legalName: '',
      gstNumber: '',
      addressLine: '',
      city: '',
      state: '',
      pinCode: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        organisation: {
          legalName: data.legalName.trim(),
          orgType: data.orgType as OrgType,
          gstNumber: data.gstNumber.trim().toUpperCase(),
          addressLine: data.addressLine.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pinCode: data.pinCode.trim(),
        },
        user: {
          fullName: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          password: data.password,
          role: data.role as 'SELLER' | 'BUYER',
        },
      };

      const result = await clientAuth.register(payload);

      if (!result.success) {
        setServerError(result.error || 'Registration failed. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      // Redirect to login page with success notification
      router.push('/login?registered=true');
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Register your Business
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Join the StockBridge B2B marketplace to buy or liquidate surplus inventory.
          </p>
        </div>

        {/* Server-side Error Alert */}
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
            <div>
              <p className="font-semibold">Registration Notice</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* 1. Account Role Selection */}
          <fieldset>
            <legend className="block text-sm font-semibold text-slate-900 mb-3">
              I want to use StockBridge as:
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition ${
                  selectedRole === 'SELLER'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value="SELLER"
                  {...register('role')}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="block text-sm font-bold text-slate-900">
                    I am a Seller
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Manufacturer, Distributor, or Wholesaler liquidating surplus stock.
                  </span>
                </div>
              </label>

              <label
                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition ${
                  selectedRole === 'BUYER'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value="BUYER"
                  {...register('role')}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="block text-sm font-bold text-slate-900">
                    I am a Buyer
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Retailer or Reseller sourcing discounted inventory in bulk.
                  </span>
                </div>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-rose-600">{errors.role.message}</p>
            )}
          </fieldset>

          {/* 2. Business Details */}
          <fieldset className="pt-4 border-t border-slate-200">
            <legend className="text-base font-semibold text-slate-900 mb-4">
              Business Information
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="legalName"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Organisation Legal Name *
                </label>
                <input
                  id="legalName"
                  type="text"
                  autoComplete="organization"
                  {...register('legalName')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.legalName ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Apex Industrial Supplies Pvt Ltd"
                />
                {errors.legalName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.legalName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="orgType"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Organisation Type *
                </label>
                <select
                  id="orgType"
                  {...register('orgType')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.orgType ? 'border-rose-300' : 'border-slate-300'
                  }`}
                >
                  <option value="MANUFACTURER">Manufacturer</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                  <option value="WHOLESALER">Wholesaler</option>
                  <option value="RETAILER">Retailer</option>
                  <option value="ONLINE_RESELLER">Online Reseller</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.orgType && (
                  <p className="mt-1 text-xs text-rose-600">{errors.orgType.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gstNumber"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  GST Number (GSTIN) *
                </label>
                <input
                  id="gstNumber"
                  type="text"
                  autoCapitalize="characters"
                  {...register('gstNumber')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.gstNumber ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                />
                {errors.gstNumber && (
                  <p className="mt-1 text-xs text-rose-600">{errors.gstNumber.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Address Line *
                </label>
                <input
                  id="addressLine"
                  type="text"
                  autoComplete="address-line1"
                  {...register('addressLine')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.addressLine ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="Street, Industrial Area, Building name"
                />
                {errors.addressLine && (
                  <p className="mt-1 text-xs text-rose-600">{errors.addressLine.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  {...register('city')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.city ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Bengaluru"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-rose-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  autoComplete="address-level1"
                  {...register('state')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.state ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Karnataka"
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-rose-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pinCode"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  PIN Code *
                </label>
                <input
                  id="pinCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  {...register('pinCode')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.pinCode ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. 560001"
                />
                {errors.pinCode && (
                  <p className="mt-1 text-xs text-rose-600">{errors.pinCode.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* 3. Personal / User Account Details */}
          <fieldset className="pt-4 border-t border-slate-200">
            <legend className="text-base font-semibold text-slate-900 mb-4">
              Authorized Representative Details
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  {...register('fullName')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.fullName ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Rajesh Verma"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Business Email *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  spellCheck="false"
                  {...register('email')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. rajesh@apexsupplies.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.phone ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="e.g. +91 9876543210"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Password (minimum 8 characters) *
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center rounded-lg bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
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
                  Creating Account...
                </span>
              ) : (
                'Create Business Account'
              )}
            </button>
          </div>

          <div className="text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500 underline underline-offset-2"
            >
              Log In here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
