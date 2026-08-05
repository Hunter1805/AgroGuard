import { useState, useEffect, useCallback } from 'react';
import type { Tire } from '../types/tires';
import type { TireMovementLog } from '../types/tire-movement';
import type { TireInspectionHeader, TireCalibrationLog } from '../types/tire-inspection';
import { tiresService } from '../services/tires.service';
import { tireMovementService } from '../services/tire-movement.service';
import { tireInspectionService } from '../services/tire-inspection.service';

export function useTireDetail(tireId?: string) {
  const [tire, setTire] = useState<Tire | null>(null);
  const [movements, setMovements] = useState<TireMovementLog[]>([]);
  const [inspections, setInspections] = useState<TireInspectionHeader[]>([]);
  const [calibrations, setCalibrations] = useState<TireCalibrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!tireId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [tireData, movData, inspData, calibData] = await Promise.all([
        tiresService.getTireById(tireId),
        tireMovementService.getMovements({ tireId }),
        tireInspectionService.getInspections({ tireId }),
        tireInspectionService.getCalibrationLogs(tireId),
      ]);
      if (!tireData) throw new Error('Pneu não encontrado');
      setTire(tireData);
      setMovements(movData);
      setInspections(inspData);
      setCalibrations(calibData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes do pneu');
    } finally {
      setLoading(false);
    }
  }, [tireId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    tire,
    movements,
    inspections,
    calibrations,
    loading,
    error,
    refetch: fetchDetail
  };
}

