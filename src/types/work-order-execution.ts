export interface WorkOrderTask {
  id: string;
  orderId: string;
  orderIndex: number; // para ordenação
  title: string;
  description?: string;
  systemId?: string;
  subsystemId?: string;
  mandatory: boolean;
  estimatedMinutes: number;
  assignedTo?: string; // ID do responsável
  instructions?: string;
  expectedResult?: string;
  requireBeforePhoto: boolean;
  requireAfterPhoto: boolean;
  requireMeasurement: boolean;
  
  // Execução
  status: 'nao_iniciada' | 'em_execucao' | 'concluida' | 'nao_realizada' | 'bloqueada' | 'cancelada';
  executionResult?: string;
  executionNotes?: string;
  realizedMinutes?: number;
  measurementValue?: number;
  measurementUnit?: string;
  photoBeforeUrl?: string;
  photoAfterUrl?: string;
  executedBy?: string;
  executedAt?: string; // ISO
}

export interface WorkOrderPause {
  id: string;
  orderId: string;
  reason: 
    | 'aguardando_peca' 
    | 'aguardando_ferramenta' 
    | 'aguardando_autorizacao' 
    | 'aguardando_mecanico' 
    | 'aguardando_fornecedor' 
    | 'aguardando_transporte' 
    | 'condicao_climatica' 
    | 'equipamento_indisponivel' 
    | 'mudanca_prioridade' 
    | 'intervalo_operacional' 
    | 'outro';
  startedAt: string; // ISO
  startedBy: string; // ID do responsável
  notes?: string;
  estimatedReturnAt?: string;
  endedAt?: string; // ISO
  endedBy?: string;
  active: boolean; // se a pausa ainda está correndo
}

export interface WorkOrderService {
  id: string;
  orderId: string;
  description: string;
  responsibleId: string;
  responsibleName: string;
  startedAt: string;
  endedAt: string;
  realizedMinutes: number;
  result: string;
  notes?: string;
}

export interface WorkOrderPartUsage {
  id: string;
  orderId: string;
  itemName: string;
  partId?: string; // Referência opcional de ID
  estimatedQuantity: number;
  usedQuantity: number;
  unit: string;
  batchOrReference?: string;
  unitCost?: number;
  totalCost?: number;
  withdrawnBy?: string;
}

export interface WorkOrderSupplyUsage {
  id: string;
  orderId: string;
  itemName: string;
  supplyId?: string;
  estimatedQuantity: number;
  usedQuantity: number;
  unit: string;
  batchOrReference?: string;
  unitCost?: number;
  totalCost?: number;
  withdrawnBy?: string;
}

export interface WorkOrderToolUsage {
  id: string;
  orderId: string;
  toolName: string;
  toolId?: string;
  quantity: number;
  withdrawnAt?: string;
  returnedAt?: string;
  stateBefore?: string;
  stateAfter?: string;
  responsibleId?: string;
}

export interface WorkOrderTest {
  id: string;
  orderId: string;
  testType: string; // Dinamômetro, Campo, etc
  procedure: string;
  performedAt: string;
  performedBy: string; // Nome
  result: 'aprovado' | 'aprovado_com_restricao' | 'reprovado' | 'necessita_novo_teste';
  measurements?: string;
  photos?: string[];
  notes?: string;
  failureReappeared: boolean;
  needsRework: boolean;
}

export interface WorkOrderRelease {
  orderId: string;
  condition: 'liberado' | 'liberado_com_restricao' | 'bloqueado';
  usageRestrictions?: string;
  releasedAt: string;
  operationResumedAt?: string;
  releasedBy: string; // Nome ou ID
  receivedByOperator?: string;
  signatureUrl?: string;
  notes?: string;
}

export interface WorkOrderExecutionData {
  // Planejamento
  mainResponsibleId?: string;
  mainResponsibleName?: string;
  teamId?: string;
  teamName?: string;
  mechanicsIds?: string[];
  workshopId?: string;
  workshopName?: string;
  serviceType?: 'interno' | 'terceirizado';
  supplierId?: string;
  supplierName?: string;
  approverId?: string;

  scheduledStartDate?: string; // YYYY-MM-DD
  scheduledStartTime?: string; // HH:mm
  scheduledEndDate?: string;
  estimatedTotalMinutes?: number;
  needsStop?: boolean;
  operationalWindow?: string;
  planningNotes?: string;

  // Execução
  executionStartedAt?: string;
  executionEndedAt?: string;
  
  // Diagnóstico
  technicalDiagnosis?: string;
  foundCause?: string;
  rootCause?: string;
  affectedSystemId?: string;
  affectedSubsystemId?: string;
  affectedComponentId?: string;
  failureConfirmed?: boolean;
  recurrentFailure?: boolean;
  futureRecommendation?: string;
  
  tasks: WorkOrderTask[];
  pauses: WorkOrderPause[];
  services: WorkOrderService[];
  parts: WorkOrderPartUsage[];
  supplies: WorkOrderSupplyUsage[];
  tools: WorkOrderToolUsage[];
  
  tests: WorkOrderTest[];
  release?: WorkOrderRelease;
}
