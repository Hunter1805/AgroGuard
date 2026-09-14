/**
 * Gateway de manutenção (agendamentos + histórico) para a API real.
 * O backend já possui rotas completas para /maintenance/schedules;
 * o histórico é derivado dos agendamentos concluídos (status COMPLETED).
 * jsPDF/xlsx não são usados aqui — apenas o apiClient.
 */
import { apiClient } from '../../lib/api/api-client';
import type { MaintenanceSchedule } from '../../types/maintenance-schedule';
import type { MaintenanceHistoryEntry } from '../../types/maintenance-schedule';

// ─── Mapeamento de status front <-> backend (enum Prisma) ───────────
const STATUS_TO_API: Record<string, string> = {
  rascunho: 'SCHEDULED',
  planejada: 'SCHEDULED',
  aguardando_aprovacao: 'SCHEDULED',
  programada: 'SCHEDULED',
  aguardando_pecas: 'DUE',
  em_execucao: 'IN_PROGRESS',
  concluida: 'COMPLETED',
  adiada: 'SCHEDULED',
  cancelada: 'CANCELLED',
};

const STATUS_FROM_API: Record<string, MaintenanceSchedule['status']> = {
  SCHEDULED: 'programada',
  DUE: 'aguardando_pecas',
  OVERDUE: 'aguardando_pecas',
  IN_PROGRESS: 'em_execucao',
  COMPLETED: 'concluida',
  CANCELLED: 'cancelada',
};

interface ApiScheduleRow {
  id: string;
  code: string;
  organizationId: string;
  equipmentId: string;
  maintenancePlanId: string | null;
  maintenancePlanIntervalId: string | null;
  scheduledDate: string;
  dueReading: string | number | null;
  meterType: string | null;
  currentReading: string | number | null;
  priority: string;
  status: string;
  responsibleId: string | null;
  estimatedDurationMinutes: number;
  requiresEquipmentStop: boolean;
  observations: string | null;
  rescheduleReason: string | null;
  canceledReason: string | null;
  workOrderId: string | null;
  completedAt: string | null;
  triggerType: string | null;
  maintenanceType: string | null;
  tasks: any;
  parts: any;
  supplies: any;
  tools: any;
  createdAt: string;
  updatedAt: string;
  equipment?: { id: string; code: string; name: string } | null;
  maintenancePlan?: { id: string; name: string; version: number } | null;
  maintenancePlanInterval?: { id: string; name: string; triggerType: string } | null;
  responsible?: { id: string; name: string } | null;
  workshop?: { id: string; name: string } | null;
  team?: { id: string; name: string } | null;
  workOrder?: { id: string; code: string } | null;
}

function num(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function mapApiScheduleToSchedule(row: ApiScheduleRow): MaintenanceSchedule {
  return {
    id: row.id,
    code: row.code,
    equipmentId: row.equipmentId,
    equipmentCode: row.equipment?.code,
    equipmentName: row.equipment?.name ?? 'Equipamento',
    planId: row.maintenancePlanId ?? undefined,
    planName: row.maintenancePlan?.name,
    intervalId: row.maintenancePlanIntervalId ?? undefined,
    intervalName: row.maintenancePlanInterval?.name,
    scheduledDate: row.scheduledDate,
    scheduledTime: undefined,
    dueReading: num(row.dueReading),
    meterType: (row.meterType as any) ?? undefined,
    currentReading: num(row.currentReading),
    priority: (row.priority as any) ?? 'NORMAL',
    status: STATUS_FROM_API[row.status] ?? 'programada',
    responsibleId: row.responsibleId ?? undefined,
    responsibleName: row.responsible?.name ?? 'Não definido',
    teamName: row.team?.name,
    workshopName: row.workshop?.name,
    estimatedDurationMinutes: row.estimatedDurationMinutes ?? 0,
    requiresEquipmentStop: row.requiresEquipmentStop ?? false,
    parts: Array.isArray(row.parts) ? row.parts : [],
    supplies: Array.isArray(row.supplies) ? row.supplies : [],
    tools: Array.isArray(row.tools) ? row.tools : [],
    observations: row.observations ?? undefined,
    rescheduledReason: row.rescheduleReason ?? undefined,
    rescheduleReason: row.rescheduleReason ?? undefined,
    canceledReason: row.canceledReason ?? undefined,
    preventiveOrderId: row.workOrder?.id ?? row.workOrderId ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Histórico é derivado de schedules concluídas
export function mapApiScheduleToHistory(row: ApiScheduleRow): MaintenanceHistoryEntry {
  const plan = row.maintenancePlan;
  const interval = row.maintenancePlanInterval;
  return {
    id: row.id,
    code: row.code,
    equipmentId: row.equipmentId,
    equipmentCode: row.equipment?.code,
    equipmentName: row.equipment?.name ?? 'Equipamento',
    planId: plan?.id ?? '',
    planName: plan?.name ?? 'Plano',
    planVersion: plan?.version ?? 1,
    intervalId: interval?.id,
    intervalName: interval?.name ?? 'Intervalo',
    triggerType: interval?.triggerType ?? row.triggerType ?? undefined,
    completedDate: row.completedAt ?? row.updatedAt,
    meterReading: num(row.currentReading) ?? 0,
    meterType: (row.meterType as any) ?? 'horimetro',
    preventiveOrderId: row.workOrder?.id ?? row.workOrderId ?? undefined,
    responsibleName: row.responsible?.name ?? 'Não definido',
    workshopName: row.workshop?.name,
    estimatedMinutes: row.estimatedDurationMinutes ?? 0,
    realizedMinutes: row.estimatedDurationMinutes ?? 0,
    totalCost: 0,
    result: 'aprovado',
    tasksCompleted: Array.isArray(row.tasks) ? row.tasks : [],
    partsConsumed: [],
    suppliesConsumed: [],
    observations: row.observations ?? undefined,
    createdAt: row.createdAt,
  };
}

// ─── Agendamentos (schedules) ────────────────
export async function fetchSchedulesFromApi(filters?: {
  equipmentId?: string;
  status?: string;
  search?: string;
  overdue?: boolean;
}): Promise<MaintenanceSchedule[]> {
  const params = new URLSearchParams();
  if (filters?.equipmentId && filters.equipmentId !== 'todos') params.set('equipmentId', filters.equipmentId);
  if (filters?.status && filters.status !== 'todos' && STATUS_TO_API[filters.status]) params.set('status', STATUS_TO_API[filters.status]);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.overdue) params.set('overdue', 'true');
  params.set('pageSize', '200');
  const q = params.toString() ? `?${params.toString()}` : '';
  const res = await apiClient<{ items: ApiScheduleRow[]; total: number }>(`/maintenance/schedules${q}`, { timeoutMs: 10_000 });
  return (res.data.items ?? []).map(mapApiScheduleToSchedule);
}

export async function fetchScheduleByIdFromApi(id: string): Promise<MaintenanceSchedule | undefined> {
  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}`, { timeoutMs: 8_000 }).catch(() => null);
  return res ? mapApiScheduleToSchedule(res.data) : undefined;
}

export async function createScheduleInApi(data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
  const payload: Record<string, unknown> = {
    equipmentId: data.equipmentId,
    scheduledDate: data.scheduledDate,
    priority: data.priority ?? 'NORMAL',
    estimatedDurationMinutes: data.estimatedDurationMinutes ?? 0,
    requiresEquipmentStop: data.requiresEquipmentStop ?? false,
  };
  if (data.planId) payload.maintenancePlanId = data.planId;
  if (data.intervalId) payload.maintenancePlanIntervalId = data.intervalId;
  if (data.responsibleId) payload.responsibleId = data.responsibleId;
  if (data.meterType) payload.meterType = data.meterType;
  if (data.dueReading !== undefined) payload.dueReading = data.dueReading;
  if (data.currentReading !== undefined) payload.currentReading = data.currentReading;
  if (data.observations) payload.observations = data.observations;
  if (Array.isArray(data.parts)) payload.parts = data.parts;
  if (Array.isArray(data.supplies)) payload.supplies = data.supplies;
  if (Array.isArray(data.tools)) payload.tools = data.tools;

  const res = await apiClient<ApiScheduleRow>('/maintenance/schedules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapApiScheduleToSchedule(res.data);
}

export async function updateScheduleInApi(id: string, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
  const payload: Record<string, unknown> = {};
  if (data.scheduledDate !== undefined) payload.scheduledDate = data.scheduledDate;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.responsibleId !== undefined) payload.responsibleId = data.responsibleId;
  if (data.estimatedDurationMinutes !== undefined) payload.estimatedDurationMinutes = data.estimatedDurationMinutes;
  if (data.requiresEquipmentStop !== undefined) payload.requiresEquipmentStop = data.requiresEquipmentStop;
  if (data.observations !== undefined) payload.observations = data.observations;
  if (data.dueReading !== undefined) payload.dueReading = data.dueReading;
  if (data.parts !== undefined) payload.parts = data.parts;
  if (data.supplies !== undefined) payload.supplies = data.supplies;
  if (data.tools !== undefined) payload.tools = data.tools;

  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return mapApiScheduleToSchedule(res.data);
}

export async function rescheduleInApi(id: string, newDate: string, reason: string): Promise<MaintenanceSchedule> {
  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ scheduledDate: newDate, rescheduleReason: reason }),
  });
  return mapApiScheduleToSchedule(res.data);
}

export async function cancelScheduleInApi(id: string, reason: string): Promise<MaintenanceSchedule> {
  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'CANCELLED', canceledReason: reason }),
  });
  return mapApiScheduleToSchedule(res.data);
}

export async function completeScheduleInApi(id: string): Promise<MaintenanceSchedule> {
  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  return mapApiScheduleToSchedule(res.data);
}

// ─── Histórico (schedules concluídas) ────────────────
export async function fetchMaintenanceHistoryFromApi(filters?: {
  equipmentId?: string;
  planId?: string;
  search?: string;
}): Promise<MaintenanceHistoryEntry[]> {
  const params = new URLSearchParams();
  params.set('status', 'COMPLETED');
  params.set('pageSize', '200');
  if (filters?.equipmentId && filters.equipmentId !== 'todos') params.set('equipmentId', filters.equipmentId);
  if (filters?.planId && filters.planId !== 'todos') params.set('maintenancePlanId', filters.planId);
  if (filters?.search) params.set('search', filters.search);
  const res = await apiClient<{ items: ApiScheduleRow[]; total: number }>(`/maintenance/schedules?${params.toString()}`, { timeoutMs: 10_000 });
  return (res.data.items ?? []).map(mapApiScheduleToHistory);
}

export async function fetchHistoryByIdFromApi(id: string): Promise<MaintenanceHistoryEntry | undefined> {
  const res = await apiClient<ApiScheduleRow>(`/maintenance/schedules/${id}`, { timeoutMs: 8_000 }).catch(() => null);
  return res ? mapApiScheduleToHistory(res.data) : undefined;
}

export async function completeMaintenanceInApi(data: Omit<MaintenanceHistoryEntry, 'id' | 'code' | 'createdAt'>): Promise<MaintenanceHistoryEntry> {
  // "Concluir" = marcar o agendamento vinculado como COMPLETED.
  // Se houver um scheduleId/planId, atualiza o agendamento correspondente.
  const scheduleId = (data as any).scheduleId ?? data.equipmentId; // fallback
  await completeScheduleInApi(scheduleId);
  // Retorna uma entrada de histórico derivada
  return {
    ...data,
    id: scheduleId,
    code: `HST-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}
