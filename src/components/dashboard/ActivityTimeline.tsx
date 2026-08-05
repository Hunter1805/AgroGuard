import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor, Gauge, CheckSquare, AlertTriangle,
  ClipboardList, Wrench, Package, Shield, Hammer,
  ArrowRight,
} from 'lucide-react';
import type { DashboardActivity } from '../../types/dashboard';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';

interface ActivityTimelineProps {
  activities: DashboardActivity[];
  loading?: boolean;
}

type ActivityType = DashboardActivity['type'];

const ACTIVITY_CONFIG: Record<ActivityType, {
  icon: React.ReactNode;
  colorClass: string;
  dotClass: string;
}> = {
  equipment_registered: {
    icon: <Tractor size={13} />,
    colorClass: 'text-primary border-primary/30 bg-primary/10',
    dotClass: 'bg-primary',
  },
  reading_recorded: {
    icon: <Gauge size={13} />,
    colorClass: 'text-on-surface-variant border-white/20 bg-surface-container-highest',
    dotClass: 'bg-on-surface-variant',
  },
  checklist_completed: {
    icon: <CheckSquare size={13} />,
    colorClass: 'text-success border-success/30 bg-success/10',
    dotClass: 'bg-success',
  },
  nonconformity_detected: {
    icon: <AlertTriangle size={13} />,
    colorClass: 'text-error border-error/30 bg-error/10',
    dotClass: 'bg-error',
  },
  order_opened: {
    icon: <ClipboardList size={13} />,
    colorClass: 'text-warning border-warning/30 bg-warning/10',
    dotClass: 'bg-warning',
  },
  maintenance_started: {
    icon: <Wrench size={13} />,
    colorClass: 'text-primary border-primary/30 bg-primary/10',
    dotClass: 'bg-primary',
  },
  part_used: {
    icon: <Package size={13} />,
    colorClass: 'text-on-surface-variant border-white/20 bg-surface-container-highest',
    dotClass: 'bg-on-surface-variant',
  },
  equipment_released: {
    icon: <Shield size={13} />,
    colorClass: 'text-success border-success/30 bg-success/10',
    dotClass: 'bg-success',
  },
  tool_borrowed: {
    icon: <Hammer size={13} />,
    colorClass: 'text-warning border-warning/20 bg-warning/5',
    dotClass: 'bg-warning',
  },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}

const ActivityItem: React.FC<{ activity: DashboardActivity; isLast: boolean }> = ({
  activity, isLast,
}) => {
  const navigate = useNavigate();
  const cfg = ACTIVITY_CONFIG[activity.type];

  return (
    <div className="flex gap-3 relative">
      {/* Linha vertical */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/5" />
      )}

      {/* Ícone */}
      <div className="shrink-0 mt-0.5">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${cfg.colorClass}`}>
          {cfg.icon}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 pb-3 min-w-0 group">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-on-surface leading-tight">{activity.title}</p>
            {activity.description && (
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5 line-clamp-1">{activity.description}</p>
            )}
            {activity.userName && (
              <p className="text-[10px] text-on-surface-variant/40 font-mono-label mt-0.5">por {activity.userName}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-on-surface-variant/40 font-mono-label whitespace-nowrap">
              {formatRelative(activity.createdAt)}
            </span>
            {activity.targetRoute && (
              <button
                onClick={() => navigate(activity.targetRoute!)}
                className="text-[10px] text-primary opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity cursor-pointer"
              >
                Ver <ArrowRight size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, loading }) => {
  return (
    <div className="glass-card rounded-xl flex flex-col border-white/5">
      <div className="p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Atividade Recente</h3>
        <p className="text-[11px] text-on-surface-variant/60 mt-0.5">Últimos eventos registrados no sistema</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-80">
        {loading ? (
          <LoadingState message="Carregando atividades..." />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="Nenhuma atividade registrada"
            description="O histórico de atividades aparecerá aqui."
          />
        ) : (
          <div>
            {activities.map((act, idx) => (
              <ActivityItem key={act.id} activity={act} isLast={idx === activities.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
