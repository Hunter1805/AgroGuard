import { useState } from 'react';
import type { StockItem } from '../types/parts';
import { partsService } from '../services/parts.service';

export function useStockItemForm(initialItem?: StockItem, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  /** True apenas durante o POST/PATCH — usado no rotulo "Salvando..." do botao. */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveItem = async (data: Partial<StockItem>) => {
    try {
      setLoading(true);
      setSaving(true);
      setError(null);

      if (initialItem) {
        await partsService.updateStockItem(initialItem.id, data);
      } else {
        await partsService.createStockItem(data as any);
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Erro ao salvar item de estoque. Tente novamente.'
      );
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    setError,
    saveItem,
  };
}
