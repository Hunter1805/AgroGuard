import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useTireRecommendations } from '../../../hooks/useTireRecommendations';
import { Button } from '../../ui/Button';

interface TireRecommendationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const TireRecommendationForm: React.FC<TireRecommendationFormProps> = ({ onClose, onSuccess }) => {
  const { createRecommendation } = useTireRecommendations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState('Trator');
  const [application, setApplication] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [size, setSize] = useState('');
  const [minPressure, setMinPressure] = useState<number | ''>(28);
  const [maxPressure, setMaxPressure] = useState<number | ''>(34);
  const [unit, setUnit] = useState<'psi' | 'bar' | 'kpa'>('psi');
  const [withWaterBallast, setWithWaterBallast] = useState(false);
  const [sourceRecommendation, setSourceRecommendation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!size || minPressure === '' || maxPressure === '') {
      setError('Por favor preencha todos os campos obrigatórios (Medida, Pressão Mínima e Máxima).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createRecommendation({
        category,
        application: application || undefined,
        equipmentModel: equipmentModel || undefined,
        size,
        minPressure: Number(minPressure),
        maxPressure: Number(maxPressure),
        unit,
        withWaterBallast,
        sourceRecommendation: sourceRecommendation || undefined,
        notes: notes || undefined,
        active: true,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar recomendação de pressão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm">Nova Recomendação de Pressão</h3>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Categoria *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="Trator">Trator</option>
                <option value="Caminhão">Caminhão</option>
                <option value="Colhedora">Colhedora</option>
                <option value="Pulverizador">Pulverizador</option>
                <option value="Carreta">Carreta</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Medida do Pneu *</label>
              <input
                type="text"
                placeholder="Ex: 18.4-30, 295/80 R22.5"
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Modelo Equipamento (opcional)</label>
              <input
                type="text"
                placeholder="Ex: MF 275"
                value={equipmentModel}
                onChange={e => setEquipmentModel(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Aplicação</label>
              <input
                type="text"
                placeholder="Ex: Preparo de Solo, Rodoviário"
                value={application}
                onChange={e => setApplication(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Pressão Mínima *</label>
              <input
                type="number"
                value={minPressure}
                onChange={e => setMinPressure(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Pressão Máxima *</label>
              <input
                type="number"
                value={maxPressure}
                onChange={e => setMaxPressure(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Unidade *</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="psi">PSI</option>
                <option value="bar">BAR</option>
                <option value="kpa">KPA</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="waterBallast"
              checked={withWaterBallast}
              onChange={e => setWithWaterBallast(e.target.checked)}
              className="rounded bg-surface-container border-white/10 text-primary focus:ring-0"
            />
            <label htmlFor="waterBallast" className="text-on-surface font-medium cursor-pointer">
              Considera utilização de lastro com água
            </label>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Fonte / Referência</label>
            <input
              type="text"
              placeholder="Ex: Manual Pirelli 2024"
              value={sourceRecommendation}
              onChange={e => setSourceRecommendation(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Instruções ou ressalvas técnicas..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Diretriz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
