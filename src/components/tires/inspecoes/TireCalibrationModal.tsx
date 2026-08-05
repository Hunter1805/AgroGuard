import React, { useState } from 'react';
import { X, Save, Gauge, AlertCircle } from 'lucide-react';
import { useTireInspections } from '../../../hooks/useTireInspections';
import { Button } from '../../ui/Button';

interface TireCalibrationModalProps {
  tireId?: string;
  equipmentId?: string;
  positionId?: string;
  currentPressure?: number;
  recommendedPressure?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const TireCalibrationModal: React.FC<TireCalibrationModalProps> = ({
  tireId = 'PN-0893',
  equipmentId = 'EQ-003',
  positionId = 'pos-1e',
  currentPressure = 24,
  recommendedPressure = 35,
  onClose,
  onSuccess,
}) => {
  const { registerCalibration } = useTireInspections();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adjustedPressure, setAdjustedPressure] = useState<number | ''>(recommendedPressure || currentPressure);
  const [equipmentUsed, setEquipmentUsed] = useState('Calibrador Digital PneuMax');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustedPressure === '') {
      setError('A pressão ajustada é obrigatória.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await registerCalibration({
        equipmentId,
        tireId,
        positionId,
        previousPressure: currentPressure,
        adjustedPressure: Number(adjustedPressure),
        recommendedPressure,
        unit: 'psi',
        date: new Date().toISOString(),
        responsibleId: 'RESP-01',
        responsibleName,
        equipmentUsed,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar calibragem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Gauge className="text-primary" size={16} />
            Calibrar Pneu {tireId}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-surface-container rounded-xl border border-white/10 flex items-center justify-between font-mono-label">
            <div>
              <span className="text-[10px] text-on-surface-variant/70 block">Pressão Medida / Anterior</span>
              <span className="text-sm font-bold text-amber-400">{currentPressure} PSI</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant/70 block">Recomendação Ideal</span>
              <span className="text-sm font-bold text-emerald-400">{recommendedPressure} PSI</span>
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Nova Pressão Ajustada (PSI) *</label>
            <input
              type="number"
              step="0.5"
              value={adjustedPressure}
              onChange={e => setAdjustedPressure(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Calibrador / Equipamento</label>
              <input
                type="text"
                value={equipmentUsed}
                onChange={e => setEquipmentUsed(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Ex: Verificação com nitrogênio..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Registrar Calibragem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
