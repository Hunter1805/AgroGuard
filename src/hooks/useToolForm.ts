import { useState } from 'react';
import type { Tool } from '../types/tools';
import { toolsService } from '../services/tools.service';

export function useToolForm(initialTool?: Tool, onSuccess?: (tool: Tool) => void) {
  const [loading, setLoading] = useState(false);
  /** True apenas durante o POST/PATCH — usado no rotulo "Salvando..." do botao. */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTool = async (data: Partial<Tool>) => {
    try {
      setLoading(true);
      setSaving(true);
      setError(null);

      let saved: Tool;
      if (initialTool?.id) {
        saved = await toolsService.updateTool(initialTool.id, data);
      } else {
        saved = await toolsService.createTool(data);
      }

      if (onSuccess) onSuccess(saved);
      return saved;
    } catch (err: unknown) {
      // Mostra a causa real na tela e SEMPRE libera o botão de salvar.
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Erro ao salvar dados da ferramenta. Tente novamente.';
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    setError,
    saveTool,
  };
}
