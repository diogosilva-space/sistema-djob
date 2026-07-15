import { z } from 'zod';

// UUID validation
export const uuidSchema = z.string().uuid('ID inválido');

// Paginação comum
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});
