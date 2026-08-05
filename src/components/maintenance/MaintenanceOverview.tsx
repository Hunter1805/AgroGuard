import React, { useState } from 'react';
import { Calendar, FileText, History, Activity, Plus, RotateCw } from 'lucide-react';
import { useMaintenanceOverview } from '../../hooks/useMaintenanceOverview';
import { MaintenanceStats } from './MaintenanceStats';
import { UpcomingMaintenanceList } from './UpcomingMaintenanceList';
import { MaintenanceAlertsPanel } from './MaintenanceAlertsPanel';
import { MaintenancePlanList } from './plans/MaintenancePlanList';
import { MaintenanceScheduleView } from './schedule/MaintenanceScheduleView';
import { MaintenanceHistoryView } from './history/MaintenanceHistoryView';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';

interface MaintenanceOverviewProps {
  initialTab?: 'visao_geral' | 'planos' | 'agenda' | 'historico';
  onNavigate?: (route: string) => void;
}

export const MaintenanceOverview: React.FC<MaintenanceOverviewProps> = ({ initialTab = 'visao_geral', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'planos' | 'agenda' | 'historico'>(initialTab);
  const { stats, alerts, upcomingSchedules, loading, refresh, handleCreateOrderFromAlert } = useMaintenanceOverview();

  const tabs = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity, count: null },
    { id: 'planos', label: 'Planos Preventivos', icon: FileText, count: 'Fase 5' },
    { id: 'agenda', label: 'Agenda de Oficina', icon: Calendar, count: stats?.programadas || 0 },
    { id: 'historico', label: 'Histórico Auditável', icon: History, count: null },
  ] as const;

  const handleRouteNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      if (route.includes('planos')) setActiveTab('planos');
      else if (route.includes('agenda')) setActiveTab('agenda');
      else if (route.includes('historico')) setActiveTab('historico');
    }
  };

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
              className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md"
            >
              <RotateCw className={`w-4 h-4 text-blue-500 ${loading ? 'animate-spin' : ''}`} /> Sincronizar Vencimentos
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab('planos')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-1" /> Novo Plano Preventivo
            </Button>
          </div>
        }
      />

      {/* Abas de Navegação Internas */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl px-4 pt-2 flex items-center gap-6 overflow-x-auto shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          <MaintenanceStats stats={stats} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 h-full">
              <UpcomingMaintenanceList
                schedules={upcomingSchedules}
                loading={loading}
                onNavigateToSchedule={() => setActiveTab('agenda')}
                onCreatePreventiveOrder={(id) => handleCreateOrderFromAlert(id)}
              />
            </div>
            <div className="lg:col-span-6 h-full">
              <MaintenanceAlertsPanel
                alerts={alerts}
                loading={loading}
                onNavigate={(route) => handleRouteNavigate(route)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'planos' && <MaintenancePlanList onNavigateToSchedule={() => setActiveTab('agenda')} />}
      
      {activeTab === 'agenda' && <MaintenanceScheduleView onNavigateToPlan={() => setActiveTab('planos')} />}

      {activeTab === 'historico' && <MaintenanceHistoryView />}
    </div>
  );
};
