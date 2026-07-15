import { apiFetch } from '@/lib/api-client';
import {
  CreateQuoteInput,
  UpdateQuoteInput,
  CreateSalesOrderInput,
  UpdateSalesOrderInput,
} from '@djob/validators';

export const vendasService = {
  // Quotes (Orçamentos)
  getQuotes: async () => {
    return apiFetch<any[]>('/vendas/quotes');
  },

  getQuoteById: async (id: string) => {
    return apiFetch<any>(`/vendas/quotes/${id}`);
  },

  createQuote: async (data: CreateQuoteInput) => {
    return apiFetch<any>('/vendas/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateQuote: async (id: string, data: UpdateQuoteInput) => {
    return apiFetch<any>(`/vendas/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  convertQuoteToOrder: async (id: string) => {
    return apiFetch<any>(`/vendas/quotes/${id}/convert`, {
      method: 'POST',
    });
  },

  // Sales Orders (Pedidos)
  getSalesOrders: async () => {
    return apiFetch<any[]>('/vendas/sales-orders');
  },

  getSalesOrderById: async (id: string) => {
    return apiFetch<any>(`/vendas/sales-orders/${id}`);
  },

  updateSalesOrder: async (id: string, data: UpdateSalesOrderInput) => {
    return apiFetch<any>(`/vendas/sales-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
