import { z } from 'zod';

import { passwordSchema } from './auth';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined);

const optionalEmail = z
  .string()
  .trim()
  .email('E-mail inválido')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

function isValidCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
    return false;
  }

  const calculateDigit = (slice: string, weights: number[]) => {
    const total = slice
      .split('')
      .reduce((sum, digit, index) => sum + Number(digit) * (weights[index] ?? 0), 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(
    digits.slice(0, 12) + firstDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return digits === `${digits.slice(0, 12)}${firstDigit}${secondDigit}`;
}

const optionalCnpj = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => !value || isValidCnpj(value), 'CNPJ inválido')
  .transform((value) => value?.replace(/\D/g, '') || undefined);

const slugSchema = z
  .string()
  .trim()
  .min(3, 'Slug deve ter no mínimo 3 caracteres')
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hifens');

const tenantFields = {
  name: z.string().trim().min(3, 'Razão social deve ter no mínimo 3 caracteres').max(255),
  slug: slugSchema,
  document: optionalCnpj,
  tradeName: optionalText(255),
  stateReg: optionalText(20),
  phone: optionalText(20),
  email: optionalEmail,
  website: optionalText(255),
  logo: optionalText(2_000),
  zipCode: optionalText(10),
  street: optionalText(255),
  number: optionalText(20),
  complement: optionalText(100),
  neighborhood: optionalText(100),
  city: optionalText(100),
  state: optionalText(2).transform((value) => value?.toUpperCase()),
};

export const createTenantSchema = z.object({
  ...tenantFields,
  adminUser: z.object({
    name: z
      .string()
      .trim()
      .min(3, 'Nome do administrador deve ter no mínimo 3 caracteres')
      .max(255),
    email: z.string().trim().email('E-mail do administrador inválido'),
    password: passwordSchema,
  }),
});

export const updateTenantSchema = z.object({
  ...Object.fromEntries(
    Object.entries(tenantFields).map(([key, schema]) => [key, schema.optional()]),
  ),
});

export const userRoleSchema = z.enum(['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER']);

export const createAdminUserSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  email: z.string().trim().email('E-mail inválido'),
  password: passwordSchema,
  role: userRoleSchema.default('OPERATOR'),
});

export const updateAdminUserSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255).optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
