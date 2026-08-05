import { useState, useEffect, useCallback } from 'react';
import type { ToolCalibration, ToolCalibrationResult } from '../types/tool-calibration';
import { toolCalibrationService } from '../services/tool-calibration.service';

export function useToolCalibrations(toolId?: string) {
  const [calibrations, setCalibrations] = useState<ToolCalibration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [result, setResult] = useState<ToolCalibrationResult | 'todos'>('todos');

  const fetchCalibrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await toolCalibrationService.getToolCalibrations({ search, toolId, result });
      setCalibrations(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar calibrações de ferramentas.');
    } finally {
      setLoading(false);
    }
  }, [search, toolId, result]);

  useEffect(() => {
    fetchCalibrations();
  }, [fetchCalibrations]);

  const registerCalibration = async (params: Parameters<typeof toolCalibrationService.registerToolCalibration>[0]) => {
    const calib = await toolCalibrationService.registerToolCalibration(params);
    fetchCalibrations();
    return calib;
  };

  return {
    calibrations,
    loading,
    error,
    search,
    setSearch,
    result,
    setResult,
    registerCalibration,
    refetch: fetchCalibrations,
  };
}
