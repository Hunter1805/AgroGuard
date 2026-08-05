import { useState, useEffect, useCallback } from 'react';
import type { ReportFilter } from '../types/report-filters';
import { reportsService } from '../services/reports.service';

export function useReportsOverview(filters?: ReportFilter) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportsService.getReportsOverview(filters);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar visão geral dos relatórios.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    loading,
    error,
    refetch: fetchOverview,
  };
}
