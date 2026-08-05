import React, { useState } from 'react';
import { X, Save, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useStockItems } from '../../../hooks/useStockItems';
import { useStockMovements } from '../../../hooks/useStockMovements';
import { Button } from '../../ui/Button';

interface StockOutputFormProps {
  initialItemId?: string;
  initialWorkOrderCode?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockOutputForm: React.FC<StockOutputFormProps> = ({ initialItemId, initialWorkOrderCode, onClose, onSuccess }) => {
  const { items } = useStockItems();
  const { registerOutput } = useStockMovements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemId, setItemId] = useState(initialItemId || '');
  const selectedItem = items.find(i => i.id === itemId);

  const [quantity, setQuantity] = useState<number>(2);
  const [type, setType] = useState<'consumo' | 'saida' | 'descarte'>('consumo');
  const [workOrderCode, setWorkOrderCode] = useState(initialWorkOrderCode || 'OS-2026-105');
  const [equipmentName, setEquipmentName] = useState('Trator Valtra A750 14');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva (Mecânico)');
  const [deliveredByName, setDeliveredByName] = useState('Roberto Alves (Almoxarife)');
  const [notes, setNotes] = useState('Saída para preventiva de 250 horas');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) {
      setError('Selecione um item de estoque.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await registerOutput({
        itemId,
        quantity: Number(quantity),
        type,
        workOrderId: workOrderCode ? `OS-${workOrderCode}` : undefined,
        workOrderCode: workOrderCode || undefined,
        equipmentName: equipmentName || undefined,
        responsibleName,
        deliveredByName,
        notes,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar saída de estoque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-rose-400">
            <ArrowUpRight size={18} />
            Registrar Saída / Consumo de Estoque
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Item de Estoque *</label>
            <select
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              required
            >
              <option value="">Selecione o item a retirar...</option>
              {items.map(i => (
                <option key={i.id} value={i.id} disabled={i.availableQuantity <= 0}>
                  {i.internalCode} — {i.name} (Disponível: {i.availableQuantity} {i.controlUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Tipo de Saída *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="consumo">Consumo por Ordem de Serviço</option>
                <option value="saida">Saída Geral / Setor</option>
                <option value="descarte">Descarte / Perda</option>
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">
                Qtd Retirada (Máx Disp: {selectedItem?.availableQuantity || 0}) *
              </label>
              <input
                type="number"
                step={selectedItem?.allowsFractionalQuantity ? '0.01' : '1'}
                min="0.01"
                max={selectedItem?.availableQuantity}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Cód. Ordem de Serviço (OS)</label>
              <input
                type="text"
                placeholder="Ex: OS-2026-105"
                value={workOrderCode}
                onChange={e => setWorkOrderCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Equipamento Relacionado</label>
              <input
                type="text"
                value={equipmentName}
                onChange={e => setEquipmentName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pela Retirada *</label>
              <input
                type="text"
                value={responsibleName}
                onChange={e => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Almoxarife Responsável</label>
              <input
                type="text"
                value={deliveredByName}
                onChange={e => setDeliveredByName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações da Saída</label>
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
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
              <Save size={14} className="mr-1" /> Confirmar Saída
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
