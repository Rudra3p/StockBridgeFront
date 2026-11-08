import 'server-only';
import { cookies } from 'next/headers';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfileResponse,
  ApiErrorResponse,
} from './types';
import { TOKEN_COOKIE_NAME } from './auth';

// Read server-only environment variables (neither may start with NEXT_PUBLIC_)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || '';

/**
 * Server-only helper to communicate with the Spring Boot backend.
 * - Enforces server-only execution via the "server-only" package.
 * - Sends X-API-KEY header on every request.
 * - Automatically attaches Authorization: Bearer <token> from httpOnly cookie if logged in.
 */
export async function backendFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  explicitToken?: string
): Promise<{ data?: T; error?: ApiErrorResponse; status: number }> {
  const url = `${BACKEND_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Read JWT from httpOnly cookie if not explicitly passed
  let token = explicitToken;
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      // In case cookies() is called outside an incoming request context
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-API-KEY': BACKEND_API_KEY,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store',
    });

    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json');
    const json = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        error: json || {
          status: response.status,
          message: response.statusText || 'Backend request failed',
        },
        status: response.status,
      };
    }

    return {
      data: json as T,
      status: response.status,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Network error communicating with backend';
    return {
      error: {
        status: 503,
        message: `${message}. Ensure the Spring Boot backend is running at ${BACKEND_URL}`,
      },
      status: 503,
    };
  }
}

/**
 * Server-only backend methods for Route Handlers
 */
export const backend = {
  login: (credentials: LoginRequest) =>
    backendFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: RegisterRequest) =>
    backendFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: (token?: string) =>
    backendFetch<UserProfileResponse>('/api/me', { method: 'GET' }, token),
};
