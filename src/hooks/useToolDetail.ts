import { useState, useEffect, useCallback } from 'react';
import type { Tool, ToolHistoryLog } from '../types/tools';
import type { ToolLoan } from '../types/tool-loan';
import type { ToolCalibration } from '../types/tool-calibration';
import type { ToolMaintenance } from '../types/tool-maintenance';
import { toolsService } from '../services/tools.service';
import { toolLoanService } from '../services/tool-loan.service';
import { toolCalibrationService } from '../services/tool-calibration.service';
import { toolMaintenanceService } from '../services/tool-maintenance.service';

export function useToolDetail(toolId?: string) {
  const [tool, setTool] = useState<Tool | undefined>(undefined);
  const [loans, setLoans] = useState<ToolLoan[]>([]);
  const [calibrations, setCalibrations] = useState<ToolCalibration[]>([]);
  const [maintenances, setMaintenances] = useState<ToolMaintenance[]>([]);
  const [history, setHistory] = useState<ToolHistoryLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!toolId) return;

    try {
      setLoading(true);
      setError(null);

      const [toolData, allLoans, calibData, mntData, histData] = await Promise.all([
        toolsService.getToolById(toolId),
        toolLoanService.getToolLoans(),
        toolCalibrationService.getToolCalibrations({ toolId }),
        toolMaintenanceService.getToolMaintenances({ toolId }),
        toolsService.getToolHistory(toolId),
      ]);

      if (!toolData) {
        setError('Ferramenta não encontrada.');
      } else {
        setTool(toolData);
        // Filtra empréstimos que possuem esta ferramenta
        setLoans(allLoans.filter(l => l.items.some(i => i.toolId === toolData.id || i.toolCode === toolData.code)));
        setCalibrations(calibData);
        setMaintenances(mntData);
        setHistory(histData);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes da ferramenta.');
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    tool,
    loans,
    calibrations,
    maintenances,
    history,
    loading,
    error,
    refetch: fetchDetail,
  };
}
