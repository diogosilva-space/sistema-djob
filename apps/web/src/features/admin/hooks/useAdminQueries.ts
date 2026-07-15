'use client';

import type {
  CreateAdminUserInput,
  CreatePlatformTenantInput,
  UpdateAdminUserInput,
  UpdatePlatformTenantInput,
} from '@djob/validators';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTenant,
  createUser,
  fetchTenant,
  fetchTenants,
  fetchTenantUsers,
  toggleTenant,
  toggleUser,
  updateTenant,
  updateUser,
} from '../api/admin.api';

interface ListOptions {
  search?: string;
  page?: number;
  limit?: number;
}

export function useTenants(options: ListOptions = {}) {
  return useQuery({
    queryKey: ['admin', 'tenants', options],
    queryFn: () => fetchTenants(options),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['admin', 'tenants', id],
    queryFn: () => fetchTenant(id),
    enabled: Boolean(id),
  });
}

export function useTenantUsers(tenantId: string, options: ListOptions = {}) {
  return useQuery({
    queryKey: ['admin', 'tenants', tenantId, 'users', options],
    queryFn: () => fetchTenantUsers(tenantId, options),
    enabled: Boolean(tenantId),
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CreatePlatformTenantInput) => createTenant(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] }),
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdatePlatformTenantInput }) =>
      updateTenant(id, values),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', variables.id] }),
  });
}

export function useToggleTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleTenant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, values }: { tenantId: string; values: CreateAdminUserInput }) =>
      createUser(tenantId, values),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ['admin', 'tenants', variables.tenantId, 'users'],
      }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateAdminUserInput }) =>
      updateUser(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] }),
  });
}

export function useToggleUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] }),
  });
}
