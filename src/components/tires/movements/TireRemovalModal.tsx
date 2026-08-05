import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Tire } from '../../../types/tires';
import { useTireMovements } from '../../../hooks/useTireMovements';
import { Button } from '../../ui/Button';

interface TireRemovalModalProps {
  tire: Tire;
  equipmentName?: string;
  positionName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TireRemovalModal: React.FC<TireRemovalModalProps> = ({
  tire,
  equipmentName = 'Equipamento',
  positionName = 'Posição Atual',
  onClose,
  onSuccess,
}) => {
  const { removeTire } = useTireMovements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [destinationStatus, setDestinationStatus] = useState<'disponivel' | 'em_reparo' | 'em_recapagem' | 'condenado' | 'descartado'>('disponivel');
  const [removalReason, setRemovalReason] = useState('Desgaste natural');
  const [reading, setReading] = useState<number | ''>('');
  const [treadDepthAtRemoval, setTreadDepthAtRemoval] = useState<number | ''>(tire.currentTreadDepth || '');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await removeTire({
        tireId: tire.id,
        equipmentId: tire.currentEquipmentId || 'EQ-003',
        equipmentName,
        positionId: tire.currentPositionId || 'pos-1e',
        positionName,
        destinationStatus,
        removalReason,
        reading: reading === '' ? undefined : Number(reading),
        treadDepthAtRemoval: treadDepthAtRemoval === '' ? undefined : Number(treadDepthAtRemoval),
        responsibleId: 'RESP-01',
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao remover pneu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface text-sm">Remover Pneu {tire.internalCode}</h3>
            <p className="text-[11px] text-on-surface-variant/70">
              Instalado em {equipmentName} ({positionName})
            </p>
          </div>
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
              <label className="block text-on-surface-variant font-mono-label mb-1">Motivo da Remoção *</label>
              <select
                value={removalReason}
                onChange={e => setRemovalReason(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="Desgaste natural">Desgaste natural</option>
                <option value="Furo / Perfuração">Furo / Perfuração</option>
                <option value="Corte lateral">Corte lateral</option>
                <option value="Bolha / Deformação">Bolha / Deformação</option>
                <option value="Vazamento">Vazamento</option>
                <option value="Rodízio prévio">Rodízio prévio</option>
                <option value="Transferência">Transferência</option>
                <option value="Enviar para Recapagem">Enviar para Recapagem</option>
                <option value="Manutenção preventiva">Manutenção preventiva</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Destino do Pneu *</label>
              <select
                value={destinationStatus}
                onChange={e => setDestinationStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="disponivel">Disponível (Estoque)</option>
                <option value="em_reparo">Oficina de Reparo</option>
                <option value="em_recapagem">Recapagem</option>
                <option value="condenado">Condenado</option>
                <option value="descartado">Descarte</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Sulco na Remoção (mm)</label>
              <input
                type="number"
                step="0.1"
                value={treadDepthAtRemoval}
                onChange={e => setTreadDepthAtRemoval(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Leitura do Equipamento (h/km)</label>
              <input
                type="number"
                value={reading}
                onChange={e => setReading(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
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

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Descreva detalhes adicionais ou estado do pneu..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700">
              <Save size={14} /> Confirmar Remoção
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
