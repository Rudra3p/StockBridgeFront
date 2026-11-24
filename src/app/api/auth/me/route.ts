import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionToken, getSessionUser, clearSessionCookies } from '@/lib/auth';
import { Role } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedRole = (searchParams.get('role') as Role | null) || undefined;

  const token = await getSessionToken(requestedRole);
  const sessionUser = await getSessionUser(requestedRole);

  if (!token && !sessionUser) {
    return NextResponse.json(
      { authenticated: false, message: 'Unauthenticated visitor' },
      { status: 200 }
    );
  }

  // If a specific role was requested and session user does not match, return unauthenticated
  if (requestedRole && sessionUser && sessionUser.role !== requestedRole) {
    return NextResponse.json(
      { authenticated: false, message: 'Role mismatch' },
      { status: 200 }
    );
  }

  // If active session is Master Administrator, resolve profile
  if (sessionUser && sessionUser.role === 'ADMIN') {
    // Only return ADMIN if either ADMIN was requested or no specific role was requested
    if (!requestedRole || requestedRole === 'ADMIN') {
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
    return NextResponse.json(
      { authenticated: false, message: 'Admin session does not match requested role' },
      { status: 200 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { authenticated: false, message: 'Unauthenticated visitor' },
      { status: 200 }
    );
  }

  const result = await backend.getMe(token);

  if (result.error || !result.data) {
    // If backend reports an error or cold start, but we have an authenticated sessionUser cookie:
    if (sessionUser && (!requestedRole || sessionUser.role === requestedRole)) {
      return NextResponse.json({
        id: sessionUser.id,
        fullName: sessionUser.name,
        email: sessionUser.email,
        phone: sessionUser.phone || '',
        role: sessionUser.role,
        enabled: true,
        createdAt: '2026-11-23',
        organisation: sessionUser.organisationId ? {
          id: sessionUser.organisationId,
          legalName: 'Verified Partner Enterprise',
          orgType: 'MANUFACTURER',
          gstNumber: 'VERIFIED',
          addressLine: 'Dispatch Hub Facility',
          city: 'Hub',
          state: 'State',
          pinCode: '000000',
          verificationStatus: sessionUser.verificationStatus || 'APPROVED',
        } : null,
      });
    }

    // If backend explicitly reports 401 and no valid sessionUser, clean up stale cookies
    if (result.status === 401) {
      await clearSessionCookies(requestedRole);
    }
    return NextResponse.json(
      { authenticated: false, message: result.error?.message || 'Failed to fetch user session' },
      { status: 200 }
    );
  }

  if (requestedRole && result.data.role !== requestedRole) {
    return NextResponse.json(
      { authenticated: false, message: 'Role mismatch' },
      { status: 200 }
    );
  }

  return NextResponse.json(result.data);
}
