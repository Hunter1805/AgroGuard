import React from 'react';
import type { ToolHistoryLog } from '../../../types/tools';
import { Timeline } from '../../ui/Timeline';

interface ToolHistoryTabProps {
  history: ToolHistoryLog[];
}

export const ToolHistoryTab: React.FC<ToolHistoryTabProps> = ({ history }) => {
  const events = history.map(h => ({
    id: h.id,
    timestamp: h.date,
    title: `Evento: ${h.event.toUpperCase().replace(/_/g, ' ')}`,
    description: `${h.notes || 'Sem observações.'}${h.originLocation ? ` — De: ${h.originLocation}` : ''}${h.destinationLocation ? ` Para: ${h.destinationLocation}` : ''}`,
    user: h.responsibleName,
    color: (h.event === 'cadastro' ? 'success' : h.event === 'baixa' || h.event === 'dano' || h.event === 'perda' ? 'error' : 'primary') as any,
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      <h3 className="font-bold text-on-surface text-sm">Trilha de Auditoria em Linha do Tempo</h3>
      {events.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum evento auditável registrado para esta ferramenta.</p>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};
