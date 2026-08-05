import { useState, useEffect, useCallback } from 'react';
import type { ChecklistSchedule } from '../types/checklist';
import { checklistScheduleService } from '../services/checklist-schedule.service';

export function useChecklistSchedules() {
  const [schedules, setSchedules] = useState<ChecklistSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<string>('todas');

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await checklistScheduleService.getChecklistSchedules({
        frequency: frequencyFilter,
      });
      setSchedules(list);
    } catch (e: any) {
      setError(e.message || 'Erro ao buscar programações de checklists.');
    } finally {
      setLoading(false);
    }
  }, [frequencyFilter]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const toggleSchedule = async (id: string) => {
    await checklistScheduleService.toggleChecklistSchedule(id);
    await loadSchedules();
  };

  const createSchedule = async (data: Omit<ChecklistSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await checklistScheduleService.createChecklistSchedule(data);
    await loadSchedules();
    return res;
  };

  return {
    schedules,
    loading,
    error,
    frequencyFilter,
    setFrequencyFilter,
    toggleSchedule,
    createSchedule,
    refetch: loadSchedules,
  };
}
