import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfileResponse,
  Role,
} from './types';

/**
 * Client-side helper functions that communicate exclusively with Next.js Route Handlers.
 * Client components never call the Spring Boot backend or read backend secrets.
 */
export const clientAuth = {
  async login(credentials: LoginRequest): Promise<{
    success: boolean;
    data?: LoginResponse;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.message || 'Login failed' };
      }
      return { success: true, data: json };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  async register(data: RegisterRequest): Promise<{
    success: boolean;
    data?: RegisterResponse;
    error?: string;
    validationErrors?: Record<string, string>;
  }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: json.message || 'Registration failed',
          validationErrors: json.validationErrors,
        };
      }
      return { success: true, data: json };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  async logout(role?: Role | string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getMe(role?: Role | string): Promise<{
    authenticated: boolean;
    user?: UserProfileResponse;
  }> {
    try {
      const url = role ? `/api/auth/me?role=${role}` : '/api/auth/me';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return { authenticated: false };
      const data = await res.json();
      if (!data || data.authenticated === false || !data.id) {
        return { authenticated: false };
      }
      return { authenticated: true, user: data };
    } catch {
      return { authenticated: false };
    }
  },
};
