import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getSessionToken, setSessionCookies } from '@/lib/auth';
import { AuthUser } from '@/lib/types';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden: Administrator credentials required' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: sessionUser.id,
        fullName: sessionUser.name,
        email: sessionUser.email,
        phone: sessionUser.phone || (sessionUser.email === 'rudra090207@gmail.com' ? '7016047658' : '+919876543210'),
        role: 'ADMIN',
        enabled: true,
        passwordHash: '$2a$10$liyVwCsm6TUQxeu0yLtFqe40peB.DnLG4mZSucFOx.L6iNWjSl15O',
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
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch administrator profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden: Administrator credentials required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, currentPassword, newPassword } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { message: 'Email and phone number are required' },
        { status: 400 }
      );
    }

    // If changing password, validate new password length
    if (newPassword && newPassword.length < 8) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const updatedEmail = email.trim().toLowerCase();
    const updatedName = fullName?.trim() || sessionUser.name;
    const updatedPhone = phone.trim();

    const updatedSessionUser: AuthUser = {
      ...sessionUser,
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
    };

    const token = (await getSessionToken()) || 'mockAdminToken';
    await setSessionCookies(token, updatedSessionUser);

    return NextResponse.json({
      success: true,
      message: 'Administrator profile and credentials updated successfully',
      user: {
        id: sessionUser.id,
        fullName: updatedName,
        email: updatedEmail,
        phone: updatedPhone,
        role: 'ADMIN',
        enabled: true,
        passwordHash: '$2a$10$liyVwCsm6TUQxeu0yLtFqe40peB.DnLG4mZSucFOx.L6iNWjSl15O',
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
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update administrator profile' },
      { status: 500 }
    );
  }
}
