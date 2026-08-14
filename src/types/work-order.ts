
export type WorkOrderStatus =
  | 'rascunho'
  | 'aberta'
  | 'em_triagem'
  | 'aguardando_aprovacao'
  | 'planejada'
  | 'programada'
  | 'aguardando_pecas'
  | 'aguardando_ferramentas'
  | 'aguardando_terceiro'
  | 'em_execucao'
  | 'pausada'
  | 'em_teste'
  | 'aguardando_liberacao'
  | 'finalizada'
  | 'aguardando_aprovacao_final'
  | 'encerrada'
  | 'cancelada';

export type WorkOrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type WorkOrderNature =
  | 'MAINTENANCE'
  | 'INSPECTION'
  | 'DIAGNOSIS'
  | 'INSTALLATION'
  | 'IMPROVEMENT'
  | 'CAMPAIGN_RECALL';

export type WorkOrderMaintenanceType =
  | 'PREVENTIVE'
  | 'CORRECTIVE'
  | 'PREDICTIVE'
  | 'CONDITION_BASED'
  | 'ROUTINE_INSPECTION';

export type WorkOrderCorrectiveMode = 'PLANNED' | 'EMERGENCY';

export type WorkOrderTrigger =
  | 'SCHEDULE'
  | 'CALENDAR'
  | 'HOUR_METER'
  | 'ODOMETER'
  | 'CYCLE'
  | 'CHECKLIST'
  | 'INSPECTION'
  | 'FAILURE'
  | 'SENSOR'
  | 'ALERT'
  | 'OPERATOR_REPORT'
  | 'MANUAL';

export type OperationalImpact =
  | 'sem_impacto'
  | 'impacto_parcial'
  | 'equipamento_indisponivel'
  | 'operacao_paralisada'
  | 'risco_seguranca';

export interface WorkOrderTimelineEvent {
  id: string;
  date: string; // ISO String
  userId: string;
  userName: string;
  action: string;
  description: string;
  previousStatus?: WorkOrderStatus;
  newStatus?: WorkOrderStatus;
  relatedData?: any;
}

export interface WorkOrder {
  id: string;
  code: string;
  status: WorkOrderStatus;
  nature: WorkOrderNature;
  maintenanceType: WorkOrderMaintenanceType | null;
  correctiveMode: WorkOrderCorrectiveMode | null;
  trigger: WorkOrderTrigger;
  priority: WorkOrderPriority;
  impact: OperationalImpact;

  // Abertura / Referências
  openedAt: string;
  requesterId: string;
  requesterName: string;
  
  equipmentId: string;
  equipmentCode?: string;
  equipmentName: string;
  location?: string;
  unit?: string;
  farm?: string;
  sector?: string;
  
  meterReadingAtOpening?: number;
  meterTypeAtOpening?: 'horimetro' | 'odometro';
  photoReadingUrl?: string;

  // IDs de Referência (Origem)
  checklistId?: string;
  checklistExecutionId?: string;
  nonConformityId?: string;
  maintenancePlanId?: string;
  maintenanceScheduleId?: string;
  alertId?: string;

  // Classificação / Abertura
  title: string;
  description: string;
  equipmentCanOperate: boolean;
  requiresBlock: boolean;
  requiresApproval: boolean;
  desiredCompletionDate?: string;
  
  // Falha Reportada (se corretiva/falha)
  failureDateTime?: string;
  identifiedBy?: string;
  symptom?: string;
  systemId?: string;
  subsystemId?: string;
  componentId?: string;
  failureCode?: string;
  possibleCause?: string;
  exactLocation?: string;
  
  attachments: string[]; // URLs

  // Etapas
  // Se houver planejamento, os dados de planejamento vão em planning
  // Se estiver em execução, vai em execution
  // Liberação em release
  // Fechamento em closing

  createdAt: string;
  updatedAt: string;
}
