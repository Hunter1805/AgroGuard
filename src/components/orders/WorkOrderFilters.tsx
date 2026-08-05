import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

export const WorkOrderFilters: React.FC = () => {
  return (
    <div className="p-4 border-b border-white/10 flex flex-wrap gap-3 items-center bg-surface-container-high/30">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input 
          type="text" 
          placeholder="Buscar OS, equipamento ou sintoma..." 
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        />
      </div>
      
      <select className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none">
        <option value="">Status: Todos</option>
        <option value="aberta">Abertas</option>
        <option value="em_execucao">Em Execução</option>
        <option value="pausada">Pausadas</option>
        <option value="encerrada">Encerradas</option>
      </select>

      <select className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none">
        <option value="">Prioridade: Todas</option>
        <option value="critica">Crítica</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
      </select>
      
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Filter size={16} /> Mais Filtros
      </Button>
    </div>
  );
};
