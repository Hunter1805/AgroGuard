import { z } from 'zod';

export const importBatchSchema = z.object({
  sourceType: z.enum(['csv', 'xlsx', 'json', 'mock']),
  entityType: z.enum(['equipment', 'users', 'stock_items', 'work_orders']),
  duplicateStrategy: z.enum(['create_only', 'update_existing', 'skip_existing', 'fail_on_duplicate']).default('skip_existing'),
  dryRun: z.boolean().default(true),
  payload: z.array(z.record(z.any())),
});
