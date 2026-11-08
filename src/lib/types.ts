export type Role = 'SELLER' | 'BUYER' | 'ADMIN';

export type OrgType =
  | 'MANUFACTURER'
  | 'DISTRIBUTOR'
  | 'WHOLESALER'
  | 'RETAILER'
  | 'ONLINE_RESELLER'
  | 'OTHER';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Organisation {
  id: string;
  legalName: string;
  orgType: OrgType;
  gstNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  verificationStatus: VerificationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  enabled: boolean;
  createdAt?: string;
  organisation?: Organisation;
}

// User object returned upon successful login
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organisationId: string;
  verificationStatus: VerificationStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterRequest {
  organisation: {
    legalName: string;
    orgType: OrgType;
    gstNumber: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  user: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'SELLER' | 'BUYER';
  };
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  organisation: Organisation;
}

export interface UserProfileResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  organisation: Organisation;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  validationErrors?: Record<string, string>;
}
