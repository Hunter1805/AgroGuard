import { useState, useEffect, useCallback } from 'react';
import type { ToolMaintenance, ToolMaintenanceStatus } from '../types/tool-maintenance';
import { toolMaintenanceService } from '../services/tool-maintenance.service';

export function useToolMaintenances(toolId?: string) {
  const [maintenances, setMaintenances] = useState<ToolMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ToolMaintenanceStatus | 'todos'>('todos');

  const fetchMaintenances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await toolMaintenanceService.getToolMaintenances({ search, toolId, status });
      setMaintenances(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar manutenções de ferramentas.');
    } finally {
      setLoading(false);
    }
  }, [search, toolId, status]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  const createMaintenance = async (params: Parameters<typeof toolMaintenanceService.createToolMaintenance>[0]) => {
    const mnt = await toolMaintenanceService.createToolMaintenance(params);
    fetchMaintenances();
    return mnt;
  };

  const completeMaintenance = async (id: string, params: Parameters<typeof toolMaintenanceService.completeToolMaintenance>[1]) => {
    const mnt = await toolMaintenanceService.completeToolMaintenance(id, params);
    fetchMaintenances();
    return mnt;
  };

  return {
    maintenances,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    createMaintenance,
    completeMaintenance,
    refetch: fetchMaintenances,
  };
}
