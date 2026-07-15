import { apiFetch } from '@/lib/api-client';
import { CreateTransactionInput, UpdateTransactionInput } from '@djob/validators';

export const financeiroService = {
  getTransactions: async () => {
    return apiFetch<any[]>('/financeiro/transacoes');
  },

  getTransactionById: async (id: string) => {
    return apiFetch<any>(`/financeiro/transacoes/${id}`);
  },

  createTransaction: async (data: CreateTransactionInput) => {
    return apiFetch<any>('/financeiro/transacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTransaction: async (id: string, data: UpdateTransactionInput) => {
    return apiFetch<any>(`/financeiro/transacoes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteTransaction: async (id: string) => {
    return apiFetch<any>(`/financeiro/transacoes/${id}`, {
      method: 'DELETE',
    });
  },
};
