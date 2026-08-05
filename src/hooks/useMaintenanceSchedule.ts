import { useState, useEffect, useCallback } from 'react';
import type { MaintenanceSchedule, MaintenanceScheduleFilterState } from '../types/maintenance-schedule';
import { maintenanceScheduleService } from '../services/maintenance-schedule.service';

const DEFAULT_FILTERS: MaintenanceScheduleFilterState = {
  search: '',
  equipmentId: 'todos',
  responsible: 'todos',
  workshop: 'todos',
  status: 'todos',
  priority: 'todos',
  period: 'todos',
};

export function useMaintenanceSchedule() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [filters, setFilters] = useState<MaintenanceScheduleFilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'lista' | 'calendario_mes' | 'calendario_semana'>('lista');

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await maintenanceScheduleService.getMaintenanceSchedules(filters);
      setSchedules(res);
    } catch (err: any) {
      setError(err?.message || 'Falha ao buscar a agenda de manutenções.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const updateFilters = (up: Partial<MaintenanceScheduleFilterState>) => {
    setFilters((prev) => ({ ...prev, ...up }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleReschedule = async (id: string, newDate: string, reason: string, newTime?: string) => {
    try {
      setError(null);
      await maintenanceScheduleService.rescheduleMaintenance(id, newDate, newTime, reason);
      setActionMessage('Serviço reprogramado na agenda com sucesso! Justificativa arquivada para auditoria.');
      await fetchSchedules();
      return true;
    } catch (err: any) {
      setError(err?.message || 'Falha ao reprogramar serviço.');
      return false;
    }
  };

  const handleCancelSchedule = async (id: string, reason: string) => {
    try {
      setError(null);
      await maintenanceScheduleService.cancelMaintenanceSchedule(id, reason);
      setActionMessage('Serviço cancelado. Justificativa devidamente registrada no livro de auditoria.');
      await fetchSchedules();
      return true;
    } catch (err: any) {
      setError(err?.message || 'Falha ao cancelar o agendamento.');
      return false;
    }
  };

  const handleCreatePreventiveOS = async (scheduleId: string) => {
    try {
      setError(null);
      const { orderId } = await maintenanceScheduleService.createPreventiveOrder(scheduleId);
      setActionMessage(`Ordem de Serviço Preventiva gerada com êxito sob o protocolo ${orderId}!`);
      await fetchSchedules();
      return orderId;
    } catch (err: any) {
      setError(err?.message || 'Falha ao emitir Ordem de Serviço Preventiva.');
      return null;
    }
  };

  return {
    schedules,
    filters,
    loading,
    error,
    actionMessage,
    viewMode,
    setViewMode,
    clearMessage: () => setActionMessage(null),
    updateFilters,
    resetFilters,
    handleReschedule,
    handleCancelSchedule,
    handleCreatePreventiveOS,
    refresh: fetchSchedules,
  };
}
