import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { ToolFilter } from '../../types/tools';

interface ToolFiltersProps {
  filters: ToolFilter;
  onFilterChange: (filters: Partial<ToolFilter>) => void;
  onReset: () => void;
}

export const ToolFilters: React.FC<ToolFiltersProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="p-4 bg-surface-container-low/40 border-b border-white/10 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por código, ferramenta, marca, série ou patrimônio..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-on-surface-variant/60" />
            <select
              value={filters.category || 'todas'}
              onChange={e => onFilterChange({ category: e.target.value })}
              className="bg-surface-container/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-on-surface"
            >
              <option value="todas">Todas Categorias</option>
              <option value="Chaves">Chaves</option>
              <option value="Medição">Medição</option>
              <option value="Elétrica">Elétrica</option>
              <option value="Pneumática">Pneumática</option>
              <option value="Solda">Solda</option>
              <option value="Segurança">Segurança (EPI)</option>
            </select>
          </div>

          <select
            value={filters.status || 'todos'}
            onChange={e => onFilterChange({ status: e.target.value as any })}
            className="bg-surface-container/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-on-surface"
          >
            <option value="todos">Todos Status</option>
            <option value="disponivel">Disponível</option>
            <option value="emprestada">Emprestada</option>
            <option value="reservada">Reservada</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="aguardando_calibracao">Aguardando Calibração</option>
            <option value="danificada">Danificada</option>
            <option value="perdida">Perdida</option>
            <option value="baixada">Baixada</option>
          </select>

          <select
            value={filters.condition || 'todas'}
            onChange={e => onFilterChange({ condition: e.target.value as any })}
            className="bg-surface-container/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-on-surface"
          >
            <option value="todas">Todas Conservações</option>
            <option value="nova">Nova</option>
            <option value="excelente">Excelente</option>
            <option value="boa">Boa</option>
            <option value="regular">Regular</option>
            <option value="ruim">Ruim</option>
            <option value="inutilizavel">Inutilizável</option>
          </select>

          <select
            value={filters.controlType || 'todos'}
            onChange={e => onFilterChange({ controlType: e.target.value as any })}
            className="bg-surface-container/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-on-surface"
          >
            <option value="todos">Controle (Todos)</option>
            <option value="individual">Individual (Patrimônio/Série)</option>
            <option value="quantidade">Por Quantidade</option>
          </select>

          <button
            onClick={onReset}
            className="p-1.5 hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
            title="Limpar Filtros"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
