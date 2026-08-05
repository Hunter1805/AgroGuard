import { useState, useEffect, useCallback } from 'react';
import type { StockMovement, StockMovementFilter } from '../types/stock-movement';
import { stockMovementService } from '../services/stock-movement.service';

export function useStockMovements(initialFilters?: StockMovementFilter) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockMovementFilter>(initialFilters || {});

  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockMovementService.getStockMovements(filters);
      setMovements(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar movimentações.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const registerEntry = async (data: Parameters<typeof stockMovementService.registerStockEntry>[0]) => {
    const res = await stockMovementService.registerStockEntry(data);
    fetchMovements();
    return res;
  };

  const registerOutput = async (data: Parameters<typeof stockMovementService.registerStockOutput>[0]) => {
    const res = await stockMovementService.registerStockOutput(data);
    fetchMovements();
    return res;
  };

  const registerReturn = async (data: Parameters<typeof stockMovementService.registerStockReturn>[0]) => {
    const res = await stockMovementService.registerStockReturn(data);
    fetchMovements();
    return res;
  };

  return {
    movements,
    loading,
    error,
    filters,
    setFilters,
    registerEntry,
    registerOutput,
    registerReturn,
    refetch: fetchMovements,
  };
}
