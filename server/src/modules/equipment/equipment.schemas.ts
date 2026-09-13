import { z } from 'zod';

export const createEquipmentSchema = z.object({
  companyId: z.string().uuid(),
  unitId: z.string().uuid(),
  farmId: z.string().uuid().optional(),
  equipmentTypeId: z.string().uuid(),
  modelId: z.string().uuid(),
  code: z.string().min(2).max(30),
  name: z.string().min(2).max(100),
  serialNumber: z.string().optional(),
  manufactureYear: z.number().int().optional(),
});

export const updateEquipmentSchema = z.object({
  code: z.string().min(2).max(30).optional(),
  name: z.string().min(2).max(100).optional(),
  serialNumber: z.string().nullable().optional(),
  manufactureYear: z.number().int().nullable().optional(),
  status: z.string().max(40).optional(),
  farmId: z.string().uuid().nullable().optional(),
});

export const createReadingSchema = z.object({
  equipmentId: z.string().uuid(),
  meterId: z.string().uuid(),
  readingValue: z.number().positive(),
  readingDate: z.string().datetime().optional(),
});
