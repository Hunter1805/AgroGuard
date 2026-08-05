import React from 'react';
import { Search, X, LayoutGrid, LayoutList, Plus, Filter } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { MaintenanceSituation } from '../../types/equipment';

interface EquipmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  assetType: string;
  onAssetTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  locationsList: string[];
  maintenanceStatus: MaintenanceSituation;
  onMaintenanceStatusChange: (status: MaintenanceSituation) => void;
  hasPendingAlert: boolean;
  onHasPendingAlertChange: (val: boolean) => void;
  isReadingOverdue: boolean;
  onIsReadingOverdueChange: (val: boolean) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onNewEquipment: () => void;
  onClearFilters: () => void;
}

const ASSET_TYPES = [
  { id: 'todos', label: 'Todos os Tipos' },
  { id: 'Trator', label: 'Tratores' },
  { id: 'Colhedora', label: 'Colhedoras' },
  { id: 'Caminhão', label: 'Caminhões' },
  { id: 'Implemento', label: 'Implementos' },
  { id: 'Veículo', label: 'Veículos' },
  { id: 'Moto', label: 'Motos' },
];

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Status Operacional' },
  { value: 'operante', label: 'Operante' },
  { value: 'em_operacao', label: 'Em Operação' },
  { value: 'manutencao', label: 'Em Manutenção' },
  { value: 'parado', label: 'Parado / Inoperante' },
  { value: 'bloqueado', label: 'Bloqueado' },
];

const MAINTENANCE_SITUATION_OPTIONS = [
  { value: 'todas', label: 'Situação Manutenção' },
  { value: 'vencida', label: 'Vencida' },
  { value: 'proxima', label: 'Próxima do Vencimento' },
  { value: 'em_dia', label: 'Em Dia' },
];

export const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  assetType,
  onAssetTypeChange,
  status,
  onStatusChange,
  location,
  onLocationChange,
  locationsList,
  maintenanceStatus,
  onMaintenanceStatusChange,
  hasPendingAlert,
  onHasPendingAlertChange,
  isReadingOverdue,
  onIsReadingOverdueChange,
  viewMode,
  onViewModeChange,
  onNewEquipment,
  onClearFilters,
}) => {
  const locationOptions = [
    { value: 'todas', label: 'Todas Localizações' },
    ...locationsList.map((loc) => ({ value: loc, label: loc })),
  ];

  const hasActiveFilters =
    assetType !== 'todos' ||
    status !== 'todos' ||
    location !== 'todas' ||
    maintenanceStatus !== 'todas' ||
    hasPendingAlert ||
    isReadingOverdue ||
    searchTerm !== '';

  return (
    <div className="space-y-3">
      {/* Abas por tipo de ativo */}
      <div className="flex items-center gap-1 border-b border-white/8 pb-0 overflow-x-auto">
        {ASSET_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onAssetTypeChange(t.id)}
            className={`px-3.5 py-2 text-[12px] font-medium whitespace-nowrap border-b-2 transition-all -mb-px cursor-pointer ${
              assetType === t.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Linha 1 de filtros e busca */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Campo de Busca */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar código, nome, marca, patrimônio..."
              className="w-full bg-surface-container-highest border border-white/10 rounded-md pl-8 pr-8 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Select Status Operacional */}
          <div className="w-40">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={onStatusChange}
              placeholder=""
            />
          </div>

          {/* Select Situação de Manutenção */}
          <div className="w-44">
            <Select
              options={MAINTENANCE_SITUATION_OPTIONS}
              value={maintenanceStatus}
              onChange={(val) => onMaintenanceStatusChange(val as MaintenanceSituation)}
              placeholder=""
            />
          </div>

          {/* Select Localização */}
          {locationsList.length > 0 && (
            <div className="w-40">
              <Select
                options={locationOptions}
                value={location}
                onChange={onLocationChange}
                placeholder=""
              />
            </div>
          )}
        </div>

        {/* Alternador de visualização & Botão Novo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-highest/60 border border-white/10 rounded-md p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              title="Visualização em Tabela"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface-container text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutList size={15} />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              title="Visualização em Cards"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-surface-container text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onNewEquipment}>
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Linha 2 de toggles rápidos: Alertas Pendentes e Leitura Atrasada */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-on-surface-variant/60 flex items-center gap-1 mr-1 font-mono-label">
            <Filter size={11} /> Filtros Rápidos:
          </span>
          <button
            onClick={() => onHasPendingAlertChange(!hasPendingAlert)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              hasPendingAlert
                ? 'bg-error/15 border-error/40 text-error font-semibold'
                : 'bg-surface-container-highest/40 border-white/5 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasPendingAlert ? 'bg-error animate-ping' : 'bg-on-surface-variant/40'}`} />
            Alertas Críticos
          </button>

          <button
            onClick={() => onIsReadingOverdueChange(!isReadingOverdue)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              isReadingOverdue
                ? 'bg-warning/15 border-warning/40 text-warning font-semibold'
                : 'bg-surface-container-highest/40 border-white/5 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isReadingOverdue ? 'bg-warning' : 'bg-on-surface-variant/40'}`} />
            Leitura Atrasada (&gt;3 dias)
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> Limpar Todos os Filtros
          </button>
        )}
      </div>
    </div>
  );
};
