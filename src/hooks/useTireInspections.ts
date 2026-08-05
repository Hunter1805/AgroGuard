import { useState, useEffect, useCallback } from 'react';
import type { TireInspectionHeader, TireCalibrationLog } from '../types/tire-inspection';
import { tireInspectionService } from '../services/tire-inspection.service';

export function useTireInspections(filters?: { equipmentId?: string; tireId?: string }) {
  const [inspections, setInspections] = useState<TireInspectionHeader[]>([]);
  const [calibrations, setCalibrations] = useState<TireCalibrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [inspData, calibData] = await Promise.all([
        tireInspectionService.getInspections(filters),
        tireInspectionService.getCalibrationLogs(filters?.tireId),
      ]);
      setInspections(inspData);
      setCalibrations(calibData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar inspeções de pneus');
    } finally {
      setLoading(false);
    }
  }, [filters?.equipmentId, filters?.tireId]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const createInspection = async (data: Omit<TireInspectionHeader, 'id' | 'createdAt'>) => {
    const created = await tireInspectionService.createInspection(data);
    await fetchInspections();
    return created;
  };

  const registerCalibration = async (data: Omit<TireCalibrationLog, 'id'>) => {
    const created = await tireInspectionService.registerCalibration(data);
    await fetchInspections();
    return created;
  };

  return {
    inspections,
    calibrations,
    loading,
    error,
    refetch: fetchInspections,
    createInspection,
    registerCalibration,
  };
}
