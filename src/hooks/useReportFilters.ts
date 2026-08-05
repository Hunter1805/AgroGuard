import { useSearchParams } from 'react-router-dom';
import type { ReportFilter, ReportQuickPeriod } from '../types/report-filters';

export function useReportFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ReportFilter = {
    period: (searchParams.get('period') as ReportQuickPeriod) || '30d',
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    equipmentId: searchParams.get('equipmentId') || undefined,
    companyId: searchParams.get('companyId') || undefined,
    unitId: searchParams.get('unitId') || undefined,
    status: searchParams.get('status') || undefined,
    search: searchParams.get('search') || undefined,
  };

  const updateFilters = (newFilters: Partial<ReportFilter>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
