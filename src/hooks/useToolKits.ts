import { useState, useEffect, useCallback } from 'react';
import type { ToolKit, ToolKitStatus } from '../types/tool-kit';
import { toolKitService } from '../services/tool-kit.service';

export function useToolKits() {
  const [kits, setKits] = useState<ToolKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('todos');
  const [status, setStatus] = useState<ToolKitStatus | 'todos'>('todos');

  const fetchKits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await toolKitService.getToolKits({ search, type, status });
      setKits(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar kits de ferramentas.');
    } finally {
      setLoading(false);
    }
  }, [search, type, status]);

  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  const inspectKit = async (params: Parameters<typeof toolKitService.inspectToolKit>[0]) => {
    const inspection = await toolKitService.inspectToolKit(params);
    fetchKits();
    return inspection;
  };

  return {
    kits,
    loading,
    error,
    search,
    setSearch,
    type,
    setType,
    status,
    setStatus,
    inspectKit,
    refetch: fetchKits,
  };
}
