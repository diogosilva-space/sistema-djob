import { z } from 'zod';

export const personTypeEnum = z.enum(['FISICA', 'JURIDICA']);

const baseAddressSchema = z.object({
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 letras').optional(),
});

export const createCustomerSchema = z
  .object({
    type: personTypeEnum.default('JURIDICA'),
    name: z.string().min(3, 'Nome/Razão Social deve ter no mínimo 3 caracteres'),
    tradeName: z.string().optional(),
    document: z.string().optional(),
    stateReg: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    website: z.string().optional(),
    notes: z.string().optional(),
  })
  .merge(baseAddressSchema);

export const updateCustomerSchema = createCustomerSchema.partial();

export const createSupplierSchema = createCustomerSchema; // Similar structure for now
export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;

export const opportunityStatusEnum = z.enum([
  'LEAD_QUALIFICADO',
  'CONTATO_INICIAL',
  'APRESENTACAO',
  'PROPOSTA_ENVIADA',
  'NEGOCIACAO',
  'FECHADO_GANHO',
  'FECHADO_PERDIDO',
]);

export const activityTypeEnum = z.enum([
  'CALL',
  'EMAIL',
  'MEETING',
  'WHATSAPP',
  'NOTE',
]);

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const taskStatusEnum = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

const optionalDateSchema = z.string().datetime().optional();
const optionalUuidSchema = z.string().uuid().optional();

export const createOpportunitySchema = z.object({
  customerId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  sellerId: z.string().uuid().optional(),
  name: z.string().min(3).max(255),
  value: z.coerce.number().nonnegative().default(0),
  probability: z.coerce.number().int().min(0).max(100).default(50),
  status: opportunityStatusEnum.optional(),
  expectedCloseAt: optionalDateSchema,
  notes: z.string().max(10000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
});

export const updateOpportunitySchema = createOpportunitySchema
  .omit({ sellerId: true, status: true })
  .partial();

export const changeOpportunityStageSchema = z.object({
  status: opportunityStatusEnum,
  value: z.coerce.number().nonnegative().optional(),
  closedAt: optionalDateSchema,
  lostReason: z.string().min(2).max(100).optional(),
}).superRefine((data, context) => {
  if (data.status === 'FECHADO_PERDIDO' && !data.lostReason) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lostReason'],
      message: 'Informe o motivo da perda.',
    });
  }
});

export const opportunityListQuerySchema = z.object({
  status: opportunityStatusEnum.optional(),
  sellerId: optionalUuidSchema,
  from: optionalDateSchema,
  to: optionalDateSchema,
  search: z.string().trim().max(255).optional(),
});

export const opportunityMetricsQuerySchema = z.object({
  sellerId: optionalUuidSchema,
  from: optionalDateSchema,
  to: optionalDateSchema,
});

export const createActivitySchema = z.object({
  opportunityId: optionalUuidSchema,
  customerId: optionalUuidSchema,
  contactId: optionalUuidSchema,
  type: activityTypeEnum,
  subject: z.string().min(2).max(255),
  description: z.string().max(10000).optional(),
  occurredAt: optionalDateSchema,
}).refine((data) => data.opportunityId || data.customerId || data.contactId, {
  message: 'Informe a oportunidade ou o contato relacionado.',
});

export const activityListQuerySchema = z.object({
  opportunityId: optionalUuidSchema,
  customerId: optionalUuidSchema,
  contactId: optionalUuidSchema,
});

export const createTaskSchema = z.object({
  opportunityId: optionalUuidSchema,
  customerId: optionalUuidSchema,
  contactId: optionalUuidSchema,
  assignedToId: optionalUuidSchema,
  title: z.string().min(2).max(255),
  description: z.string().max(10000).optional(),
  dueDate: z.string().datetime(),
  priority: taskPriorityEnum.default('MEDIUM'),
});

export const updateTaskSchema = createTaskSchema
  .omit({ assignedToId: true })
  .partial();

export const taskListQuerySchema = z.object({
  opportunityId: optionalUuidSchema,
  customerId: optionalUuidSchema,
  contactId: optionalUuidSchema,
  status: taskStatusEnum.optional(),
  dueDate: optionalDateSchema,
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type ChangeOpportunityStageInput = z.infer<typeof changeOpportunityStageSchema>;
export type OpportunityListQuery = z.infer<typeof opportunityListQuerySchema>;
export type OpportunityMetricsQuery = z.infer<typeof opportunityMetricsQuerySchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type ActivityListQuery = z.infer<typeof activityListQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

export const contactRoleEnum = z.enum(['CLIENT', 'SUPPLIER', 'BOTH']);

export const createContactSchema = createCustomerSchema.extend({
  role: contactRoleEnum.default('CLIENT'),
  segment: z.string().max(100).optional(),
});

export const updateContactSchema = createContactSchema.partial();

export const contactListQuerySchema = z.object({
  role: contactRoleEnum.optional(),
  search: z.string().trim().max(255).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactListQuery = z.infer<typeof contactListQuerySchema>;
