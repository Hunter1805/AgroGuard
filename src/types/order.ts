import type { MaintenanceType } from './maintenance';

export type OrderPriority = 'Alta' | 'Média' | 'Baixa';
export type OrderStatus = 'Em Progresso' | 'Aguardando Peça' | 'Concluída' | 'Pendente';
export type MaintenanceSubtype = 'Preventiva' | 'Corretiva não planejada' | 'Corretiva planejada';
export type EquipmentKind = 'Trator' | 'Implemento' | 'Máquina' | 'Caminhão' | 'Outro';
export type FailureLocation = 'Fazenda' | 'Pátio' | 'Lavoura' | 'Outro';

export interface ServiceOrder {
  id: string;
  // ── Dados da OS ───────────────────────────────────────────────────────
  requester: string;             // Solicitante
  failureLocation: FailureLocation;
  openDate: string;              // Data de Abertura
  // ── Identificação do Equipamento ─────────────────────────────────────
  equipment: string;             // Nome/Descrição do ativo
  equipmentKind: EquipmentKind;
  horimeter?: number;
  odometer?: number;
  patrimony?: string;
  brand?: string;
  model?: string;
  // ── Dados de Parada ───────────────────────────────────────────────────
  failureDateTime?: string;      // Falha na Operação
  maintenanceStart?: string;     // Início da Manutenção
  maintenanceEnd?: string;       // Término da Manutenção
  operationResume?: string;      // Retomada de Operação
  totalDowntimeHours?: number;   // Tempo Total de Parada
  mttrHours?: number;            // Tempo de Reparo (MTTR)
  // ── Dados da Falha ────────────────────────────────────────────────────
  responsible: string;
  type: MaintenanceType;
  maintenanceSubtype?: MaintenanceSubtype;
  priority: OrderPriority;       // Alta / Média / Baixa (gravidade)
  affectedSystem?: string;       // Sistema afetado
  affectedSubsystem?: string;    // Subsistema afetado
  // ── Textos Livres ─────────────────────────────────────────────────────
  reportedSymptom?: string;      // Sintoma Reportado
  servicesPerformed?: string;    // Serviços Executados
  partsUsed?: string;            // Peças Utilizadas
  observations?: string;
  // ── Status interno ────────────────────────────────────────────────────
  status: OrderStatus;
  date: string;
  costEstimate: string;
  technician: string;
}
