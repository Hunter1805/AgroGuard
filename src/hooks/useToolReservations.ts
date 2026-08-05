import { useState, useEffect, useCallback } from 'react';
import type { ToolReservation, ToolReservationStatus } from '../types/tools';
import { toolReservationService } from '../services/tool-reservation.service';

export function useToolReservations() {
  const [reservations, setReservations] = useState<ToolReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ToolReservationStatus | 'todos'>('todos');

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await toolReservationService.getToolReservations({ search, status });
      setReservations(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar reservas.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = async (params: Parameters<typeof toolReservationService.createToolReservation>[0]) => {
    const res = await toolReservationService.createToolReservation(params);
    fetchReservations();
    return res;
  };

  const cancelReservation = async (id: string, reason: string) => {
    const res = await toolReservationService.cancelToolReservation(id, reason);
    fetchReservations();
    return res;
  };

  return {
    reservations,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    createReservation,
    cancelReservation,
    refetch: fetchReservations,
  };
}
