import { z } from 'zod';

export const createWorkOrderSchema = z.object({
  equipmentId: z.string().uuid(),
  workshopId: z.string().uuid().optional(),
  type: z.enum(['preventiva', 'corretiva', 'inspecao', 'preditiva']).default('corretiva'),
  priority: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
  description: z.string().min(5).max(500),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    'aberta',
    'planejada',
    'em_execucao',
    'pausada',
    'em_teste',
    'aguardando_liberacao',
    'finalizada',
    'encerrada',
    'cancelada',
  ]),
  justification: z.string().optional(),
});
