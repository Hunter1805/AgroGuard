export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  homeRoute: string;
  tableDensity: 'comfortable' | 'compact';
  dateFormat: 'dd/MM/yyyy' | 'yyyy-MM-dd';
  timeFormat: '24h' | '12h';

  notifications: {
    inApp: boolean;
    email: boolean;
    criticalAlerts: boolean;
    assignedWorkOrders: boolean;
    overdueTasks: boolean;
    stockAlerts: boolean;
  };
}
