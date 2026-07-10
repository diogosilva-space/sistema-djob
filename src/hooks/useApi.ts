import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { api } from '@/lib/api';

/**
 * Hook genérico para fazer GET requests com React Query
 * 
 * @example
 * const { data, isLoading } = useApiQuery('/clientes', ['clientes']);
 */
export function useApiQuery<T>(
  endpoint: string,
  queryKey: unknown[],
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => api.get<T>(endpoint),
    ...options,
  });
}

/**
 * Hook genérico para fazer POST/PUT/PATCH/DELETE requests com React Query
 * 
 * @example
 * const mutation = useApiMutation('/clientes', 'POST');
 * mutation.mutate({ nome: 'Cliente Teste' });
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => {
      switch (method) {
        case 'POST':
          return api.post<TData>(endpoint, data);
        case 'PUT':
          return api.put<TData>(endpoint, data);
        case 'PATCH':
          return api.patch<TData>(endpoint, data);
        case 'DELETE':
          return api.delete<TData>(endpoint);
        default:
          throw new Error(`Método ${method} não suportado`);
      }
    },
    ...options,
  });
}
