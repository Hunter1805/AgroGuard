import { useState, useEffect, useCallback } from 'react';
import type { TireMovementLog, TireAction } from '../types/tire-movement';
import { tireMovementService } from '../services/tire-movement.service';

export function useTireMovements(filters?: { tireId?: string; equipmentId?: string; action?: TireAction }) {
  const [movements, setMovements] = useState<TireMovementLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tireMovementService.getMovements(filters);
      setMovements(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar histórico de movimentações');
    } finally {
      setLoading(false);
    }
  }, [filters?.tireId, filters?.equipmentId, filters?.action]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return {
    movements,
    loading,
    error,
    refetch: fetchMovements,
    installTire: tireMovementService.installTire.bind(tireMovementService),
    removeTire: tireMovementService.removeTire.bind(tireMovementService),
    rotateTires: tireMovementService.rotateTires.bind(tireMovementService),
    transferTire: tireMovementService.transferTire.bind(tireMovementService),
    replaceTire: tireMovementService.replaceTire.bind(tireMovementService),
    sendTireToRepair: tireMovementService.sendTireToRepair.bind(tireMovementService),
    completeTireRepair: tireMovementService.completeTireRepair.bind(tireMovementService),
    sendTireToRetread: tireMovementService.sendTireToRetread.bind(tireMovementService),
    completeTireRetread: tireMovementService.completeTireRetread.bind(tireMovementService),
    discardTire: tireMovementService.discardTire.bind(tireMovementService),
  };
}
