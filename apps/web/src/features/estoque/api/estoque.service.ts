import { apiFetch } from '@/lib/api-client';
import { StockMovementInput } from '@djob/validators';

export const estoqueService = {
  getStockItems: async () => {
    return apiFetch<any[]>('/estoque/items');
  },

  getMovements: async () => {
    return apiFetch<any[]>('/estoque/movements');
  },

  adjustStock: async (data: StockMovementInput) => {
    return apiFetch<any>('/estoque/adjust', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
