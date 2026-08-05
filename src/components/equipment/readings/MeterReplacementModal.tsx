import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import type { Equipment } from '../../../types/equipment';
import { equipmentReadingsService } from '../../../services/equipment-readings.service';
import { Button } from '../../ui/Button';

interface MeterReplacementModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MeterReplacementModal: React.FC<MeterReplacementModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Defeito no mostrador / display quebrada');
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newInitialReading, setNewInitialReading] = useState('0');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !equipment) return null;

  const currentMeter = equipment.meters?.[0] || {
    id: 'm-1',
    label: 'Horímetro Principal',
    currentValue: equipment.currentHours || 0,
    unit: equipment.meterType === 'odometro' ? 'km' : 'h',
    type: equipment.meterType === 'odometro' ? 'odometro' : 'horimetro',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const initialVal = parseFloat(newInitialReading);
    if (isNaN(initialVal)) {
      setError('Informe um valor numérico inicial válido para o novo medidor.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await equipmentReadingsService.replaceMeter({
        equipmentId: equipment.id,
        previousMeterId: currentMeter.id,
        newMeterId: `m-new-${Date.now()}`,
        replacementAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        reason,
        previousFinalReading: currentMeter.currentValue,
        newInitialReading: initialVal,
        newSerialNumber: newSerialNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        createdBy: 'Operador / Técnico',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setError('Erro ao registrar substituição de medidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-lg w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw size={20} />
            <div>
              <h3 className="font-title-md text-[16px] font-bold text-on-surface">
                Substituir Medidor Físico
              </h3>
              <p className="text-[11px] text-on-surface-variant/70">
                Troca de relógio de horímetro ou odômetro preservando o acumulado histórico do ativo.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-error/15 text-error text-[11px] font-medium">
            {error}
          </div>
        )}

        <div className="p-3 rounded-xl bg-surface-container/50 border border-white/5 space-y-1 text-[12px] font-mono-label">
          <p>Equipamento: <strong>{equipment.name} ({equipment.plateOrCode})</strong></p>
          <p>Medidor Atual: <strong>{currentMeter.label}</strong></p>
          <p>Última Leitura Final: <strong className="text-warning">{currentMeter.currentValue} {currentMeter.unit}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Motivo da Substituição *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
            >
              <option value="Defeito no mostrador / display quebrada">Defeito no mostrador / display quebrada</option>
              <option value="Reinício natural do medidor (zeramento)">Reinício natural do medidor (zeramento)</option>
              <option value="Substituição preventiva no painel">Substituição preventiva no painel</option>
              <option value="Manutenção elétrica geral">Manutenção elétrica geral</option>
              <option value="Outro motivo técnico">Outro motivo técnico</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Nº de Série do Novo Medidor
              </label>
              <input
                type="text"
                value={newSerialNumber}
                onChange={(e) => setNewSerialNumber(e.target.value)}
                placeholder="Ex: SER-9901-X"
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none font-mono-label"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-primary uppercase block mb-1 font-bold">
                Leitura Inicial do Novo Medidor *
              </label>
              <input
                type="number"
                step="any"
                value={newInitialReading}
                onChange={(e) => setNewInitialReading(e.target.value)}
                placeholder="Ex: 0"
                className="w-full bg-surface-container border border-primary/40 rounded-lg px-3 py-2 text-primary font-bold focus:outline-none font-mono-label"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Observações Técnicas da Substituição
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes da troca efetuada pela oficina..."
              rows={2}
              className="w-full bg-surface-container border border-white/10 rounded-lg p-2.5 text-on-surface focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Confirmar Troca do Medidor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
