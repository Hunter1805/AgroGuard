import React from 'react';
import type { TireMovementLog } from '../../../types/tire-movement';
import { Timeline } from '../../ui/Timeline';

interface TireTimelineTabProps {
  movements: TireMovementLog[];
}

export const TireTimelineTab: React.FC<TireTimelineTabProps> = ({ movements }) => {
  const events = movements.map(m => ({
    id: m.id,
    timestamp: m.date,
    title: `Ação: ${m.action.toUpperCase()}`,
    description: `${m.notes || 'Sem observações.'}${m.equipmentName ? ` — Equipamento: ${m.equipmentName}` : ''}`,
    user: m.responsibleName,
    color: (m.action === 'instalacao' ? 'success' : m.action === 'descarte' ? 'error' : 'primary') as any,
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      <h3 className="font-bold text-on-surface text-sm">Trilha de Auditoria em Linha do Tempo</h3>
      {events.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum evento auditável registrado para este pneu.</p>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};
