import React, { useState } from 'react';
import { RefreshCw, X, ArrowRight } from 'lucide-react';
import type { MasterDataBase } from '../../types/master-data';

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecord: MasterDataBase | null;
  availableOptions: MasterDataBase[];
  onConfirmReplacement: (replacementId: string) => void;
}

export const MasterDataReplacementModal: React.FC<ReplacementModalProps> = ({
  isOpen,
  onClose,
  currentRecord,
  availableOptions,
  onConfirmReplacement,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');

  if (!isOpen || !currentRecord) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    onConfirmReplacement(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <RefreshCw size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">Definir Substituto</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <p className="text-[12px] text-on-surface-variant/80 leading-relaxed">
          Defina o cadastro substituto que será sugerido automaticamente em novos formulários no lugar de <strong>{currentRecord.name}</strong>.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="glass-card rounded-xl border border-white/10 p-3 flex items-center justify-between text-[12px]">
            <span className="text-on-surface-variant/70">Atual (Inativo):</span>
            <span className="font-semibold text-on-surface font-mono-label">{currentRecord.name}</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              Selecione o Cadastro Substituto
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2.5 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            >
              <option value="">Selecione um substituto ativo...</option>
              {availableOptions
                .filter((opt) => opt.id !== currentRecord.id && opt.status === 'ativo')
                .map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.code ? `[${opt.code}] ` : ''}{opt.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedId}
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              Confirmar Substituto
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
