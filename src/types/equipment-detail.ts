import type { Equipment, EquipmentDocument, EquipmentImage } from './equipment';
import type { Priority } from '../components/ui/PriorityBadge';

export type EquipmentDetailTab =
  | 'visao-geral'
  | 'leituras'
  | 'checklists'
  | 'manutencoes'
  | 'ordens-servico'
  | 'falhas'
  | 'pneus'
  | 'pecas-insumos'
  | 'custos'
  | 'documentos'
  | 'fotos'
  | 'historico';

export interface EquipmentDetailSummary {
  openOrders: number;
  pendingAlerts: number;
  overdueMaintenance: number;
  pendingChecklists: number;
  openFailures: number;
  accumulatedCost: number;
  availabilityPercent: number;
  lastReadingText: string;
  lastChecklistText: string;
}

export interface EquipmentReadingSummary {
  id: string;
  dateTime: string;
  meterId: string;
  meterName: string;
  meterType: 'horimetro' | 'odometro' | 'outros';
  unit: string;
  previousValue: number;
  newValue: number;
  difference: number;
  source: string;
  user: string;
  status: 'normal' | 'suspeito' | 'corrigido';
  photoUrl?: string;
  notes?: string;
}

export interface EquipmentChecklistSummary {
  id: string;
  code: string;
  scheduledDate: string;
  executionDate?: string;
  modelName: string;
  type: string;
  status: 'Concluído' | 'Com Ressalva' | 'Pendente' | 'Cancelado';
  nonConformitiesCount: number;
  finalResult: 'Aprovado' | 'Aprovado com Restrição' | 'Reprovado';
  operatorName: string;
}

export interface EquipmentMaintenanceSummary {
  id: string;
  title: string;
  type: 'Preventiva' | 'Preditiva' | 'Corretiva';
  planName?: string;
  planCode?: string;
  triggerType: 'Leitura' | 'Data' | 'Misto';
  targetValue?: string;
  dueDate?: string;
  progressPercent: number;
  status: 'Em Dia' | 'Próxima' | 'Vencida' | 'Concluída';
  serviceOrderId?: string;
  cost?: number;
  executedBy?: string;
  executedAt?: string;
}

export interface EquipmentOrderSummary {
  id: string;
  number: string;
  openingDate: string;
  type: string;
  description: string;
  priority: Priority;
  status: 'Aberta' | 'Em Execução' | 'Aguardando Peça' | 'Aguardando Terceiro' | 'Encerrada';
  responsibleName: string;
  timeOpenHours: number;
  cost: number;
}

export interface EquipmentFailureSummary {
  id: string;
  code: string;
  date: string;
  system: string;
  subsystem?: string;
  component?: string;
  symptom: string;
  causeIdentified?: string;
  criticality: Priority;
  status: 'Em Investigação' | 'OS Criada' | 'Resolvido';
  relatedOrderId?: string;
}

export interface EquipmentRecurrentFailureGroup {
  system: string;
  subsystem: string;
  symptom: string;
  occurrencesCount: number;
  lastOccurrenceDate: string;
}

export interface EquipmentTirePosition {
  id: string;
  axle: string;
  side: 'Esquerdo' | 'Direito' | 'Central';
  position: string;
  tireCode: string;
  brand: string;
  measure: string;
  currentPressurePsi: number;
  recommendedPressurePsi: number;
  treadDepthMm: number;
  condition: 'Excelente' | 'Bom' | 'Regular' | 'Crítico';
  lastInspectionDate: string;
}

export interface EquipmentTireSummary {
  totalTiresInstalled: number;
  axleConfiguration: string;
  recommendedPressureText: string;
  lastInspectionDate?: string;
  anomaliesCount: number;
  positions: EquipmentTirePosition[];
}

export interface EquipmentPartUsage {
  id: string;
  date: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  serviceOrderId?: string;
  responsibleName: string;
}

export interface EquipmentCostSummary {
  id: string;
  date: string;
  category: 'Preventiva' | 'Corretiva' | 'Peças' | 'Insumos' | 'Mão de Obra' | 'Terceiros' | 'Pneus';
  description: string;
  source: string;
  serviceOrderId?: string;
  value: number;
  responsibleName: string;
}

export interface EquipmentDocumentSummary extends EquipmentDocument {
  docType: string;
  docNumber?: string;
  issueDate?: string;
  dueDate?: string;
  status: 'Válido' | 'Próximo do Vencimento' | 'Vencido' | 'Sem Vencimento' | 'Arquivado';
  hasAlert: boolean;
}

export interface EquipmentPhotoSummary extends EquipmentImage {
  category: 'Principal' | 'Painel' | 'Frente' | 'Traseira' | 'Lateral' | 'Placa' | 'Patrimônio' | 'Adicional';
  caption?: string;
  date: string;
  uploadedBy: string;
}

export interface EquipmentHistoryEvent {
  id: string;
  type:
    | 'cadastro'
    | 'edicao'
    | 'status'
    | 'responsavel'
    | 'localizacao'
    | 'leitura'
    | 'checklist'
    | 'falha'
    | 'ordem_servico'
    | 'manutencao'
    | 'peca'
    | 'documento'
    | 'foto'
    | 'arquivamento'
    | 'reativacao';
  title: string;
  description: string;
  dateTime: string;
  userName: string;
  sourceModule: string;
  relatedLink?: string;
  previousValue?: string;
  newValue?: string;
}

export interface EquipmentDetailData {
  equipment: Equipment;
  summary: EquipmentDetailSummary;
  readings: EquipmentReadingSummary[];
  checklists: EquipmentChecklistSummary[];
  maintenances: EquipmentMaintenanceSummary[];
  orders: EquipmentOrderSummary[];
  failures: EquipmentFailureSummary[];
  recurrentFailures: EquipmentRecurrentFailureGroup[];
  tires: EquipmentTireSummary;
  parts: EquipmentPartUsage[];
  costs: EquipmentCostSummary[];
  documents: EquipmentDocumentSummary[];
  photos: EquipmentPhotoSummary[];
  history: EquipmentHistoryEvent[];
}
