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
