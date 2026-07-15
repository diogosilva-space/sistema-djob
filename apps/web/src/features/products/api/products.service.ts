import { apiFetch } from '@/lib/api-client';
import { CreateProductInput, UpdateProductInput } from '@djob/validators';

export const productsService = {
  createProduct: async (data: CreateProductInput) => {
    return apiFetch<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProducts: async () => {
    return apiFetch<any[]>('/products');
  },

  getProductById: async (id: string) => {
    return apiFetch<any>(`/products/${id}`);
  },

  updateProduct: async (id: string, data: UpdateProductInput) => {
    return apiFetch<any>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: string) => {
    return apiFetch<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
