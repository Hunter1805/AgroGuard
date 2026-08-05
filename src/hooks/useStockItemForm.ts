import { useState } from 'react';
import type { StockItem } from '../types/parts';
import { partsService } from '../services/parts.service';

export function useStockItemForm(initialItem?: StockItem, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveItem = async (data: Partial<StockItem>) => {
    try {
      setLoading(true);
      setError(null);

      if (initialItem) {
        await partsService.updateStockItem(initialItem.id, data);
      } else {
        await partsService.createStockItem(data as any);
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar item de estoque.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    saveItem,
  };
}
