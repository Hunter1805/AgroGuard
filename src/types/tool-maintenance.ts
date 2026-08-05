export type ToolMaintenanceType =
  | 'preventiva'
  | 'corretiva'
  | 'limpeza'
  | 'afiamento'
  | 'lubrificacao'
  | 'troca_componente'
  | 'revisao_eletrica'
  | 'outro';

export type ToolMaintenanceStatus =
  | 'aberta'
  | 'aguardando_aprovacao'
  | 'aguardando_fornecedor'
  | 'em_execucao'
  | 'concluida'
  | 'reprovada'
  | 'cancelada';

export interface ToolMaintenance {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  type: ToolMaintenanceType;
  problemDescription: string;
  openedDate: string; // ISO String
  completedDate?: string; // ISO String
  responsibleName: string;
  providerName?: string;
  serviceExecuted?: string;
  appliedParts?: string;
  cost?: number;
  status: ToolMaintenanceStatus;
  workOrderId?: string;
  notes?: string;
}
