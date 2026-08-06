import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { MaintenancePlanFilterState } from '../../../types/maintenance-plan';
import { Button } from '../../ui/Button';

interface MaintenancePlanFiltersProps {
  filters: MaintenancePlanFilterState;
  onUpdateFilters: (filters: Partial<MaintenancePlanFilterState>) => void;
  onResetFilters: () => void;
}

export const MaintenancePlanFilters: React.FC<MaintenancePlanFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 flex flex-col md:flex-row items-center gap-3 justify-between rounded-xl shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Buscar plano por nome, código, máquina..."
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <div className="flex items-center gap-2 bg-[var(--color-surface-secondary)] px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-semibold whitespace-nowrap">
          <Filter className="w-3.5 h-3.5 text-[var(--color-brand)]" />
          <span>Tipo de Ativo:</span>
          <select
            value={filters.equipmentType}
            onChange={(e) => onUpdateFilters({ equipmentType: e.target.value })}
            className="bg-transparent text-[var(--color-text-primary)] font-bold focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="Trator">Trator</option>
            <option value="Colhedora">Colhedora</option>
            <option value="Implemento">Implemento</option>
            <option value="Caminhão">Caminhão / Veículo</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[var(--color-surface-secondary)] px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-semibold whitespace-nowrap">
          <span>Situação:</span>
          <select
            value={filters.status}
            onChange={(e) => onUpdateFilters({ status: e.target.value as any })}
            className="bg-transparent text-[var(--color-text-primary)] font-bold focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos in vigor</option>
            <option value="inativo">Inativos</option>
            <option value="arquivado">Arquivados</option>
          </select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          title="Limpar filtros"
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
