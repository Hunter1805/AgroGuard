import { useState, useEffect, useCallback } from 'react';
import type { StockLot, StockLotFilter } from '../types/stock-lot';
import { stockLotService } from '../services/stock-lot.service';

export function useStockLots(initialFilters?: StockLotFilter) {
  const [lots, setLots] = useState<StockLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockLotFilter>(initialFilters || {});

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockLotService.getStockLots(filters);
      setLots(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lotes de insumos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  return {
    lots,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchLots,
  };
}
