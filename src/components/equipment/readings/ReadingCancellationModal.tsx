import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { Button } from '../../ui/Button';

interface ReadingCancellationModalProps {
  reading: MeterReading | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (readingId: string, reason: string) => Promise<void>;
}

export const ReadingCancellationModal: React.FC<ReadingCancellationModalProps> = ({
  reading,
  isOpen,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !reading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirmCancel(reading.id, reason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-md w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-error">
            <Trash2 size={18} />
            <h3 className="font-title-md text-[16px] font-bold">
              Cancelar Registro de Leitura
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <p className="text-[12px] text-on-surface-variant/80">
          A leitura <strong>não será excluída do banco de dados</strong>. Ela permanecerá no histórico de auditoria com status <strong>cancelada</strong> sem impactar o medidor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          <div>
            <label className="text-[11px] font-mono-label text-error uppercase font-bold block mb-1">
              Motivo do Cancelamento *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva a razão de cancelamento deste registro..."
              rows={3}
              className="w-full bg-surface-container border border-error/40 rounded-lg p-2.5 text-on-surface focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Manter Registro
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Confirmar Cancelamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
