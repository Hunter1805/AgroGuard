import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder } from '../types/work-order';
import { workOrderService } from '../services/work-order.service';

export function useWorkOrders() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginação servida pelo backend (page/pageSize; max 100 por página).
  const PAGE_SIZE = 100;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await workOrderService.getWorkOrdersPaged({ page, pageSize: PAGE_SIZE });
      setOrders(result.items);
      setTotal(result.total);
    } catch (err: unknown) {
      setError(err instanceof Error && err.message ? err.message : 'Erro ao carregar Ordens de Serviço');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
    refetch: fetchOrders
  };
}
