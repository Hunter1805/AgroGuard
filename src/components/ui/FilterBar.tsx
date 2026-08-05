import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  resultCount?: number;
  className?: string;
  showFilterIcon?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters,
  actions,
  resultCount,
  className = '',
  showFilterIcon = false,
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Campo de busca */}
        {onSearchChange !== undefined && (
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none"
            />
            <input
              type="text"
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-surface-container-highest border border-white/10 rounded-md pl-8 pr-8 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {searchValue && searchValue.length > 0 && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Ícone de filtros avançados */}
        {showFilterIcon && (
          <button className="p-2 rounded-md border border-white/10 bg-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            <SlidersHorizontal size={15} />
          </button>
        )}

        {/* Filtros passados como children */}
        {filters}

        {/* Ações (botões de ação como criar, exportar) */}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>

      {/* Contagem de resultados */}
      {resultCount !== undefined && (
        <p className="text-[12px] text-on-surface-variant/60 font-mono-label">
          {resultCount} {resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      )}
    </div>
  );
};
