import React, { useState } from 'react';
import { Plus, Clock, Tractor } from 'lucide-react';
import { useChecklistSchedules } from '../../../hooks/useChecklistSchedules';
import { ChecklistScheduleForm } from './ChecklistScheduleForm';
import { EmptyState } from '../../ui/EmptyState';
import { Button } from '../../ui/Button';

export const ChecklistScheduleList: React.FC = () => {
  const { schedules, loading, error, toggleSchedule, createSchedule } = useChecklistSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-mono-label animate-pulse">Carregando agendamentos...</div>;
  if (error) return <div className="p-4 bg-error/15 text-error rounded-xl font-medium">{error}</div>;

  if (schedules.length === 0) {
    return (
      <>
        <EmptyState
          title="Nenhuma programação cadastrada"
          description="Agende execuções automáticas diárias ou semanais para seus tratores e maquinários."
          action={<Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>Nova Programação</Button>}
        />
        <ChecklistScheduleForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={createSchedule} />
      </>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in text-[12px]">
      <div className="flex justify-between items-center">
        <span className="font-mono-label text-on-surface-variant/80">
          <strong>{schedules.length}</strong> agendamento(s) configurados na frota
        </span>
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setIsModalOpen(true)}>
          Nova Programação
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className={`glass-card rounded-2xl p-4 border transition-all flex flex-col justify-between shadow-lg ${
              sch.active ? 'bg-surface-container-highest/40 border-white/10 hover:border-secondary/40' : 'bg-surface-container-highest/20 border-white/5 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30 text-[10px] font-mono-label font-bold uppercase">
                  {sch.frequency.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-mono-label font-bold px-2 py-0.5 rounded-full ${sch.active ? 'bg-success/15 text-success border border-success/30' : 'bg-surface text-on-surface-variant'}`}>
                  {sch.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <h4 className="font-title-md text-[15px] font-bold text-on-surface">
                {sch.templateName}
              </h4>
              
              <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-mono-label">
                <Clock size={13} className="text-secondary" />
                <span>Limite Prévio: <strong className="text-on-surface">{sch.dueTime || '07:00'}</strong></span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-mono-label">
                <Tractor size={13} className="text-primary" />
                <span>Alvos: <strong className="text-on-surface">{sch.equipmentIds.length > 0 ? `${sch.equipmentIds.length} Ativos específicos` : sch.equipmentTypeIds?.join(', ')}</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-[11px] font-mono-label text-primary">
                Próxima: <strong>{sch.nextExecutionDate || 'Amanhã'}</strong>
              </span>
              <button
                onClick={() => toggleSchedule(sch.id)}
                className="px-2.5 py-1 rounded-md bg-surface-container border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors font-mono-label text-[10px] uppercase cursor-pointer"
              >
                {sch.active ? 'Inativar' : 'Reativar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ChecklistScheduleForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={createSchedule} />
    </div>
  );
};
