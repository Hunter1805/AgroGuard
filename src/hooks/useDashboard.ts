import { useCallback, useEffect, useState } from 'react';
import type {
  DashboardKPIs,
  MonthlyCostBar,
  ActiveAlert,
  FleetStatusBreakdown,
  DashboardStats,
  DashboardAlert,
  UpcomingMaintenance,
  DashboardActivity,
  DashboardOrder,
} from '../types/dashboard';
import { dashboardService } from '../services/dashboard.service';

interface UseDashboardReturn {
  // Novos
  stats: DashboardStats | null;
  priorityAlerts: DashboardAlert[];
  upcomingMaintenance: UpcomingMaintenance[];
  recentOrders: DashboardOrder[];
  activities: DashboardActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  // Legado
  kpis: DashboardKPIs | null;
  chartPeriod: '6M' | 'YTD';
  setChartPeriod: (p: '6M' | 'YTD') => void;
  chartData: MonthlyCostBar[];
  alerts: ActiveAlert[];
  fleetStatus: FleetStatusBreakdown | null;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [priorityAlerts, setPriorityAlerts] = useState<DashboardAlert[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<UpcomingMaintenance[]>([]);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Legado
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'6M' | 'YTD'>('6M');
  const [chartData, setChartData] = useState<MonthlyCostBar[]>([]);
  const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
  const [fleetStatus, setFleetStatus] = useState<FleetStatusBreakdown | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        statsRes,
        alertsRes,
        maintenanceRes,
        ordersRes,
        activitiesRes,
        kpiRes,
        legacyAlertsRes,
        fleetRes,
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPriorityAlerts(6),
        dashboardService.getUpcomingMaintenance(),
        dashboardService.getRecentOrders(5),
        dashboardService.getRecentActivities(8),
        dashboardService.getKPIs(),
        dashboardService.getActiveAlerts(),
        dashboardService.getFleetStatus(),
      ]);

      setStats(statsRes);
      setPriorityAlerts(alertsRes);
      setUpcomingMaintenance(maintenanceRes);
      setRecentOrders(ordersRes);
      setActivities(activitiesRes);
      setKpis(kpiRes);
      setAlerts(legacyAlertsRes);
      setFleetStatus(fleetRes);
    } catch {
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    dashboardService.getCostChartData(chartPeriod).then(setChartData);
  }, [chartPeriod]);

  return {
    stats,
    priorityAlerts,
    upcomingMaintenance,
    recentOrders,
    activities,
    loading,
    error,
    refetch: loadAll,
    kpis,
    chartPeriod,
    setChartPeriod,
    chartData,
    alerts,
    fleetStatus,
  };
}
