import { NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionToken, getSessionUser, clearSessionCookies } from '@/lib/auth';

export async function GET() {
  const token = await getSessionToken();
  const sessionUser = await getSessionUser();

  if (!token && !sessionUser) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  // If active session is Master Administrator, resolve profile
  if (sessionUser && sessionUser.role === 'ADMIN') {
    return NextResponse.json({
      id: sessionUser.id,
      fullName: sessionUser.name,
      email: sessionUser.email,
      phone: sessionUser.phone || (sessionUser.email === 'rudra090207@gmail.com' ? '7016047658' : '+919876543210'),
      role: 'ADMIN',
      enabled: true,
      createdAt: '2026-11-23',
      organisation: {
        id: sessionUser.organisationId,
        legalName: 'StockBridge Platform Admin Org',
        orgType: 'OTHER',
        gstNumber: 'ADMIN0000000001',
        addressLine: 'StockBridge HQ, Tech Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        verificationStatus: 'APPROVED',
      },
    });
  }

  if (!token) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  const result = await backend.getMe(token);

  if (result.error || !result.data) {
    // If backend reports 401/403, clean up stale cookies
    if (result.status === 401) {
      await clearSessionCookies();
    }
    return NextResponse.json(
      { message: result.error?.message || 'Failed to fetch user session' },
      { status: result.status || 401 }
    );
  }

  return NextResponse.json(result.data);
}
