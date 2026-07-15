import { z } from 'zod';

export const stockItemSchema = z.object({
  productId: z.string().uuid(),
  location: z.string().min(1).default('PRINCIPAL'),
  quantity: z.number().default(0),
  reserved: z.number().default(0),
});

export type StockItemInput = z.infer<typeof stockItemSchema>;

export const stockMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['ENTRY', 'EXIT', 'TRANSFER', 'ADJUST', 'RETURN']),
  quantity: z.number().positive('A quantidade deve ser maior que zero'),
  location: z.string().min(1).default('PRINCIPAL'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type StockMovementInput = z.infer<typeof stockMovementSchema>;

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().uuid(),
  expectedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productName: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().min(0),
      }),
    )
    .min(1, 'Adicione pelo menos um item ao pedido de compra'),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;

export const updatePurchaseOrderSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED', 'CANCELLED']).optional(),
  expectedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;
