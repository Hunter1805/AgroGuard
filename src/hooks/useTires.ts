import { useState, useEffect, useCallback } from 'react';
import type { Tire, TireStatus, TireCondition } from '../types/tires';
import { tiresService } from '../services/tires.service';

export interface TireFiltersState {
  search: string;
  status?: TireStatus;
  condition?: TireCondition;
  brand: string;
  size: string;
  equipmentId?: string;
  hasAnomaly?: boolean;
  pressureIrregular?: boolean;
  treadCritical?: boolean;
}

export function useTires(initialFilters?: Partial<TireFiltersState>) {
  const [tires, setTires] = useState<Tire[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TireFiltersState>({
    search: '',
    brand: '',
    size: '',
    ...initialFilters,
  });

  const fetchTires = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tiresData, statsData] = await Promise.all([
        tiresService.getTires(filters),
        tiresService.getTireDashboard(),
      ]);
      setTires(tiresData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pneus');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTires();
  }, [fetchTires]);

  const updateFilters = (newFilters: Partial<TireFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      size: '',
    });
  };

  const createTire = async (data: Partial<Tire>) => {
    const created = await tiresService.createTire(data);
    await fetchTires();
    return created;
  };

  const updateTire = async (id: string, data: Partial<Tire>) => {
    const updated = await tiresService.updateTire(id, data);
    await fetchTires();
    return updated;
  };

  const archiveTire = async (id: string) => {
    await tiresService.archiveTire(id);
    await fetchTires();
  };

  return {
    tires,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchTires,
    createTire,
    updateTire,
    archiveTire,
  };
}

