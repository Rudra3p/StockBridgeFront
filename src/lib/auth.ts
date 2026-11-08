import { cookies } from 'next/headers';
import { AuthUser, Role } from './types';

export const TOKEN_COOKIE_NAME = 'stockbridge_token';
export const USER_COOKIE_NAME = 'stockbridge_user';

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie) as AuthUser;
  } catch {
    return null;
  }
}

export async function setSessionCookies(token: string, user: AuthUser) {
  const cookieStore = await cookies();
  const maxAge = 60 * 60 * 24; // 24 hours
  const isProduction = process.env.NODE_ENV === 'production';

  // Set JWT in httpOnly cookie
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  // Store non-sensitive user profile info (accessible for fast layout display)
  cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);
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
