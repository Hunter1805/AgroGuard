import { useState, useEffect, useCallback } from 'react';
import type { ChecklistDashboardStats } from '../types/checklist';
import { checklistService } from '../services/checklist.service';

export type ChecklistTabType = 'execucoes' | 'modelos' | 'programacoes' | 'nao_conformidades';

export function useChecklists(initialTab: ChecklistTabType = 'execucoes') {
  const [activeTab, setActiveTab] = useState<ChecklistTabType>(initialTab);
  const [stats, setStats] = useState<ChecklistDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checklistService.getChecklistDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar indicadores do módulo de Checklists.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    activeTab,
    setActiveTab,
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
