import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight, ChevronRight, AlertTriangle } from 'lucide-react';
import type { UpcomingMaintenance, DashboardMaintenanceStatus } from '../../types/dashboard';
import { ROUTES } from '../../types/routes';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';

interface NextMaintenancePanelProps {
  items: UpcomingMaintenance[];
  loading?: boolean;
}

const STATUS_CONFIG: Record<DashboardMaintenanceStatus, {
  label: string;
  barClass: string;
  textClass: string;
  borderClass: string;
}> = {
  vencida: {
    label: 'Vencida',
    barClass: 'bg-error',
    textClass: 'text-error',
    borderClass: 'border-l-error',
  },
  urgente: {
    label: 'Urgente',
    barClass: 'bg-warning',
    textClass: 'text-warning',
    borderClass: 'border-l-warning',
  },
  proxima: {
    label: 'Próxima',
    barClass: 'bg-primary/70',
    textClass: 'text-primary',
    borderClass: 'border-l-primary/60',
  },
  normal: {
    label: 'Normal',
    barClass: 'bg-success/60',
    textClass: 'text-success',
    borderClass: 'border-l-success/30',
  },
};

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit',
  });
}

const MaintenanceRow: React.FC<{ item: UpcomingMaintenance }> = ({ item }) => {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[item.status];
  const progress = Math.min(100, item.progressPercentage);

  const hasReading = item.currentReading !== undefined && item.dueReading !== undefined;
  const remaining = hasReading ? item.dueReading! - item.currentReading! : null;

  return (
    <div
      onClick={() => navigate(ROUTES.MANUTENCOES)}
      className={`border-l-2 pl-3 py-2.5 pr-2 rounded-r-md hover:bg-surface-container-highest/30 transition-all cursor-pointer group ${cfg.borderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-on-surface leading-snug group-hover:text-primary transition-colors truncate">
            {item.equipmentName}
          </p>
          <p className="text-[11px] text-on-surface-variant/70 mt-0.5 truncate">{item.planName}</p>

          {/* Leitura atual vs vencimento */}
          {hasReading && (
            <p className="text-[10px] font-mono-label text-on-surface-variant/50 mt-0.5">
              Atual: {item.currentReading?.toLocaleString('pt-BR')} {item.unit} →
              Venc.: {item.dueReading?.toLocaleString('pt-BR')} {item.unit}
              {remaining !== null && remaining > 0 && (
                <span className="ml-1 text-on-surface-variant/40">
                  ({remaining.toLocaleString('pt-BR')} {item.unit} restantes)
                </span>
              )}
            </p>
          )}
          {item.dueDate && !hasReading && (
            <p className="text-[10px] font-mono-label text-on-surface-variant/50 mt-0.5">
              Data prevista: {formatDueDate(item.dueDate)}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end shrink-0 gap-1">
          <span className={`text-[10px] font-mono-label font-bold ${cfg.textClass}`}>
            {item.status === 'vencida' ? '⚠ Vencida' : `${progress}%`}
          </span>
          <ChevronRight size={13} className="text-on-surface-variant/30 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${cfg.barClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const NextMaintenancePanel: React.FC<NextMaintenancePanelProps> = ({ items, loading }) => {
  const navigate = useNavigate();
  const overdueCount = items.filter((i) => i.status === 'vencida').length;
  const urgentCount = items.filter((i) => i.status === 'urgente').length;

  return (
    <div className="glass-card rounded-xl flex flex-col border-white/5">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Próximas Manutenções</h3>
          {overdueCount > 0 && (
            <span className="flex items-center gap-1 bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label">
              <AlertTriangle size={9} /> {overdueCount} vencida{overdueCount > 1 ? 's' : ''}
            </span>
          )}
          {urgentCount > 0 && overdueCount === 0 && (
            <span className="bg-warning/10 text-warning text-[10px] px-1.5 py-0.5 rounded-full font-mono-label">
              {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate(ROUTES.MANUTENCOES)}
          className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
        >
          Ver agenda <ArrowRight size={13} />
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto max-h-80">
        {loading ? (
          <LoadingState message="Carregando manutenções..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Wrench size={28} />}
            title="Nenhuma manutenção pendente"
            description="Todos os equipamentos em dia."
          />
        ) : (
          items.map((item) => (
            <MaintenanceRow key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};
