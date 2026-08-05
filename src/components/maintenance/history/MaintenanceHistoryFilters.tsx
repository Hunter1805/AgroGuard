import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { MaintenanceHistoryFilterState } from '../../../types/maintenance-schedule';
import { Button } from '../../ui/Button';

interface MaintenanceHistoryFiltersProps {
  filters: MaintenanceHistoryFilterState;
  onUpdateFilters: (up: Partial<MaintenanceHistoryFilterState>) => void;
  onResetFilters: () => void;
}

export const MaintenanceHistoryFilters: React.FC<MaintenanceHistoryFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  return (
    <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar protocolo, máquina, plano..."
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={filters.onlyWithOrder || false}
            onChange={(e) => onUpdateFilters({ onlyWithOrder: e.target.checked })}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span>Somente Com Ordem (OS)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-rose-600 dark:text-rose-400">
          <input
            type="checkbox"
            checked={filters.onlyWithDelay || false}
            onChange={(e) => onUpdateFilters({ onlyWithDelay: e.target.checked })}
            className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
          />
          <span>Somente Com Atraso na Tolerância</span>
        </label>

        <Button variant="ghost" size="sm" onClick={onResetFilters} title="Limpar filtros do histórico" className="rounded-xl text-gray-400 hover:text-gray-700">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
