import { z } from 'zod';

export const shipmentStatusEnum = z.enum([
  'PENDING',
  'PICKED',
  'SHIPPED',
  'IN_TRANSIT',
  'DELIVERED',
  'RETURNED',
]);

export const createShipmentSchema = z.object({
  salesOrderId: z.string().uuid('ID do Pedido de Venda inválido'),
  carrier: z.string().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  recipientName: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().length(2, 'Estado deve ter 2 letras').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

export const updateShipmentSchema = createShipmentSchema.partial().extend({
  status: shipmentStatusEnum.optional(),
});

export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
