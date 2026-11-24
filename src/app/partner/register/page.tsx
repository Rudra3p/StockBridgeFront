'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Loader2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { clientAuth } from '@/lib/client-api';
import { OrgType } from '@/lib/types';
import type { SelectedLocationData } from '@/components/LocationPickerMap';

// Dynamically load MapLibre GL JS + OpenFreeMap Location Picker (SSR safe)
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[320px] rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-[#e65c00]" />
      <span className="text-xs font-bold text-slate-500 font-quicksand">
        Loading OpenFreeMap Vector Layer (MapLibre GL)...
      </span>
    </div>
  ),
});

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<2 | 3>(2);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'SELLER',
      orgType: 'MANUFACTURER',
      legalName: '',
      gstNumber: '',
      addressLine: 'Plot 104, Sachin GIDC Industrial Area',
      city: 'Surat',
      state: 'Gujarat',
      pinCode: '394230',
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const legalNameWatch = watch('legalName');
  const gstNumberWatch = watch('gstNumber');
  const cityWatch = watch('city');

  const handleMapLocationSelect = useCallback((loc: SelectedLocationData) => {
    setValue('addressLine', loc.addressLine, { shouldValidate: true });
    setValue('city', loc.city, { shouldValidate: true });
    setValue('state', loc.state, { shouldValidate: true });
    setValue('pinCode', loc.pinCode, { shouldValidate: true });
  }, [setValue]);

  const goToNextStep = async () => {
    setServerError(null);
    const isValid = await trigger([
      'legalName',
      'orgType',
      'gstNumber',
      'addressLine',
      'city',
      'state',
    ]);

    if (isValid) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          pinCode: data.pinCode?.trim() || '000000',
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

      // Redirect to partner login page with success notification
      router.push('/partner/login?registered=true');
    } catch {
      setServerError('An unexpected error occurred during partner onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-quicksand text-balance tracking-tight">
            Register as a Business Partner
          </h1>
        </div>

        {/* ========================================================= */}
        {/* MULTI-STEP WIZARD STEPPER (PSYCHOLOGICAL PROGRESSION)      */}
        {/* ========================================================= */}
        <div className="mb-8">
          {/* Stepper Steps */}
          <div className="flex items-center justify-between relative">
            {/* Step 1: Partner Pre-qualification (Always Complete) */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e65c00] text-white shadow-sm ring-4 ring-orange-50 text-xs font-bold">
                ✓
              </div>
              <span className="mt-2 text-[11px] font-bold text-orange-950 font-quicksand text-center">
                1. Partnership Tier
              </span>
              <span className="text-[10px] text-orange-600 font-mono hidden sm:inline">
                Verified Enterprise
              </span>
            </div>

            {/* Connecting Line 1 */}
            <div className="h-0.5 flex-1 bg-[#e65c00] -mt-6"></div>

            {/* Step 2: Factory & Facility Profile */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  currentStep === 2
                    ? 'bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm'
                    : 'bg-[#e65c00] text-white ring-4 ring-orange-50'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span
                className={`mt-2 text-[11px] font-bold font-quicksand text-center ${
                  currentStep === 2 ? 'text-slate-900' : 'text-orange-950'
                }`}
              >
                2. Enterprise Profile
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                GSTIN &amp; Warehouse
              </span>
            </div>

            {/* Connecting Line 2 */}
            <div
              className={`h-0.5 flex-1 -mt-6 transition-all ${
                currentStep === 3 ? 'bg-[#e65c00]' : 'bg-slate-200'
              }`}
            ></div>

            {/* Step 3: Account Signatory */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  currentStep === 3
                    ? 'bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                3
              </div>
              <span
                className={`mt-2 text-[11px] font-bold font-quicksand text-center ${
                  currentStep === 3 ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                3. Partner Signatory
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                Auth &amp; Security
              </span>
            </div>
          </div>

          {/* Progress Bar & Psychological Notice */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5 font-quicksand">
              <span>
                {currentStep === 2
                  ? 'Manufacturing & Warehouse Information'
                  : 'Authorized Liquidation Signatory'}
              </span>
              <span className="font-mono font-bold text-slate-700">
                {currentStep === 2 ? '65% Complete' : '95% Complete — Final Step'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#e65c00] h-full transition-all duration-500 rounded-full"
                style={{ width: currentStep === 2 ? '65%' : '95%' }}
              ></div>
            </div>
          </div>

          {/* Psychological Momentum Banner */}
          {currentStep === 2 ? (
            <div className="mt-4 p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center gap-2.5 text-xs text-orange-950">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e65c00] text-white font-bold text-[10px]">
                ✓
              </span>
              <p className="font-quicksand">
                <strong>Step 1 Verified:</strong> Liquidation partner eligibility approved. You are qualified for 100% pre-funded escrow deposits before lot dispatch.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-quicksand truncate">
                <span className="text-base shrink-0">🏭</span>
                <span className="truncate">
                  Onboarding <strong>{legalNameWatch || 'Your Enterprise'}</strong>
                  {gstNumberWatch ? ` (${gstNumberWatch.toUpperCase()})` : ''}
                  {cityWatch ? ` • ${cityWatch}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#e65c00] font-bold hover:underline shrink-0 font-quicksand"
              >
                Edit Details
              </button>
            </div>
          )}
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

        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[540px] flex flex-col justify-between" noValidate>
          {/* Hidden Role: SELLER */}
          <input type="hidden" value="SELLER" {...register('role')} />

          {/* Hidden Form Bindings for Location (Populated by Map) */}
          <input type="hidden" {...register('addressLine')} />
          <input type="hidden" {...register('city')} />
          <input type="hidden" {...register('state')} />
          <input type="hidden" {...register('pinCode')} />

          {/* ========================================================= */}
          {/* STEP 2: ENTERPRISE & DISPATCH WAREHOUSE DETAILS            */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-bold text-slate-900 mb-4 font-quicksand">
                  Manufacturing &amp; Facility Profile
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
                      placeholder="e.g. Apex Textiles &amp; Spinning Mills Pvt Ltd"
                      autoComplete="organization"
                      {...register('legalName')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
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
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e65c00]"
                    >
                      <option value="MANUFACTURER">Manufacturer / Factory Plant</option>
                      <option value="DISTRIBUTOR">Master Distributor / C&amp;F Agent</option>
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
                      className={`w-full uppercase font-mono rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                        errors.gstNumber ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.gstNumber && (
                      <p className="mt-1 text-xs text-rose-500">{errors.gstNumber.message}</p>
                    )}
                  </div>

                  {/* Interactive MapLibre GL JS + OpenFreeMap Location Picker */}
                  <div className="sm:col-span-2 pt-1">
                    <label className="block text-xs font-bold text-slate-800 mb-2 font-quicksand flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#e65c00]" />
                      <span>Factory &amp; Primary Dispatch Godown Location (Interactive Map) *</span>
                    </label>
                    
                    <LocationPickerMap
                      initialLat={21.1702} // Surat hub default for partner sellers
                      initialLng={72.8311}
                      onLocationSelect={handleMapLocationSelect}
                    />

                    {(errors.addressLine || errors.city || errors.state) && (
                      <p className="mt-1.5 text-xs text-rose-600 font-quicksand">
                        Please pin your factory or dispatch warehouse on the map to continue.
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-quicksand"
                >
                  <span>Continue to Partner Signatory</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: AUTHORIZED SIGNATORY & CREDENTIALS FORM            */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-bold text-slate-900 mb-1 font-quicksand">
                  Authorized Representative Details
                </legend>
                <p className="text-xs text-slate-500 mb-4 font-quicksand">
                  Designate the primary executive authorized to list surplus inventory, accept bids, and approve bank payouts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Signatory Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Ramesh Patel (Director / Head of Supply Chain)"
                      autoComplete="name"
                      {...register('fullName')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
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
                      Corporate Business Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="ramesh@apextextiles.com"
                      autoComplete="username"
                      {...register('email')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
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
                      Official Contact Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98250 12345"
                      autoComplete="tel"
                      {...register('phone')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
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
                      Seller Portal Password (min 8 characters) *
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register('password')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e65c00] ${
                        errors.password ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </fieldset>

              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-orange-950 space-y-1 font-quicksand">
                <p className="font-semibold flex items-center gap-1.5">
                  <span>🛡️</span> Confidential Liquidation Protection
                </p>
                <p className="text-[11px] text-orange-900/80">
                  StockBridge automatically applies brand masking and geo-fenced liquidation to protect your brand equity and prevent channel conflict.
                </p>
              </div>

              {/* Action Buttons: Back + Submit */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition font-quicksand"
                >
                  ← Back to Facility Details
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#e65c00] hover:bg-[#c44e00] py-3.5 px-6 text-sm font-bold text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#e65c00] focus:ring-offset-2 disabled:opacity-60 font-quicksand"
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
                      Creating Partner Account...
                    </span>
                  ) : (
                    <span>Register as Liquidation Partner →</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer link */}
          <div className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-100 font-quicksand">
            Already registered?{' '}
            <Link href="/partner/login" className="font-bold text-[#e65c00] hover:underline">
              Sign In to Seller Central →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
