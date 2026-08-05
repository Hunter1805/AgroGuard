import type { MaintenanceTriggerType } from './maintenance';

// ─── Referência mínima de equipamento para o Dashboard ─────────────────────
export interface EquipmentReference {
  id: string;
  code: string;
  name: string;
  status: 'operante' | 'em_operacao' | 'manutencao' | 'parado' | 'bloqueado' | 'inoperante';
}

// ─── Indicadores do Dashboard ───────────────────────────────────────────────
export interface DashboardStats {
  // Status de equipamentos
  totalEquipment: number;
  availableEquipment: number;
  operatingEquipment: number;
  maintenanceEquipment: number;
  stoppedEquipment: number;
  blockedEquipment: number;
  // Ordens de serviço
  openOrders: number;
  overdueOrders: number;
  // Manutenções
  upcomingMaintenance: number;
  overdueMaintenance: number;
  // Outros
  pendingChecklists: number;
  openNonConformities: number;
  borrowedTools: number;
  lowStockItems: number;
  criticalAlerts: number;
}

// ─── Alertas resumidos para o Dashboard ─────────────────────────────────────
export type AlertPriority = 'informativo' | 'baixa' | 'media' | 'alta' | 'critica';
export type AlertStatus =
  | 'novo'
  | 'visualizado'
  | 'em_tratamento'
  | 'adiado'
  | 'resolvido';

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: AlertPriority;
  status: AlertStatus;
  equipmentId?: string;
  equipmentName?: string;
  createdAt: string; // ISO
  dueAt?: string;    // ISO
  recommendedAction?: string;
  targetRoute?: string;
}

// ─── Próximas manutenções ────────────────────────────────────────────────────
export type DashboardMaintenanceStatus = 'normal' | 'proxima' | 'urgente' | 'vencida';

export interface UpcomingMaintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  planName: string;
  triggerType: MaintenanceTriggerType;
  currentReading?: number;
  dueReading?: number;
  dueDate?: string; // ISO
  progressPercentage: number;
  status: DashboardMaintenanceStatus;
  unit?: string; // 'h' | 'km'
}

// ─── Atividades recentes (linha do tempo) ────────────────────────────────────
export interface DashboardActivity {
  id: string;
  type:
    | 'equipment_registered'
    | 'reading_recorded'
    | 'checklist_completed'
    | 'nonconformity_detected'
    | 'order_opened'
    | 'maintenance_started'
    | 'part_used'
    | 'equipment_released'
    | 'tool_borrowed';
  title: string;
  description?: string;
  userName?: string;
  createdAt: string; // ISO
  targetRoute?: string;
}

// ─── Legado — mantido por compatibilidade com componentes existentes ─────────
export interface DashboardKPIs {
  currentMonthCost: string;
  projectedMonthCost: string;
  costTrendPercentage: number;
  overdueMaintenancesCount: number;
  nextMaintenancesCount: number;
}

export interface MonthlyCostBar {
  month: string;
  costLabel: string;
  heightPercent: number;
  isCurrent?: boolean;
}

export interface ActiveAlert {
  id: string;
  equipment: string;
  message: string;
  timeAgo: string;
  severity: 'error' | 'tertiary' | 'primary';
}

export interface FleetStatusBreakdown {
  total: number;
  operantes: number;
  emManutencao: number;
  inoperantes: number;
}

// ─── OS resumida para o Dashboard ───────────────────────────────────────────
export type OrderPriorityDash = 'Alta' | 'Média' | 'Baixa';
export type OrderStatusDash =
  | 'Aberta'
  | 'Em execução'
  | 'Aguardando peças'
  | 'Pausada'
  | 'Em teste'
  | 'Finalizada'
  | 'Cancelada';

export interface DashboardOrder {
  id: string;
  number: string;
  equipmentName: string;
  type: string;
  priority: OrderPriorityDash;
  responsible: string;
  status: OrderStatusDash;
  openedAt: string; // ISO
  targetRoute: string;
}
