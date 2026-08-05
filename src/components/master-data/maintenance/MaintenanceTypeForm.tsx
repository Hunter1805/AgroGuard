import React, { useState, useEffect } from 'react';
import { Wrench, X } from 'lucide-react';
import type { MaintenanceTypeMaster } from '../../../types/maintenance-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: MaintenanceTypeMaster | null;
  onSave: (data: Partial<MaintenanceTypeMaster>) => void;
}

export const MaintenanceTypeForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<MaintenanceTypeMaster>>({
    code: '',
    name: '',
    description: '',
    color: '#10B981',
    requiresApproval: false,
    requiresEquipmentParada: true,
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `TM-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        color: '#10B981',
        requiresApproval: false,
        requiresEquipmentParada: true,
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
              <Wrench size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Tipo de Manutenção' : 'Novo Tipo de Manutenção'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Cor Badge</label>
              <input
                type="color"
                value={formData.color || '#10B981'}
                onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                className="w-full h-9 bg-surface-container-highest border border-white/10 rounded-lg p-1 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome do Tipo</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Preventiva, Corretiva Planejada, Preditiva"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Descrição</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresApproval ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresApproval: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Aprovação do Gestor
            </label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresEquipmentParada ?? true}
                onChange={(e) => setFormData((p) => ({ ...p, requiresEquipmentParada: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Parada do Equipamento
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
              Salvar Tipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
