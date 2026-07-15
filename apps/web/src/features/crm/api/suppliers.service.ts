import { apiFetch } from '@/lib/api-client';
import { CreateSupplierInput, UpdateSupplierInput } from '@djob/validators';

export const suppliersService = {
  createSupplier: async (data: CreateSupplierInput) => {
    return apiFetch<any>('/crm/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSuppliers: async () => {
    return apiFetch<any[]>('/crm/suppliers');
  },

  getSupplierById: async (id: string) => {
    return apiFetch<any>(`/crm/suppliers/${id}`);
  },

  updateSupplier: async (id: string, data: UpdateSupplierInput) => {
    return apiFetch<any>(`/crm/suppliers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteSupplier: async (id: string) => {
    return apiFetch<any>(`/crm/suppliers/${id}`, {
      method: 'DELETE',
    });
  },
};
