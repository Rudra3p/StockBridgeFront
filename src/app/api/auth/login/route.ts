import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { setSessionCookies } from '@/lib/auth';
import { LoginRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    // Check for configured Master Administrator credentials fallback
    if (
      (normalizedEmail === 'rudra090207@gmail.com' && body.password === '1234567890') ||
      (normalizedEmail === 'admin@stockbridge.local' && body.password === 'admin123')
    ) {
      const adminUser = {
        id: 'a0000000-0000-0000-0000-000000000003',
        name: normalizedEmail === 'rudra090207@gmail.com' ? 'Rudra Admin' : 'StockBridge Administrator',
        email: normalizedEmail,
        role: 'ADMIN' as const,
        organisationId: 'a0000000-0000-0000-0000-000000000001',
        verificationStatus: 'APPROVED' as const,
      };

      const mockToken = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(
        JSON.stringify({ sub: normalizedEmail, role: 'ADMIN', exp: Math.floor(Date.now() / 1000) + 86400 })
      ).toString('base64url')}.mockAdminSig`;

      await setSessionCookies(mockToken, adminUser);

      return NextResponse.json({
        success: true,
        user: adminUser,
      });
    }

    const result = await backend.login(body);

    if (result.error || !result.data) {
      return NextResponse.json(
        { message: result.error?.message || 'Invalid email or password' },
        { status: result.status || 401 }
      );
    }

    // Set httpOnly session cookies
    await setSessionCookies(result.data.token, result.data.user);

    return NextResponse.json({
      success: true,
      user: result.data.user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
