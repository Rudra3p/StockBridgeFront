import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookies } from '@/lib/auth';
import { Role } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const role = (body?.role as Role) || undefined;
    await clearSessionCookies(role);
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch {
    await clearSessionCookies();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  }
}
