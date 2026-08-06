import React from 'react';
import type { EquipmentStats as StatsType } from '../../types/equipment';

export interface EquipmentStatsBarProps {
  stats: StatsType | null;
}

export const EquipmentStatsBar: React.FC<EquipmentStatsBarProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div
      className="flex items-center gap-4 flex-wrap text-[13px] py-1 select-none"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      <span className="font-medium">
        <strong style={{ color: 'var(--color-text-primary)' }}>{stats.total}</strong> equipamentos
      </span>

      <span style={{ color: 'var(--color-border)' }}>•</span>

      <span className="flex items-center gap-1.5 font-medium">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-success)' }}
        />
        <strong style={{ color: 'var(--color-text-primary)' }}>{stats.operantes}</strong> operantes
      </span>

      <span style={{ color: 'var(--color-border)' }}>•</span>

      <span className="flex items-center gap-1.5 font-medium">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-warning)' }}
        />
        <strong style={{ color: 'var(--color-text-primary)' }}>{stats.emManutencao}</strong> em manutenção
      </span>

      <span style={{ color: 'var(--color-border)' }}>•</span>

      <span className="flex items-center gap-1.5 font-medium">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-danger)' }}
        />
        <strong style={{ color: 'var(--color-text-primary)' }}>{stats.alertasPendentes}</strong> com alertas
      </span>
    </div>
  );
};
