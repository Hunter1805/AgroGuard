import React, { useState, useEffect } from 'react';
import { PauseCircle, X } from 'lucide-react';
import type { OperationalReasonMaster, OperationalReasonGroup } from '../../../types/maintenance-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: OperationalReasonMaster | null;
  onSave: (data: Partial<OperationalReasonMaster>) => void;
}

const REASON_GROUPS: { key: OperationalReasonGroup; label: string }[] = [
  { key: 'pausa_os', label: 'Pausa de OS' },
  { key: 'cancelamento_os', label: 'Cancelamento de OS' },
  { key: 'adiamento_os', label: 'Adiamento de OS' },
  { key: 'bloqueio_equipamento', label: 'Bloqueio de Equipamento' },
  { key: 'inatividade_equipamento', label: 'Inatividade de Equipamento' },
  { key: 'baixa_patrimonial', label: 'Baixa Patrimonial' },
  { key: 'ajuste_estoque', label: 'Ajuste de Estoque' },
  { key: 'perda_estoque', label: 'Perda de Estoque' },
  { key: 'descarte_estoque', label: 'Descarte de Estoque' },
];

export const OperationalReasonForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<OperationalReasonMaster>>({
    code: '',
    name: '',
    group: 'pausa_os',
    requiresComplementaryJustification: true,
    requiresApproval: false,
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `MOT-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        group: 'pausa_os',
        requiresComplementaryJustification: true,
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
              <PauseCircle size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Motivo Operacional' : 'Novo Motivo Operacional'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Grupo de Aplicação</label>
              <select
                value={formData.group || 'pausa_os'}
                onChange={(e) => setFormData((p) => ({ ...p, group: e.target.value as OperationalReasonGroup }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                {REASON_GROUPS.map((g) => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome do Motivo</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Aguardando Peças de Reposição, Condições Climáticas"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresComplementaryJustification ?? true}
                onChange={(e) => setFormData((p) => ({ ...p, requiresComplementaryJustification: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Justificativa Complementar do Operador
            </label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresApproval ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresApproval: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Aprovação Superior
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
              Salvar Motivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
