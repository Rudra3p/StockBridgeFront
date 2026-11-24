import { NextRequest, NextResponse } from 'next/server';

const BUYER_TOKEN_COOKIE = 'sb_buyer_token';
const BUYER_USER_COOKIE = 'sb_buyer_user';

const SELLER_TOKEN_COOKIE = 'sb_seller_token';
const SELLER_USER_COOKIE = 'sb_seller_user';

const ADMIN_TOKEN_COOKIE = 'sb_admin_token';
const ADMIN_USER_COOKIE = 'sb_admin_user';

type Role = 'SELLER' | 'BUYER' | 'ADMIN';

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

function getSessionForRole(request: NextRequest, roleType: Role) {
  let token: string | undefined;
  let userCookie: string | undefined;

  if (roleType === 'BUYER') {
    token = request.cookies.get(BUYER_TOKEN_COOKIE)?.value;
    userCookie = request.cookies.get(BUYER_USER_COOKIE)?.value;
  } else if (roleType === 'SELLER') {
    token = request.cookies.get(SELLER_TOKEN_COOKIE)?.value;
    userCookie = request.cookies.get(SELLER_USER_COOKIE)?.value;
  } else if (roleType === 'ADMIN') {
    token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    userCookie = request.cookies.get(ADMIN_USER_COOKIE)?.value;
  }

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

  const isValid = Boolean(token && role === roleType);
  return { token, role, isValid };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. NEVER redirect public registration pages!
  // Anyone can always visit /register or /partner/register without being bounced
  if (pathname === '/register' || pathname === '/partner/register') {
    return NextResponse.next();
  }

  // 2. Separate Admin Gateway Routing
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname === '/admin' || (pathname.startsWith('/admin/') && !isAdminLogin);

  if (isAdminLogin) {
    const adminSession = getSessionForRole(request, 'ADMIN');
    if (adminSession.isValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const adminSession = getSessionForRole(request, 'ADMIN');
    if (!adminSession.isValid) {
      const adminLoginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        adminLoginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(adminLoginUrl);
    }
    return NextResponse.next();
  }

  // 3. Seller Portal Protected Routes (/seller and /seller/*)
  const isSellerRoute = pathname.startsWith('/seller');
  if (isSellerRoute) {
    const sellerSession = getSessionForRole(request, 'SELLER');
    if (!sellerSession.isValid) {
      const partnerLoginUrl = new URL('/partner/login', request.url);
      partnerLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(partnerLoginUrl);
    }
    return NextResponse.next();
  }

  // 4. Buyer Portal Protected Routes (/buyer and /buyer/*)
  const isBuyerRoute = pathname.startsWith('/buyer');
  if (isBuyerRoute) {
    const buyerSession = getSessionForRole(request, 'BUYER');
    if (!buyerSession.isValid) {
      const buyerLoginUrl = new URL('/login', request.url);
      buyerLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(buyerLoginUrl);
    }
    return NextResponse.next();
  }

  // 5. Login Page Auto-Redirects (STRICTLY role-specific)
  // If already logged in as BUYER, bounce /login to /buyer/dashboard
  if (pathname === '/login') {
    const buyerSession = getSessionForRole(request, 'BUYER');
    if (buyerSession.isValid) {
      return NextResponse.redirect(new URL('/buyer/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If already logged in as SELLER, bounce /partner/login to /seller/dashboard
  if (pathname === '/partner/login') {
    const sellerSession = getSessionForRole(request, 'SELLER');
    if (sellerSession.isValid) {
      return NextResponse.redirect(new URL('/seller/dashboard', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/seller/:path*',
    '/buyer/:path*',
    '/login',
    '/partner/login',
  ],
};
