import { useState, useEffect, useCallback } from 'react';
import type { Tool, ToolFilter, ToolsDashboardStats } from '../types/tools';
import { toolsService } from '../services/tools.service';

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<ToolsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ToolFilter>({
    search: '',
    category: 'todas',
    status: 'todos',
    condition: 'todas',
    controlType: 'todos',
  });

  // Mantidos para retrocompatibilidade com componentes legados
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'todas' | 'Alta' | 'Média'>('todas');

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const activeSearch = filters.search || searchTerm;
      const combinedFilters: ToolFilter = {
        ...filters,
        search: activeSearch,
      };

      const [list, statsData] = await Promise.all([
        toolsService.getTools(combinedFilters),
        toolsService.getToolsDashboard(),
      ]);

      let filteredList = list;
      if (filterPriority !== 'todas') {
        filteredList = filteredList.filter(t => t.priority === filterPriority);
      }

      setTools(filteredList);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar inventário de ferramentas.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, filterPriority]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const updateFilters = (newFilters: Partial<ToolFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'todas',
      status: 'todos',
      condition: 'todas',
      controlType: 'todos',
    });
    setSearchTerm('');
    setFilterPriority('todas');
  };

  return {
    tools,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchTools,
    // propriedades legadas
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
  };
}
