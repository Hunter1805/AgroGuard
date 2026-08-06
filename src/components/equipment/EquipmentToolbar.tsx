import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, Table, Download, X } from 'lucide-react';
import type { EquipmentStatus, AssetType } from '../../types/equipment';

export interface EquipmentToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  status: EquipmentStatus | 'todos';
  onStatusChange: (val: EquipmentStatus | 'todos') => void;
  location: string;
  onLocationChange: (val: string) => void;
  locationsList: string[];
  assetType: AssetType | 'todos';
  onAssetTypeChange: (val: AssetType | 'todos') => void;
  hasPendingAlert: boolean;
  onHasPendingAlertChange: (val: boolean) => void;
  isReadingOverdue: boolean;
  onIsReadingOverdueChange: (val: boolean) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onClearFilters: () => void;
  visibleColumns?: string[];
  onToggleColumn?: (colKey: string) => void;
}

export const EquipmentToolbar: React.FC<EquipmentToolbarProps> = ({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  location,
  onLocationChange,
  locationsList,
  assetType,
  onAssetTypeChange,
  hasPendingAlert,
  onHasPendingAlertChange,
  isReadingOverdue,
  onIsReadingOverdueChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const [, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sincronizar filtros com a URL (query parameters)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (status !== 'todos') params.set('status', status);
    if (location !== 'todas') params.set('loc', location);
    if (assetType !== 'todos') params.set('tipo', assetType);
    if (hasPendingAlert) params.set('alert', 'true');
    if (isReadingOverdue) params.set('readingOverdue', 'true');

    setSearchParams(params, { replace: true });
  }, [searchTerm, status, location, assetType, hasPendingAlert, isReadingOverdue, setSearchParams]);

  // Contagem de filtros ativos (além da busca e view)
  const activeCount = [
    status !== 'todos',
    location !== 'todas',
    assetType !== 'todos',
    hasPendingAlert,
    isReadingOverdue,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Barra principal de ferramentas */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px] flex-wrap">
          {/* Campo de Busca */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-3 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, código ou patrimônio…"
              className="w-full pl-8 pr-3 h-10 text-[13px] rounded-md border"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Select Status */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as EquipmentStatus | 'todos')}
            className="h-10 px-3 text-[13px] rounded-md border cursor-pointer select-none"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="todos">Status: Todos</option>
            <option value="operante">Operante</option>
            <option value="em_operacao">Em Operação</option>
            <option value="manutencao">Em Manutenção</option>
            <option value="parado">Parado</option>
            <option value="bloqueado">Bloqueado</option>
            <option value="inoperante">Inoperante</option>
          </select>

          {/* Select Localização */}
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="h-10 px-3 text-[13px] rounded-md border cursor-pointer select-none"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="todas">Localização: Todas</option>
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Botão Mais Filtros */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="h-10 px-3 text-[13px] rounded-md border inline-flex items-center gap-2 cursor-pointer font-medium"
            style={{
              borderColor: activeCount > 0 ? 'var(--color-brand)' : 'var(--color-border)',
              backgroundColor: activeCount > 0 ? 'var(--color-brand-light)' : 'var(--color-surface)',
              color: activeCount > 0 ? 'var(--color-brand)' : 'var(--color-text-primary)',
            }}
          >
            <SlidersHorizontal size={14} />
            Mais filtros
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center bg-[var(--color-brand)]">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Lado Direito: Exportar & Visualização */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botão Exportar */}
          <button
            type="button"
            className="h-10 px-3 text-[13px] rounded-md border inline-flex items-center gap-2 cursor-pointer"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Download size={14} />
            Exportar
          </button>

          {/* Seletor de Modo de Visualização */}
          <div
            className="flex items-center p-0.5 rounded-md border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)',
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Visualização em tabela (Padrão)"
              aria-label="Tabela"
              className="p-1.5 rounded text-[13px] cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--color-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-brand)' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Table size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Visualização em cards"
              aria-label="Cards"
              className="p-1.5 rounded text-[13px] cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--color-surface)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--color-brand)' : 'var(--color-text-muted)',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Chips de Filtros Ativos */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-[12px]">
          <span className="text-[var(--color-text-muted)]">Filtros aplicados:</span>

          {status !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
              Status: {status}
              <X size={12} className="cursor-pointer hover:text-[var(--color-danger)]" onClick={() => onStatusChange('todos')} />
            </span>
          )}

          {location !== 'todas' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
              Local: {location}
              <X size={12} className="cursor-pointer hover:text-[var(--color-danger)]" onClick={() => onLocationChange('todas')} />
            </span>
          )}

          {assetType !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
              Tipo: {assetType}
              <X size={12} className="cursor-pointer hover:text-[var(--color-danger)]" onClick={() => onAssetTypeChange('todos')} />
            </span>
          )}

          {hasPendingAlert && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-danger-light)] border border-[var(--color-danger)] text-[var(--color-danger)] font-medium">
              Apenas com alertas
              <X size={12} className="cursor-pointer" onClick={() => onHasPendingAlertChange(false)} />
            </span>
          )}

          {isReadingOverdue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-warning-light)] border border-[var(--color-warning)] text-[var(--color-warning)] font-medium">
              Leitura pendente
              <X size={12} className="cursor-pointer" onClick={() => onIsReadingOverdueChange(false)} />
            </span>
          )}

          <button
            type="button"
            onClick={onClearFilters}
            className="text-[var(--color-brand)] font-medium hover:underline ml-1 cursor-pointer"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Drawer de Filtros Avançados ("Mais filtros") */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed right-0 top-0 h-screen w-80 bg-[var(--color-surface)] border-l border-[var(--color-border)] z-50 p-6 flex flex-col justify-between animate-slide-in-right"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-4">
                <h3 className="font-semibold text-[16px]">Filtros avançados</h3>
                <button type="button" onClick={() => setDrawerOpen(false)} className="p-1 rounded cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-[13px]">
                <div>
                  <label className="block font-medium mb-1 text-[var(--color-text-secondary)]">Tipo de Ativo</label>
                  <select
                    value={assetType}
                    onChange={(e) => onAssetTypeChange(e.target.value as AssetType | 'todos')}
                    className="w-full h-10 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="proprio">Próprio</option>
                    <option value="terceiro">Terceiro</option>
                    <option value="alugado">Alugado</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPendingAlert}
                      onChange={(e) => onHasPendingAlertChange(e.target.checked)}
                      className="rounded accent-[var(--color-brand)]"
                    />
                    Apenas equipamentos com alertas
                  </label>

                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isReadingOverdue}
                      onChange={(e) => onIsReadingOverdueChange(e.target.checked)}
                      className="rounded accent-[var(--color-brand)]"
                    />
                    Apenas com leitura atrasada
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => { onClearFilters(); setDrawerOpen(false); }}
                className="text-[var(--color-text-secondary)] hover:underline font-medium text-[13px] cursor-pointer"
              >
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 h-10 rounded-md bg-[var(--color-brand)] text-white text-[13px] font-medium cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
