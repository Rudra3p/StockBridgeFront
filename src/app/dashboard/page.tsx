'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientAuth } from '@/lib/client-api';
import DashboardView from '@/components/DashboardView';
import { Role } from '@/lib/types';

export default function GeneralDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkUser() {
      const res = await clientAuth.getMe();
      if (isMounted) {
        if (res.authenticated && res.user) {
          setRole(res.user.role);
        } else {
          router.push('/login');
        }
        setLoading(false);
      }
    }
    checkUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading || !role) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e65c00] border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium font-quicksand">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const portalTitle =
    role === 'SELLER'
      ? 'Seller Liquidation Portal'
      : role === 'ADMIN'
      ? 'Administration Console'
      : 'Wholesale Buyer Portal';

  return <DashboardView expectedRole={role} portalTitle={portalTitle} />;
}
