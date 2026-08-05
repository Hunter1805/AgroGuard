import React, { useState, useEffect } from 'react';
import { Flame, X } from 'lucide-react';
import type { PriorityMaster } from '../../../types/maintenance-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PriorityMaster | null;
  onSave: (data: Partial<PriorityMaster>) => void;
}

export const PriorityForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<PriorityMaster>>({
    code: '',
    name: '',
    description: '',
    numericLevel: 2,
    color: '#F59E0B',
    defaultDeadlineValue: 24,
    defaultDeadlineUnit: 'horas',
    requiresEquipmentBlock: false,
    requiresApproval: false,
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `PRI-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        numericLevel: 3,
        color: '#EF4444',
        defaultDeadlineValue: 12,
        defaultDeadlineUnit: 'horas',
        requiresEquipmentBlock: false,
        requiresApproval: false,
        status: 'ativo',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Flame size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Prioridade' : 'Nova Prioridade de OS'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Código</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                required
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nível Numérico (1-4)</label>
              <select
                value={formData.numericLevel || 1}
                onChange={(e) => setFormData((p) => ({ ...p, numericLevel: Number(e.target.value) as any }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                <option value={1}>1 — Baixa</option>
                <option value={2}>2 — Média</option>
                <option value={3}>3 — Alta</option>
                <option value={4}>4 — Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome da Prioridade</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Baixa, Média, Alta, Crítica / Emergencial"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Prazo Padrão</label>
              <input
                type="number"
                value={formData.defaultDeadlineValue || ''}
                onChange={(e) => setFormData((p) => ({ ...p, defaultDeadlineValue: Number(e.target.value) }))}
                placeholder="24"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Unidade do Prazo</label>
              <select
                value={formData.defaultDeadlineUnit || 'horas'}
                onChange={(e) => setFormData((p) => ({ ...p, defaultDeadlineUnit: e.target.value as any }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                <option value="horas">Horas</option>
                <option value="dias">Dias</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresEquipmentBlock ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresEquipmentBlock: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Bloqueia Equipamento Automaticamente
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-all shadow-md"
            >
              Salvar Prioridade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
