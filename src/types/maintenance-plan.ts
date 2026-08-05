import type { MaintenanceTriggerType, MaintenanceRule, MaintenancePriority } from './maintenance';

// ─── Recursos da Tarefa (Peças, Insumos e Ferramentas) ───────────────────────
export interface MaintenanceRequiredItem {
  id: string;
  itemId?: string;
  name: string;
  quantity?: number;
  unit?: string;
  required: boolean;
  notes?: string;
}

// ─── Tarefa de Manutenção ───────────────────────────────────────────────────
export interface MaintenanceTask {
  id: string;
  order: number;

  title: string;
  description?: string;

  systemId?: string;
  subsystemId?: string;
  criticality: MaintenancePriority;

  estimatedDurationMinutes?: number;
  estimatedMinutes?: number; // compatibilidade legada

  safetyInstructions?: string;
  executionInstructions?: string;
  expectedResult?: string;

  required: boolean;
  requirePhotoBefore: boolean;
  requirePhotoAfter: boolean;
  requireMeasurement: boolean;

  measurementUnit?: string;
  minimumValue?: number;
  maximumValue?: number;

  parts: MaintenanceRequiredItem[];
  supplies: MaintenanceRequiredItem[] | any[]; // aceita também array de MaintenanceSupply legado
  tools: MaintenanceRequiredItem[];
}

// ─── Intervalo de Manutenção (Fase 5) ───────────────────────────────────────
export interface MaintenancePlanInterval {
  id: string;
  name: string;
  description?: string;

  triggerType: MaintenanceTriggerType;
  rule: MaintenanceRule;

  meterType?: 'horimetro' | 'odometro';
  readingInterval?: number;

  timeInterval?: number;
  timeUnit?: 'dias' | 'semanas' | 'meses' | 'anos';

  alertReadingBefore?: number;
  alertDaysBefore?: number;

  allowedReadingDelay?: number;
  allowedDaysDelay?: number;

  priority: MaintenancePriority;

  estimatedDurationMinutes?: number;
  requiresEquipmentStop: boolean;
  requiresApproval: boolean;

  tasks: MaintenanceTask[];
}

// ─── Contrato Mestre do Plano Preventivo (Fase 5 + Compatibilidade) ─────────
export interface MaintenancePlan {
  id?: string;
  code?: string;
  name?: string;
  description?: string;

  applicableEquipmentTypeIds?: string[];
  applicableBrandIds?: string[];
  applicableModelIds?: string[];
  specificEquipmentIds?: string[];

  version?: number;
  active?: boolean;
  archived?: boolean;

  intervals?: MaintenancePlanInterval[];

  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // ── Campos de Compatibilidade com Versões Legadas do Sistema ──
  equipmentId?: string;
  equipmentName?: string;
  intervalBlocks?: MaintenanceIntervalBlock[];
}

// ─── Filtros para Listagem de Planos Preventivos ─────────────────────────────
export interface MaintenancePlanFilterState {
  search: string;
  equipmentType: string;
  brand: string;
  model: string;
  status: 'todos' | 'ativo' | 'inativo' | 'arquivado';
  triggerType: string;
  linkStatus: 'todos' | 'com_vinculo' | 'sem_vinculo';
}

// ─── Estruturas Legadas (Para manter step 5 de cadastro e drawers sem erros) ─
export type IntervalType = 'hours' | 'km' | 'calendar' | 'daily';

export interface MaintenanceInterval {
  label: string;          // "A cada 10 Horas (Diária)", "A cada 250h", "Anual"
  type: IntervalType;
  value: number;          // 10, 250, 1 (para anos), etc.
  unit: string;           // "h", "km", "meses", "semana"
}

export interface MaintenanceSupply {
  description: string;    // "SAE 15W-40 API CI-4", "Graxa de Lítio EP2"
  quantity: string;       // "~8,5", "Conforme necessidade", "-"
  unit: string;           // "Litros", "Gramas", "Peça", "psi"
}

export interface MaintenanceIntervalBlock {
  interval: MaintenanceInterval;
  tasks: any[];
}
