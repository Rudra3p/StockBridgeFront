import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfileResponse,
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

  async logout(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getMe(): Promise<{
    authenticated: boolean;
    user?: UserProfileResponse;
  }> {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) return { authenticated: false };
      const data = await res.json();
      return { authenticated: true, user: data };
    } catch {
      return { authenticated: false };
    }
  },
};
