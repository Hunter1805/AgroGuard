import { useState, useEffect, useCallback } from 'react';
import type { MaintenanceHistoryEntry, MaintenanceHistoryFilterState } from '../types/maintenance-schedule';
import { maintenanceHistoryService } from '../services/maintenance-history.service';

const DEFAULT_FILTERS: MaintenanceHistoryFilterState = {
  search: '',
  equipmentId: 'todos',
  planId: 'todos',
  interval: 'todos',
  responsible: 'todos',
  workshop: 'todos',
  result: 'todos',
  onlyWithOrder: false,
  onlyWithDelay: false,
  triggerType: 'todos',
};

export function useMaintenanceHistory(equipmentIdFilter?: string) {
  const [history, setHistory] = useState<MaintenanceHistoryEntry[]>([]);
  const [filters, setFilters] = useState<MaintenanceHistoryFilterState>({
    ...DEFAULT_FILTERS,
    equipmentId: equipmentIdFilter || 'todos',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MaintenanceHistoryEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await maintenanceHistoryService.getMaintenanceHistory(filters);
      setHistory(res);
    } catch (err: any) {
      setError(err?.message || 'Falha ao resgatar histórico de manutenções realizadas.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateFilters = (up: Partial<MaintenanceHistoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...up }));
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, equipmentId: equipmentIdFilter || 'todos' });
  };

  const openDrawer = (entry: MaintenanceHistoryEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEntry(null);
  };

  return {
    history,
    filters,
    loading,
    error,
    selectedEntry,
    isDrawerOpen,
    updateFilters,
    resetFilters,
    openDrawer,
    closeDrawer,
    refresh: fetchHistory,
  };
}
