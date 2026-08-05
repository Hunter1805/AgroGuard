import React from 'react';
import { Gauge, ClockAlert, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { ReadingStats } from '../../../types/equipment-readings';

interface ReadingsStatsProps {
  stats: ReadingStats | null;
}

export const ReadingsStats: React.FC<ReadingsStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Leituras Registradas Hoje',
      value: stats?.readingsToday ?? 0,
      subtext: 'Apontamentos da frota',
      icon: <CheckCircle2 size={18} />,
      colorClass: 'text-success',
      bgClass: 'bg-success/5 border-success/20',
    },
    {
      label: 'Equipamentos s/ Leitura Recente',
      value: stats?.equipmentsOverdue ?? 0,
      subtext: 'Pendente há mais de 3 dias',
      icon: <ClockAlert size={18} />,
      colorClass: 'text-warning font-bold',
      bgClass: 'bg-warning/5 border-warning/20',
    },
    {
      label: 'Leituras Suspeitas',
      value: stats?.suspiciousReadings ?? 0,
      subtext: 'Fora do limite de utilização',
      icon: <AlertTriangle size={18} />,
      colorClass: 'text-error',
      bgClass: 'bg-error/5 border-error/20',
    },
    {
      label: 'Pendentes de Aprovação',
      value: stats?.pendingApproval ?? 0,
      subtext: 'Leituras regressivas ou retroativas',
      icon: <ShieldAlert size={18} />,
      colorClass: 'text-warning',
      bgClass: 'bg-warning/10 border-warning/30',
    },
    {
      label: 'Medidores Ativos',
      value: stats?.activeMeters ?? 0,
      subtext: 'Horímetros e Odômetros',
      icon: <Gauge size={18} />,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/5 border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-card rounded-xl p-3.5 flex flex-col justify-between border ${card.bgClass} transition-all`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-body-sm text-on-surface-variant/80 font-medium">
              {card.label}
            </span>
            <span className={card.colorClass}>{card.icon}</span>
          </div>

          <div className="mt-2 space-y-0.5">
            <p className={`font-title-md text-[20px] font-bold leading-tight ${card.colorClass}`}>
              {card.value}
            </p>
            <p className="text-[10px] text-on-surface-variant/60 truncate">
              {card.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
