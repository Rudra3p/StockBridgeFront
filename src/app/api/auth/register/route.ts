import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { RegisterRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.organisation || !body.user) {
      return NextResponse.json(
        { message: 'Both organisation and user details are required' },
        { status: 400 }
      );
    }

    if (body.user.role !== 'SELLER' && body.user.role !== 'BUYER') {
      return NextResponse.json(
        { message: 'Role must be SELLER or BUYER only' },
        { status: 400 }
      );
    }

    const result = await backend.register(body);

    if (result.error || !result.data) {
      return NextResponse.json(
        {
          message: result.error?.message || 'Registration failed',
          validationErrors: result.error?.validationErrors,
        },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
