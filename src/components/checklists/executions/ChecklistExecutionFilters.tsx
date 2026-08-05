import React from 'react';
import { Search, Filter, AlertCircle, Ban, X } from 'lucide-react';
import type { ChecklistExecutionFiltersState } from '../../../types/checklist';

interface ChecklistExecutionFiltersProps {
  filters: ChecklistExecutionFiltersState;
  onFilterChange: (newFilters: Partial<ChecklistExecutionFiltersState>) => void;
  onClear: () => void;
}

export const ChecklistExecutionFilters: React.FC<ChecklistExecutionFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const isFiltered =
    filters.search ||
    filters.type !== 'todos' ||
    filters.status !== 'todos' ||
    filters.onlyWithNonConformity ||
    filters.onlyBlockedEquipment;

  return (
    <div className="glass-card bg-surface-container-highest/50 border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Busca textual */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Buscar por código, placa, operador..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Seletores rápidos de Tipo e Status */}
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto text-[12px]">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-primary" />
            <span className="font-mono-label text-on-surface-variant/70 uppercase text-[11px]">Tipo:</span>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ type: e.target.value })}
              className="bg-surface-container border border-white/10 rounded-md px-2 py-1.5 text-on-surface focus:outline-none capitalize"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="seguranca">Segurança</option>
              <option value="pre_operacao">Pré-Operação</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono-label text-on-surface-variant/70 uppercase text-[11px]">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="bg-surface-container border border-white/10 rounded-md px-2 py-1.5 text-on-surface focus:outline-none"
            >
              <option value="todos">Todos os Status</option>
              <option value="em_andamento">Em Andamento (Rascunho)</option>
              <option value="concluido">Concluído sem Falhas</option>
              <option value="concluido_com_nao_conformidade">Com Não Conformidade</option>
              <option value="aguardando_validacao">Aguardando Validação</option>
              <option value="reprovado">Reprovado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toggles Rápidos de Auditoria */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyWithNonConformity}
              onChange={(e) => onFilterChange({ onlyWithNonConformity: e.target.checked })}
              className="rounded border-white/20 bg-surface-container text-error focus:ring-0"
            />
            <span className="text-error font-medium inline-flex items-center gap-1">
              <AlertCircle size={13} /> Apenas com Não Conformidade
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyBlockedEquipment}
              onChange={(e) => onFilterChange({ onlyBlockedEquipment: e.target.checked })}
              className="rounded border-white/20 bg-surface-container text-error focus:ring-0"
            />
            <span className="text-error font-bold inline-flex items-center gap-1">
              <Ban size={13} /> Ativos Bloqueados por Falha
            </span>
          </label>
        </div>

        {isFiltered && (
          <button
            onClick={onClear}
            className="text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 font-mono-label uppercase text-[10px]"
          >
            <X size={12} /> Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};
