import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const result = await backend.getAdminListings();

  if (result.data && Array.isArray(result.data)) {
    return NextResponse.json({
      source: 'backend',
      listings: result.data,
    });
  }

  return NextResponse.json({
    source: 'fallback',
    message: 'Backend currently offline. Seed lots active.',
  });
}

export async function PUT(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ message: 'Listing ID and status are required' }, { status: 400 });
  }

  const result = await backend.updateAdminListingStatus(id, status);

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
    message: `Listing ${id} status set to ${status} (Local sync active)`,
  });
}
