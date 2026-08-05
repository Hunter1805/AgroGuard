import { useState, useEffect, useCallback } from 'react';
import type { StockItem, StockDashboardStats, StockItemFilter } from '../types/parts';
import { partsService } from '../services/parts.service';

export function useStockItems(initialFilters?: StockItemFilter) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [stats, setStats] = useState<StockDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockItemFilter>(initialFilters || {});

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [itemList, dashboardStats] = await Promise.all([
        partsService.getStockItems(filters),
        partsService.getStockDashboardStats(),
      ]);
      setItems(itemList);
      setStats(dashboardStats);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar peças e insumos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateFilters = (newFilters: Partial<StockItemFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    items,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchItems,
  };
}
