import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, ArrowRight, Flame, AlertTriangle,
  AlertCircle, Info, Eye, ClipboardList,
  Gauge, CalendarClock, CheckCircle2,
} from 'lucide-react';
import type { DashboardAlert, AlertPriority } from '../../types/dashboard';
import { ROUTES } from '../../types/routes';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';

interface AlertsCentralProps {
  alerts: DashboardAlert[];
  loading?: boolean;
}

// ── Configurações visuais de prioridade ──────────────────────────────────────
const PRIORITY_CONFIG: Record<AlertPriority, {
  icon: React.ReactNode;
  label: string;
  rowClass: string;
  badgeClass: string;
}> = {
  critica: {
    icon: <Flame size={14} />,
    label: 'Crítico',
    rowClass: 'border-l-error bg-error/5',
    badgeClass: 'bg-error/15 text-error border-error/30',
  },
  alta: {
    icon: <AlertTriangle size={14} />,
    label: 'Alto',
    rowClass: 'border-l-error/60 bg-error/3',
    badgeClass: 'bg-error/10 text-error border-error/20',
  },
  media: {
    icon: <AlertCircle size={14} />,
    label: 'Médio',
    rowClass: 'border-l-warning/60',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
  },
  baixa: {
    icon: <Info size={14} />,
    label: 'Baixo',
    rowClass: 'border-l-success/40',
    badgeClass: 'bg-success/10 text-success border-success/20',
  },
  informativo: {
    icon: <Info size={14} />,
    label: 'Informativo',
    rowClass: 'border-l-white/10',
    badgeClass: 'bg-surface-container-highest text-on-surface-variant border-white/10',
  },
};

// ── Ícone por tipo de alerta ──────────────────────────────────────────────────
function getTypeIcon(type: string): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    'Manutenção': <CalendarClock size={13} />,
    'Checklist': <CheckCircle2 size={13} />,
    'Falha': <AlertTriangle size={13} />,
    'Pneus': <Gauge size={13} />,
    'Ordem de Serviço': <ClipboardList size={13} />,
    'Leitura': <Eye size={13} />,
  };
  return map[type] ?? <AlertCircle size={13} />;
}

function formatDue(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return `${Math.abs(diffDays)}d em atraso`;
  if (diffDays === 0) return 'Hoje';
  return `${diffDays}d restantes`;
}

// ── Componente de alerta individual ──────────────────────────────────────────
const AlertRow: React.FC<{ alert: DashboardAlert }> = ({ alert }) => {
  const navigate = useNavigate();
  const cfg = PRIORITY_CONFIG[alert.priority];

  const handleAction = () => {
    navigate(alert.targetRoute ?? ROUTES.ALERTAS);
  };

  return (
    <div
      className={`flex items-start gap-3 border-l-2 pl-3 py-2.5 rounded-r-md hover:bg-surface-container-highest/30 transition-all group ${cfg.rowClass}`}
    >
      {/* Ícone de prioridade */}
      <div className={`shrink-0 mt-0.5 p-1 rounded border ${cfg.badgeClass}`}>
        {cfg.icon}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 justify-between">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-on-surface leading-snug">{alert.title}</p>
            <p className="text-[11px] text-on-surface-variant/70 mt-0.5 line-clamp-1">{alert.description}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-on-surface-variant/50 font-mono-label">
                {getTypeIcon(alert.type)} {alert.type}
              </span>
              {alert.equipmentName && (
                <span className="text-[10px] text-on-surface-variant/50 font-mono-label">
                  🚜 {alert.equipmentName}
                </span>
              )}
              {alert.dueAt && (
                <span className={`text-[10px] font-mono-label ${
                  new Date(alert.dueAt) < new Date() ? 'text-error/80' : 'text-on-surface-variant/50'
                }`}>
                  ⏱ {formatDue(alert.dueAt)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAction}
            className="shrink-0 text-[11px] text-primary opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer whitespace-nowrap"
          >
            {alert.recommendedAction ?? 'Ver'} <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
export const AlertsCentral: React.FC<AlertsCentralProps> = ({ alerts, loading }) => {
  const navigate = useNavigate();

  const criticalCount = alerts.filter((a) => a.priority === 'critica' || a.priority === 'alta').length;

  return (
    <div className="glass-card rounded-xl flex flex-col border-white/5">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Alertas Prioritários</h3>
          {criticalCount > 0 && (
            <span className="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label">
              {criticalCount} urgentes
            </span>
          )}
        </div>
        <button
          onClick={() => navigate(ROUTES.ALERTAS)}
          className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
        >
          Ver todos <ArrowRight size={13} />
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto max-h-72">
        {loading ? (
          <LoadingState message="Carregando alertas..." />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={28} />}
            title="Nenhum alerta no momento"
            description="Tudo em dia na operação."
          />
        ) : (
          alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
};
