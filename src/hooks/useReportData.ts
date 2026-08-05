import { useState, useEffect, useCallback } from 'react';
import type { ReportCategory, ReportTableData } from '../types/reports';
import type { ReportFilter } from '../types/report-filters';

import { reportEquipmentService } from '../services/report-equipment.service';
import { reportMaintenanceService } from '../services/report-maintenance.service';
import { reportWorkOrderService } from '../services/report-work-order.service';
import { reportChecklistService } from '../services/report-checklist.service';
import { reportTiresService } from '../services/report-tires.service';
import { reportToolsService } from '../services/report-tools.service';
import { reportStockService } from '../services/report-stock.service';
import { reportCostsService } from '../services/report-costs.service';

export function useReportData(category: ReportCategory, filters?: ReportFilter) {
  const [data, setData] = useState<ReportTableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let res: ReportTableData;

      switch (category) {
        case 'equipamentos':
        case 'leituras':
          res = await reportEquipmentService.getEquipmentReport(filters);
          break;
        case 'manutencoes':
          res = await reportMaintenanceService.getMaintenanceReport(filters);
          break;
        case 'ordens-servico':
          res = await reportWorkOrderService.getWorkOrderReport(filters);
          break;
        case 'checklists':
        case 'nao-conformidades':
          res = await reportChecklistService.getChecklistReport(filters);
          break;
        case 'pneus':
          res = await reportTiresService.getTiresReport(filters);
          break;
        case 'ferramentas':
          res = await reportToolsService.getToolsReport(filters);
          break;
        case 'pecas-estoque':
          res = await reportStockService.getStockReport(filters);
          break;
        case 'custos':
          res = await reportCostsService.getCostsReport(filters);
          break;
        default:
          res = await reportEquipmentService.getEquipmentReport(filters);
          break;
      }

      setData(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar os dados do relatório.');
    } finally {
      setLoading(false);
    }
  }, [category, filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    data,
    loading,
    error,
    refetch: fetchReport,
  };
}
