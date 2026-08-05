import React from 'react';
import { AlertTriangle, AlertCircle, Info, ArrowDown, Flame } from 'lucide-react';

export type Priority = 'Informativo' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';

const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  className: string;
  icon: React.ReactNode;
}> = {
  Informativo: {
    label: 'Informativo',
    className: 'bg-surface-container-highest text-on-surface-variant border-white/10',
    icon: <Info size={10} />,
  },
  Baixo: {
    label: 'Baixo',
    className: 'bg-success/10 text-success border-success/20',
    icon: <ArrowDown size={10} />,
  },
  Médio: {
    label: 'Médio',
    className: 'bg-warning/10 text-warning border-warning/20',
    icon: <AlertCircle size={10} />,
  },
  Alto: {
    label: 'Alto',
    className: 'bg-error/10 text-error border-error/20',
    icon: <AlertTriangle size={10} />,
  },
  Crítico: {
    label: 'Crítico',
    className: 'bg-error/15 text-error border-error/30 font-bold',
    icon: <Flame size={10} />,
  },
};

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'sm',
}) => {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Informativo;

  const sizeClass = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-[11px] px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-mono-label font-medium whitespace-nowrap ${sizeClass} ${config.className}`}>
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};
