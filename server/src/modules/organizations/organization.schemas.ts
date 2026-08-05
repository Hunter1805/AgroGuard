import { z } from 'zod';

export const createCompanySchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(100),
  corporateName: z.string().optional(),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
});

export const createUnitSchema = z.object({
  companyId: z.string().uuid(),
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(100),
  type: z.enum(['matriz', 'filial']).default('matriz'),
  city: z.string().optional(),
  state: z.string().optional(),
});
