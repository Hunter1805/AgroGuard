import type { MaintenanceScheduleStatus, MaintenancePriority } from './maintenance';
import type { MaintenanceRequiredItem } from './maintenance-plan';

// ─── Vinculação do Plano ao Equipamento ──────────────────────────────────────
export interface EquipmentMaintenancePlanLink {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  equipmentCode?: string;
  planId: string;
  planName?: string;
  planVersion: number;

  startDate: string;
  baseReading?: number;
  baseDate?: string;
  lastKnownMaintenanceDate?: string;
  lastKnownMaintenanceReading?: number;

  applicableIntervalIds?: string[];
  active: boolean;

  maintenanceResponsibleId?: string;
  maintenanceResponsibleName?: string;
  workshopId?: string;
  workshopName?: string;
  observations?: string;

  createdAt: string;
  updatedAt: string;
}

// ─── Programação na Agenda de Manutenção ─────────────────────────────────────
export interface MaintenanceSchedule {
  id: string;
  code: string;
  equipmentId: string;
  equipmentCode?: string;
  equipmentName: string;

  planId?: string;
  planName?: string;
  intervalId?: string;
  intervalName?: string;

  scheduledDate: string; // ISO
  scheduledTime?: string; // Ex: "08:00"
  dueReading?: number;
  meterType?: 'horimetro' | 'odometro';
  currentReading?: number;

  priority: MaintenancePriority;
  status: MaintenanceScheduleStatus;

  responsibleId?: string;
  responsibleName: string;
  teamName?: string;
  workshopName?: string;
  farmName?: string;
  unitName?: string;

  estimatedDurationMinutes: number;
  requiresEquipmentStop: boolean;

  parts: MaintenanceRequiredItem[];
  supplies: MaintenanceRequiredItem[];
  tools: MaintenanceRequiredItem[];

  observations?: string;
  rescheduledReason?: string;
  rescheduleReason?: string;
  canceledReason?: string;
  preventiveOrderId?: string; // Ordem de Serviço Preventiva vinculada

  createdAt: string;
  updatedAt: string;
}

// ─── Histórico Auditável de Manutenções Concluídas ───────────────────────────
export interface MaintenanceHistoryEntry {
  id: string;
  code: string;
  equipmentId: string;
  equipmentCode?: string;
  equipmentName: string;

  planId: string;
  planName: string;
  planVersion: number;
  intervalId?: string;
  intervalName: string;
  triggerType?: string;

  completedDate: string;
  executionDate?: string;
  meterReading: number;
  performedReading?: number;
  expectedReading?: number;
  meterType: 'horimetro' | 'odometro';
  preventiveOrderId?: string;
  responsibleName: string;
  technicianResponsible?: string;
  workshopName?: string;

  estimatedMinutes: number;
  realizedMinutes: number;
  durationMinutes?: number;
  totalCost: number;
  totalCostEstimate?: number;
  technicianNotes?: string;

  result: 'aprovado' | 'aprovado_com_restricao' | 'reprovado';
  nextDueDate?: string;
  nextDueReading?: number;

  tasksCompleted: Array<{
    title: string;
    completed: boolean;
    notes?: string;
    measurementValue?: number;
    measurementUnit?: string;
    photoBeforeUrl?: string;
    photoAfterUrl?: string;
  }>;
  partsConsumed: Array<{ name: string; quantity: number; unit: string; cost?: number }>;
  suppliesConsumed: Array<{ name: string; quantity: number; unit: string; cost?: number }>;
  observations?: string;

  createdAt: string;
}

// ─── Filtros de Agenda e Histórico ───────────────────────────────────────────
export interface MaintenanceScheduleFilterState {
  search: string;
  equipmentId: string;
  responsible: string;
  workshop: string;
  status: string;
  priority: string;
  period: 'todos' | 'hoje' | 'semana' | 'mes' | 'atrasados';
}

export interface MaintenanceHistoryFilterState {
  search: string;
  equipmentId: string;
  planId: string;
  interval: string;
  responsible: string;
  workshop: string;
  result: string;
  onlyWithOrder: boolean;
  onlyWithDelay: boolean;
  triggerType: string;
}
