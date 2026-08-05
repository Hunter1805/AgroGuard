import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { MasterDataGroupType } from '../../types/master-data';

interface SearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedGroup: MasterDataGroupType | 'todos';
  onGroupChange: (group: MasterDataGroupType | 'todos') => void;
}

const GROUPS_FILTER: { key: MasterDataGroupType | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos os Grupos' },
  { key: 'organizacao', label: 'Organização' },
  { key: 'equipamentos', label: 'Equipamentos' },
  { key: 'manutencao', label: 'Manutenção' },
  { key: 'materiais_servicos', label: 'Materiais & Serviços' },
];

export const MasterDataSearch: React.FC<SearchProps> = ({
  query,
  onQueryChange,
  selectedGroup,
  onGroupChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Input de Busca Global */}
      <div className="relative flex-1 w-full">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar cadastro por nome, código, descrição..."
          className="w-full bg-surface-container-highest/60 border border-white/10 rounded-xl py-2 pl-9 pr-9 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 transition-all placeholder:text-on-surface-variant/40"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filtro por Grupo */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <Filter size={14} className="text-on-surface-variant/50 hidden sm:block flex-shrink-0" />
        {GROUPS_FILTER.map((g) => (
          <button
            key={g.key}
            onClick={() => onGroupChange(g.key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
              selectedGroup === g.key
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'bg-surface-container-highest/40 text-on-surface-variant border border-white/5 hover:bg-surface-container-highest hover:text-on-surface'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
};
