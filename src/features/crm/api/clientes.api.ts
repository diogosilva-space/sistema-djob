import { api } from '@/lib/api';

import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../types/Cliente.types';

/**
 * API de Clientes
 */

export const clientesApi = {
  /**
   * Lista todos os clientes
   */
  getAll: () => api.get<Cliente[]>('/clientes'),

  /**
   * Busca um cliente por ID
   */
  getById: (id: string) => api.get<Cliente>(`/clientes/${id}`),

  /**
   * Cria um novo cliente
   */
  create: (data: CreateClienteDTO) => api.post<Cliente>('/clientes', data),

  /**
   * Atualiza um cliente existente
   */
  update: ({ id, ...data }: UpdateClienteDTO) => api.put<Cliente>(`/clientes/${id}`, data),

  /**
   * Remove um cliente
   */
  delete: (id: string) => api.delete<void>(`/clientes/${id}`),

  /**
   * Busca clientes por termo de pesquisa
   */
  search: (termo: string) => api.get<Cliente[]>(`/clientes/search?q=${encodeURIComponent(termo)}`),
};
