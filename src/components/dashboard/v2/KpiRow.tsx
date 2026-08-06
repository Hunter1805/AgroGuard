import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ClipboardList, Bell } from 'lucide-react';
import type { DashboardStats } from '../../../types/dashboard';
import { ROUTES } from '../../../types/routes';

interface KpiItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  context: string;
  route: string;
  /** Valor mínimo para ativar a cor de alerta */
  alertThreshold?: number;
  colorVar?: string;
}

/** Skeleton de um KPI durante carregamento */
const KpiSkeleton: React.FC = () => (
  <div
    className="animate-skeleton rounded-lg h-[100px]"
    style={{ backgroundColor: 'var(--color-border)' }}
    aria-hidden
  />
);

/** Um único bloco de KPI */
const KpiItem: React.FC<KpiItemProps> = ({
  icon,
  label,
  value,
  context,
  route,
  alertThreshold = 1,
  colorVar = 'var(--color-danger)',
}) => {
  const navigate = useNavigate();
  const isAlert = value >= alertThreshold;
  const numColor = isAlert ? colorVar : 'var(--color-text-primary)';

  return (
    <button
      type="button"
      onClick={() => navigate(route)}
      className="flex flex-col justify-between rounded-lg px-5 py-4 cursor-pointer text-left transition-shadow duration-150 h-[100px] w-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
      aria-label={`${label}: ${value}`}
    >
      {/* Linha superior: label + ícone */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[12px] font-medium leading-tight"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
        <span
          aria-hidden
          style={{ color: isAlert ? colorVar : 'var(--color-text-muted)' }}
        >
          {icon}
        </span>
      </div>

      {/* Linha inferior: número + contexto */}
      <div>
        <p
          className="font-semibold leading-none mb-1"
          style={{ fontSize: '28px', color: numColor }}
          aria-label={String(value)}
        >
          {value}
        </p>
        <p
          className="text-[11px] leading-tight"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {context}
        </p>
      </div>
    </button>
  );
};

// ─── KpiRow ───────────────────────────────────────────────────────────────────
interface KpiRowProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export const KpiRow: React.FC<KpiRowProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <KpiSkeleton key={i} />)}
      </div>
    );
  }

  const equipIndisponiveis = (stats.maintenanceEquipment ?? 0) + (stats.blockedEquipment ?? 0) + (stats.stoppedEquipment ?? 0);
  const equipCtx = [
    stats.maintenanceEquipment > 0 ? `${stats.maintenanceEquipment} em manutenção` : '',
    stats.blockedEquipment > 0 ? `${stats.blockedEquipment} bloqueado${stats.blockedEquipment > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' · ') || 'todos operantes';

  const manuCtx = stats.overdueMaintenance > 0
    ? `${Math.min(stats.overdueMaintenance, 2)} com prioridade crítica`
    : 'nenhuma vencida';

  const osCtx = stats.overdueOrders > 0
    ? `${stats.overdueOrders} atrasada${stats.overdueOrders > 1 ? 's' : ''} há mais de 1 dia`
    : 'todas no prazo';

  const alertCtx = stats.criticalAlerts > 0
    ? `${Math.min(stats.criticalAlerts, 3)} novo${Math.min(stats.criticalAlerts, 3) > 1 ? 's' : ''} desde ontem`
    : 'nenhum alerta novo';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label="KPIs críticos">
      <KpiItem
        icon={<ShieldAlert size={18} />}
        label="Equipamentos indisponíveis"
        value={equipIndisponiveis}
        context={equipCtx}
        route={ROUTES.EQUIPAMENTOS}
        alertThreshold={1}
        colorVar="var(--color-danger)"
      />
      <KpiItem
        icon={<AlertTriangle size={18} />}
        label="Manutenções vencidas"
        value={stats.overdueMaintenance ?? 0}
        context={manuCtx}
        route={ROUTES.MANUTENCOES}
        alertThreshold={1}
        colorVar="var(--color-warning)"
      />
      <KpiItem
        icon={<ClipboardList size={18} />}
        label="Ordens de Serviço críticas"
        value={stats.openOrders ?? 0}
        context={osCtx}
        route={ROUTES.ORDENS_SERVICO}
        alertThreshold={1}
        colorVar="var(--color-warning)"
      />
      <KpiItem
        icon={<Bell size={18} />}
        label="Alertas críticos"
        value={stats.criticalAlerts ?? 0}
        context={alertCtx}
        route={ROUTES.ALERTAS}
        alertThreshold={1}
        colorVar="var(--color-danger)"
      />
    </div>
  );
};
