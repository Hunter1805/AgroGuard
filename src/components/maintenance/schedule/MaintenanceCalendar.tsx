import React from 'react';
import { Calendar as CalendarIcon, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import type { MaintenanceSchedule } from '../../../types/maintenance-schedule';

interface MaintenanceCalendarProps {
  schedules: MaintenanceSchedule[];
  onSelectSchedule?: (schedule: MaintenanceSchedule) => void;
}

export const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ schedules, onSelectSchedule }) => {
  // Dias simulados para demonstração da agenda semanal/operacional
  const daysOfWeek = [
    { label: 'Segunda-feira', dateStr: '04/08/2026', key: '2026-08-04' },
    { label: 'Terça-feira', dateStr: '05/08/2026', key: '2026-08-05' },
    { label: 'Quarta-feira', dateStr: '06/08/2026', key: '2026-08-06' },
    { label: 'Quinta-feira', dateStr: '07/08/2026', key: '2026-08-07' },
    { label: 'Sexta-feira', dateStr: '08/08/2026', key: '2026-08-08' },
    { label: 'Sábado (Meio)', dateStr: '09/08/2026', key: '2026-08-09' },
  ];

  const getPriorityBorder = (p: string) => {
    switch (p) {
      case 'critica': return 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/10';
      case 'alta': return 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10';
      default: return 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/10';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-100 dark:border-blue-900 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-semibold">
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" /> Visualização em Calendário da Semana Operacional (04/08 a 09/08)
        </span>
        <span className="text-gray-500 dark:text-gray-400">Total de {schedules.length} reservas na oficina</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {daysOfWeek.map((day, idx) => {
          // Filtrar agendamentos do dia ou fallback visual de demonstração nos 3 primeiros dias
          const daySchedules = schedules.filter((s) => s.scheduledDate === day.key || (idx === 0 && s.id === 'SCH-100') || (idx === 1 && s.id === 'SCH-101') || (idx === 3 && s.id === 'SCH-102'));

          return (
            <div key={day.key} className="glass-card p-3.5 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="pb-2 mb-2.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">{day.label}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                    {day.dateStr}
                  </span>
                </div>

                {daySchedules.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 opacity-60">
                    <p className="text-[11px] font-medium">Livre / Sem paradas reservadas</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {daySchedules.map((sch) => (
                      <div
                        key={sch.id}
                        onClick={() => (onSelectSchedule ? onSelectSchedule(sch) : null)}
                        className={`p-2.5 rounded-xl border border-gray-200/70 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-all ${getPriorityBorder(sch.priority)}`}
                      >
                        <p className="font-bold text-xs text-gray-900 dark:text-white truncate" title={sch.equipmentName}>
                          {sch.equipmentName}
                        </p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 font-semibold truncate mt-0.5 flex items-center gap-1" title={sch.intervalName || sch.planName}>
                          <Wrench className="w-3 h-3 text-gray-400 flex-shrink-0" /> {sch.intervalName || sch.planName}
                        </p>
                        
                        <div className="mt-2 pt-1.5 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                            <Clock className="w-3 h-3" /> {sch.scheduledTime || '08:00'} ({sch.estimatedDurationMinutes || 120}min)
                          </span>
                          {sch.preventiveOrderId && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> OS
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800 text-right">
                <span className="text-[10px] text-gray-400 font-semibold">{daySchedules.length} reserva(s)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
