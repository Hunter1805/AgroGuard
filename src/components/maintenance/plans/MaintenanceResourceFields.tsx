import React, { useState } from 'react';
import { Plus, Trash2, Box, Wrench } from 'lucide-react';
import type { MaintenanceRequiredItem } from '../../../types/maintenance-plan';
import { Button } from '../../ui/Button';

interface MaintenanceResourceFieldsProps {
  items: MaintenanceRequiredItem[];
  category: 'peca' | 'insumo' | 'ferramenta';
  onAddItem: (item: MaintenanceRequiredItem) => void;
  onRemoveItem: (id: string) => void;
}

export const MaintenanceResourceFields: React.FC<MaintenanceResourceFieldsProps> = ({ items, category, onAddItem, onRemoveItem }) => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [unit] = useState(category === 'insumo' ? 'Litros' : 'Peça');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddItem({
      id: `RES-${Date.now()}`,
      name: name.trim(),
      quantity: Number(qty) || 1,
      unit,
      required: true,
    });
    setName('');
  };

  const getPlaceholder = () => {
    switch (category) {
      case 'insumo': return 'Ex: Óleo SAE 15W-40 API CI-4';
      case 'ferramenta': return 'Ex: Chave de Bujão / Calibrador de Válvula';
      default: return 'Ex: Filtro de Óleo Lubrificante Original';
    }
  };

  return (
    <div className="space-y-3 bg-gray-50/70 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
        <span className="flex items-center gap-1.5">
          {category === 'ferramenta' ? <Wrench className="w-3.5 h-3.5 text-blue-500" /> : <Box className="w-3.5 h-3.5 text-purple-500" />}
          {category === 'peca' ? 'Peças Exigidas' : category === 'insumo' ? 'Insumos / Fluidos' : 'Ferramentas de Oficina'}
        </span>
        <span className="text-gray-400">{items.length} inseridos</span>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={getPlaceholder()}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-900 dark:text-white"
        />
        {category !== 'ferramenta' && (
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            title="Quantidade estimada"
            className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-center font-bold"
          />
        )}
        <Button size="sm" type="button" onClick={handleAdd} className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-3 py-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {items.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between py-1.5 px-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-xs font-medium">
              <span className="text-gray-800 dark:text-gray-200">
                <strong>{it.name}</strong> {it.quantity && `(${it.quantity} ${it.unit || ''})`}
              </span>
              <button type="button" onClick={() => onRemoveItem(it.id)} className="text-rose-500 hover:text-rose-700 p-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
