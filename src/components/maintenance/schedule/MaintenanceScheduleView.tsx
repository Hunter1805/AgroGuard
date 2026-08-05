import React, { useState } from 'react';
import { Calendar, List, Plus, Filter, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useMaintenanceSchedule } from '../../../hooks/useMaintenanceSchedule';
import { MaintenanceScheduleList } from './MaintenanceScheduleList';
import { MaintenanceCalendar } from './MaintenanceCalendar';
import { MaintenanceScheduleForm } from './MaintenanceScheduleForm';
import { Button } from '../../ui/Button';

interface MaintenanceScheduleViewProps {
  onNavigateToPlan?: () => void;
}

export const MaintenanceScheduleView: React.FC<MaintenanceScheduleViewProps> = () => {
  const {
    schedules,
    filters,
    loading,
    actionMessage,
    viewMode,
    setViewMode,
    clearMessage,
    updateFilters,
    resetFilters,
    handleReschedule,
    handleCreatePreventiveOS,
    refresh,
  } = useMaintenanceSchedule();

  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Mensagens de Sucesso na OS / Justificativa */}
      {actionMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-emerald-900 dark:text-emerald-200 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={clearMessage} className="text-xs text-emerald-600 font-extrabold hover:text-emerald-800 uppercase">
            FECHAR
          </button>
        </div>
      )}

      {/* Barra Superior com Alternador de View e Filtros */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('lista')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              viewMode === 'lista'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Modo Lista / Tabela
          </button>
          
          <button
            onClick={() => setViewMode('calendario_semana')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              viewMode !== 'lista'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Modo Calendário Operacional
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>Período:</span>
            <select
              value={filters.period}
              onChange={(e) => updateFilters({ period: e.target.value as any })}
              className="bg-transparent text-gray-900 dark:text-white font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="todos">Todas as Reservas</option>
              <option value="semana">Próximos 7 Dias</option>
              <option value="mes">Neste Mês</option>
              <option value="atrasadas">Pendentes / Atrasados</option>
            </select>
          </div>

          <Button variant="ghost" size="sm" onClick={resetFilters} title="Limpar filtros" className="rounded-xl text-gray-400 hover:text-gray-700">
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button onClick={() => setIsCreating(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 shadow-md">
            <Plus className="w-4 h-4 mr-1" /> Agendar na Oficina
          </Button>
        </div>
      </div>

      {/* Conteúdo da Agenda */}
      {viewMode === 'lista' ? (
        <MaintenanceScheduleList
          schedules={schedules}
          loading={loading}
          onReschedule={handleReschedule}
          onCreateOrder={handleCreatePreventiveOS}
        />
      ) : (
        <MaintenanceCalendar
          schedules={schedules}
          onSelectSchedule={() => {}}
        />
      )}

      {/* Modal de Criação */}
      {isCreating && (
        <MaintenanceScheduleForm
          onClose={() => setIsCreating(false)}
          onSuccess={() => {
            setIsCreating(false);
            refresh();
          }}
        />
      )}
    </div>
  );
};
