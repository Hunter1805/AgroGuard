import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { MasterDataStatus } from '../../types/master-data';

interface MasterDataFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: MasterDataStatus | 'todos';
  onStatusChange: (status: MasterDataStatus | 'todos') => void;
  hasLinksFilter: 'todos' | 'com_vinculos' | 'sem_vinculos';
  onHasLinksChange: (val: 'todos' | 'com_vinculos' | 'sem_vinculos') => void;
}

export const MasterDataFilters: React.FC<MasterDataFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  hasLinksFilter,
  onHasLinksChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between glass-card p-3 rounded-xl border border-white/10">
      {/* Input de Busca */}
      <div className="relative flex-1 w-full">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por código, nome ou descrição..."
          className="w-full bg-surface-container-highest/60 border border-white/10 rounded-lg py-1.5 pl-9 pr-8 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Selects de Status e Vínculos */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-1">
          <Filter size={14} className="text-on-surface-variant/50 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as MasterDataStatus | 'todos')}
            className="bg-surface-container-highest/60 border border-white/10 rounded-lg py-1.5 px-2.5 text-[12px] text-on-surface focus:outline-none focus:border-primary/50"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
            <option value="arquivado">Arquivados</option>
          </select>
        </div>

        <select
          value={hasLinksFilter}
          onChange={(e) => onHasLinksChange(e.target.value as any)}
          className="bg-surface-container-highest/60 border border-white/10 rounded-lg py-1.5 px-2.5 text-[12px] text-on-surface focus:outline-none focus:border-primary/50"
        >
          <option value="todos">Todos os Vínculos</option>
          <option value="com_vinculos">Com Vínculos</option>
          <option value="sem_vinculos">Sem Vínculos</option>
        </select>
      </div>
    </div>
  );
};
