import { apiFetch } from '@/lib/api-client';
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from '@djob/validators';

export const comprasService = {
  createPurchaseOrder: async (data: CreatePurchaseOrderInput) => {
    return apiFetch<any>('/compras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPurchaseOrders: async () => {
    return apiFetch<any[]>('/compras');
  },

  getPurchaseOrderById: async (id: string) => {
    return apiFetch<any>(`/compras/${id}`);
  },

  updatePurchaseOrder: async (id: string, data: UpdatePurchaseOrderInput) => {
    return apiFetch<any>(`/compras/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
