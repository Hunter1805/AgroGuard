import { isExplicitMockMode } from '../config/data-source.config';
import type {
  DashboardKPIs,
  MonthlyCostBar,
  ActiveAlert,
  FleetStatusBreakdown,
  DashboardStats,
  DashboardAlert,
  UpcomingMaintenance,
  DashboardActivity,
  DashboardOrder,
} from '../types/dashboard';

// ─── Stats ───────────────────────────────────────────────────────────────────
const mockStats: DashboardStats = {
  totalEquipment: 31,
  availableEquipment: 22,
  operatingEquipment: 14,
  maintenanceEquipment: 5,
  stoppedEquipment: 3,
  blockedEquipment: 1,
  openOrders: 8,
  overdueOrders: 3,
  upcomingMaintenance: 7,
  overdueMaintenance: 4,
  pendingChecklists: 6,
  openNonConformities: 2,
  borrowedTools: 9,
  lowStockItems: 3,
  criticalAlerts: 4,
};

// ─── Alertas prioritários ─────────────────────────────────────────────────────
const mockAlerts: DashboardAlert[] = [
  {
    id: 'DA-001',
    title: 'Manutenção Vencida — 250h',
    description: 'Troca de óleo motor vencida há 3 dias. Equipamento operando fora do intervalo recomendado.',
    type: 'Manutenção',
    priority: 'critica',
    status: 'novo',
    equipmentId: 'EQ-003',
    equipmentName: 'Trator Massey 275 03',
    createdAt: '2026-08-01T08:00:00Z',
    dueAt: '2026-07-29T00:00:00Z',
    recommendedAction: 'Criar OS preventiva imediatamente',
    targetRoute: '/ordens-servico',
  },
  {
    id: 'DA-002',
    title: 'Falha Crítica Registrada',
    description: 'Sistema hidráulico com pressão abaixo do mínimo. Equipamento bloqueado automaticamente.',
    type: 'Falha',
    priority: 'critica',
    status: 'em_tratamento',
    equipmentId: 'EQ-014',
    equipmentName: 'Trator Valtra A750 14',
    createdAt: '2026-08-02T14:30:00Z',
    recommendedAction: 'Abrir OS corretiva urgente',
    targetRoute: '/ordens-servico',
  },
  {
    id: 'DA-003',
    title: 'Checklist Não Realizado',
    description: 'Checklist diário não preenchido há 2 dias consecutivos.',
    type: 'Checklist',
    priority: 'alta',
    status: 'novo',
    equipmentId: 'EQ-022',
    equipmentName: 'Trator LS U80 22',
    createdAt: '2026-08-02T07:00:00Z',
    dueAt: '2026-08-04T12:00:00Z',
    recommendedAction: 'Realizar checklist agora',
    targetRoute: '/checklists',
  },
  {
    id: 'DA-004',
    title: 'Pressão de Pneu Irregular',
    description: 'Dianteiro esquerdo (PN-0893) com 24 PSI — recomendado 35 PSI. Risco de desgaste irregular.',
    type: 'Pneus',
    priority: 'media',
    status: 'visualizado',
    equipmentId: 'EQ-003',
    equipmentName: 'Trator Massey Ferguson 275 03',
    createdAt: '2026-08-03T09:30:00Z',
    recommendedAction: 'Calibrar pneu',
    targetRoute: '/pneus',
  },
  {
    id: 'DA-007',
    title: 'Pneu Próximo do Sulco Mínimo',
    description: 'Pneu PN-0901 com sulco atual de 5mm (mínimo 3mm). Recomenda-se recapagem.',
    type: 'Pneus',
    priority: 'alta',
    status: 'novo',
    createdAt: '2026-08-02T11:00:00Z',
    recommendedAction: 'Enviar para recapagem',
    targetRoute: '/pneus',
  },
  {
    id: 'DA-005',
    title: 'OS Aguardando Peça há 5 Dias',
    description: 'Filtro de ar não chegou. OS parada desde 28/07.',
    type: 'Ordem de Serviço',
    priority: 'alta',
    status: 'em_tratamento',
    equipmentId: 'EQ-V01',
    equipmentName: 'Caminhão Volvo FH 360',
    createdAt: '2026-07-28T10:00:00Z',
    recommendedAction: 'Verificar pedido junto ao fornecedor',
    targetRoute: '/ordens-servico',
  },
  {
    id: 'DA-006',
    title: 'Leitura de Horímetro Atrasada',
    description: 'Sem leitura registrada há 4 dias. Pode afetar precisão dos alertas de manutenção.',
    type: 'Leitura',
    priority: 'media',
    status: 'novo',
    equipmentId: 'EQ-C01',
    equipmentName: 'Colhedora Jacto K3',
    createdAt: '2026-07-31T00:00:00Z',
    recommendedAction: 'Registrar leitura atual',
    targetRoute: '/equipamentos',
  },
  {
    id: 'DA-008',
    title: 'Empréstimo de Ferramenta Atrasado',
    description: 'Multímetro Digital Automotivo (FER-002) com prazo de devolução vencido desde 01/08 por Carlos Silva.',
    type: 'Ordem de Serviço',
    priority: 'alta',
    status: 'novo',
    createdAt: '2026-08-02T08:00:00Z',
    recommendedAction: 'Registrar devolução ou prorrogar',
    targetRoute: '/ferramentas/emprestimos',
  },
  {
    id: 'DA-009',
    title: 'Calibração de Ferramenta Vencida',
    description: 'Multímetro Digital (FER-002) com aferição vencida. Equipamento bloqueado para novos empréstimos.',
    type: 'Manutenção',
    priority: 'critica',
    status: 'novo',
    createdAt: '2026-08-01T09:00:00Z',
    recommendedAction: 'Registrar calibração técnica',
    targetRoute: '/ferramentas/calibracoes',
  },
  {
    id: 'DA-010',
    title: 'Item Sem Estoque: Fluido Hidráulico ISO VG 68',
    description: 'Fluido de transmissão hidráulica (FLI-ISO68) com saldo 0 L. Risco de interrupção em corretivas.',
    type: 'Estoque',
    priority: 'critica',
    status: 'novo',
    createdAt: '2026-08-03T16:00:00Z',
    recommendedAction: 'Emitir Pedido de Compras',
    targetRoute: '/pecas-insumos/PART-004',
  },
  {
    id: 'DA-011',
    title: 'Lote de Insumo com Validade Próxima',
    description: 'Lote LT-2026-8801 do Óleo 15W40 (240 L) vence em 15/08/2026. Priorizar utilização no FEFO.',
    type: 'Estoque',
    priority: 'alta',
    status: 'novo',
    createdAt: '2026-08-01T08:00:00Z',
    recommendedAction: 'Alocar nas OSs da semana',
    targetRoute: '/pecas-insumos/lotes',
  },
];

// ─── Próximas manutenções ─────────────────────────────────────────────────────
const mockUpcomingMaintenance: UpcomingMaintenance[] = [
  {
    id: 'UM-001',
    equipmentId: 'EQ-022',
    equipmentName: 'Trator LS U80 22',
    planName: 'Revisão de 500 horas',
    triggerType: 'horas',
    currentReading: 472,
    dueReading: 500,
    progressPercentage: 94,
    status: 'urgente',
    unit: 'h',
  },
  {
    id: 'UM-002',
    equipmentId: 'EQ-003',
    equipmentName: 'Trator Massey 275 03',
    planName: 'Troca de óleo motor — 250h',
    triggerType: 'horas',
    currentReading: 8100,
    dueReading: 8100,
    progressPercentage: 100,
    status: 'vencida',
    unit: 'h',
  },
  {
    id: 'UM-003',
    equipmentId: 'EQ-013',
    equipmentName: 'Trator Valtra A750 13',
    planName: 'Lubrificação geral — 3 meses',
    triggerType: 'data',
    dueDate: '2026-08-10T00:00:00Z',
    progressPercentage: 85,
    status: 'proxima',
  },
  {
    id: 'UM-004',
    equipmentId: 'EQ-001',
    equipmentName: 'Trator Massey 265 01',
    planName: 'Troca de filtro de ar — 500h',
    triggerType: 'horas',
    currentReading: 6800,
    dueReading: 7000,
    progressPercentage: 72,
    status: 'normal',
    unit: 'h',
  },
  {
    id: 'UM-005',
    equipmentId: 'EQ-V04',
    equipmentName: 'Caminhão VW 14220',
    planName: 'Revisão geral — 50.000km',
    triggerType: 'quilometros',
    currentReading: 47200,
    dueReading: 50000,
    progressPercentage: 94,
    status: 'urgente',
    unit: 'km',
  },
];

// ─── OS recentes ─────────────────────────────────────────────────────────────
const mockOrders: DashboardOrder[] = [
  {
    id: 'os-001', number: 'OS-0042',
    equipmentName: 'Trator Massey 275 03', type: 'Corretiva não planejada',
    priority: 'Alta', responsible: 'João M.', status: 'Em execução',
    openedAt: '2026-08-01T09:00:00Z', targetRoute: '/ordens-servico',
  },
  {
    id: 'os-002', number: 'OS-0043',
    equipmentName: 'Trator Valtra A750 14', type: 'Corretiva planejada',
    priority: 'Alta', responsible: 'Carlos R.', status: 'Aguardando peças',
    openedAt: '2026-07-28T10:00:00Z', targetRoute: '/ordens-servico',
  },
  {
    id: 'os-003', number: 'OS-0044',
    equipmentName: 'Caminhão Volvo FH 360', type: 'Preventiva',
    priority: 'Média', responsible: 'Pedro A.', status: 'Aberta',
    openedAt: '2026-08-03T14:00:00Z', targetRoute: '/ordens-servico',
  },
  {
    id: 'os-004', number: 'OS-0045',
    equipmentName: 'Colhedora Jacto K3', type: 'Inspeção',
    priority: 'Baixa', responsible: 'Ana S.', status: 'Em teste',
    openedAt: '2026-08-04T08:00:00Z', targetRoute: '/ordens-servico',
  },
  {
    id: 'os-005', number: 'OS-0040',
    equipmentName: 'Trator Agrale 4100 11', type: 'Preventiva',
    priority: 'Baixa', responsible: 'João M.', status: 'Pausada',
    openedAt: '2026-07-25T10:00:00Z', targetRoute: '/ordens-servico',
  },
];

// ─── Linha do tempo ───────────────────────────────────────────────────────────
const mockActivities: DashboardActivity[] = [
  {
    id: 'act-001', type: 'order_opened', title: 'OS-0042 aberta',
    description: 'Falha hidráulica no Trator Massey 275 03',
    userName: 'João Mecânico', createdAt: '2026-08-04T09:15:00Z',
    targetRoute: '/ordens-servico',
  },
  {
    id: 'act-002', type: 'reading_recorded', title: 'Leitura registrada',
    description: 'Trator LS U80 22 — 472 h',
    userName: 'Operador Paulo', createdAt: '2026-08-04T07:30:00Z',
    targetRoute: '/equipamentos',
  },
  {
    id: 'act-003', type: 'checklist_completed', title: 'Checklist diário concluído',
    description: 'Trator Massey 3307 4x4 — sem não conformidades',
    userName: 'Operador Lucas', createdAt: '2026-08-04T06:45:00Z',
    targetRoute: '/checklists',
  },
  {
    id: 'act-004', type: 'nonconformity_detected', title: 'Não conformidade detectada',
    description: 'Trator Valtra A750 13 — pressão baixa no pneu dianteiro',
    userName: 'Sistema', createdAt: '2026-08-03T17:00:00Z',
    targetRoute: '/alertas',
  },
  {
    id: 'act-005', type: 'tool_borrowed', title: 'Ferramenta emprestada',
    description: 'Chave de torque retirada por Carlos R. para OS-0043',
    userName: 'Carlos R.', createdAt: '2026-08-03T14:20:00Z',
    targetRoute: '/ferramentas',
  },
  {
    id: 'act-006', type: 'maintenance_started', title: 'Manutenção iniciada',
    description: 'Revisão 250h — Trator Massey 3407 24',
    userName: 'Mecânico Pedro', createdAt: '2026-08-03T11:00:00Z',
    targetRoute: '/manutencoes',
  },
  {
    id: 'act-007', type: 'equipment_released', title: 'Equipamento liberado',
    description: 'Adubadeira Minami M535D — OS-0039 encerrada',
    userName: 'Gestor Marco', createdAt: '2026-08-02T16:30:00Z',
    targetRoute: '/ordens-servico',
  },
  {
    id: 'act-008', type: 'part_used', title: 'Peça utilizada',
    description: 'Filtro de óleo — 2 unidades, OS-0041',
    userName: 'João Mecânico', createdAt: '2026-08-02T10:00:00Z',
    targetRoute: '/pecas-insumos',
  },
];

// ─── Legado (compatibilidade) ─────────────────────────────────────────────────
const mockKPIs: DashboardKPIs = {
  currentMonthCost: 'R$ 45.280',
  projectedMonthCost: 'R$ 52.100',
  costTrendPercentage: 12,
  overdueMaintenancesCount: 4,
  nextMaintenancesCount: 7,
};

const mockCostChart: Record<string, MonthlyCostBar[]> = {
  '6M': [
    { month: 'Fev', costLabel: 'R$ 31.2k', heightPercent: 55 },
    { month: 'Mar', costLabel: 'R$ 18.5k', heightPercent: 30 },
    { month: 'Abr', costLabel: 'R$ 38.9k', heightPercent: 70 },
    { month: 'Mai', costLabel: 'R$ 34.1k', heightPercent: 60 },
    { month: 'Jun', costLabel: 'R$ 41.7k', heightPercent: 75 },
    { month: 'Jul', costLabel: 'R$ 45.2k', heightPercent: 85, isCurrent: true },
  ],
  YTD: [
    { month: 'Q1', costLabel: 'R$ 72.1k', heightPercent: 60 },
    { month: 'Q2', costLabel: 'R$ 118.2k', heightPercent: 90, isCurrent: true },
  ],
};

const mockLegacyAlerts: ActiveAlert[] = [
  { id: '1', equipment: 'Trator Massey 275 03', message: 'Manutenção 250h vencida há 3 dias.', timeAgo: 'Há 3d', severity: 'error' },
  { id: '2', equipment: 'Trator Valtra A750 14', message: 'Sistema hidráulico com pressão crítica.', timeAgo: 'Ontem', severity: 'error' },
  { id: '3', equipment: 'Colhedora Jacto K3', message: 'Horímetro sem leitura há 4 dias.', timeAgo: 'Há 4d', severity: 'tertiary' },
];

const mockFleetStatus: FleetStatusBreakdown = {
  total: 31,
  operantes: 22,
  emManutencao: 5,
  inoperantes: 4,
};

// ─── Serviço ─────────────────────────────────────────────────────────────────
export const dashboardService = {
  // Novos métodos
  async getStats(): Promise<DashboardStats> {
    if (!isExplicitMockMode) {
      return { totalEquipment: 0, availableEquipment: 0, operatingEquipment: 0, maintenanceEquipment: 0, stoppedEquipment: 0, blockedEquipment: 0, openOrders: 0, overdueOrders: 0, upcomingMaintenance: 0, overdueMaintenance: 0, pendingChecklists: 0, openNonConformities: 0, borrowedTools: 0, lowStockItems: 0, criticalAlerts: 0 };
    }
    return Promise.resolve({ ...mockStats });
  },

  async getPriorityAlerts(limit = 6): Promise<DashboardAlert[]> {
    if (!isExplicitMockMode) return [];
    const priorityOrder: Record<string, number> = {
      critica: 0, alta: 1, media: 2, baixa: 3, informativo: 4,
    };
    const sorted = [...mockAlerts].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    return Promise.resolve(sorted.slice(0, limit));
  },

  async getUpcomingMaintenance(): Promise<UpcomingMaintenance[]> {
    if (!isExplicitMockMode) return [];
    const statusOrder: Record<string, number> = {
      vencida: 0, urgente: 1, proxima: 2, normal: 3,
    };
    return Promise.resolve(
      [...mockUpcomingMaintenance].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      )
    );
  },

  async getRecentOrders(limit = 5): Promise<DashboardOrder[]> {
    if (!isExplicitMockMode) return [];
    return Promise.resolve(mockOrders.slice(0, limit));
  },

  async getRecentActivities(limit = 8): Promise<DashboardActivity[]> {
    if (!isExplicitMockMode) return [];
    return Promise.resolve(mockActivities.slice(0, limit));
  },

  // Legado (compatibilidade)
  async getKPIs(): Promise<DashboardKPIs> {
    if (!isExplicitMockMode) return { currentMonthCost: 'R$ 0', projectedMonthCost: 'R$ 0', costTrendPercentage: 0, overdueMaintenancesCount: 0, nextMaintenancesCount: 0 };
    return Promise.resolve({ ...mockKPIs });
  },

  async getCostChartData(period: '6M' | 'YTD'): Promise<MonthlyCostBar[]> {
    if (!isExplicitMockMode) return [];
    return Promise.resolve(mockCostChart[period] ?? []);
  },

  async getActiveAlerts(): Promise<ActiveAlert[]> {
    if (!isExplicitMockMode) return [];
    return Promise.resolve([...mockLegacyAlerts]);
  },

  async getFleetStatus(): Promise<FleetStatusBreakdown> {
    if (!isExplicitMockMode) return { total: 0, operantes: 0, emManutencao: 0, inoperantes: 0 };
    return Promise.resolve({ ...mockFleetStatus });
  },
};
