import React from 'react';
import { Gauge, Calendar, ClipboardList, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import type { Equipment } from '../../../types/equipment';
import type { EquipmentDetailSummary } from '../../../types/equipment-detail';

interface EquipmentSummaryCardsProps {
  equipment: Equipment;
  summary: EquipmentDetailSummary | null;
}

export const EquipmentSummaryCards: React.FC<EquipmentSummaryCardsProps> = ({
  equipment,
  summary,
}) => {
  const unit = equipment.meterType === 'odometro' ? 'km' : 'h';
  const currentMeterText = `${equipment.currentHours.toLocaleString('pt-BR')} ${unit}`;

  const cards = [
    {
      label: 'Leitura Atual',
      value: currentMeterText,
      subtext: summary?.lastReadingText || 'Sem registro hoje',
      icon: <Gauge size={18} />,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/5 border-primary/20',
    },
    {
      label: 'Próxima Manutenção',
      value: equipment.nextMaintenanceDate || '—',
      subtext: equipment.maintenanceStatus === 'vencida' ? 'Manutenção Vencida!' : 'No prazo',
      icon: <Calendar size={18} />,
      colorClass: equipment.maintenanceStatus === 'vencida' ? 'text-error font-bold' : 'text-warning',
      bgClass: equipment.maintenanceStatus === 'vencida' ? 'bg-error/10 border-error/30' : 'bg-warning/5 border-warning/20',
    },
    {
      label: 'OS Abertas',
      value: summary?.openOrders ?? 0,
      subtext: 'Em andamento na oficina',
      icon: <ClipboardList size={18} />,
      colorClass: 'text-on-surface',
      bgClass: 'bg-surface-container-highest/30 border-white/10',
    },
    {
      label: 'Alertas Pendentes',
      value: summary?.pendingAlerts ?? 0,
      subtext: 'Requer atenção operacional',
      icon: <AlertTriangle size={18} />,
      colorClass: summary?.pendingAlerts ? 'text-error' : 'text-success',
      bgClass: summary?.pendingAlerts ? 'bg-error/5 border-error/20' : 'bg-success/5 border-success/20',
    },
    {
      label: 'Último Checklist',
      value: summary?.lastChecklistText || 'Concluído com Sucesso',
      subtext: '0 não conformidades',
      icon: <CheckCircle2 size={18} />,
      colorClass: 'text-success',
      bgClass: 'bg-success/5 border-success/20',
    },
    {
      label: 'Disponibilidade Operacional',
      value: `${summary?.availabilityPercent ?? 94}%`,
      subtext: 'Acumulado nos últimos 30 dias',
      icon: <Activity size={18} />,
      colorClass: (summary?.availabilityPercent ?? 94) > 80 ? 'text-success' : 'text-warning',
      bgClass: 'bg-surface-container-highest/30 border-white/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
            <p className={`font-title-md text-[18px] font-bold leading-tight ${card.colorClass}`}>
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
