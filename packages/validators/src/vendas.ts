import { z } from 'zod';

export const tecnicaPersonalizacaoSchema = z.enum([
  'BOR',
  'ETQ',
  'IMP',
  'SUB',
  'LAS',
  'LAS360',
  'HOT',
  'SIL',
  'SIL360',
  'SILTEX',
  'TAM',
  'TRA',
  'UVD',
  'UV360',
]);

export const personalizacaoSchema = z.object({
  id: z.string().optional(),
  tecnica: tecnicaPersonalizacaoSchema,
  numeroCores: z.number().int().min(1).optional(),
  posicaoArte: z.string().min(1),
  tamanhoArte: z.string().min(1),
  arquivos: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  custoCalculado: z.number().min(0).default(0),
});

export const quoteItemSchema = z.object({
  productId: z.string().uuid(),
  description: z.string().min(1),
  quantity: z.number().min(0.001),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  configuration: personalizacaoSchema.optional(),
});

export const createQuoteSchema = z.object({
  customerId: z.string().uuid(),
  validUntil: z.string().datetime().optional(), // ISO string
  notes: z.string().optional(),
  conditions: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos um item ao orçamento'),
  discount: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
export type PersonalizacaoInput = z.infer<typeof personalizacaoSchema>;

export const updateQuoteSchema = createQuoteSchema.partial().extend({
  status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'CONVERTED']).optional(),
});

export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;

export const createSalesOrderSchema = z.object({
  customerId: z.string().uuid(),
  quoteId: z.string().uuid().optional(),
  paymentMethod: z.string().optional(),
  paymentTerms: z.string().optional(),
  deliveryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;

export const updateSalesOrderSchema = z.object({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
  paymentMethod: z.string().optional(),
  paymentTerms: z.string().optional(),
  deliveryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export type UpdateSalesOrderInput = z.infer<typeof updateSalesOrderSchema>;
