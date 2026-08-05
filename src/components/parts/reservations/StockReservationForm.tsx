import React, { useState } from 'react';
import { X, Save, Bookmark, AlertCircle } from 'lucide-react';
import { useStockItems } from '../../../hooks/useStockItems';
import { useStockReservations } from '../../../hooks/useStockReservations';
import { Button } from '../../ui/Button';

interface StockReservationFormProps {
  initialItemId?: string;
  initialWorkOrderCode?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockReservationForm: React.FC<StockReservationFormProps> = ({
  initialItemId,
  initialWorkOrderCode,
  onClose,
  onSuccess,
}) => {
  const { items } = useStockItems();
  const { createReservation } = useStockReservations();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemId, setItemId] = useState(initialItemId || '');
  const selectedItem = items.find(i => i.id === itemId);

  const [quantity, setQuantity] = useState<number>(2);
  const [workOrderCode, setWorkOrderCode] = useState(initialWorkOrderCode || 'OS-2026-105');
  const [equipmentName, setEquipmentName] = useState('Trator Valtra A750 14');
  const [requesterName, setRequesterName] = useState('Marcos Souza (Mecânico)');
  const [expectedUseDate, setExpectedUseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'urgente'>('alta');
  const [justification, setJustification] = useState('Garantia de insumos para manutenção preventiva de 250 horas');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) {
      setError('Selecione um item de estoque.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createReservation({
        itemId,
        quantity: Number(quantity),
        workOrderId: workOrderCode ? `OS-${workOrderCode}` : undefined,
        workOrderCode: workOrderCode || undefined,
        equipmentName: equipmentName || undefined,
        requesterName,
        expectedUseDate,
        priority,
        justification,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar reserva de estoque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Bookmark size={16} className="text-primary" />
            Criar Reserva de Peças / Insumos
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Item a Reservar *</label>
            <select
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              required
            >
              <option value="">Selecione o item...</option>
              {items.map(i => (
                <option key={i.id} value={i.id} disabled={i.availableQuantity <= 0}>
                  {i.internalCode} — {i.name} (Disp: {i.availableQuantity} {i.controlUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">
                Qtd Reservada ({selectedItem?.controlUnit || 'UN'}) *
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

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Prioridade *</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
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
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Previsão de Uso *</label>
              <input
                type="date"
                value={expectedUseDate}
                onChange={e => setExpectedUseDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Equipamento Relacionado</label>
              <input
                type="text"
                value={equipmentName}
                onChange={e => setEquipmentName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Solicitante *</label>
              <input
                type="text"
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Justificativa da Reserva</label>
            <textarea
              rows={2}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Confirmar Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
