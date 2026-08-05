import React from 'react';
import { Filter, Search, RotateCcw, BookmarkPlus } from 'lucide-react';
import type { ReportFilter, ReportQuickPeriod } from '../../types/report-filters';

interface ReportGlobalFiltersProps {
  filters: ReportFilter;
  onFilterChange: (newFilters: Partial<ReportFilter>) => void;
  onReset: () => void;
  onSaveFavorite?: () => void;
}

export const ReportGlobalFilters: React.FC<ReportGlobalFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSaveFavorite,
}) => {
  const quickPeriods: { id: ReportQuickPeriod; label: string }[] = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: 'mes_atual', label: 'Mês Atual' },
    { id: 'ano_atual', label: 'Ano Atual' },
  ];

  return (
    <div className="p-4 bg-surface-container-low/50 border-b border-white/10 space-y-3 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-on-surface text-[11px] font-mono-label">
          <Filter size={14} className="text-primary" /> Filtros & Período do Relatório
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {quickPeriods.map(qp => (
            <button
              key={qp.id}
              onClick={() => onFilterChange({ period: qp.id })}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                filters.period === qp.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container/60 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar nos resultados..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <select
            value={filters.status || ''}
            onChange={e => onFilterChange({ status: e.target.value || undefined })}
            className="w-full px-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface font-bold"
          >
            <option value="">Todos os Status</option>
            <option value="em_operacao">Em Operação</option>
            <option value="manutencao">Em Manutenção</option>
            <option value="disponivel">Disponível</option>
            <option value="parado">Parado</option>
            <option value="bloqueado">Bloqueado</option>
            <option value="concluido">Concluído</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>

        <div>
          <select
            value={filters.groupBy || 'nenhum'}
            onChange={e => onFilterChange({ groupBy: e.target.value as any })}
            className="w-full px-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface"
          >
            <option value="nenhum">Sem Agrupamento</option>
            <option value="equipamento">Agrupar por Equipamento</option>
            <option value="tipo">Agrupar por Tipo</option>
            <option value="unidade">Agrupar por Unidade</option>
            <option value="status">Agrupar por Status</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          {onSaveFavorite && (
            <button
              onClick={onSaveFavorite}
              className="px-3 py-1.5 bg-primary/15 text-primary hover:bg-primary/25 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookmarkPlus size={14} /> Salvar Favorito
            </button>
          )}
          <button
            onClick={onReset}
            className="px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
            title="Limpar filtros"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
