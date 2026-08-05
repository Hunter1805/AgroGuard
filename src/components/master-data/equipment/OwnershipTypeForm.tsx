import React, { useState, useEffect } from 'react';
import { Key, X } from 'lucide-react';
import type { OwnershipTypeMaster } from '../../../types/equipment-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: OwnershipTypeMaster | null;
  onSave: (data: Partial<OwnershipTypeMaster>) => void;
}

export const OwnershipTypeForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<OwnershipTypeMaster>>({
    code: '',
    name: '',
    description: '',
    requiresSupplier: false,
    requiresContract: false,
    requiresEndDate: false,
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `PROP-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        requiresSupplier: false,
        requiresContract: false,
        requiresEndDate: false,
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
              <Key size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Forma de Propriedade' : 'Nova Forma de Propriedade'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome da Forma de Propriedade</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Próprio, Alugado, Financiado, Comodato"
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

          {/* Regras Condicionais */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Requisitos Condicionais</label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresSupplier ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresSupplier: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Fornecedor Vinculado
            </label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresContract ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresContract: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Número de Contrato
            </label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requiresEndDate ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, requiresEndDate: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Exige Data de Término / Vencimento
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
              Salvar Forma de Propriedade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
