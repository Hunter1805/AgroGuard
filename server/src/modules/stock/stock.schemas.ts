import { z } from 'zod';

export const createStockItemSchema = z.object({
  unitMeasureId: z.string().min(1).optional(),
  unitMeasureSymbol: z.string().min(1).optional(),
  code: z.string().min(2).max(30),
  name: z.string().min(2).max(100),
  partNumber: z.string().optional(),
  minQuantity: z.number().nonnegative().default(0),
}).refine((d) => !!d.unitMeasureId || !!d.unitMeasureSymbol, {
  message: 'Informe a unidade de medida (id ou símbolo).',
});

export const stockMovementSchema = z.object({
  warehouseId: z.string().uuid(),
  stockItemId: z.string().uuid(),
  type: z.enum(['entrada', 'saida', 'ajuste']),
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative().default(0),
  workOrderId: z.string().uuid().optional(),
});
