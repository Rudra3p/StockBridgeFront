'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { clientAuth } from '@/lib/client-api';
import { OrgType } from '@/lib/types';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'SELLER',
      orgType: 'MANUFACTURER',
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
          role: 'SELLER' as const,
        },
      };

      const result = await clientAuth.register(payload);

      if (!result.success) {
        setServerError(result.error || 'Partner registration failed. Please check your GSTIN and details.');
        setIsSubmitting(false);
        return;
      }

      // Redirect to login page with success notification
      router.push('/login?registered=partner');
    } catch {
      setServerError('An unexpected error occurred during partner onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Switcher Banner: Buyer vs Seller */}
        <div className="mb-6 p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e65c00] text-white font-bold text-[10px]">
              🤝
            </span>
            <span className="font-bold text-orange-950 font-quicksand">
              Partner Liquidation Account (Selling Surplus)
            </span>
          </div>
          <Link
            href="/register"
            className="text-[#e65c00] font-bold hover:underline font-mono"
          >
            Looking to Buy Wholesale? Register as Buyer →
          </Link>
        </div>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-[#e65c00] mb-3">
            FACTORY / MILL / BRAND PARTNER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-quicksand">
            Register as a Business Partner
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-quicksand max-w-md mx-auto">
            Liquidate aging stock, factory seconds, and cancelled export lots with 100% pre-funded escrow and confidential brand masking.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-rose-50 p-4 border border-rose-200 text-sm text-rose-800 flex items-start gap-3"
          >
            <span className="text-rose-500 font-bold">⚠️</span>
            <div>
              <p className="font-semibold">Registration Issue</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* Hidden Role: SELLER */}
          <input type="hidden" value="SELLER" {...register('role')} />

          {/* 1. Manufacturing & Business Entity Info */}
          <fieldset>
            <legend className="text-base font-semibold text-slate-900 mb-4 font-quicksand flex items-center justify-between">
              <span>Enterprise & Manufacturing Details</span>
              <span className="text-xs font-mono text-slate-400 font-normal">GSTIN Verification Required</span>
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="legalName"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Factory / Corporate Entity Legal Name *
                </label>
                <input
                  id="legalName"
                  type="text"
                  placeholder="e.g. Apex Textiles & Spinning Mills Pvt Ltd"
                  autoComplete="organization"
                  {...register('legalName')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.legalName ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.legalName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.legalName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="orgType"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Business Facility Category *
                </label>
                <select
                  id="orgType"
                  {...register('orgType')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                >
                  <option value="MANUFACTURER">Manufacturer / Factory</option>
                  <option value="DISTRIBUTOR">Master Distributor</option>
                  <option value="WHOLESALER">Large Wholesaler / Stockist</option>
                  <option value="RETAILER">Brand OEM / Importer</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="gstNumber"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Company GSTIN *
                </label>
                <input
                  id="gstNumber"
                  type="text"
                  placeholder="24AAACA1234A1Z5"
                  autoComplete="off"
                  {...register('gstNumber')}
                  className={`w-full uppercase font-mono rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.gstNumber ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.gstNumber && (
                  <p className="mt-1 text-xs text-rose-500">{errors.gstNumber.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Primary Warehouse / Dispatch Godown Address *
                </label>
                <input
                  id="addressLine"
                  type="text"
                  placeholder="e.g. Plot 42, GIDC Apparel Park, Industrial Area"
                  autoComplete="street-address"
                  {...register('addressLine')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.addressLine ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.addressLine && (
                  <p className="mt-1 text-xs text-rose-500">{errors.addressLine.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Dispatch Hub City *
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Surat, Tirupur, Agra, Bhiwandi"
                  autoComplete="address-level2"
                  {...register('city')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.city ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-rose-500">{errors.city.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                    placeholder="Gujarat"
                    autoComplete="address-level1"
                    {...register('state')}
                    className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                      errors.state ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-rose-500">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pinCode"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Pin Code *
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    placeholder="395002"
                    autoComplete="postal-code"
                    {...register('pinCode')}
                    className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                      errors.pinCode ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.pinCode && (
                    <p className="mt-1 text-xs text-rose-500">{errors.pinCode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* 2. Authorized Account Signatory */}
          <fieldset>
            <legend className="text-base font-semibold text-slate-900 mb-4 font-quicksand">
              Authorized Partner Representative
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Representative Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  autoComplete="name"
                  {...register('fullName')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.fullName ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Corporate Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ramesh@apextextiles.com"
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Direct Mobile Phone (OTP Verification) *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="9825012345"
                  autoComplete="tel"
                  {...register('phone')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.phone ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Create Security Password *
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                    errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1 font-quicksand">
                  Must be at least 8 characters with 1 number and 1 special character.
                </p>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#e65c00] hover:bg-[#c44e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e65c00] shadow-md transition disabled:opacity-50 font-quicksand"
          >
            {isSubmitting ? 'Creating Partner Account...' : 'Register as Liquidation Partner →'}
          </button>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500 font-quicksand">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-[#e65c00] hover:underline">
              Sign In to Seller Central
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
