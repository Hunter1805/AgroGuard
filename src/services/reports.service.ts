import type { ReportDefinition, SavedReport } from '../types/reports';
import type { ReportFilter } from '../types/report-filters';
import { reportIndicatorsService } from './report-indicators.service';

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'rep-equipments',
    title: 'Relatório de Frota & Disponibilidade',
    description: 'Status, horímetro/odômetro, custos acumulados e disponibilidade por equipamento.',
    category: 'equipamentos',
    route: '/relatorios/equipamentos',
    iconName: 'Tractor',
    popular: true,
  },
  {
    id: 'rep-readings',
    title: 'Relatório de Leituras & Horas de Uso',
    description: 'Horas trabalhadas, quilômetros rodados, média diária e leituras pendentes.',
    category: 'leituras',
    route: '/relatorios/leituras',
    iconName: 'Gauge',
  },
  {
    id: 'rep-maintenances',
    title: 'Relatório de Manutenções Preventivas',
    description: 'Cumprimento de planos preventivos, revisões vencidas/concluídas e custos.',
    category: 'manutencoes',
    route: '/relatorios/manutencoes',
    iconName: 'Wrench',
    popular: true,
  },
  {
    id: 'rep-orders',
    title: 'Relatório de Ordens de Serviço',
    description: 'OS por tipo (preventiva/corretiva), prioridade, tempos de atendimento e parada.',
    category: 'ordens-servico',
    route: '/relatorios/ordens-servico',
    iconName: 'ClipboardList',
    popular: true,
  },
  {
    id: 'rep-checklists',
    title: 'Relatório de Checklists & Conformidade',
    description: 'Taxa de execução, conformidade operacional e não conformidades abertas.',
    category: 'checklists',
    route: '/relatorios/checklists',
    iconName: 'CheckSquare',
  },
  {
    id: 'rep-failures',
    title: 'Relatório de Falhas & Diagnósticos',
    description: 'Falhas por sistema, subsistema, criticidade e causas recorrentes.',
    category: 'falhas',
    route: '/relatorios/falhas',
    iconName: 'AlertTriangle',
  },
  {
    id: 'rep-tires',
    title: 'Relatório de Gestão de Pneus',
    description: 'Pneus instalados, sulcos críticos, pressões fora do padrão e rodízios.',
    category: 'pneus',
    route: '/relatorios/pneus',
    iconName: 'Disc',
  },
  {
    id: 'rep-tools',
    title: 'Relatório de Ferramentas & Kits',
    description: 'Disponibilidade de ferramentas, empréstimos atrasados, calibrações e kits.',
    category: 'ferramentas',
    route: '/relatorios/ferramentas',
    iconName: 'Hammer',
  },
  {
    id: 'rep-stock',
    title: 'Relatório de Peças & Estoque',
    description: 'Valor total em estoque, itens sem estoque, consumo por OS e lotes vencendo.',
    category: 'pecas-estoque',
    route: '/relatorios/pecas-estoque',
    iconName: 'Package',
    popular: true,
  },
  {
    id: 'rep-costs',
    title: 'Relatório Consolidado de Custos',
    description: 'Gastos com peças, pneus, mão de obra e serviços por equipamento e fazenda.',
    category: 'custos',
    route: '/relatorios/custos',
    iconName: 'DollarSign',
    popular: true,
  },
  {
    id: 'rep-indicators',
    title: 'Painel de Indicadores Operacionais',
    description: 'Indicadores chave: Disponibilidade, MTTR, MTBF, Cumprimento Preventivo.',
    category: 'indicadores',
    route: '/relatorios/indicadores',
    iconName: 'BarChart2',
    popular: true,
  },
];

let savedReportsStore: SavedReport[] = [
  {
    id: 'fav-001',
    name: 'Filtro Semanal de OS Atrasadas da Oficina Central',
    category: 'ordens-servico',
    reportTypeId: 'rep-orders',
    filters: { status: 'atrasada', companyId: 'UN-01' },
    visibleColumns: ['code', 'equipmentName', 'type', 'priority', 'status', 'estimatedHours'],
    createdByName: 'Roberto Alves',
    isPrivate: false,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
  },
];

export const reportsService = {
  async getReportDefinitions(): Promise<ReportDefinition[]> {
    return REPORT_DEFINITIONS;
  },

  async getSavedReports(): Promise<SavedReport[]> {
    return savedReportsStore;
  },

  async saveFavoriteReport(data: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedReport> {
    const newReport: SavedReport = {
      ...data,
      id: `fav-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savedReportsStore.unshift(newReport);
    return newReport;
  },

  async deleteFavoriteReport(id: string): Promise<void> {
    savedReportsStore = savedReportsStore.filter(r => r.id !== id);
  },

  async getReportsOverview(filters?: ReportFilter) {
    const indicators = await reportIndicatorsService.getOperationalIndicators(filters);
    const definitions = await this.getReportDefinitions();
    const favorites = await this.getSavedReports();

    return {
      indicators,
      definitions,
      popularReports: definitions.filter(d => d.popular),
      favorites,
    };
  },
};
