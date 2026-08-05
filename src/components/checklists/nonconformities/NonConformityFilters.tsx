import React from 'react';
import { Search, Filter, Ban, X } from 'lucide-react';
import type { NonConformityFiltersState } from '../../../types/checklist';

interface NonConformityFiltersProps {
  filters: NonConformityFiltersState;
  onFilterChange: (updated: Partial<NonConformityFiltersState>) => void;
  onClear: () => void;
}

export const NonConformityFilters: React.FC<NonConformityFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const isFiltered = filters.search || filters.status !== 'todos' || filters.criticality !== 'todas' || filters.onlyBlocked;

  return (
    <div className="glass-card bg-surface-container-highest/50 border border-white/10 rounded-xl p-4 space-y-3 animate-fade-in text-[12px]">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Buscar por código, falha ou ativo..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[13px] text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto font-mono-label text-[11px]">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-primary" />
            <span className="text-on-surface-variant/70 uppercase">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="bg-surface-container border border-white/10 rounded px-2 py-1 text-on-surface focus:outline-none"
            >
              <option value="todos">Todos os Status</option>
              <option value="aberta">Aberta</option>
              <option value="em_tratamento">Em Tratamento</option>
              <option value="aguardando_os">Aguardando OS</option>
              <option value="resolvida">Resolvida (Concluída)</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-on-surface-variant/70 uppercase">Criticidade:</span>
            <select
              value={filters.criticality}
              onChange={(e) => onFilterChange({ criticality: e.target.value })}
              className="bg-surface-container border border-white/10 rounded px-2 py-1 text-on-surface focus:outline-none capitalize"
            >
              <option value="todas">Todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 font-mono-label text-[11px]">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyBlocked}
            onChange={(e) => onFilterChange({ onlyBlocked: e.target.checked })}
            className="rounded border-white/20 bg-surface-container text-error focus:ring-0"
          />
          <span className="text-error font-bold inline-flex items-center gap-1">
            <Ban size={13} /> Mostrar apenas que provocaram bloqueio da máquina
          </span>
        </label>

        {isFiltered && (
          <button
            onClick={onClear}
            className="text-on-surface-variant hover:text-primary transition-colors uppercase inline-flex items-center gap-1 text-[10px]"
          >
            <X size={12} /> Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};
