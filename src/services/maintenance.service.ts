import type { MaintenanceItem, RevisionSchedule, MaintenanceOverviewStats, MaintenanceAlertItem } from '../types/maintenance';
import type { ServiceOrder } from '../types/order';
import { ROUTES } from '../types/routes';
import { isExplicitMockMode } from '../config/data-source.config';

const mockMaintenances: MaintenanceItem[] = [
  { id: 'MAN-901', equipment: 'Trator John Deere 8R', type: 'Preventiva', due: 'Há 5 dias', status: 'vencida', description: 'Troca de óleo de transmissão e substituição de filtros.' },
  { id: 'MAN-902', equipment: 'Caminhão MB Actros', type: 'Corretiva', due: 'Ontem', status: 'vencida', description: 'Desgaste crítico no pneu traseiro direito e alinhamento.' },
  { id: 'MAN-903', equipment: 'Plantadeira DB50', type: 'Calibração', due: 'Hoje (08:15)', status: 'pendente', description: 'Calibração dos sensores de dosagem de sementes.' },
  { id: 'MAN-904', equipment: 'Colheitadeira S700', type: 'Preventiva', due: 'Amanhã', status: 'agendada', description: 'Revisão geral de 500h do sistema hidráulico.' },
  { id: 'MAN-905', equipment: 'Pulverizador M4040', type: 'Preventiva', due: '14 JUL', status: 'agendada', description: 'Inspeção anual de bicos e bomba de pressão.' },
];

const mockRevisions: RevisionSchedule[] = [
  { id: 'REV-01', dateBadge: 'AMANHÃ', equipment: 'Colheitadeira S700', details: 'Revisão de 500h • Oficina Interna', isTomorrow: true },
  { id: 'REV-02', dateBadge: '14 JUL', equipment: 'Pulverizador M4040', details: 'Preventiva Anual • Concessionária' },
  { id: 'REV-03', dateBadge: '18 JUL', equipment: 'Trator Case Magnum', details: 'Troca de fluidos (1000h)' },
];

const mockOrders: ServiceOrder[] = [
  { id: 'OS-4029', equipment: 'Colheitadeira Jacto K3 4x2', equipmentKind: 'Máquina', type: 'Preventiva', maintenanceSubtype: 'Preventiva', priority: 'Média', status: 'Em Progresso', date: '04/08/2026', costEstimate: 'R$ 4.200,00', technician: 'Carlos Eduardo', requester: 'Gerência', failureLocation: 'Fazenda', openDate: '04/08/2026', responsible: 'Carlos Eduardo' },
  { id: 'OS-4028', equipment: 'Trator Massey 265 01 4x2', equipmentKind: 'Trator', type: 'Corretiva', maintenanceSubtype: 'Corretiva não planejada', priority: 'Alta', status: 'Aguardando Peça', date: '03/08/2026', costEstimate: 'R$ 1.850,00', technician: 'Lucas Pereira', requester: 'Operador', failureLocation: 'Lavoura', openDate: '03/08/2026', responsible: 'Lucas Pereira' },
  { id: 'OS-4027', equipment: 'Caminhão Volvo FH 360', equipmentKind: 'Caminhão', type: 'Preventiva', maintenanceSubtype: 'Preventiva', priority: 'Baixa', status: 'Concluída', date: '02/08/2026', costEstimate: 'R$ 650,00', technician: 'Carlos Eduardo', requester: 'Motorista', failureLocation: 'Pátio', openDate: '02/08/2026', responsible: 'Carlos Eduardo' },
  { id: 'OS-4026', equipment: 'Trator Valtra A750 13 4x4', equipmentKind: 'Trator', type: 'Preventiva', maintenanceSubtype: 'Preventiva', priority: 'Média', status: 'Concluída', date: '01/08/2026', costEstimate: 'R$ 900,00', technician: 'Lucas Pereira', requester: 'Gerência', failureLocation: 'Fazenda', openDate: '01/08/2026', responsible: 'Lucas Pereira' },
];

export const maintenanceService = {
  async getQueue(): Promise<MaintenanceItem[]> {
    return isExplicitMockMode ? Promise.resolve([...mockMaintenances]) : Promise.resolve([]);
  },

  async getUpcomingRevisions(): Promise<RevisionSchedule[]> {
    return isExplicitMockMode ? Promise.resolve([...mockRevisions]) : Promise.resolve([]);
  },

  async getOrders(): Promise<ServiceOrder[]> {
    return isExplicitMockMode ? Promise.resolve([...mockOrders]) : Promise.resolve([]);
  },

  async createOrder(newOrder: ServiceOrder): Promise<ServiceOrder> {
    mockOrders.unshift(newOrder);
    return Promise.resolve(newOrder);
  },

  // ─── Agregação Analítica Mestre da Fase 5 (Visão Geral) ─────────────────────
  async getMaintenanceOverviewStats(): Promise<MaintenanceOverviewStats> {
    if (!isExplicitMockMode) return { vencidas: 0, urgentes: 0, proximas: 0, programadas: 0, emExecucao: 0, concluidasPeriodo: 0, semPlanoPreventivo: 0, ordensPreventivasAbertas: 0, percentualCumprimento: 0, tempoPrevistoMinutos: 0, tempoRealizadoMinutos: 0 };
    const stats: MaintenanceOverviewStats = {
      vencidas: 2,
      urgentes: 3,
      proximas: 6,
      programadas: 4,
      emExecucao: 2,
      concluidasPeriodo: 18,
      semPlanoPreventivo: 1,
      ordensPreventivasAbertas: 5,
      percentualCumprimento: 94.2,
      tempoPrevistoMinutos: 3600,
      tempoRealizadoMinutos: 3420,
    };
    return Promise.resolve(stats);
  },

  async getMaintenanceAlerts(): Promise<MaintenanceAlertItem[]> {
    if (!isExplicitMockMode) return [];
    const alerts: MaintenanceAlertItem[] = [
      {
        id: 'ALT-MAN-01',
        type: 'proxima',
        equipmentId: 'EQ-022',
        equipmentCode: 'TR-022',
        equipmentName: 'Trator LS U80 22 4x4',
        planId: 'PLN-V5-01',
        planName: 'Plano Preventivo Trator LS U80 (2026)',
        intervalId: 'INT-200H',
        intervalName: 'A Cada 200 Horas (Troca de Óleo e Filtros)',
        priority: 'HIGH',
        currentReading: 6185,
        dueReading: 6200,
        meterType: 'horimetro',
        remainingValue: 'Restam 15h de operação',
        responsibleName: 'Eng. Mecânico (Carlos Roberto)',
        recommendedAction: 'Agendar parada de 2h na oficina para substituição de filtros.',
        route: ROUTES.MANUTENCOES_AGENDA,
      },
      {
        id: 'ALT-MAN-02',
        type: 'aguardando_peca',
        equipmentId: 'EQ-005',
        equipmentCode: 'COL-01',
        equipmentName: 'Colhedora John Deere S700',
        planId: 'PLN-V5-03',
        planName: 'Plano Colhedora S-Series Anual',
        intervalId: 'INT-500H',
        intervalName: 'Revisão Hidráulica 500h',
        priority: 'CRITICAL',
        currentReading: 12515,
        dueReading: 12500,
        meterType: 'horimetro',
        remainingValue: 'Excedido em 15h (No Limite da Tolerância)',
        responsibleName: 'Técnico Concessionaria JD',
        recommendedAction: 'Cobrar fornecedor pela entrega imediata do kit hidráulico Hy-Gard.',
        route: ROUTES.MANUTENCOES_AGENDA,
      },
      {
        id: 'ALT-MAN-03',
        type: 'sem_plano',
        equipmentId: 'EQ-018',
        equipmentCode: 'IMP-04',
        equipmentName: 'Plantadeira Jacto Meridia 12',
        priority: 'NORMAL',
        remainingValue: 'Nenhum plano ativo vinculado',
        responsibleName: 'Supervisor Operacional (Roberto Campos)',
        recommendedAction: 'Vincular o plano de revisão pré-plantio ao implemento antes do início de setembro.',
        route: ROUTES.MANUTENCOES_PLANOS,
      },
    ];
    return Promise.resolve(alerts);
  },
};

