import React from 'react';
import { Database, Building2, Truck, MapPin, Cpu, Settings, AlertCircle, Link } from 'lucide-react';

interface StatsProps {
  stats: {
    totalCategories: number;
    totalActiveRecords: number;
    activeSuppliersCount: number;
    registeredLocationsCount: number;
    equipmentModelsCount: number;
    maintenanceSystemsCount: number;
    pendingRecordsCount?: number;
    linkedRecordsCount?: number;
  };
  loading?: boolean;
}

export const MasterDataOverviewStats: React.FC<StatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl border border-white/10 p-3 h-20 bg-surface-container-high/40" />
        ))}
      </div>
    );
  }

  const STAT_ITEMS = [
    { label: 'Cadastros Ativos', value: stats.totalActiveRecords, icon: Database, color: 'text-primary' },
    { label: 'Fornecedores Ativos', value: stats.activeSuppliersCount, icon: Truck, color: 'text-secondary' },
    { label: 'Localizações', value: stats.registeredLocationsCount, icon: MapPin, color: 'text-tertiary' },
    { label: 'Modelos Frota', value: stats.equipmentModelsCount, icon: Cpu, color: 'text-accent' },
    { label: 'Sistemas Manutenção', value: stats.maintenanceSystemsCount, icon: Settings, color: 'text-info' },
    { label: 'Categorias Totais', value: stats.totalCategories, icon: Building2, color: 'text-on-surface' },
    { label: 'Com Pendências', value: stats.pendingRecordsCount ?? 0, icon: AlertCircle, color: 'text-warning' },
    { label: 'Com Vínculos', value: stats.linkedRecordsCount ?? 0, icon: Link, color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {STAT_ITEMS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="glass-card rounded-xl border border-white/10 p-3 hover:border-primary/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-on-surface-variant/70 uppercase tracking-wider line-clamp-1">
                {item.label}
              </span>
              <Icon size={14} className={item.color} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[20px] font-bold text-on-surface font-mono-label">
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
