import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'stockbridge_token';
const USER_COOKIE_NAME = 'stockbridge_user';

type Role = 'SELLER' | 'BUYER' | 'ADMIN';

function getRoleDashboard(role: Role): string {
  switch (role) {
    case 'SELLER':
      return '/seller/dashboard';
    case 'BUYER':
      return '/buyer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}

function parseRoleFromToken(token: string): Role | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return (payload.role as Role) || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const userCookie = request.cookies.get(USER_COOKIE_NAME)?.value;

  let role: Role | null = null;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      role = user.role as Role;
    } catch {
      // fallback to token decoding
    }
  }

  if (!role && token) {
    role = parseRoleFromToken(token);
  }

  const isAuthenticated = Boolean(token && role);

  // 1. If user is already authenticated and visits /login or /register, redirect to their dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    const targetDashboard = getRoleDashboard(role!);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 2. Protected routes check: /seller/*, /buyer/*, /admin/*
  const isSellerRoute = pathname.startsWith('/seller');
  const isBuyerRoute = pathname.startsWith('/buyer');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isSellerRoute || isBuyerRoute || isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based authorization
    if (isSellerRoute && role !== 'SELLER') {
      return NextResponse.redirect(new URL(getRoleDashboard(role!), request.url));
    }

    if (isBuyerRoute && role !== 'BUYER') {
      return NextResponse.redirect(new URL(getRoleDashboard(role!), request.url));
    }

    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role!), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/seller/:path*',
    '/buyer/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
