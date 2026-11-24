'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-api';
import { UserProfileResponse } from '@/lib/types';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function AdminProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [fullName, setFullName] = useState('Rudra Admin');
  const [email, setEmail] = useState('rudra090207@gmail.com');
  const [phone, setPhone] = useState('7016047658');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        const adminRes = await fetch('/api/admin/profile');
        if (adminRes.ok) {
          const adminJson = await adminRes.json();
          if (adminJson.success && adminJson.user) {
            if (isMounted) {
              setCurrentUser(adminJson.user);
              setFullName(adminJson.user.fullName || 'Rudra Admin');
              setEmail(adminJson.user.email || 'rudra090207@gmail.com');
              setPhone(adminJson.user.phone || '7016047658');
              setLoading(false);
            }
            return;
          }
        }
      } catch {
        // fallback to clientAuth
      }

      const res = await clientAuth.getMe();
      if (isMounted) {
        if (res.authenticated && res.user && res.user.role === 'ADMIN') {
          setCurrentUser(res.user);
          setFullName(res.user.fullName || 'Rudra Admin');
          setEmail(res.user.email || 'rudra090207@gmail.com');
          setPhone(res.user.phone || '7016047658');
          setLoading(false);
        } else {
          router.replace('/admin/login');
        }
      }
    }

    loadUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: 'error', text: json.message || 'Failed to update profile' });
        setSavingProfile(false);
        return;
      }

      setProfileMsg({ type: 'success', text: 'Administrator profile details updated successfully!' });
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          fullName,
          email,
          phone,
        });
      }
      setSavingProfile(false);
    } catch {
      setProfileMsg({ type: 'error', text: 'Network error. Please try again.' });
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setPasswordMsg({ type: 'error', text: json.message || 'Failed to update password' });
        setSavingPassword(false);
        return;
      }

      setPasswordMsg({ type: 'success', text: 'Password updated successfully! Please use your new password next time.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavingPassword(false);
    } catch {
      setPasswordMsg({ type: 'error', text: 'Network error. Please try again.' });
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await clientAuth.logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff7a1a] border-t-transparent" />
          <p className="text-sm font-mono text-slate-400">Loading Administrator Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-orange-950 selection:text-orange-200">
      
      {/* ── Left Sidebar Navigation (Desktop permanent / Mobile drawer) ── */}
      <DashboardSidebar
        role="ADMIN"
        activeTab="profile"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* ── Operations Main Workspace ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold font-quicksand text-white">
                Administrator Profile &amp; Security Settings
              </h1>
              <p className="text-xs font-mono text-slate-400">
                {currentUser?.email} • {currentUser?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono font-bold text-slate-200 hover:text-white transition"
            >
              ← Back to Admin Console
            </Link>
          </div>
        </header>

        {/* ── Main Container ─────────────────────────────────────── */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-2xl font-mono shadow-lg">
              RA
            </div>
            <div>
              <h2 className="text-xl font-bold font-quicksand text-white">
                {fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                <span>Role: <strong className="text-[#ff7a1a]">MASTER_ADMIN</strong></span>
                <span>•</span>
                <span>Org: <strong className="text-slate-200">{currentUser?.organisation?.legalName || 'StockBridge Admin'}</strong></span>
                <span>•</span>
                <span>GST: <strong className="text-emerald-400">ADMIN0000000001</strong></span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-auto text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            ✓ Active Session Verified
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ====================================================== */}
          {/* 1. UPDATE CONTACT & PROFILE FORM                       */}
          {/* ====================================================== */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#ff7a1a]" />
                <h3 className="text-lg font-bold font-quicksand text-white">
                  Contact Information
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-quicksand">
                Update your administrative contact email and direct mobile number.
              </p>
            </div>

            {profileMsg && (
              <div
                className={`p-3 rounded-lg text-xs font-mono border ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  ADMIN EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full flex items-center justify-center rounded-lg bg-[#ff7a1a] py-2.5 px-4 text-xs font-mono font-bold text-white shadow-sm transition hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] disabled:opacity-60"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* ====================================================== */}
          {/* 2. UPDATE PASSWORD & SECURITY FORM                     */}
          {/* ====================================================== */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h3 className="text-lg font-bold font-quicksand text-white">
                  Security &amp; Password
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-quicksand">
                Rotate your master administrator password. Minimum 8 characters.
              </p>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-lg text-xs font-mono border ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 px-4 text-xs font-mono font-bold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-60"
                >
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Audit & Security Specs */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 text-xs font-mono text-slate-400 space-y-1">
          <div className="text-slate-300 font-bold uppercase mb-2">
            Operations Audit Log Policy:
          </div>
          <p>• All credential modifications are logged with UTC timestamps and client IP address.</p>
          <p>• Escrow arbitration and lot approval rights require continuous two-factor validation.</p>
        </div>

      </main>

      </div>
    </div>
  );
}
