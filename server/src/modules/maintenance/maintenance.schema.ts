import { z } from 'zod';
import { MaintenanceScheduleStatus, MaintenanceType, MaintenanceTrigger } from '@prisma/client';

export const createIntervalSchema = z.object({
  name: z.string().min(1, 'Nome do intervalo é obrigatório'),
  description: z.string().optional(),
  triggerType: z.nativeEnum(MaintenanceTrigger),
  rule: z.string().optional(),
  meterType: z.string().optional(),
  readingInterval: z.number().positive('Intervalo de leitura deve ser positivo').optional(),
  timeInterval: z.number().int().positive('Intervalo de tempo deve ser positivo').optional(),
  timeUnit: z.enum(['DAYS', 'WEEKS', 'MONTHS', 'YEARS']).optional(),
  alertReadingBefore: z.number().optional(),
  alertDaysBefore: z.number().int().optional(),
  allowedReadingDelay: z.number().optional(),
  allowedDaysDelay: z.number().int().optional(),
  priority: z.string().default('NORMAL'),
  estimatedDurationMinutes: z.number().int().optional(),
  requiresEquipmentStop: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
  tasks: z.any().optional(),
});

export const createPlanSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, 'Nome do plano de manutenção é obrigatório'),
  description: z.string().optional(),
  intervals: z.array(createIntervalSchema).optional(),
});

export const updatePlanSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, 'Nome não pode ser vazio').optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  intervals: z.array(createIntervalSchema).optional(),
});

export const linkEquipmentSchema = z.object({
  equipmentId: z.string().uuid('ID do equipamento inválido'),
  startDate: z.coerce.date().optional(),
  baseReading: z.number().optional(),
  baseDate: z.coerce.date().optional(),
  maintenanceResponsibleId: z.string().uuid().optional(),
  workshopId: z.string().uuid().optional(),
  observations: z.string().optional(),
});

export const createScheduleSchema = z.object({
  equipmentId: z.string().uuid('ID do equipamento é obrigatório'),
  maintenancePlanId: z.string().uuid().optional(),
  maintenancePlanIntervalId: z.string().uuid().optional(),
  scheduledDate: z.coerce.date(),
  dueReading: z.number().optional(),
  meterType: z.string().optional(),
  currentReading: z.number().optional(),
  priority: z.string().default('NORMAL'),
  responsibleId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  workshopId: z.string().uuid().optional(),
  estimatedDurationMinutes: z.number().int().default(0),
  requiresEquipmentStop: z.boolean().default(false),
  observations: z.string().optional(),
  workOrderId: z.string().uuid().optional(),
  triggerType: z.nativeEnum(MaintenanceTrigger).optional(),
  maintenanceType: z.nativeEnum(MaintenanceType).optional(),
  tasks: z.any().optional(),
  parts: z.any().optional(),
  supplies: z.any().optional(),
  tools: z.any().optional(),
});

export const updateScheduleSchema = z.object({
  scheduledDate: z.coerce.date().optional(),
  dueReading: z.number().optional(),
  priority: z.string().optional(),
  responsibleId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  workshopId: z.string().uuid().optional(),
  estimatedDurationMinutes: z.number().int().optional(),
  requiresEquipmentStop: z.boolean().optional(),
  observations: z.string().optional(),
  rescheduleReason: z.string().optional(),
  workOrderId: z.string().uuid().optional(),
  tasks: z.any().optional(),
  parts: z.any().optional(),
  supplies: z.any().optional(),
  tools: z.any().optional(),
});

export const updateScheduleStatusSchema = z.object({
  status: z.nativeEnum(MaintenanceScheduleStatus, {
    errorMap: () => ({ message: 'Status de agendamento inválido' }),
  }),
  canceledReason: z.string().optional(),
  rescheduleReason: z.string().optional(),
});

export const listSchedulesQuerySchema = z.object({
  equipmentId: z.string().uuid().optional(),
  maintenancePlanId: z.string().uuid().optional(),
  status: z.nativeEnum(MaintenanceScheduleStatus).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  overdue: z.coerce.boolean().optional(),
  upcoming: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export type CreateIntervalInput = z.infer<typeof createIntervalSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type LinkEquipmentInput = z.infer<typeof linkEquipmentSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type UpdateScheduleStatusInput = z.infer<typeof updateScheduleStatusSchema>;
export type ListSchedulesQueryInput = z.infer<typeof listSchedulesQuerySchema>;
