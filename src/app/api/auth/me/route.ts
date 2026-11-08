import { NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionToken, clearSessionCookies } from '@/lib/auth';

export async function GET() {
  const token = await getSessionToken();

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
