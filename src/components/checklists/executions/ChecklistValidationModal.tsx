import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import type { ChecklistExecution } from '../../../types/checklist';
import { Button } from '../../ui/Button';

interface ChecklistValidationModalProps {
  execution: ChecklistExecution | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (validatorName: string, comments?: string) => Promise<any>;
  onReject: (reason: string, validatorName: string) => Promise<any>;
}

export const ChecklistValidationModal: React.FC<ChecklistValidationModalProps> = ({
  execution,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [validatorName, setValidatorName] = useState('Supervisor OperACional / Oficina');
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectingMode, setIsRejectingMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !execution) return null;

  const handleApprove = async () => {
    if (!validatorName.trim()) {
      setError('O nome do supervisor validador é obrigatório.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onApprove(validatorName, comments.trim() || undefined);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Erro ao aprovar checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError('A justificativa da reprovação é obrigatória.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onReject(rejectionReason.trim(), validatorName);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Erro ao reprovar checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-md w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={20} />
            <h3 className="font-title-md text-[16px] font-bold text-on-surface">Validação por Supervisor</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-surface-container/50 border border-white/5 text-[12px] space-y-1 font-mono-label">
          <p>Checklist: <strong>{execution.code} ({execution.templateName})</strong></p>
          <p>Equipamento: <strong>{execution.equipmentCode} — {execution.equipmentName}</strong></p>
          <p>Operador: <strong>{execution.operatorName}</strong></p>
          <p>Condição Final: <strong className="uppercase text-warning">{execution.finalCondition?.replace('_', ' ') || 'Liberada'}</strong></p>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-error/15 text-error text-[11px] font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
            Supervisor Responsável *
          </label>
          <input
            type="text"
            value={validatorName}
            onChange={(e) => setValidatorName(e.target.value)}
            className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface text-[12px] focus:outline-none"
            required
          />
        </div>

        {!isRejectingMode ? (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Comentários / Parecer (Opcional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Observações adicionais na aprovação..."
                rows={2}
                className="w-full bg-surface-container border border-white/10 rounded-lg p-2.5 text-on-surface text-[12px] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-error border-error/30"
                icon={<XCircle size={14} />}
                onClick={() => setIsRejectingMode(true)}
              >
                Reprovar
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                icon={<CheckCircle2 size={14} />}
                onClick={handleApprove}
                isLoading={isSubmitting}
              >
                Aprovar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRejectSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono-label text-error uppercase font-bold block mb-1">
                Motivo Obrigatório da Reprovação *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Indique ao operador o que precisa ser corrigido na inspeção..."
                rows={3}
                className="w-full bg-surface-container border border-error/40 rounded-lg p-2.5 text-on-surface text-[12px] focus:outline-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsRejectingMode(false)}>
                Voltar
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Confirmar Reprovação
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
