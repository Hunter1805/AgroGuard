import React, { useState } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import type { MaintenanceSchedule } from '../../../types/maintenance-schedule';
import { Button } from '../../ui/Button';

interface RescheduleMaintenanceModalProps {
  schedule: MaintenanceSchedule;
  onClose: () => void;
  onConfirm: (newDate: string, reason: string, newTime?: string) => Promise<boolean>;
}

export const RescheduleMaintenanceModal: React.FC<RescheduleMaintenanceModalProps> = ({
  schedule,
  onClose,
  onConfirm,
}) => {
  const [newDate, setNewDate] = useState(schedule.scheduledDate || new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState(schedule.scheduledTime || '08:00');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 10) {
      setError('A justificativa auditable deve possuir no mínimo 10 caracteres explicando o motivo da mudança de agenda.');
      return;
    }
    setLoading(true);
    setError(null);
    const success = await onConfirm(newDate, reason.trim(), newTime);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <form onSubmit={handleSubmit} className="glass-card bg-white dark:bg-gray-900 max-w-lg w-full p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Reprogramar Serviço na Oficina</h3>
              <p className="text-xs text-gray-500 font-medium">{schedule.equipmentName} ({schedule.intervalName || schedule.planName})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Nova Data Programada</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 font-extrabold text-sm text-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Novo Horário Previsto</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 font-extrabold text-sm text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Justificativa Obrigatória para Auditoria
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Trator impossibilitado de deixar a frente de preparo no lote 4. Reagendado de acordo com a gerência agrícola para o sábado pela manhã..."
            rows={3}
            className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-amber-50/20 dark:bg-amber-950/20 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            required
          />
          <span className="text-[10px] text-gray-400 mt-1 block">
            Este registro ficará permanentemente anexado ao livro de auditoria e ao histórico de alterações do equipamento.
          </span>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="text-xs font-bold text-gray-500">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-6 shadow-md">
            {loading ? 'Arquivando Justificativa...' : 'Confirmar Reagendamento'}
          </Button>
        </div>
      </form>
    </div>
  );
};
