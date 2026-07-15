import { z } from 'zod';

export const financialTypeEnum = z.enum(['INCOME', 'EXPENSE']);
export const transactionStatusEnum = z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']);

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid().optional().nullable(),
  type: financialTypeEnum,
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  dueDate: z.string().datetime(),
  paidDate: z.string().datetime().optional().nullable(),
  status: transactionStatusEnum.default('PENDING'),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial();

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
