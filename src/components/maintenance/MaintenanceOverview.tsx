import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCw, Plus } from 'lucide-react';
import { useMaintenanceOverview } from '../../hooks/useMaintenanceOverview';
import { MaintenanceStats } from './MaintenanceStats';
import { UpcomingMaintenanceList } from './UpcomingMaintenanceList';
import { MaintenanceAlertsPanel } from './MaintenanceAlertsPanel';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';

export const MaintenanceOverview: React.FC = () => {
  const navigate = useNavigate();
  const { stats, alerts, upcomingSchedules, loading, refresh, handleCreateOrderFromAlert } = useMaintenanceOverview();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-fadeIn">
      {/* Cabeçalho Superior da Página */}
      <PageHeader
        title="Gestão de Manutenções e Planos Preventivos"
        subtitle="Controle inteligente com regra combinada de horas, odômetros e vencimentos por tempo"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              title="Recalcular vencimentos reativos com os dados mais recentes do horímetro"
              className="flex items-center gap-1.5 font-semibold text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
            >
              <RotateCw className={`w-4 h-4 text-[var(--color-brand)] ${loading ? 'animate-spin' : ''}`} /> Sincronizar Vencimentos
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.MANUTENCOES_PLANOS)}
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Novo Plano Preventivo
            </Button>
          </div>
        }
      />

      {/* Estatísticas / KPIs */}
      <MaintenanceStats stats={stats} loading={loading} />

      {/* Alertas e Próximas Paradas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 h-full">
          <UpcomingMaintenanceList
            schedules={upcomingSchedules}
            loading={loading}
            onNavigateToSchedule={() => navigate(ROUTES.MANUTENCOES_AGENDA)}
            onCreatePreventiveOrder={(id) => handleCreateOrderFromAlert(id)}
          />
        </div>
        <div className="lg:col-span-6 h-full">
          <MaintenanceAlertsPanel
            alerts={alerts}
            loading={loading}
            onNavigate={(route) => navigate(route)}
          />
        </div>
      </div>
    </div>
  );
};
