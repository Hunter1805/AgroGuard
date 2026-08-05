import React from 'react';
import {
  Tractor,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  PlayCircle,
  ClockAlert,
  AlertCircle,
} from 'lucide-react';
import type { EquipmentStats as StatsType } from '../../types/equipment';

interface EquipmentStatsProps {
  stats: StatsType | null;
}

export const EquipmentStats: React.FC<EquipmentStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total da Frota',
      value: stats.total,
      icon: <Tractor size={18} />,
      colorClass: 'text-on-surface',
      borderClass: 'border-l-white/20',
      bgClass: 'bg-surface-container-highest/30',
    },
    {
      label: 'Operantes',
      value: stats.operantes,
      icon: <CheckCircle2 size={18} />,
      colorClass: 'text-success',
      borderClass: 'border-l-success/60',
      bgClass: 'bg-success/5',
    },
    {
      label: 'Em Operação',
      value: stats.emOperacao,
      icon: <PlayCircle size={18} />,
      colorClass: 'text-primary',
      borderClass: 'border-l-primary/60',
      bgClass: 'bg-primary/5',
    },
    {
      label: 'Em Manutenção',
      value: stats.emManutencao,
      icon: <Wrench size={18} />,
      colorClass: 'text-warning',
      borderClass: 'border-l-warning/60',
      bgClass: 'bg-warning/5',
    },
    {
      label: 'Manutenções Vencidas',
      value: stats.manutencoesVencidas,
      icon: <ClockAlert size={18} />,
      colorClass: 'text-error font-bold',
      borderClass: 'border-l-error/80',
      bgClass: 'bg-error/10',
    },
    {
      label: 'Alertas Críticos',
      value: stats.alertasPendentes,
      icon: <AlertCircle size={18} />,
      colorClass: 'text-error',
      borderClass: 'border-l-error/60',
      bgClass: 'bg-error/5',
    },
    {
      label: 'Parados / Bloqueados',
      value: stats.parados + stats.bloqueados,
      icon: <ShieldAlert size={18} />,
      colorClass: 'text-warning',
      borderClass: 'border-l-warning/70',
      bgClass: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-card rounded-xl p-3.5 flex flex-col justify-between border-l-2 ${card.borderClass} ${card.bgClass}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-body-sm text-on-surface-variant/80 font-medium">
              {card.label}
            </span>
            <span className={card.colorClass}>{card.icon}</span>
          </div>
          <p className={`font-title-md text-[24px] font-bold leading-none mt-2 ${card.colorClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};
