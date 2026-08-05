import { useState, useEffect } from 'react';
import { adminAuditService } from '../services/admin-audit.service';
import type { AdminAuditEvent } from '../types/admin-audit';

export function useAdminAudit(filters?: any) {
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await adminAuditService.getAuditEvents(filters);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [filters?.module]);

  return {
    events,
    loading,
    refetchEvents: fetchEvents,
  };
}
