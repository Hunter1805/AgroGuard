import React, { useState } from 'react';
import { X, Save, Undo2, AlertCircle } from 'lucide-react';
import type { StockItem } from '../../../types/parts';
import type { StockItemReturnCondition } from '../../../types/stock-movement';
import { useStockMovements } from '../../../hooks/useStockMovements';
import { Button } from '../../ui/Button';

interface StockReturnModalProps {
  item: StockItem;
  workOrderCode?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockReturnModal: React.FC<StockReturnModalProps> = ({ item, workOrderCode: initialOS, onClose, onSuccess }) => {
  const { registerReturn } = useStockMovements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [workOrderCode, setWorkOrderCode] = useState(initialOS || 'OS-2026-105');
  const [returnCondition, setReturnCondition] = useState<StockItemReturnCondition>('lacrado');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva (Mecânico)');
  const [notes, setNotes] = useState('Devolução de sobra de material não utilizado na OS');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await registerReturn({
        itemId: item.id,
        quantity: Number(quantity),
        workOrderCode: workOrderCode || undefined,
        returnCondition,
        responsibleName,
        notes,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar devolução.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-blue-400">
            <Undo2 size={16} />
            Devolver Sobra de Material ao Estoque ({item.internalCode})
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Item</label>
            <input
              type="text"
              value={`${item.internalCode} — ${item.name}`}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Qtd Devolvida ({item.controlUnit}) *</label>
              <input
                type="number"
                step={item.allowsFractionalQuantity ? '0.01' : '1'}
                min="0.01"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Condição do Material *</label>
              <select
                value={returnCondition}
                onChange={e => setReturnCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="lacrado">Lacrado / Novo</option>
                <option value="aberto_utilizavel">Aberto e Reutilizável</option>
                <option value="parcialmente_utilizado">Parcialmente Utilizado</option>
                <option value="danificado">Danificado / Avariado</option>
                <option value="contaminado">Contaminado</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Ordem de Serviço (OS)</label>
              <input
                type="text"
                value={workOrderCode}
                onChange={e => setWorkOrderCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Devolvido Por *</label>
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
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save size={14} className="mr-1" /> Confirmar Devolução
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
