import { apiFetch } from '@/lib/api-client';
import {
  CreateProductionOrderInput,
  UpdateProductionOrderInput,
  CreateProductionStepInput,
  UpdateProductionStepInput,
  CreateProductionLogInput,
} from '@djob/validators';

export const pcpService = {
  // Ordens de Produção
  getProductionOrders: async () => {
    return apiFetch<any[]>('/pcp/production-orders');
  },

  getProductionOrderById: async (id: string) => {
    return apiFetch<any>(`/pcp/production-orders/${id}`);
  },

  createProductionOrder: async (data: CreateProductionOrderInput) => {
    return apiFetch<any>('/pcp/production-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProductionOrder: async (id: string, data: UpdateProductionOrderInput) => {
    return apiFetch<any>(`/pcp/production-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProductionOrder: async (id: string) => {
    return apiFetch<any>(`/pcp/production-orders/${id}`, {
      method: 'DELETE',
    });
  },

  // Etapas de Produção
  createProductionStep: async (data: CreateProductionStepInput) => {
    return apiFetch<any>('/pcp/production-steps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProductionStep: async (id: string, data: UpdateProductionStepInput) => {
    return apiFetch<any>(`/pcp/production-steps/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProductionStep: async (id: string) => {
    return apiFetch<any>(`/pcp/production-steps/${id}`, {
      method: 'DELETE',
    });
  },

  // Logs / Apontamentos
  createProductionLog: async (data: CreateProductionLogInput) => {
    return apiFetch<any>('/pcp/production-steps/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Steps - Actions
  startStep: async (id: string, responsibleName: string) => {
    return apiFetch<any>(`/pcp/production-steps/${id}/start`, {
      method: 'POST',
      body: JSON.stringify({ responsibleName }),
    });
  },

  pauseStep: async (id: string, reason: string, responsibleName: string) => {
    return apiFetch<any>(`/pcp/production-steps/${id}/pause`, {
      method: 'POST',
      body: JSON.stringify({ reason, responsibleName }),
    });
  },

  finishStep: async (id: string, responsibleName: string) => {
    return apiFetch<any>(`/pcp/production-steps/${id}/finish`, {
      method: 'POST',
      body: JSON.stringify({ responsibleName }),
    });
  },

  logDefect: async (id: string, quantity: number, reason: string, responsibleName: string) => {
    return apiFetch<any>(`/pcp/production-steps/${id}/defect`, {
      method: 'POST',
      body: JSON.stringify({ quantity, reason, responsibleName }),
    });
  },
};
