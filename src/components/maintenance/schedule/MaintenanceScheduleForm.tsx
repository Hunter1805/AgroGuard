import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { maintenanceScheduleService } from '../../../services/maintenance-schedule.service';
import { Button } from '../../ui/Button';

interface MaintenanceScheduleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const MaintenanceScheduleForm: React.FC<MaintenanceScheduleFormProps> = ({ onClose, onSuccess }) => {
  const [eqName, setEqName] = useState('Trator LS U80 22 4x4');
  const [serviceName, setServiceName] = useState('Revisão Preventiva de 500h - Sistema Hidráulico');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('08:00');
  const [workshop, setWorkshop] = useState('Oficina Central Sede');
  const [responsible, setResponsible] = useState('Carlos Roberto (Mecânico Chefe)');
  const [priority, setPriority] = useState<'normal' | 'media' | 'alta' | 'critica'>('alta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await maintenanceScheduleService.createMaintenanceSchedule({
        equipmentId: 'EQ-GEN',
        equipmentCode: 'FROTA-01',
        equipmentName: eqName,
        intervalId: 'INT-500H',
        intervalName: serviceName,
        scheduledDate: date,
        scheduledTime: time,
        workshopId: 'W-01',
        workshopName: workshop,
        responsibleId: 'REP-01',
        responsibleName: responsible,
        status: 'programado',
        priority,
        estimatedDurationMinutes: 180,
      } as any);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Falha ao agendar serviço na oficina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <form onSubmit={handleSubmit} className="glass-card bg-white dark:bg-gray-900 max-w-xl w-full p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Nova Programação em Agenda de Oficina</h3>
              <p className="text-xs text-gray-500">Reserva de horário e recursos operacionais da fazenda</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl">{error}</p>}

        <div>
          <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Máquina / Equipamento Alferes</label>
          <input type="text" value={eqName} onChange={(e) => setEqName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white" required />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Tipo de Manutenção / Serviço</label>
          <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white" required />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Data Reserva</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-bold text-blue-600" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Horário</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-bold" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Prioridade</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-bold">
              <option value="normal">Normal</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Oficina Alvo</label>
            <input type="text" value={workshop} onChange={(e) => setWorkshop(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-semibold" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Responsável Técnico</label>
            <input type="text" value={responsible} onChange={(e) => setResponsible(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-sm font-semibold" required />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="text-xs font-bold text-gray-500">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 shadow-md shadow-blue-500/20">
            {loading ? 'Confirmando...' : 'Confirmar & Reservar Horário'}
          </Button>
        </div>
      </form>
    </div>
  );
};
