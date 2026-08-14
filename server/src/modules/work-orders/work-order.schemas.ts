import { z } from 'zod';

export const createWorkOrderSchema = z.object({
  equipmentId: z.string().uuid(),
  workshopId: z.string().uuid().optional(),
  nature: z.enum(['MAINTENANCE', 'INSPECTION', 'DIAGNOSIS', 'INSTALLATION', 'IMPROVEMENT', 'CAMPAIGN_RECALL']).default('MAINTENANCE'),
  maintenanceType: z.enum(['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'CONDITION_BASED', 'ROUTINE_INSPECTION']).optional().nullable(),
  correctiveMode: z.enum(['PLANNED', 'EMERGENCY']).optional().nullable(),
  trigger: z.enum([
    'SCHEDULE',
    'CALENDAR',
    'HOUR_METER',
    'ODOMETER',
    'CYCLE',
    'CHECKLIST',
    'INSPECTION',
    'FAILURE',
    'SENSOR',
    'ALERT',
    'OPERATOR_REPORT',
    'MANUAL',
  ]).default('MANUAL'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL']).default('NORMAL'),
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
