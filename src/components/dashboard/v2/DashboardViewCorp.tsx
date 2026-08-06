import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';
import { ErrorState } from '../../ui/ErrorState';
import { PageHeaderCorp } from '../../ui/PageHeaderCorp';
import { KpiRow } from './KpiRow';
import { QuickActionsBar } from './QuickActionsBar';
import { PrioritiesTable } from './PrioritiesTable';
import { UpcomingList } from './UpcomingList';
import { RecentTimeline } from './RecentTimeline';

export interface DashboardViewCorpProps {
  onOpenNewOS?: () => void;
}

export const DashboardViewCorp: React.FC<DashboardViewCorpProps> = ({ onOpenNewOS }) => {
  const {
    stats,
    priorityAlerts,
    upcomingMaintenance,
    activities,
    loading,
    error,
    refetch,
  } = useDashboard();

  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    const now = new Date();
    setLastUpdated(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6 pb-16">
        {/* Cabeçalho */}
        <PageHeaderCorp
          title="Dashboard"
          description="Visão geral da operação e principais indicadores da frota."
          secondaryActions={[
            {
              label: `Atualizado às ${lastUpdated}`,
              icon: <RotateCw size={13} className={isRefreshing ? 'animate-spin' : ''} />,
              onClick: handleRefresh,
              variant: 'ghost',
            },
          ]}
        />

        {/* Erro global */}
        {error && (
          <ErrorState
            title="Erro ao carregar dashboard"
            message={error}
            onRetry={handleRefresh}
          />
        )}

        {/* Linha 1 — 4 KPIs críticos */}
        <KpiRow stats={stats} loading={loading} />

        {/* Ações rápidas (no máximo 3) */}
        <QuickActionsBar onOpenNewOS={onOpenNewOS} />

        {/* Linha 2 — Prioridades do dia (Tabela) + Próximas atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <PrioritiesTable alerts={priorityAlerts} loading={loading} />
          </div>
          <div className="lg:col-span-1 h-full">
            <UpcomingList items={upcomingMaintenance} loading={loading} />
          </div>
        </div>

        {/* Linha 3 — Atividades recentes (Timeline compacta) */}
        <RecentTimeline activities={activities} loading={loading} />
      </div>
  );
};
