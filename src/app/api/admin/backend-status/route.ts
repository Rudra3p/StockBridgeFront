import { NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const startTime = Date.now();
  const result = await backend.getAdminHealth();
  const latencyMs = Date.now() - startTime;

  if (result.data) {
    return NextResponse.json({
      connected: true,
      latencyMs,
      backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
      status: 'UP',
      database: result.data.database || 'CONNECTED',
      stats: {
        totalOrganisations: result.data.totalOrganisations || 0,
        totalUsers: result.data.totalUsers || 0,
        totalListings: result.data.totalListings || 0,
      },
      timestamp: result.data.timestamp || new Date().toISOString(),
    });
  }

  return NextResponse.json({
    connected: false,
    latencyMs,
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
    status: 'OFFLINE_FALLBACK',
    message: result.error?.message || 'Backend is currently offline or unreachable',
  });
}
