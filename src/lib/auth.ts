import { cookies } from 'next/headers';
import { AuthUser, Role } from './types';

// Distinct, non-colliding cookies for each user type
export const BUYER_TOKEN_COOKIE = 'sb_buyer_token';
export const BUYER_USER_COOKIE = 'sb_buyer_user';

export const SELLER_TOKEN_COOKIE = 'sb_seller_token';
export const SELLER_USER_COOKIE = 'sb_seller_user';

export const ADMIN_TOKEN_COOKIE = 'sb_admin_token';
export const ADMIN_USER_COOKIE = 'sb_admin_user';

// Legacy fallback constants for backward compatibility
export const TOKEN_COOKIE_NAME = BUYER_TOKEN_COOKIE;
export const USER_COOKIE_NAME = BUYER_USER_COOKIE;

export function getTokenCookieName(role?: Role | string): string {
  if (role === 'SELLER') return SELLER_TOKEN_COOKIE;
  if (role === 'ADMIN') return ADMIN_TOKEN_COOKIE;
  return BUYER_TOKEN_COOKIE;
}

export function getUserCookieName(role?: Role | string): string {
  if (role === 'SELLER') return SELLER_USER_COOKIE;
  if (role === 'ADMIN') return ADMIN_USER_COOKIE;
  return BUYER_USER_COOKIE;
}

export async function getSessionToken(role?: Role | string): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieName = getTokenCookieName(role);
  return cookieStore.get(cookieName)?.value;
}

export async function getSessionUser(role?: Role | string): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const cookieName = getUserCookieName(role);
  const userCookie = cookieStore.get(cookieName)?.value;
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie) as AuthUser;
  } catch {
    return null;
  }
}

export async function setSessionCookies(token: string, user: AuthUser, explicitRole?: Role | string) {
  const cookieStore = await cookies();
  const maxAge = 60 * 60 * 24; // 24 hours
  const isProduction = process.env.NODE_ENV === 'production';

  const roleToUse = explicitRole || user.role || 'BUYER';
  const tokenCookie = getTokenCookieName(roleToUse);
  const userCookie = getUserCookieName(roleToUse);

  // Set JWT in isolated httpOnly cookie
  cookieStore.set(tokenCookie, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  // Store user profile info in isolated cookie
  cookieStore.set(userCookie, JSON.stringify(user), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearSessionCookies(role?: Role | string) {
  const cookieStore = await cookies();
  if (role) {
    cookieStore.delete(getTokenCookieName(role));
    cookieStore.delete(getUserCookieName(role));
  } else {
    // Clear all if no role specified
    cookieStore.delete(BUYER_TOKEN_COOKIE);
    cookieStore.delete(BUYER_USER_COOKIE);
    cookieStore.delete(SELLER_TOKEN_COOKIE);
    cookieStore.delete(SELLER_USER_COOKIE);
    cookieStore.delete(ADMIN_TOKEN_COOKIE);
    cookieStore.delete(ADMIN_USER_COOKIE);
  }
}

export function parseJwtPayload(token: string): { role?: Role; sub?: string } | null {
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
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
