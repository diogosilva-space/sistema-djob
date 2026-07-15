import { z } from 'zod';

export const employeeStatusEnum = z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']);

export const createEmployeeSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  document: z.string().optional().nullable(),
  email: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  admissionDate: z.string().optional().nullable(),
  salary: z.number().min(0).optional().nullable(),
  status: employeeStatusEnum.default('ACTIVE'),
  zipCode: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().length(2, 'Estado deve ter 2 letras').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
