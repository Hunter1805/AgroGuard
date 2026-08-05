import React from 'react';
import { History, Gauge, Wrench, ClipboardList, ArrowRight } from 'lucide-react';
import type { EquipmentHistoryEvent } from '../../../../types/equipment-detail';
import { Timeline } from '../../../ui/Timeline';
import { Button } from '../../../ui/Button';

interface Props {
  history: EquipmentHistoryEvent[];
  onViewFullHistory: () => void;
}

function getEventColor(type: EquipmentHistoryEvent['type']): 'default' | 'primary' | 'success' | 'warning' | 'error' {
  switch (type) {
    case 'leitura':
      return 'primary';
    case 'ordem_servico':
    case 'falha':
      return 'error';
    case 'manutencao':
      return 'warning';
    case 'checklist':
      return 'success';
    default:
      return 'default';
  }
}

function getEventIcon(type: EquipmentHistoryEvent['type']) {
  switch (type) {
    case 'leitura':
      return <Gauge size={14} />;
    case 'ordem_servico':
    case 'manutencao':
      return <Wrench size={14} />;
    case 'checklist':
      return <ClipboardList size={14} />;
    default:
      return <History size={14} />;
  }
}

export const RecentActivitySection: React.FC<Props> = ({ history, onViewFullHistory }) => {
  const events = history.slice(0, 5).map((h) => ({
    id: h.id,
    title: h.title,
    description: h.description,
    timestamp: h.dateTime,
    user: h.userName,
    color: getEventColor(h.type),
    icon: getEventIcon(h.type),
  }));

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h4 className="text-[14px] font-semibold text-on-surface flex items-center gap-2">
          <History size={16} className="text-primary" /> Atividade Recente
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewFullHistory}
        >
          Ver histórico completo <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>

      <Timeline events={events} />
    </div>
  );
};
