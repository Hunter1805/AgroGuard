import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  employeeCode: z.string().optional(),
  type: z.enum(['interno', 'terceirizado', 'temporario', 'consultor', 'auditor']).default('interno'),
  roleIds: z.array(z.string().uuid()).optional(),
});
