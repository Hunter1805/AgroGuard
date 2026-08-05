import { useState, useEffect } from 'react';
import { systemSettingsService } from '../services/system-settings.service';
import type { SystemSettings } from '../types/system-settings';

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const data = await systemSettingsService.getSettings();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    refetchSettings: fetchSettings,
  };
}
