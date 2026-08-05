import { useCallback, useEffect, useState } from 'react';
import type {
  MeterReading,
  ReadingStats,
  ReadingsFilterState,
} from '../types/equipment-readings';
import { equipmentReadingsService } from '../services/equipment-readings.service';

const INITIAL_FILTERS: ReadingsFilterState = {
  search: '',
  meterType: 'todos',
  status: 'todos',
  source: 'todos',
  responsible: '',
  period: 'todos',
  equipmentId: '',
  onlySuspicious: false,
  onlyRegressive: false,
  onlyCorrected: false,
};

export function useEquipmentReadings(initialEquipmentId?: string) {
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReadingsFilterState>({
    ...INITIAL_FILTERS,
    equipmentId: initialEquipmentId || '',
  });

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, currentStats] = await Promise.all([
        equipmentReadingsService.getAllReadings(filters),
        equipmentReadingsService.getReadingStats(),
      ]);
      setReadings(data);
      setStats(currentStats);
    } catch {
      setError('Erro ao carregar registros de leituras.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const updateFilters = (newFilters: Partial<ReadingsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ ...INITIAL_FILTERS, equipmentId: initialEquipmentId || '' });
  };

  const approveReading = async (readingId: string, userId = 'Administrador') => {
    await equipmentReadingsService.approveReading(readingId, userId);
    await fetchReadings();
  };

  const rejectReading = async (readingId: string, reason: string, userId = 'Administrador') => {
    await equipmentReadingsService.rejectReading(readingId, reason, userId);
    await fetchReadings();
  };

  const correctReading = async (readingId: string, correctedValue: number, justification: string, userId = 'Administrador') => {
    await equipmentReadingsService.correctReading(readingId, correctedValue, justification, userId);
    await fetchReadings();
  };

  const cancelReading = async (readingId: string, reason: string, userId = 'Administrador') => {
    await equipmentReadingsService.cancelReading(readingId, reason, userId);
    await fetchReadings();
  };

  return {
    readings,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    approveReading,
    rejectReading,
    correctReading,
    cancelReading,
    refetch: fetchReadings,
  };
}
