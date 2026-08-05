import React, { useState } from 'react';
import { Calendar, MapPin, User, CheckCircle2, Clock, RotateCcw, AlertCircle } from 'lucide-react';
import type { MaintenanceSchedule } from '../../../types/maintenance-schedule';
import { RescheduleMaintenanceModal } from './RescheduleMaintenanceModal';
import { Button } from '../../ui/Button';

interface MaintenanceScheduleListProps {
  schedules: MaintenanceSchedule[];
  loading?: boolean;
  onReschedule: (id: string, newDate: string, reason: string, time?: string) => Promise<boolean>;
  onCreateOrder: (id: string) => Promise<string | null>;
}

export const MaintenanceScheduleList: React.FC<MaintenanceScheduleListProps> = ({
  schedules,
  loading,
  onReschedule,
  onCreateOrder,
}) => {
  const [reschedulingTarget, setReschedulingTarget] = useState<MaintenanceSchedule | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const handleOSClick = async (id: string) => {
    setCreatingId(id);
    await onCreateOrder(id);
    setCreatingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  const getStatusBadge = (status: string, osId?: string) => {
    if (osId) {
      return <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-300 dark:border-emerald-800">Em Execução ({osId})</span>;
    }
    if (status === 'adiado' || status === 'atrasada') {
      return <span className="px-3 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 font-extrabold text-xs rounded-full border border-rose-300 dark:border-rose-800">Adiado / Atrasada</span>;
    }
    return <span className="px-3 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 font-extrabold text-xs rounded-full border border-blue-200 dark:border-blue-800">Programado na Oficina</span>;
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {schedules.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-500">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
          <p className="text-sm font-bold">Nenhuma reserva agendada com estes filtros na oficina.</p>
        </div>
      ) : (
        schedules.map((sch) => (
          <div key={sch.id} className="glass-card p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition-all">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-extrabold text-base text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                  {sch.equipmentName}
                </span>
                {getStatusBadge(sch.status, sch.preventiveOrderId)}
                <span className="text-xs font-mono text-gray-400 font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  Ref: {sch.intervalName || sch.planName}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1 flex-wrap">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Calendar className="w-3.5 h-3.5" /> Data: {new Date(sch.scheduledDate).toLocaleDateString('pt-BR')} às {sch.scheduledTime || '08:00'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Parada Prevista: {sch.estimatedDurationMinutes || 120} min
                </span>
                {sch.workshopName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {sch.workshopName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-500" /> {sch.responsibleName}
                </span>
              </div>

              {sch.rescheduleReason && (
                <div className="mt-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase block text-[10px] opacity-70">Justificativa de Adiamento (Auditável):</span>
                    {sch.rescheduleReason}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReschedulingTarget(sch)}
                title="Reprogramar data/hora (Exige Justificativa)"
                className="text-xs font-bold bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 px-3.5 py-2 text-gray-700 dark:text-gray-200"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-500" /> Reagendar
              </Button>

              {!sch.preventiveOrderId ? (
                <Button
                  size="sm"
                  onClick={() => handleOSClick(sch.id!)}
                  disabled={creatingId === sch.id}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-4 py-2 shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1 text-white animate-pulse" />
                  {creatingId === sch.id ? 'Gerando OS...' : 'Emitir OS Preventiva'}
                </Button>
              ) : (
                <Button size="sm" disabled className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800 px-4 py-2">
                  ✓ OS na Oficina
                </Button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Modal de Reagendamento Auditável */}
      {reschedulingTarget && (
        <RescheduleMaintenanceModal
          schedule={reschedulingTarget}
          onClose={() => setReschedulingTarget(null)}
          onConfirm={(newDate, reason, time) => onReschedule(reschedulingTarget.id!, newDate, reason, time)}
        />
      )}
    </div>
  );
};
