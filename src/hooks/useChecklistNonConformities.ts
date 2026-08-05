import { useState, useEffect, useCallback } from 'react';
import type { ChecklistNonConformity, NonConformityFiltersState } from '../types/checklist';
import { checklistNonConformityService } from '../services/checklist-nonconformity.service';

export function useChecklistNonConformities(initialEquipmentId?: string) {
  const [nonConformities, setNonConformities] = useState<ChecklistNonConformity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<NonConformityFiltersState>({
    search: '',
    status: 'todos',
    criticality: 'todas',
    equipmentId: initialEquipmentId || '',
    onlyBlocked: false,
  });

  const loadNCs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await checklistNonConformityService.getNonConformities(filters);
      setNonConformities(list);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar lista de não conformidades.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadNCs();
  }, [loadNCs]);

  const assignToUser = async (id: string, responsibleName: string) => {
    const updated = await checklistNonConformityService.assignNonConformity(id, responsibleName);
    await loadNCs();
    return updated;
  };

  const resolveNonConformity = async (
    id: string,
    solutionApplied: string,
    resolvedBy: string,
    photoAfterUrl?: string,
    unblockEquipment?: boolean
  ) => {
    const resolved = await checklistNonConformityService.resolveNonConformity(id, {
      solutionApplied,
      resolvedBy,
      photoAfterUrl,
      unblockEquipment,
    });
    await loadNCs();
    return resolved;
  };

  const linkOrder = async (id: string, orderId: string) => {
    const res = await checklistNonConformityService.linkOrderToNonConformity(id, orderId);
    await loadNCs();
    return res;
  };

  const cancelNC = async (id: string, reason: string) => {
    const res = await checklistNonConformityService.cancelNonConformity(id, reason);
    await loadNCs();
    return res;
  };

  return {
    nonConformities,
    loading,
    error,
    filters,
    setFilters,
    assignToUser,
    resolveNonConformity,
    linkOrder,
    cancelNC,
    refetch: loadNCs,
  };
}
