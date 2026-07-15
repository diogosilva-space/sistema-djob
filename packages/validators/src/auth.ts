import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  tenantSlug: z.string().min(1, 'Informe o ambiente (tenant)'),
});

export type LoginInput = z.infer<typeof loginSchema>;
