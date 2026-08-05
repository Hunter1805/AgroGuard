import { z } from 'zod';

export const createStockItemSchema = z.object({
  unitMeasureId: z.string().uuid(),
  code: z.string().min(2).max(30),
  name: z.string().min(2).max(100),
  partNumber: z.string().optional(),
  minQuantity: z.number().nonnegative().default(0),
});

export const stockMovementSchema = z.object({
  warehouseId: z.string().uuid(),
  stockItemId: z.string().uuid(),
  type: z.enum(['entrada', 'saida', 'ajuste']),
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative().default(0),
  workOrderId: z.string().uuid().optional(),
});
