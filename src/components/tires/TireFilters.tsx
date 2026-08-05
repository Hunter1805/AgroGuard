import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { TireStatus, TireCondition } from '../../types/tires';
import type { TireFiltersState } from '../../hooks/useTires';

interface TireFiltersProps {
  filters: TireFiltersState;
  onFilterChange: (filters: Partial<TireFiltersState>) => void;
  onReset: () => void;
}

export const TireFilters: React.FC<TireFiltersProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="p-4 border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-container-low/30">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por código interno, série, marca, modelo ou medida..."
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <select
          value={filters.status || ''}
          onChange={e => onFilterChange({ status: (e.target.value as TireStatus) || undefined })}
          className="bg-surface-container/60 rounded-xl border border-white/10 text-xs px-3 py-2 text-on-surface focus:outline-none focus:border-primary/50"
        >
          <option value="">Todos os Status</option>
          <option value="instalado">Instalado</option>
          <option value="disponivel">Disponível (Estoque)</option>
          <option value="em_reparo">Em Reparo</option>
          <option value="em_recapagem">Em Recapagem</option>
          <option value="recapado">Recapado</option>
          <option value="condenado">Condenado</option>
          <option value="descartado">Descartado</option>
        </select>

        {/* Condição */}
        <select
          value={filters.condition || ''}
          onChange={e => onFilterChange({ condition: (e.target.value as TireCondition) || undefined })}
          className="bg-surface-container/60 rounded-xl border border-white/10 text-xs px-3 py-2 text-on-surface focus:outline-none focus:border-primary/50"
        >
          <option value="">Todas as Condições</option>
          <option value="novo">Novo</option>
          <option value="bom">Bom</option>
          <option value="atencao">Atenção</option>
          <option value="critico">Crítico</option>
          <option value="inutilizavel">Inutilizável</option>
        </select>

        {/* Filtro Rápido Anomalias */}
        <button
          onClick={() => onFilterChange({ hasAnomaly: !filters.hasAnomaly })}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
            filters.hasAnomaly
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-surface-container/60 text-on-surface-variant border-white/10 hover:bg-surface-container'
          }`}
        >
          <Filter size={13} />
          Com Anomalia
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Limpar filtros"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
};
