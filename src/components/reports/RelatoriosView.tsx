import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, Tractor, Gauge, Wrench, ClipboardList, CheckSquare,
  AlertTriangle, Disc, Hammer, Package, DollarSign, BarChart2, History
} from 'lucide-react';
import { ReportsOverview } from './ReportsOverview';
import { EquipmentReportView } from './equipment/EquipmentReportView';
import { ReadingsReportView } from './readings/ReadingsReportView';
import { MaintenanceReportView } from './maintenance/MaintenanceReportView';
import { WorkOrderReportView } from './orders/WorkOrderReportView';
import { ChecklistReportView } from './checklists/ChecklistReportView';
import { FailuresReportView } from './failures/FailuresReportView';
import { TiresReportView } from './tires/TiresReportView';
import { ToolsReportView } from './tools/ToolsReportView';
import { StockReportView } from './stock/StockReportView';
import { CostsReportView } from './costs/CostsReportView';
import { OperationalIndicatorsView } from './indicators/OperationalIndicatorsView';
import { ExportHistoryView } from './ExportHistoryView';
import { PageHeader } from '../ui/PageHeader';
import { ROUTES } from '../../types/routes';

interface RelatoriosViewProps {
  initialTab?: string;
}

export const RelatoriosView: React.FC<RelatoriosViewProps> = ({ initialTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = (): string => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/equipamentos')) return 'equipamentos';
    if (path.includes('/leituras')) return 'leituras';
    if (path.includes('/manutencoes')) return 'manutencoes';
    if (path.includes('/ordens-servico')) return 'ordens-servico';
    if (path.includes('/checklists')) return 'checklists';
    if (path.includes('/nao-conformidades')) return 'checklists';
    if (path.includes('/falhas')) return 'falhas';
    if (path.includes('/pneus')) return 'pneus';
    if (path.includes('/ferramentas')) return 'ferramentas';
    if (path.includes('/pecas-estoque')) return 'pecas-estoque';
    if (path.includes('/custos')) return 'custos';
    if (path.includes('/indicadores')) return 'indicadores';
    if (path.includes('/exportacoes')) return 'exportacoes';
    return 'visao_geral';
  };

  const activeTab = getActiveTabFromPath();

  const tabs = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity, route: ROUTES.RELATORIOS },
    { id: 'equipamentos', label: 'Equipamentos', icon: Tractor, route: ROUTES.RELATORIOS_EQUIPAMENTOS },
    { id: 'leituras', label: 'Leituras', icon: Gauge, route: ROUTES.RELATORIOS_LEITURAS },
    { id: 'manutencoes', label: 'Manutenções', icon: Wrench, route: ROUTES.RELATORIOS_MANUTENCOES },
    { id: 'ordens-servico', label: 'Ordens de Serviço', icon: ClipboardList, route: ROUTES.RELATORIOS_ORDENS_SERVICO },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare, route: ROUTES.RELATORIOS_CHECKLISTS },
    { id: 'falhas', label: 'Falhas', icon: AlertTriangle, route: ROUTES.RELATORIOS_FALHAS },
    { id: 'pneus', label: 'Pneus', icon: Disc, route: ROUTES.RELATORIOS_PNEUS },
    { id: 'ferramentas', label: 'Ferramentas', icon: Hammer, route: ROUTES.RELATORIOS_FERRAMENTAS },
    { id: 'pecas-estoque', label: 'Peças & Estoque', icon: Package, route: ROUTES.RELATORIOS_PECAS_ESTOQUE },
    { id: 'custos', label: 'Custos', icon: DollarSign, route: ROUTES.RELATORIOS_CUSTOS },
    { id: 'indicadores', label: 'Indicadores', icon: BarChart2, route: ROUTES.RELATORIOS_INDICADORES },
    { id: 'exportacoes', label: 'Histórico Exportações', icon: History, route: ROUTES.RELATORIOS_EXPORTACOES },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-xs">
      <PageHeader
        title="Central Gerencial de Relatórios & Indicadores"
        subtitle="Consolidação operacional de frota, preventivas, OSs, pneus, estoque, custos e indicadores MTTR/MTBF"
      />

      {/* Abas de Navegação */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl px-4 pt-2 flex items-center gap-2 overflow-x-auto shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className={`flex items-center gap-2 pb-2.5 pt-1.5 px-3 border-b-2 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)] font-bold'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Visão Ativa */}
      {activeTab === 'visao_geral' && <ReportsOverview />}
      {activeTab === 'equipamentos' && <EquipmentReportView />}
      {activeTab === 'leituras' && <ReadingsReportView />}
      {activeTab === 'manutencoes' && <MaintenanceReportView />}
      {activeTab === 'ordens-servico' && <WorkOrderReportView />}
      {activeTab === 'checklists' && <ChecklistReportView />}
      {activeTab === 'falhas' && <FailuresReportView />}
      {activeTab === 'pneus' && <TiresReportView />}
      {activeTab === 'ferramentas' && <ToolsReportView />}
      {activeTab === 'pecas-estoque' && <StockReportView />}
      {activeTab === 'custos' && <CostsReportView />}
      {activeTab === 'indicadores' && <OperationalIndicatorsView />}
      {activeTab === 'exportacoes' && <ExportHistoryView />}
    </div>
  );
};
