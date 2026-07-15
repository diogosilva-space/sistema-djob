import { apiFetch } from '@/lib/api-client';
import { CreateShipmentInput, UpdateShipmentInput } from '@djob/validators';

export const logisticaService = {
  getShipments: async () => {
    return apiFetch<any[]>('/logistica/remessas');
  },

  getShipmentById: async (id: string) => {
    return apiFetch<any>(`/logistica/remessas/${id}`);
  },

  createShipment: async (data: CreateShipmentInput) => {
    return apiFetch<any>('/logistica/remessas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateShipment: async (id: string, data: UpdateShipmentInput) => {
    return apiFetch<any>(`/logistica/remessas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
