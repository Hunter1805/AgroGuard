import React, { useState } from 'react';
import { Archive, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface ArchiveConfirmModalProps {
  isOpen: boolean;
  equipmentName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ArchiveConfirmModal: React.FC<ArchiveConfirmModalProps> = ({
  isOpen,
  equipmentName,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="glass-card bg-surface-container-highest border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning/10 text-warning border border-warning/20">
              <Archive size={22} />
            </div>
            <div>
              <h3 className="font-title-md text-[17px] font-semibold text-on-surface">
                Arquivar Equipamento
              </h3>
              <p className="text-[12px] text-on-surface-variant/70">
                Confirmar desativação na frota ativa
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-surface-container-highest/40 rounded-lg p-3.5 border border-white/5 text-[12px] text-on-surface-variant/80">
          Você está prestes a arquivar o equipamento <strong className="text-on-surface">{equipmentName}</strong>. Ele será movido para o registro histórico e deixará de figurar nos indicadores operacionais ativos.
        </div>

        {/* Formulário com Justificativa */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-on-surface mb-1.5">
              Justificativa do Arquivamento <span className="text-error">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder="Descreva o motivo (ex: Venda de ativo, perda total, substituição de frota...)"
              className={`w-full bg-surface-container border rounded-lg p-3 text-[12px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all ${
                error ? 'border-error' : 'border-white/10'
              }`}
            />
            {error && (
              <p className="text-error text-[11px] mt-1 flex items-center gap-1">
                <AlertTriangle size={12} /> É obrigatório informar uma justificativa.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              icon={<Archive size={14} />}
              isLoading={isSubmitting}
            >
              Confirmar Arquivamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
