import React, { useState } from 'react';
import { Archive, PowerOff, X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordName: string;
  targetAction: 'inativar' | 'arquivar' | 'ativar';
  onConfirm: (reason: string) => void;
}

export const MasterDataStatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  recordName,
  targetAction,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const isActivate = targetAction === 'ativar';
  const isArchive = targetAction === 'arquivar';

  const title = isActivate
    ? 'Ativar Registro'
    : isArchive
    ? 'Arquivar Registro'
    : 'Inativar Registro';

  const subtitle = isActivate
    ? `Deseja reativar o cadastro "${recordName}" para torná-lo disponível novamente nos formulários?`
    : isArchive
    ? `O arquivamento removerá "${recordName}" das listagens padrão, preservando seu histórico e vínculos.`
    : `A inativação impedirá a seleção de "${recordName}" em novos lançamentos. Históricos anteriores permanecem intactos.`;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg border ${isActivate ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
              {isActivate ? <CheckCircleIcon /> : isArchive ? <Archive size={18} /> : <PowerOff size={18} />}
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">{title}</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <p className="text-[13px] text-on-surface-variant/80 leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          {!isActivate && (
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                Motivo / Justificativa (Obrigatório)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Descreva o motivo da alteração de status..."
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2.5 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 resize-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all shadow-md ${
                isActivate
                  ? 'bg-success hover:bg-success/90'
                  : isArchive
                  ? 'bg-warning hover:bg-warning/90'
                  : 'bg-error hover:bg-error/90'
              }`}
            >
              Confirmar {title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
