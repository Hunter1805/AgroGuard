import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useChecklistTemplateForm } from '../../../hooks/useChecklistTemplateForm';
import { useEquipments } from '../../../hooks/useEquipments';
import type { ChecklistSchedule } from '../../../types/checklist';

interface ChecklistScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ChecklistSchedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
}

export const ChecklistScheduleForm: React.FC<ChecklistScheduleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { templates } = useChecklistTemplateForm();
  const { equipments } = useEquipments();

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'diaria' | 'semanal' | 'dias_personalizados' | 'sob_demanda'>('diaria');
  const [dueTime, setDueTime] = useState('06:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleEquipment = (id: string) => {
    if (selectedEquipmentIds.includes(id)) {
      setSelectedEquipmentIds(selectedEquipmentIds.filter((i) => i !== id));
    } else {
      setSelectedEquipmentIds([...selectedEquipmentIds, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      setError('Selecione ao menos um modelo de checklist.');
      return;
    }
    const tpl = templates.find((t) => t.id === selectedTemplateId);
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        templateId: selectedTemplateId,
        templateName: tpl ? tpl.name : 'Checklist AgroGuard',
        equipmentIds: selectedEquipmentIds,
        equipmentTypeIds: tpl?.applicableEquipmentTypeIds || ['Trator'],
        frequency,
        dueTime,
        responsibleUserIds: ['user-101'],
        validatorUserIds: ['sup-001'],
        startDate: new Date().toISOString().slice(0, 10),
        active: true,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar programação de checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-lg w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl text-[12px]">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-secondary">
            <Clock size={20} />
            <h3 className="font-title-md text-[16px] font-bold text-on-surface">Nova Programação de Inspeção</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {error && <div className="p-2.5 rounded-lg bg-error/15 text-error text-[12px] font-medium">{error}</div>}

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Modelo de Checklist *
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
              required
            >
              <option value="">Selecione o modelo na biblioteca...</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.code} — {tpl.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Frequência
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none capitalize"
              >
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="dias_personalizados">Dias Personalizados</option>
                <option value="sob_demanda">Sob Demanda</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Horário Limite Prévio (Due Time)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none font-mono-label"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Vincular a Equipamentos da Frota
            </label>
            <div className="max-h-40 overflow-y-auto border border-white/10 rounded-xl p-2 space-y-1 bg-surface-container/50">
              {equipments.map((eq) => {
                const sel = selectedEquipmentIds.includes(eq.id);
                return (
                  <label key={eq.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sel}
                      onChange={() => handleToggleEquipment(eq.id)}
                      className="rounded border-white/20 bg-surface text-secondary focus:ring-0"
                    />
                    <span className="text-on-surface font-semibold">{eq.plateOrCode}</span>
                    <span className="text-on-surface-variant text-[11px] truncate">{eq.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>Salvar Programação</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
