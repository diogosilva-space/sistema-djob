import type {
  CreateAdminUserInput,
  UpdateAdminUserInput,
  CreatePlatformTenantInput,
  UpdatePlatformTenantInput,
} from '@djob/validators';

import { apiFetch } from '@/lib/api-client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  document?: string;
  tradeName?: string;
  stateReg?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { users: number };
}

export interface AdminUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SELLER' | 'OPERATOR' | 'VIEWER' | 'SUPER_ADMIN';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
}

function queryString(params: ListParams) {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const value = query.toString();
  return value ? `?${value}` : '';
}

export function fetchTenants(params: ListParams = {}) {
  return apiFetch<PaginatedResponse<Tenant>>(`/admin/tenants${queryString(params)}`);
}

export function createTenant(values: CreatePlatformTenantInput) {
  return apiFetch<{ tenant: Tenant; adminUser: AdminUser }>('/admin/tenants', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function fetchTenant(id: string) {
  return apiFetch<Tenant>(`/admin/tenants/${id}`);
}

export function updateTenant(id: string, values: UpdatePlatformTenantInput) {
  return apiFetch<Tenant>(`/admin/tenants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function toggleTenant(id: string) {
  return apiFetch<Tenant>(`/admin/tenants/${id}/toggle`, { method: 'PATCH' });
}

export function fetchTenantUsers(tenantId: string, params: ListParams = {}) {
  return apiFetch<PaginatedResponse<AdminUser>>(
    `/admin/tenants/${tenantId}/users${queryString(params)}`,
  );
}

export function createUser(tenantId: string, values: CreateAdminUserInput) {
  return apiFetch<AdminUser>(`/admin/tenants/${tenantId}/users`, {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function updateUser(id: string, values: UpdateAdminUserInput) {
  return apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function toggleUser(id: string) {
  return apiFetch<AdminUser>(`/admin/users/${id}/toggle`, { method: 'PATCH' });
}
