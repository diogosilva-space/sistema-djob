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
