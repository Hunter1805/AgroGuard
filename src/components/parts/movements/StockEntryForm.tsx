import React, { useState } from 'react';
import { X, Save, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { useStockItems } from '../../../hooks/useStockItems';
import { useStockMovements } from '../../../hooks/useStockMovements';
import { Button } from '../../ui/Button';

interface StockEntryFormProps {
  initialItemId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockEntryForm: React.FC<StockEntryFormProps> = ({ initialItemId, onClose, onSuccess }) => {
  const { items } = useStockItems();
  const { registerEntry } = useStockMovements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemId, setItemId] = useState(initialItemId || '');
  const selectedItem = items.find(i => i.id === itemId);

  const [quantity, setQuantity] = useState<number>(10);
  const [unitCost, setUnitCost] = useState<number | ''>(68);
  const [supplierName, setSupplierName] = useState('AgroPeças Distribuidora');
  const [invoiceNumber, setInvoiceNumber] = useState('NF-2026-9901');
  const [lotCode, setLotCode] = useState(`LT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expirationDate, setExpirationDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [responsibleName, setResponsibleName] = useState('Roberto Alves (Almoxarife)');
  const [notes, setNotes] = useState('Entrada referente ao pedido de compras');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) {
      setError('Selecione um item de estoque.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await registerEntry({
        itemId,
        quantity: Number(quantity),
        unitCost: unitCost === '' ? 0 : Number(unitCost),
        supplierName,
        invoiceNumber,
        lotCode: selectedItem?.controlsLot ? lotCode : undefined,
        expirationDate: selectedItem?.controlsExpiration ? expirationDate : undefined,
        responsibleName,
        notes,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar entrada de estoque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-emerald-400">
            <ArrowDownLeft size={18} />
            Registrar Entrada de Estoque (Compra / Reposição)
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
              <option value="">Selecione o item...</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>
                  {i.internalCode} — {i.name} (Atual: {i.currentQuantity} {i.controlUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">
                Quantidade Entrada ({selectedItem?.controlUnit || 'UN'}) *
              </label>
              <input
                type="number"
                step={selectedItem?.allowsFractionalQuantity ? '0.01' : '1'}
                min="0.01"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Custo Unitário da Entrada (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitCost}
                onChange={e => setUnitCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Fornecedor</label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Nº Nota Fiscal / Doc</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>

          {selectedItem?.controlsLot && (
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Número do Lote *</label>
              <input
                type="text"
                value={lotCode}
                onChange={e => setLotCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
          )}

          {selectedItem?.controlsExpiration && (
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Data de Validade do Lote *</label>
              <input
                type="date"
                value={expirationDate}
                onChange={e => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pelo Recebimento *</label>
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
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              <Save size={14} className="mr-1" /> Salvar Entrada
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
