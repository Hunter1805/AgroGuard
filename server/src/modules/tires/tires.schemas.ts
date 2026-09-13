import { z } from 'zod';

const tireMetadataSchema = z.record(z.string(), z.any());

export const createTireSchema = z.object({
  code: z.string().min(1).max(40),
  brand: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  size: z.string().min(1).max(40),
  serialNumber: z.string().max(60).optional().nullable(),
  status: z.string().max(40).optional(),
  currentDepthMm: z.number().nonnegative().optional(),
  metadata: tireMetadataSchema.optional(),
});

export const updateTireSchema = z.object({
  code: z.string().min(1).max(40).optional(),
  brand: z.string().min(1).max(80).optional(),
  model: z.string().min(1).max(80).optional(),
  size: z.string().min(1).max(40).optional(),
  serialNumber: z.string().max(60).optional().nullable(),
  status: z.string().max(40).optional(),
  currentDepthMm: z.number().nonnegative().optional(),
  metadata: tireMetadataSchema.optional(),
});

export const tireMovementSchema = z.object({
  tireId: z.string().uuid(),
  action: z.enum(['instalar', 'remover', 'rodizio', 'transferir', 'reparo', 'recapagem', 'descartar', 'condenar']),
  equipmentId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
  newPositionId: z.string().uuid().optional(),
  depthMm: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
  metadata: tireMetadataSchema.optional(),
});

export type CreateTireInput = z.infer<typeof createTireSchema>;
export type UpdateTireInput = z.infer<typeof updateTireSchema>;
export type TireMovementInput = z.infer<typeof tireMovementSchema>;
