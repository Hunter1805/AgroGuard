import React, { useState } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { Button } from '../../ui/Button';

interface ReadingApprovalModalProps {
  reading: MeterReading | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApprove: (readingId: string) => Promise<void>;
  onConfirmReject: (readingId: string, reason: string) => Promise<void>;
}

export const ReadingApprovalModal: React.FC<ReadingApprovalModalProps> = ({
  reading,
  isOpen,
  onClose,
  onConfirmApprove,
  onConfirmReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectingMode, setIsRejectingMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !reading) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmApprove(reading.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirmReject(reading.id, rejectionReason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-md w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Aprovação de Leitura Pendente
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-[12px] p-3 bg-surface-container/50 rounded-xl border border-white/5 font-mono-label">
          <p>Equipamento: <strong>{reading.equipmentName} ({reading.equipmentCode})</strong></p>
          <p>Leitura Anterior: <strong>{reading.previousValue} {reading.unit}</strong></p>
          <p>Nova Leitura: <strong className="text-primary">{reading.value} {reading.unit}</strong></p>
          {reading.justification && (
            <p className="text-warning pt-1">Justificativa: "{reading.justification}"</p>
          )}
        </div>

        {!isRejectingMode ? (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-error border-error/30"
              icon={<XCircle size={14} />}
              onClick={() => setIsRejectingMode(true)}
            >
              Rejeitar Leitura
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              icon={<CheckCircle2 size={14} />}
              onClick={handleApprove}
              isLoading={isSubmitting}
            >
              Aprovar Leitura
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReject} className="space-y-3 text-[12px]">
            <div>
              <label className="text-[11px] font-mono-label text-error uppercase font-bold block mb-1">
                Motivo da Rejeição *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Informe o motivo do indeferimento..."
                rows={3}
                className="w-full bg-surface-container border border-error/40 rounded-lg p-2.5 text-on-surface focus:outline-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsRejectingMode(false)}>
                Voltar
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Confirmar Rejeição
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
