'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse, Role } from '@/lib/types';

interface DashboardViewProps {
  expectedRole: Role;
  portalTitle: string;
}

export default function DashboardView({
  expectedRole,
  portalTitle,
}: DashboardViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const result = await clientAuth.getMe();
      if (isMounted) {
        if (result.authenticated && result.user) {
          setProfile(result.user);
        } else {
          router.push('/login');
        }
        setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await clientAuth.logout();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isPending = profile.organisation?.verificationStatus === 'PENDING';
  const isApproved = profile.organisation?.verificationStatus === 'APPROVED';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Verification Status Banner */}
        {isPending && (
          <div
            role="status"
            className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm text-amber-900 flex items-start gap-3.5"
          >
            <svg
              className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-bold text-amber-950">
                Your business is waiting for admin approval.
              </p>
              <p className="mt-0.5 text-xs text-amber-800">
                Our verification team is validating your GST and company credentials. Once approved, you can initiate live transactions.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {portalTitle}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isPending
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  Status: {profile.organisation?.verificationStatus || 'PENDING'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome, {profile.fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Logged in as <strong className="text-slate-700">{profile.email}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          {/* Business & Account Details Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Organisation Details
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Legal Name:</dt>
                  <dd className="font-semibold text-slate-900">
                    {profile.organisation?.legalName || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Org Type:</dt>
                  <dd className="font-medium text-slate-800">
                    {profile.organisation?.orgType || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">GST Number:</dt>
                  <dd className="font-mono font-medium text-slate-800">
                    {profile.organisation?.gstNumber || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Location:</dt>
                  <dd className="text-slate-800">
                    {profile.organisation?.city}, {profile.organisation?.state} ({profile.organisation?.pinCode})
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Account Summary
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Assigned Role:</dt>
                  <dd className="font-bold text-slate-900">{profile.role}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phone Contact:</dt>
                  <dd className="font-medium text-slate-800">{profile.phone || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Account Status:</dt>
                  <dd className="text-emerald-700 font-semibold">Active</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Registered On:</dt>
                  <dd className="text-slate-700">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'Recently'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Role-specific Actions Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {profile.role === 'SELLER' && 'Surplus Inventory Management'}
            {profile.role === 'BUYER' && 'Available Surplus Marketplace'}
            {profile.role === 'ADMIN' && 'Platform Administration & Verification'}
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            {profile.role === 'SELLER' &&
              'List surplus production lots, define lot sizes, and set B2B discount tiers.'}
            {profile.role === 'BUYER' &&
              'Browse verified inventory listings from manufacturers and distributors.'}
            {profile.role === 'ADMIN' &&
              'Review and verify newly registered business GST documents.'}
          </p>

          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
            Marketplace features (Catalogue, Cart, and Bidding) will be enabled in upcoming project phases.
          </div>
        </div>
      </div>
    </div>
  );
}
