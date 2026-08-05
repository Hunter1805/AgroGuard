import React, { useState } from 'react';
import { History, Filter, Gauge, Wrench, ClipboardList, AlertTriangle, FileText, Camera, MapPin } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentHistoryEvent } from '../../../../types/equipment-detail';
import { Timeline } from '../../../ui/Timeline';

interface HistoryTabProps {
  equipment?: Equipment;
  history: EquipmentHistoryEvent[];
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
    case 'falha':
      return <AlertTriangle size={14} />;
    case 'documento':
      return <FileText size={14} />;
    case 'foto':
      return <Camera size={14} />;
    case 'localizacao':
      return <MapPin size={14} />;
    default:
      return <History size={14} />;
  }
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ history }) => {
  const [filterType, setFilterType] = useState<string>('todos');

  const filteredHistory = history.filter((h) => {
    if (filterType !== 'todos' && h.type !== filterType) return false;
    return true;
  });

  const timelineEvents = filteredHistory.map((h) => ({
    id: h.id,
    title: h.title,
    description: h.description,
    timestamp: h.dateTime,
    user: h.userName,
    color: getEventColor(h.type),
    icon: getEventIcon(h.type),
  }));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Histórico de Alterações e Trilha de Auditoria
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Linha do tempo cronológica com todos os eventos e movimentações do ativo.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <Filter size={14} className="text-primary" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface-container border border-white/10 rounded-md px-3 py-1.5 text-on-surface focus:outline-none"
          >
            <option value="todos">Todos os Eventos</option>
            <option value="leitura">Leituras</option>
            <option value="checklist">Checklists</option>
            <option value="manutencao">Manutenções</option>
            <option value="ordem_servico">Ordens de Serviço</option>
            <option value="falha">Falhas</option>
            <option value="cadastro">Cadastro e Edição</option>
          </select>
        </div>
      </div>

      {/* Linha do Tempo Completa */}
      <div className="glass-card rounded-xl border border-white/10 p-6 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2 border-b border-white/10 pb-3">
          <History size={16} className="text-primary" /> Eventos Registrados ({timelineEvents.length})
        </h4>

        <Timeline events={timelineEvents} />
      </div>
    </div>
  );
};
