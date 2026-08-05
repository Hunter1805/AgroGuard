import React from 'react';
import type { StockHistoryLog } from '../../../types/parts';
import { Timeline } from '../../ui/Timeline';

interface StockHistoryTabProps {
  history: StockHistoryLog[];
}

export const StockHistoryTab: React.FC<StockHistoryTabProps> = ({ history }) => {
  const events = history.map(h => ({
    id: h.id,
    timestamp: h.date,
    title: `Evento: ${h.event.toUpperCase().replace(/_/g, ' ')}`,
    description: h.notes || 'Sem observações.',
    user: h.responsibleName,
    color: (h.event === 'cadastro' ? 'success' : h.event === 'perda' || h.event === 'descarte' ? 'error' : 'primary') as any,
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm">Trilha de Auditoria do Item</h3>
      {events.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum evento auditável registrado para este item.</p>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};
