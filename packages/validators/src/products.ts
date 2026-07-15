import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['SIMPLE', 'CONFIGURABLE', 'RAW_MATERIAL', 'SERVICE']).default('SIMPLE'),
  unit: z.string().default('UN'),
  costPrice: z.number().min(0, 'Preço de custo inválido').default(0),
  salePrice: z.number().min(0, 'Preço de venda inválido').default(0),
  minStock: z.number().min(0).default(0),
  maxStock: z.number().optional(),
  weight: z.number().optional(),
  isConfigurable: z.boolean().default(false),
  bomTemplate: z.any().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
