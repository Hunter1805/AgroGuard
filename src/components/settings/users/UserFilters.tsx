import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { UserStatus } from '../../../types/users';

interface UserFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: UserStatus | 'todos';
  onStatusChange: (status: UserStatus | 'todos') => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-card p-3 rounded-xl border border-white/10">
      <div className="relative flex-1 w-full">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nome, e-mail ou matrícula..."
          className="w-full bg-surface-container-highest/60 border border-white/10 rounded-lg py-1.5 pl-9 pr-8 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40"
        />
        {query && (
          <button onClick={() => onQueryChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter size={14} className="text-on-surface-variant/50 hidden sm:block" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as any)}
          className="bg-surface-container-highest/60 border border-white/10 rounded-lg py-1.5 px-3 text-[12px] text-on-surface focus:outline-none focus:border-primary/50"
        >
          <option value="todos">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="bloqueado">Bloqueados</option>
          <option value="convite_pendente">Convite Pendente</option>
          <option value="inativo">Inativos</option>
          <option value="arquivado">Arquivados</option>
        </select>
      </div>
    </div>
  );
};
