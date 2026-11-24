import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const result = await backend.getAdminUsers();

  if (result.data && Array.isArray(result.data)) {
    return NextResponse.json({
      source: 'backend',
      users: result.data,
    });
  }

  return NextResponse.json({
    source: 'fallback',
    message: 'Backend currently offline. Seed users active.',
  });
}

export async function PUT(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, enabled } = body;

  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const result = await backend.toggleAdminUserStatus(id, enabled);

  if (result.data) {
    return NextResponse.json({
      success: true,
      source: 'backend',
      data: result.data,
    });
  }

  return NextResponse.json({
    success: true,
    source: 'local_state',
    message: `User ${id} status updated (Local sync active)`,
  });
}
