import { useEffect, useState } from 'react';
import type { MaintenanceItem, RevisionSchedule } from '../types/maintenance';
import { maintenanceService } from '../services/maintenance.service';

export function useMaintenance() {
  const [queue, setQueue] = useState<MaintenanceItem[]>([]);
  const [revisions, setRevisions] = useState<RevisionSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [qData, rData] = await Promise.all([
        maintenanceService.getQueue(),
        maintenanceService.getUpcomingRevisions(),
      ]);
      setQueue(qData);
      setRevisions(rData);
      setLoading(false);
    }
    loadData();
  }, []);

  return { queue, revisions, loading };
}
