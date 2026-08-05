import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { StockItemFilter, StockItemType, StockItemStatus } from '../../types/parts';
import { Button } from '../ui/Button';

interface StockFiltersProps {
  filters: StockItemFilter;
  onFilterChange: (newFilters: Partial<StockItemFilter>) => void;
  onReset: () => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="p-4 bg-surface-container-low/50 border-b border-white/10 space-y-3 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-on-surface text-[11px] font-mono-label mb-1">
        <Filter size={14} className="text-primary" /> Filtros e Busca no Estoque
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por código, nome, marca ou código de barras..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface focus:outline-none focus:border-primary/50 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.type || 'todos'}
            onChange={e => onFilterChange({ type: e.target.value as StockItemType | 'todos' })}
            className="px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface text-xs"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="peca">Peça de Reposição</option>
            <option value="filtro">Filtro</option>
            <option value="oleo">Óleo Lubrificante</option>
            <option value="graxa">Graxa</option>
            <option value="fluido">Fluido</option>
            <option value="combustivel_auxiliar">Combustível Auxiliar</option>
            <option value="material_consumo">Material de Consumo</option>
            <option value="componente_eletrico">Componente Elétrico</option>
            <option value="componente_hidraulico">Componente Hidráulico</option>
            <option value="item_seguranca">EPI / Segurança</option>
          </select>

          <select
            value={filters.status || 'todos'}
            onChange={e => onFilterChange({ status: e.target.value as StockItemStatus | 'todos' })}
            className="px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface text-xs"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="estoque_baixo">Estoque Baixo</option>
            <option value="sem_estoque">Sem Estoque</option>
            <option value="bloqueado">Bloqueado</option>
          </select>

          <Button variant="outline" size="sm" onClick={onReset} className="flex items-center gap-1">
            <RotateCcw size={14} /> Limpar
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-label pt-1 border-t border-white/5">
        <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
          <input
            type="checkbox"
            checked={Boolean(filters.belowMinimumOnly)}
            onChange={e => onFilterChange({ belowMinimumOnly: e.target.checked })}
            className="rounded bg-surface-container border-white/10 text-amber-500"
          />
          Abaixo do Mínimo
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
          <input
            type="checkbox"
            checked={Boolean(filters.outOfStockOnly)}
            onChange={e => onFilterChange({ outOfStockOnly: e.target.checked })}
            className="rounded bg-surface-container border-white/10 text-rose-500"
          />
          Sem Estoque
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-blue-400">
          <input
            type="checkbox"
            checked={Boolean(filters.hasReservationsOnly)}
            onChange={e => onFilterChange({ hasReservationsOnly: e.target.checked })}
            className="rounded bg-surface-container border-white/10 text-blue-500"
          />
          Com Reserva
        </label>
      </div>
    </div>
  );
};
