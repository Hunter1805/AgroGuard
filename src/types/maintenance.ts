// ─── Tipos Gerais e Enums da Fase 5: Sistema Completo de Manutenções ─────────

export type MaintenanceTriggerType =
  | 'horas'
  | 'quilometros'
  | 'data'
  | 'dias'
  | 'semanas'
  | 'meses'
  | 'anos'
  | 'data_fixa'
  | 'fim_safra'
  | 'combinado';

export type MaintenanceRule =
  | 'leitura'
  | 'tempo'
  | 'o_que_ocorrer_primeiro';

export type MaintenanceStatus =
  | 'em_dia'
  | 'proxima'
  | 'urgente'
  | 'vencida'
  | 'programada'
  | 'em_execucao'
  | 'concluida'
  | 'adiada'
  | 'cancelada';

export type MaintenanceScheduleStatus =
  | 'rascunho'
  | 'planejada'
  | 'aguardando_aprovacao'
  | 'programada'
  | 'aguardando_pecas'
  | 'em_execucao'
  | 'concluida'
  | 'adiada'
  | 'cancelada';

export type MaintenancePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

// ─── Indicadores da Visão Geral de Manutenções (Dashboard) ───────────────────
export interface MaintenanceOverviewStats {
  vencidas: number;
  urgentes: number;
  proximas: number;
  programadas: number;
  emExecucao: number;
  concluidasPeriodo: number;
  semPlanoPreventivo: number;
  ordensPreventivasAbertas: number;
  percentualCumprimento: number;
  tempoPrevistoMinutos: number;
  tempoRealizadoMinutos: number;
}

// ─── Alertas Específicos de Manutenção ────────────────────────────────────────
export interface MaintenanceAlertItem {
  id: string;
  type: 'proxima' | 'urgente' | 'vencida' | 'sem_leitura' | 'config_incompleta' | 'sem_plano' | 'programada_atrasada' | 'aguardando_peca';
  equipmentId: string;
  equipmentCode?: string;
  equipmentName: string;
  planId?: string;
  planName?: string;
  intervalId?: string;
  intervalName?: string;
  priority: MaintenancePriority;
  currentReading?: number;
  dueReading?: number;
  meterType?: 'horimetro' | 'odometro';
  dueDate?: string;
  remainingValue?: string; // Ex: "Restam 28h" ou "Vence em 4 dias"
  responsibleName?: string;
  recommendedAction: string;
  route: string;
}

// ─── Tipos Legados e Transicionais (Para preservar componentes antigos) ──────
export type MaintenanceType = 'Preventiva' | 'Corretiva' | 'Calibração';
export type LegacyMaintenanceStatus = 'vencida' | 'pendente' | 'agendada' | 'concluida';

export interface MaintenanceItem {
  id: string;
  equipment: string;
  type: MaintenanceType;
  due: string;
  status: LegacyMaintenanceStatus;
  description: string;
}

export interface RevisionSchedule {
  id: string;
  dateBadge: string;
  equipment: string;
  details: string;
  isTomorrow?: boolean;
}
