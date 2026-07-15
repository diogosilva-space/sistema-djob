import { apiFetch } from '@/lib/api-client';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@djob/validators';

export const rhService = {
  getEmployees: async () => {
    return apiFetch<any[]>('/rh/funcionarios');
  },

  getEmployeeById: async (id: string) => {
    return apiFetch<any>(`/rh/funcionarios/${id}`);
  },

  createEmployee: async (data: CreateEmployeeInput) => {
    return apiFetch<any>('/rh/funcionarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEmployee: async (id: string, data: UpdateEmployeeInput) => {
    return apiFetch<any>(`/rh/funcionarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteEmployee: async (id: string) => {
    return apiFetch<any>(`/rh/funcionarios/${id}`, {
      method: 'DELETE',
    });
  },
};
