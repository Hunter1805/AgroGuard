import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { Button } from '../../ui/Button';

interface ReadingCorrectionModalProps {
  reading: MeterReading | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCorrection: (readingId: string, correctedValue: number, justification: string) => Promise<void>;
}

export const ReadingCorrectionModal: React.FC<ReadingCorrectionModalProps> = ({
  reading,
  isOpen,
  onClose,
  onConfirmCorrection,
}) => {
  const [correctedValue, setCorrectedValue] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(correctedValue);

    if (isNaN(num)) {
      setError('Informe um valor de leitura numérico válido.');
      return;
    }

    if (!justification.trim()) {
      setError('Informe a justificativa da correção auditável.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirmCorrection(reading.id, num, justification.trim());
      onClose();
    } catch {
      setError('Erro ao lançar correção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-md w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Edit size={18} className="text-warning" />
            <h3 className="font-title-md text-[16px] font-bold text-on-surface">
              Corrigir Leitura (Auditável)
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <p className="text-[12px] text-on-surface-variant/80">
          O registro original ({reading.value} {reading.unit}) será mantido com status <strong>corrigida</strong> e um novo registro será encadeado com a referência auditável.
        </p>

        {error && (
          <div className="p-2.5 rounded-lg bg-error/15 text-error text-[11px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          <div>
            <label className="text-[11px] font-mono-label text-warning uppercase font-bold block mb-1">
              Novo Valor Corrigido ({reading.unit}) *
            </label>
            <input
              type="number"
              step="any"
              value={correctedValue}
              onChange={(e) => setCorrectedValue(e.target.value)}
              placeholder={`Ex: ${reading.previousValue + 10}`}
              className="w-full bg-surface-container border border-warning/40 rounded-lg px-3 py-2 font-bold text-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Justificativa Obrigatória da Correção *
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explique o motivo do ajuste auditável..."
              rows={3}
              className="w-full bg-surface-container border border-white/10 rounded-lg p-2.5 text-on-surface focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Salvar Correção
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
