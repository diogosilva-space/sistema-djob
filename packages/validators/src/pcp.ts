import { z } from 'zod';

export const productionOrderStatusEnum = z.enum([
  'PLANNED',
  'IN_PROGRESS',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
]);

export const productionStepStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']);

export const productionLogTypeEnum = z.enum(['START', 'FINISH', 'PAUSE', 'RESUME', 'DEFECT']);

export const createProductionOrderSchema = z.object({
  salesOrderId: z.string().uuid().optional(),
  code: z.string().min(3),
  priority: z.number().int().min(1).max(5).default(3),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  notes: z.string().optional(),
});

export const updateProductionOrderSchema = createProductionOrderSchema.partial().extend({
  status: productionOrderStatusEnum.optional(),
  completedAt: z.string().datetime().optional().or(z.date().optional()),
});

export const createProductionStepSchema = z.object({
  productionOrderId: z.string().uuid(),
  name: z.string().min(2),
  sequence: z.number().int().min(1),
  estimatedMinutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const updateProductionStepSchema = createProductionStepSchema.partial().extend({
  status: productionStepStatusEnum.optional(),
  actualMinutes: z.number().int().positive().optional(),
  startedAt: z.string().datetime().optional().or(z.date().optional()),
  completedAt: z.string().datetime().optional().or(z.date().optional()),
});

export const createProductionLogSchema = z.object({
  stepId: z.string().uuid(),
  type: productionLogTypeEnum,
  processedQty: z.number().positive().optional(),
  defectQty: z.number().min(0).optional(),
  defectType: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateProductionOrderInput = z.infer<typeof createProductionOrderSchema>;
export type UpdateProductionOrderInput = z.infer<typeof updateProductionOrderSchema>;
export type CreateProductionStepInput = z.infer<typeof createProductionStepSchema>;
export type UpdateProductionStepInput = z.infer<typeof updateProductionStepSchema>;
export type CreateProductionLogInput = z.infer<typeof createProductionLogSchema>;
