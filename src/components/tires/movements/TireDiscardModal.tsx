import React, { useState } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import type { Tire } from '../../../types/tires';
import { useTireMovements } from '../../../hooks/useTireMovements';
import { Button } from '../../ui/Button';

interface TireDiscardModalProps {
  tire: Tire;
  onClose: () => void;
  onSuccess: () => void;
}

export const TireDiscardModal: React.FC<TireDiscardModalProps> = ({ tire, onClose, onSuccess }) => {
  const { discardTire } = useTireMovements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState('Desgaste total de carcaça');
  const [residualValue, setResidualValue] = useState<number | ''>('');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await discardTire({
        tireId: tire.id,
        reason,
        residualValue: residualValue === '' ? undefined : Number(residualValue),
        responsibleId: 'RESP-01',
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar descarte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-rose-400">
            <Trash2 size={16} />
            Descartar Pneu {tire.internalCode}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px]">
            Atenção: O descarte registrará a desativação permanente deste pneu. Ele continuará legível para histórico e auditoria, mas não poderá mais ser instalado.
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Motivo do Descarte *</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="Desgaste total de carcaça">Desgaste total de carcaça</option>
              <option value="Corte irreparável no talão/flanco">Corte irreparável no talão/flanco</option>
              <option value="Deformação / Bolha estrutural grave">Deformação / Bolha estrutural grave</option>
              <option value="Limite máximo de recapagens atingido">Limite máximo de recapagens atingido</option>
              <option value="Fogo / Danos por sobreaquecimento">Fogo / Danos por sobreaquecimento</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Valor Residual Obtido (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 150.00"
                value={residualValue}
                onChange={e => setResidualValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável *</label>
              <input
                type="text"
                value={responsibleName}
                onChange={e => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações de Laudo / Auditoria</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Número de nota fiscal de sucata ou laudo técnico..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700">
              <Trash2 size={14} /> Confirmar Descarte
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
