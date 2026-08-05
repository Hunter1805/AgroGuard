import { useState } from 'react';
import type { Tool } from '../types/tools';
import { toolsService } from '../services/tools.service';

export function useToolForm(initialTool?: Tool, onSuccess?: (tool: Tool) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTool = async (data: Partial<Tool>) => {
    try {
      setLoading(true);
      setError(null);

      let saved: Tool;
      if (initialTool?.id) {
        saved = await toolsService.updateTool(initialTool.id, data);
      } else {
        saved = await toolsService.createTool(data);
      }

      if (onSuccess) onSuccess(saved);
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar dados da ferramenta.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    saveTool,
  };
}
