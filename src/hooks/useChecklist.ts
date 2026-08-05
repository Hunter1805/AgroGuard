import { useState, useEffect } from 'react';
import type { LegacyChecklistItem as ChecklistItem, ChecklistSession, ChecklistItemEntry } from '../types/checklist';
import { checklistService } from '../services/checklist.service';

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [sessions, setSessions] = useState<ChecklistSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      checklistService.getItems(),
      checklistService.getSessions(),
    ]).then(([fetchedItems, fetchedSessions]) => {
      setItems(fetchedItems);
      setSessions(fetchedSessions);
      setLoading(false);
    });
  }, []);

  const submitSession = async (session: ChecklistSession) => {
    const created = await checklistService.createSession(session);
    setSessions((prev) => [created, ...prev]);
    return created;
  };

  const buildNewSession = (
    equipmentId: string,
    equipmentName: string,
    operatorName: string,
    horimeter: number,
    entries: ChecklistItemEntry[]
  ): ChecklistSession => ({
    id: `CHK-${Date.now()}`,
    equipmentId,
    equipmentName,
    operatorName,
    horimeter,
    date: new Date().toISOString().split('T')[0],
    items: entries,
    status: entries.some((e) => e.status === 'nok') ? 'com_pendencias' : 'concluido',
  });

  return { items, sessions, loading, submitSession, buildNewSession };
}
