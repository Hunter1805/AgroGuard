import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder } from '../types/work-order';
import { workOrderService } from '../services/work-order.service';

export function useWorkOrders() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workOrderService.getWorkOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar Ordens de Serviço');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
}
