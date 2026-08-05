import React from 'react';
import { Calendar, Wrench, ArrowRight, CheckCircle2, User, MapPin } from 'lucide-react';
import type { MaintenanceSchedule } from '../../types/maintenance-schedule';
import { Button } from '../ui/Button';

interface UpcomingMaintenanceListProps {
  schedules: MaintenanceSchedule[];
  loading?: boolean;
  onNavigateToSchedule: () => void;
  onCreatePreventiveOrder: (scheduleId: string) => void;
}

export const UpcomingMaintenanceList: React.FC<UpcomingMaintenanceListProps> = ({
  schedules,
  loading,
  onNavigateToSchedule,
  onCreatePreventiveOrder,
}) => {
  if (loading) {
    return (
      <div className="glass-card p-5 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critica':
      case 'alta':
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-semibold text-xs rounded-full border border-rose-200 dark:border-rose-900/50">Prioridade {p === 'critica' ? 'Crítica' : 'Alta'}</span>;
      case 'media':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-semibold text-xs rounded-full border border-amber-200 dark:border-amber-900/50">Média</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold text-xs rounded-full border border-blue-200 dark:border-blue-900/50">Normal</span>;
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Agenda Próximos 7 Dias</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Serviços programados com reserva de oficina</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onNavigateToSchedule} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold text-xs">
            Ver Agenda <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {schedules.length === 0 ? (
          <div className="py-12 text-center">
            <Wrench className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nenhum serviço pendente programado para esta semana.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80 mt-2">
            {schedules.map((s) => (
              <div key={s.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                      {s.equipmentName}
                    </span>
                    {getPriorityBadge(s.priority)}
                    {s.preventiveOrderId && (
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {s.preventiveOrderId} (OS)
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-gray-400 inline" /> {s.intervalName || s.planName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {new Date(s.scheduledDate).toLocaleDateString('pt-BR')} ({s.scheduledTime || '08:00'})
                    </span>
                    {s.workshopName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {s.workshopName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-purple-500" />
                      {s.responsibleName.split('(')[0].trim()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!s.preventiveOrderId ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCreatePreventiveOrder(s.id)}
                      className="text-xs bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Emitir OS
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg">
                      Em Execução
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-500">
        <span>Respeitando tempo de parada de {schedules.reduce((acc, c) => acc + (c.estimatedDurationMinutes || 0), 0) / 60}h programadas.</span>
      </div>
    </div>
  );
};
