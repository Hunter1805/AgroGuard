import { useState, useEffect, useCallback } from 'react';
import type { ReportOperationalIndicators } from '../types/report-indicators';
import type { ReportFilter } from '../types/report-filters';
import { reportIndicatorsService } from '../services/report-indicators.service';

export function useOperationalIndicators(filters?: ReportFilter) {
  const [indicators, setIndicators] = useState<ReportOperationalIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndicators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportIndicatorsService.getOperationalIndicators(filters);
      setIndicators(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao calcular os indicadores operacionais.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  return {
    indicators,
    loading,
    error,
    refetch: fetchIndicators,
  };
}
