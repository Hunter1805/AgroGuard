import { useState, useEffect, useCallback } from 'react';
import type { MaintenanceOverviewStats, MaintenanceAlertItem } from '../types/maintenance';
import type { MaintenanceSchedule } from '../types/maintenance-schedule';
import { maintenanceService } from '../services/maintenance.service';
import { maintenanceScheduleService } from '../services/maintenance-schedule.service';

export function useMaintenanceOverview() {
  const [stats, setStats] = useState<MaintenanceOverviewStats | null>(null);
  const [alerts, setAlerts] = useState<MaintenanceAlertItem[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedStats, fetchedAlerts, fetchedSchedules] = await Promise.all([
        maintenanceService.getMaintenanceOverviewStats(),
        maintenanceService.getMaintenanceAlerts(),
        maintenanceScheduleService.getMaintenanceSchedules(),
      ]);
      setStats(fetchedStats);
      setAlerts(fetchedAlerts);
      // Filtrar apenas as próximas da semana
      setUpcomingSchedules(fetchedSchedules.slice(0, 5));
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar o panorama de manutenções no AgroGuard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleCreateOrderFromAlert = async (scheduleId?: string) => {
    if (!scheduleId) return;
    try {
      await maintenanceScheduleService.createPreventiveOrder(scheduleId);
      await fetchOverview();
    } catch (err: any) {
      setError(err?.message || 'Erro ao emitir OS Preventiva.');
    }
  };

  return {
    stats,
    alerts,
    upcomingSchedules,
    loading,
    error,
    refresh: fetchOverview,
    handleCreateOrderFromAlert,
  };
}
