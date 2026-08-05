import { useState, useEffect, useCallback } from 'react';
import type { StockInventory, StockInventoryFilter } from '../types/stock-inventory';
import { stockInventoryService } from '../services/stock-inventory.service';

export function useStockInventories(initialFilters?: StockInventoryFilter) {
  const [inventories, setInventories] = useState<StockInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockInventoryFilter>(initialFilters || {});

  const fetchInventories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockInventoryService.getStockInventories(filters);
      setInventories(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar inventários.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const createInventory = async (data: Parameters<typeof stockInventoryService.createStockInventory>[0]) => {
    const res = await stockInventoryService.createStockInventory(data);
    fetchInventories();
    return res;
  };

  const registerCount = async (id: string, counts: { itemId: string; count: number }[]) => {
    const res = await stockInventoryService.registerInventoryCount(id, counts);
    fetchInventories();
    return res;
  };

  const approveInventory = async (id: string, approverName: string) => {
    const res = await stockInventoryService.approveStockInventory(id, approverName);
    fetchInventories();
    return res;
  };

  return {
    inventories,
    loading,
    error,
    filters,
    setFilters,
    createInventory,
    registerCount,
    approveInventory,
    refetch: fetchInventories,
  };
}
