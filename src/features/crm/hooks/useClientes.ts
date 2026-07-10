import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { clientesApi } from '../api/clientes.api';
import { CreateClienteDTO, UpdateClienteDTO } from '../types/Cliente.types';

/**
 * Hooks para gerenciar clientes
 */

// Keys para o React Query
export const clientesKeys = {
  all: ['clientes'] as const,
  lists: () => [...clientesKeys.all, 'list'] as const,
  list: (filters: string) => [...clientesKeys.lists(), { filters }] as const,
  details: () => [...clientesKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientesKeys.details(), id] as const,
};

/**
 * Hook para buscar todos os clientes
 */
export function useClientes() {
  return useQuery({
    queryKey: clientesKeys.lists(),
    queryFn: async () => {
      // TODO: Remover mock quando backend estiver pronto
      const { clientesMock, USE_MOCK_DATA } = await import('@/lib/mockData');
      if (USE_MOCK_DATA) {
        return clientesMock;
      }
      return clientesApi.getAll();
    },
  });
}

/**
 * Hook para buscar um cliente por ID
 */
export function useCliente(id: string) {
  return useQuery({
    queryKey: clientesKeys.detail(id),
    queryFn: async () => {
      // TODO: Remover mock quando backend estiver pronto
      const { clientesMock, USE_MOCK_DATA } = await import('@/lib/mockData');
      if (USE_MOCK_DATA) {
        const cliente = clientesMock.find((c) => c.id === id);
        if (!cliente) throw new Error('Cliente não encontrado');
        return cliente;
      }
      return clientesApi.getById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar um novo cliente
 */
export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientesApi.create,
    onSuccess: () => {
      // Invalida a lista de clientes para recarregar
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar um cliente
 */
export function useUpdateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientesApi.update,
    onSuccess: (data) => {
      // Invalida a lista e o detalhe do cliente
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.detail(data.id!) });
    },
  });
}

/**
 * Hook para deletar um cliente
 */
export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
    },
  });
}
