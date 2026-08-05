import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { ErrorState } from './ui/ErrorState';

// Componentes do Dashboard
import { StatsCards } from './dashboard/StatsCards';
import { AlertsCentral } from './dashboard/AlertsCentral';
import { NextMaintenancePanel } from './dashboard/NextMaintenancePanel';
import { RecentOrdersPanel } from './dashboard/RecentOrdersPanel';
import { ActivityTimeline } from './dashboard/ActivityTimeline';
import { QuickActions } from './dashboard/QuickActions';

interface DashboardViewProps {
  /** @deprecated — mantido por compatibilidade com App.tsx durante transição */
  setActiveTab?: (tab: string) => void;
  serviceOrders?: unknown[];
  revisions?: unknown[];
}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const {
    stats, priorityAlerts, upcomingMaintenance, recentOrders,
    activities, loading, error, refetch,
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
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-5 pb-14">

        {/* Cabeçalho */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">
              Visão Geral
            </h1>
            <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">
              Acompanhamento operacional da frota em tempo real.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="font-mono-label text-[11px]">Atualizado {lastUpdated}</span>
          </button>
        </div>

        {/* Erro global */}
        {error && (
          <ErrorState
            title="Erro ao carregar dashboard"
            message={error}
            onRetry={handleRefresh}
          />
        )}

        {/* Indicadores */}
        <StatsCards stats={stats} loading={loading} />

        {/* Ações rápidas */}
        <QuickActions />

        {/* Linha 1: Alertas | Próximas manutenções */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AlertsCentral alerts={priorityAlerts} loading={loading} />
          <NextMaintenancePanel items={upcomingMaintenance} loading={loading} />
        </div>

        {/* OS Recentes */}
        <RecentOrdersPanel orders={recentOrders} loading={loading} />

        {/* Linha do tempo */}
        <ActivityTimeline activities={activities} loading={loading} />
      </div>
    </div>
  );
};
