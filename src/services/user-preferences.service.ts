import type { UserPreferences } from '../types/user-preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  homeRoute: '/dashboard',
  tableDensity: 'comfortable',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: '24h',
  notifications: {
    inApp: true,
    email: false,
    criticalAlerts: true,
    assignedWorkOrders: true,
    overdueTasks: true,
    stockAlerts: true,
  },
};

let userPreferencesStore: Record<string, UserPreferences> = {};

export const userPreferencesService = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    return userPreferencesStore[userId] || DEFAULT_PREFERENCES;
  },

  async updatePreferences(userId: string, prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getPreferences(userId);
    const updated = {
      ...current,
      ...prefs,
      notifications: {
        ...current.notifications,
        ...(prefs.notifications || {}),
      },
    };
    userPreferencesStore[userId] = updated;
    return updated;
  },
};
