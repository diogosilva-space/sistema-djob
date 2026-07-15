import { apiFetch } from '@/lib/api-client';
import { CreateCustomerInput, UpdateCustomerInput } from '@djob/validators';

export const customersService = {
  getCustomers: async () => {
    return apiFetch<any[]>('/crm/customers');
  },

  getCustomerById: async (id: string) => {
    return apiFetch<any>(`/crm/customers/${id}`);
  },

  createCustomer: async (data: CreateCustomerInput) => {
    return apiFetch<any>('/crm/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCustomer: async (id: string, data: UpdateCustomerInput) => {
    return apiFetch<any>(`/crm/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCustomer: async (id: string) => {
    return apiFetch<any>(`/crm/customers/${id}`, {
      method: 'DELETE',
    });
  },
};
