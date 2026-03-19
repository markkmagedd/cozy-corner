export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export type AdminRole = 'admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export const ADMIN_AUTH_COOKIE = 'sb-admin-session';
