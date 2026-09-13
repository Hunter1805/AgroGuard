import { z } from 'zod';

export const createToolSchema = z.object({
  code: z.string().min(1).max(30).optional(),
  name: z.string().min(2).max(120),
  serialNumber: z.string().max(60).optional().nullable(),
  status: z.string().max(40).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateToolSchema = createToolSchema.partial().extend({
  name: z.string().min(2).max(120).optional(),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
