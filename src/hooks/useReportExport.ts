import { useState, useEffect, useCallback } from 'react';
import type { ReportExportLog, ReportExportFormat } from '../types/report-export';
import type { ReportTableData } from '../types/reports';
import { reportExportService } from '../services/report-export.service';

export function useReportExport() {
  const [logs, setLogs] = useState<ReportExportLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportExportService.getExportHistory();
      setLogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const exportData = async (
    reportName: string,
    category: any,
    format: ReportExportFormat,
    tableData: ReportTableData,
    userName?: string
  ) => {
    await reportExportService.exportReport(reportName, category, format, tableData, userName);
    await fetchHistory();
  };

  return {
    logs,
    loading,
    exportData,
    refetchHistory: fetchHistory,
  };
}
