// ─── Tipos e Contratos do Módulo Completo de Checklists (Fase 4) ──────────────

export type ChecklistTemplateType =
  | 'diario'
  | 'semanal'
  | 'mensal'
  | 'pre_operacao'
  | 'pos_operacao'
  | 'seguranca'
  | 'entrega'
  | 'manutencao'
  | 'personalizado';

export type ChecklistItemResponseType =
  | 'conformidade'
  | 'sim_nao'
  | 'texto'
  | 'numero'
  | 'medicao'
  | 'selecao'
  | 'foto';

export type ChecklistExecutionStatus =
  | 'nao_iniciado'
  | 'em_andamento'
  | 'concluido'
  | 'concluido_com_nao_conformidade'
  | 'aguardando_validacao'
  | 'reprovado'
  | 'cancelado';

export type ChecklistItemResult =
  | 'conforme'
  | 'nao_conforme'
  | 'nao_se_aplica'
  | 'nao_verificado';

export type NonConformityStatus =
  | 'aberta'
  | 'em_tratamento'
  | 'aguardando_os'
  | 'resolvida'
  | 'cancelada';

export type ChecklistCriticality =
  | 'baixa'
  | 'media'
  | 'alta'
  | 'critica';

// ─── Item e Seção de Modelo ─────────────────────────────────────────────────
export interface ChecklistItem {
  id: string;
  code?: string;
  title: string;
  description?: string;
  order: number;

  responseType: ChecklistItemResponseType;
  criticality: ChecklistCriticality;

  required: boolean;
  allowNotApplicable: boolean;

  requireNotesOnNonConformity: boolean;
  requirePhotoOnNonConformity: boolean;
  requireMeasurement?: boolean;

  measurementUnit?: string;
  minimumValue?: number;
  maximumValue?: number;

  options?: string[];

  generateAlert: boolean;
  createOrderAutomatically: boolean;
  blockEquipment: boolean;

  correctionGuidance?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  items: ChecklistItem[];
}

export interface ChecklistTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: ChecklistTemplateType;

  applicableEquipmentTypeIds: string[];
  applicableModelIds: string[];
  specificEquipmentIds: string[];

  sections: ChecklistSection[];

  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  archivedAt?: string;
}

// ─── Programações ────────────────────────────────────────────────────────────
export interface ChecklistSchedule {
  id: string;
  templateId: string;
  templateName?: string;
  equipmentIds: string[];
  equipmentTypeIds: string[];

  frequency:
    | 'diaria'
    | 'semanal'
    | 'mensal'
    | 'dias_personalizados'
    | 'sob_demanda';

  weekdays?: number[]; // 0 = Domingo ... 6 = Sábado
  dayOfMonth?: number;
  dueTime?: string; // Ex: "08:00"

  responsibleUserIds: string[];
  validatorUserIds: string[];

  startDate: string;
  endDate?: string;

  active: boolean;
  nextExecutionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Respostas e Execução ────────────────────────────────────────────────────
export interface ChecklistAnswer {
  id: string;
  itemId: string;

  result?: ChecklistItemResult;

  booleanValue?: boolean;
  textValue?: string;
  numericValue?: number;
  selectedOption?: string;

  notes?: string;
  photoUrls: string[];

  nonConformityId?: string;
  immediateAction?: string;

  answeredAt?: string;
}

export interface ChecklistExecution {
  id: string;
  code?: string;
  templateId: string;
  templateName?: string;
  templateType?: ChecklistTemplateType;
  templateVersion: number;

  equipmentId: string;
  equipmentCode?: string;
  equipmentName?: string;
  scheduleId?: string;

  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;

  operatorId: string;
  operatorName?: string;
  validatorId?: string;
  validatorName?: string;

  locationId?: string;

  horimeterReading?: number;
  odometerReading?: number;

  status: ChecklistExecutionStatus;
  answers: ChecklistAnswer[];

  generalNotes?: string;
  initialPhotoUrl?: string;

  finalCondition?:
    | 'liberado'
    | 'liberado_com_restricao'
    | 'bloqueado';

  operatorSignature?: string;
  validatorSignature?: string;
  rejectionReason?: string;

  createdAt: string;
  updatedAt: string;
}

// ─── Não Conformidades ───────────────────────────────────────────────────────
export interface ChecklistNonConformity {
  id: string;
  code?: string;
  executionId: string;
  equipmentId: string;
  equipmentCode?: string;
  equipmentName?: string;
  itemId: string;
  itemTitle?: string;
  checklistName?: string;

  title: string;
  description: string;

  criticality: ChecklistCriticality;
  status: NonConformityStatus;

  photoUrls: string[];

  immediateAction?: string;
  responsibleUserId?: string;
  responsibleName?: string;
  dueAt?: string;

  generatedAlertId?: string;
  generatedOrderId?: string;

  blockedEquipment: boolean;

  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;

  createdAt: string;
  updatedAt: string;
}

// ─── Indicadores e Filtros ──────────────────────────────────────────────────
export interface ChecklistDashboardStats {
  previstosHoje: number;
  concluidosHoje: number;
  atrasados: number;
  execucoesComNaoConformidades: number;
  naoConformidadesCriticas: number;
  equipamentosBloqueados: number;
  taxaConformidade: number;
  modelosAtivos: number;
}

export interface ChecklistExecutionFiltersState {
  search: string;
  equipmentId: string;
  templateId: string;
  type: string;
  status: string;
  operator: string;
  onlyWithNonConformity: boolean;
  onlyWithCriticalItem: boolean;
  onlyBlockedEquipment: boolean;
  onlyOverdue: boolean;
}

export interface NonConformityFiltersState {
  search: string;
  status: string;
  criticality: string;
  equipmentId: string;
  onlyBlocked: boolean;
}

// ─── Tipos Legados de Transição (Para evitar quebras em componentes antigos) ─
export type ChecklistItemStatus = 'ok' | 'nok' | 'pendente';
export type ChecklistFrequency = 'daily' | 'weekly';

export interface LegacyChecklistItem {
  id: number;
  description: string;
  supply?: string;
  frequency: ChecklistFrequency;
  weeklyNote?: string;
}

export interface ChecklistItemEntry {
  itemId: number;
  status: ChecklistItemStatus;
  observation?: string;
}

export interface ChecklistSession {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  horimeter: number;
  timeSpentMinutes?: number;
  operatorName: string;
  responsibleName?: string;
  items: ChecklistItemEntry[];
  status: 'pendente' | 'concluido' | 'com_pendencias';
  observations?: string;
}
