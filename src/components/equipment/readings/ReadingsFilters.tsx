import React from 'react';
import { Search, Filter, RotateCcw, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { ReadingsFilterState } from '../../../types/equipment-readings';

interface ReadingsFiltersProps {
  filters: ReadingsFilterState;
  onFilterChange: (newFilters: Partial<ReadingsFilterState>) => void;
  onClearFilters: () => void;
}

export const ReadingsFilters: React.FC<ReadingsFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="glass-card rounded-xl border border-white/10 p-4 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Busca textual */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por equipamento, código, placa ou responsável..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Seletores de Filtro */}
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <select
            value={filters.meterType}
            onChange={(e) => onFilterChange({ meterType: e.target.value as ReadingsFilterState['meterType'] })}
            className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
          >
            <option value="todos">Todos os Medidores</option>
            <option value="horimetro">Horímetro</option>
            <option value="odometro">Odômetro</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as ReadingsFilterState['status'] })}
            className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="valida">Válida</option>
            <option value="suspeita">Suspeita</option>
            <option value="pendente_aprovacao">Pendente de Aprovação</option>
            <option value="corrigida">Corrigida</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <select
            value={filters.source}
            onChange={(e) => onFilterChange({ source: e.target.value as ReadingsFilterState['source'] })}
            className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
          >
            <option value="todos">Todas as Origens</option>
            <option value="manual">Manual</option>
            <option value="checklist">Checklist</option>
            <option value="ordem_servico">Ordem de Serviço</option>
            <option value="manutencao">Manutenção</option>
            <option value="importacao">Importação</option>
            <option value="integracao">Integração / Telemetria</option>
          </select>

          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Limpar Filtros"
          >
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </div>

      {/* Botões rápidos de alternância */}
      <div className="flex items-center gap-2 text-[11px] pt-1 border-t border-white/5 flex-wrap">
        <span className="text-on-surface-variant/60 font-mono-label flex items-center gap-1">
          <Filter size={12} /> Filtros rápidos:
        </span>

        <button
          onClick={() => onFilterChange({ onlySuspicious: !filters.onlySuspicious })}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.onlySuspicious
              ? 'bg-error/20 border-error/40 text-error'
              : 'bg-surface-container-highest/40 border-white/5 text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <AlertTriangle size={12} /> Somente Suspeitas
        </button>

        <button
          onClick={() => onFilterChange({ onlyRegressive: !filters.onlyRegressive })}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.onlyRegressive
              ? 'bg-warning/20 border-warning/40 text-warning'
              : 'bg-surface-container-highest/40 border-white/5 text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <RefreshCw size={12} /> Somente Regressivas
        </button>

        <button
          onClick={() => onFilterChange({ onlyCorrected: !filters.onlyCorrected })}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.onlyCorrected
              ? 'bg-primary/20 border-primary/40 text-primary'
              : 'bg-surface-container-highest/40 border-white/5 text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <CheckCircle2 size={12} /> Somente Corrigidas
        </button>
      </div>
    </div>
  );
};
