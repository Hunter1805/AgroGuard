import { z } from 'zod';

const date = z.coerce.date();

export const executionPatchSchema = z.object({
  executionStartedAt: date.optional().nullable(), executionEndedAt: date.optional().nullable(),
  technicalDiagnosis: z.string().max(5000).optional().nullable(), foundCause: z.string().max(5000).optional().nullable(),
  rootCause: z.string().max(5000).optional().nullable(), failureConfirmed: z.boolean().optional().nullable(),
  recurrentFailure: z.boolean().optional().nullable(), futureRecommendation: z.string().max(5000).optional().nullable(),
}).strict();

export const laborCreateSchema = z.object({
  executorUserId: z.string().uuid().optional().nullable(), entryType: z.enum(['SERVICE', 'PAUSE']).default('SERVICE'),
  status: z.enum(['OPEN', 'COMPLETED', 'CANCELLED']).default('OPEN'), startedAt: date,
  endedAt: date.optional().nullable(), durationMinutes: z.number().int().nonnegative().optional().nullable(),
  observation: z.string().max(2000).optional().nullable(), hourlyCost: z.number().nonnegative().optional().nullable(),
}).strict();
export const laborPatchSchema = laborCreateSchema.partial();

export const materialCreateSchema = z.object({
  stockItemId: z.string().uuid(), quantity: z.number().positive(), unitCost: z.number().nonnegative(),
  totalCost: z.number().nonnegative().optional(), consumedAt: date.optional(), batchOrReference: z.string().max(200).optional().nullable(),
  responsibleUserId: z.string().uuid().optional().nullable(),
}).strict();
export const materialPatchSchema = materialCreateSchema.partial();

export const toolCreateSchema = z.object({
  toolId: z.string().uuid(), quantity: z.number().positive().default(1), withdrawnAt: date.optional().nullable(),
  returnedAt: date.optional().nullable(), stateBefore: z.string().max(100).optional().nullable(), stateAfter: z.string().max(100).optional().nullable(),
  responsibleUserId: z.string().uuid().optional().nullable(),
}).strict();
export const toolPatchSchema = toolCreateSchema.partial();

export const noteSchema = z.object({ message: z.string().trim().min(1).max(2000) }).strict();
export const timelineQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), pageSize: z.coerce.number().int().positive().max(100).default(50) });
