import { useState, useEffect, useCallback } from 'react';
import type { StockReservation, StockReservationFilter } from '../types/stock-reservation';
import { stockReservationService } from '../services/stock-reservation.service';

export function useStockReservations(initialFilters?: StockReservationFilter) {
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockReservationFilter>(initialFilters || {});

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockReservationService.getStockReservations(filters);
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar reservas.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = async (data: Parameters<typeof stockReservationService.createStockReservation>[0]) => {
    const res = await stockReservationService.createStockReservation(data);
    fetchReservations();
    return res;
  };

  const fulfillReservation = async (id: string, fulfilledQuantity: number, responsibleName: string) => {
    const res = await stockReservationService.fulfillStockReservation(id, fulfilledQuantity, responsibleName);
    fetchReservations();
    return res;
  };

  const cancelReservation = async (id: string, cancelReason: string) => {
    const res = await stockReservationService.cancelStockReservation(id, cancelReason);
    fetchReservations();
    return res;
  };

  return {
    reservations,
    loading,
    error,
    filters,
    setFilters,
    createReservation,
    fulfillReservation,
    cancelReservation,
    refetch: fetchReservations,
  };
}
