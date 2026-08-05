import React, { useState } from 'react';
import { X, Save, ClipboardList, AlertCircle } from 'lucide-react';
import type { StockInventoryType } from '../../../types/stock-inventory';
import { useStockInventories } from '../../../hooks/useStockInventories';
import { Button } from '../../ui/Button';

interface StockInventoryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const StockInventoryForm: React.FC<StockInventoryFormProps> = ({ onClose, onSuccess }) => {
  const { createInventory } = useStockInventories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('Inventário Geral de Almoxarifado');
  const [type, setType] = useState<StockInventoryType>('geral');
  const [warehouseName, setWarehouseName] = useState('Almoxarifado Central');
  const [plannedDate, setPlannedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [responsibleName, setResponsibleName] = useState('Roberto Alves (Almoxarife)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await createInventory({
        title,
        type,
        warehouseName,
        plannedDate,
        responsibleName,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar inventário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <ClipboardList size={16} className="text-primary" />
            Abrir Novo Inventário Físico
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Título do Inventário *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Tipo de Inventário *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="geral">Geral (Todos os Itens)</option>
                <option value="por_almoxarifado">Por Almoxarifado</option>
                <option value="por_categoria">Por Categoria</option>
                <option value="rotativo">Rotativo</option>
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Almoxarifado</label>
              <input
                type="text"
                value={warehouseName}
                onChange={e => setWarehouseName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Data Planejada *</label>
              <input
                type="date"
                value={plannedDate}
                onChange={e => setPlannedDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
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

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Iniciar Inventário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
