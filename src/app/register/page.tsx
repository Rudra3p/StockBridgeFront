'use client';

import { useState } from 'react';
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

// Dynamically load Google Maps-style Leaflet Location Picker to ensure 100% SSR safety
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[320px] rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-[#e65c00]" />
      <span className="text-xs font-bold text-slate-500 font-quicksand">Loading Map...</span>
    </div>
  ),
});

export default function RegisterPage() {
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
      role: 'BUYER',
      orgType: 'RETAILER',
      legalName: '',
      gstNumber: '',
      addressLine: 'Phase 4, GIDC Vatva Industrial Estate',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pinCode: '382445',
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const legalNameWatch = watch('legalName');
  const gstNumberWatch = watch('gstNumber');
  const cityWatch = watch('city');

  const handleMapLocationSelect = (loc: SelectedLocationData) => {
    setValue('addressLine', loc.addressLine, { shouldValidate: true });
    setValue('city', loc.city, { shouldValidate: true });
    setValue('state', loc.state, { shouldValidate: true });
    setValue('pinCode', loc.pinCode, { shouldValidate: true });
  };

  const goToNextStep = async () => {
    setServerError(null);
    const isValid = await trigger([
      'legalName',
      'orgType',
      'gstNumber',
      'addressLine',
      'city',
      'state',
      'pinCode',
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
          pinCode: data.pinCode.trim(),
        },
        user: {
          fullName: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          password: data.password,
          role: 'BUYER' as const,
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-quicksand text-balance tracking-tight">
            Register Your Business
          </h1>
        </div>

        {/* ========================================================= */}
        {/* MULTI-STEP WIZARD STEPPER (PSYCHOLOGICAL PROGRESSION)      */}
        {/* ========================================================= */}
        <div className="mb-8">
          {/* Stepper Steps */}
          <div className="flex items-center justify-between relative">
            {/* Step 1: Pre-Qualification (Always Complete - Psychological Boost) */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e65c00] text-white shadow-sm ring-4 ring-orange-50 text-xs font-bold">
                ✓
              </div>
              <span className="mt-2 text-[11px] font-bold text-orange-950 font-quicksand text-center">
                1. Eligibility
              </span>
              <span className="text-[10px] text-[#e65c00] font-mono hidden sm:inline">
                Verified Free Tier
              </span>
            </div>

            {/* Connecting Line 1 */}
            <div className="h-0.5 flex-1 bg-[#e65c00] -mt-6"></div>

            {/* Step 2: Business Profile */}
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
                2. Business Profile
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                GSTIN &amp; Location
              </span>
            </div>

            {/* Connecting Line 2 */}
            <div
              className={`h-0.5 flex-1 -mt-6 transition-all ${
                currentStep === 3 ? 'bg-[#e65c00]' : 'bg-slate-200'
              }`}
            ></div>

            {/* Step 3: Authorized Signatory */}
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
                3. Signatory Details
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                Personal &amp; Auth
              </span>
            </div>
          </div>

          {/* Progress Bar & Psychological Notice */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5 font-quicksand">
              <span>
                {currentStep === 2
                  ? 'Business Information'
                  : 'Authorized Representative'}
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
            <div className="mt-4 p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center gap-2.5 text-xs text-orange-950">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e65c00] text-white font-bold text-[10px]">
                ✓
              </span>
              <p className="font-quicksand">
                <strong>Step 1 Verified:</strong> Pre-qualification passed! Your enterprise is eligible for zero setup fees and 100% escrow protection.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-quicksand truncate">
                <span className="text-base shrink-0">🏢</span>
                <span className="truncate">
                  Registering <strong>{legalNameWatch || 'Your Organisation'}</strong>
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

        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[540px] flex flex-col justify-between" noValidate>
          {/* Hidden Role and OrgType Inputs */}
          <input type="hidden" value="BUYER" {...register('role')} />
          <input type="hidden" value="RETAILER" {...register('orgType')} />

          {/* Hidden Form Bindings for Location (Populated by Map) */}
          <input type="hidden" {...register('addressLine')} />
          <input type="hidden" {...register('city')} />
          <input type="hidden" {...register('state')} />
          <input type="hidden" {...register('pinCode')} />

          {/* ========================================================= */}
          {/* STEP 2: BUSINESS INFORMATION FORM                          */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-bold text-slate-900 mb-4 font-quicksand">
                  Organisation Information
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Legal Name */}
                  <div>
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
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
                        errors.legalName ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="e.g. Apex Retail Enterprises Pvt Ltd"
                    />
                    {errors.legalName && (
                      <p className="mt-1 text-xs text-rose-600">{errors.legalName.message}</p>
                    )}
                  </div>

                  {/* GSTIN */}
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
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
                        errors.gstNumber ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="e.g. 29ABCDE1234F1Z5"
                    />
                    {errors.gstNumber && (
                      <p className="mt-1 text-xs text-rose-600">{errors.gstNumber.message}</p>
                    )}
                  </div>

                  {/* Interactive Google Map Alternative Location Picker */}
                  <div className="sm:col-span-2 pt-1">
                    <label className="block text-xs font-bold text-slate-800 mb-2 font-quicksand flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#e65c00]" />
                      <span>Dispatch Location &amp; Warehouse Hub (Interactive Map) *</span>
                    </label>
                    
                    <LocationPickerMap onLocationSelect={handleMapLocationSelect} />

                    {(errors.addressLine || errors.city || errors.state || errors.pinCode) && (
                      <p className="mt-1.5 text-xs text-rose-600 font-quicksand">
                        Please pin your location on the map to continue.
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
                  <span>Continue to Signatory Details</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: AUTHORIZED SIGNATORY & SECURITY FORM               */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-bold text-slate-900 mb-1 font-quicksand">
                  Authorized Representative Details
                </legend>
                <p className="text-xs text-slate-500 mb-4 font-quicksand">
                  These credentials will be used to log in and authorize purchase bids, inspections, and escrow releases.
                </p>

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
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
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
                      Official Business Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      spellCheck="false"
                      {...register('email')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
                        errors.email ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="e.g. rajesh@apexretail.com"
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
                      Mobile Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      {...register('phone')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
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
                      Account Password (minimum 8 characters) *
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register('password')}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent ${
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

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e65c00] py-3.5 px-4 text-sm font-bold text-white shadow-md transition hover:bg-[#c44e00] focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 font-quicksand"
                >
                  {isSubmitting ? (
                    <span>Registering Organisation...</span>
                  ) : (
                    <span>Complete Registration &amp; Access Dashboard →</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition py-1 font-quicksand"
                >
                  ← Back to Business Profile
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Existing Member Switcher */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 font-quicksand">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#e65c00] hover:text-[#c44e00] hover:underline"
          >
            Log in to your workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
