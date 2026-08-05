import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor, Wrench, AlertTriangle, ClipboardList,
  Bell, TrendingDown, ShieldAlert, Clock,
  CheckSquare, AlertCircle, Hammer, Package,
} from 'lucide-react';
import type { DashboardStats } from '../../types/dashboard';
import { ROUTES } from '../../types/routes';
import { LoadingState } from '../ui/LoadingState';

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
  /** @deprecated — mantido por compatibilidade */
  setActiveTab?: (tab: string) => void;
  kpis?: unknown;
}

interface CriticalCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  colorClass: string;
  borderClass: string;
  route: string;
  alert?: boolean;
}

const CriticalCard: React.FC<CriticalCardProps> = ({
  icon, label, value, sub, colorClass, borderClass, route, alert,
}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className={`glass-card rounded-xl p-4 flex flex-col justify-between h-28 border-l-2 cursor-pointer hover:brightness-110 transition-all active:scale-[0.98] text-left ${borderClass}`}
    >
      <div className="flex justify-between items-start">
        <span className="font-body-sm text-[12px] text-on-surface-variant">{label}</span>
        <span className={colorClass}>{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <p className={`font-title-md text-[28px] font-bold leading-none ${colorClass}`}>{value}</p>
          {sub && <p className="font-body-sm text-[11px] text-on-surface-variant/70">{sub}</p>}
        </div>
        {alert && value > 0 && (
          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2 overflow-hidden">
            <div className={`h-full rounded-full ${colorClass.includes('error') ? 'bg-error' : 'bg-warning'}`}
              style={{ width: `${Math.min(100, (value / 10) * 100)}%` }} />
          </div>
        )}
      </div>
    </button>
  );
};

interface CompactCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  route: string;
}

const CompactCard: React.FC<CompactCardProps> = ({ icon, label, value, colorClass, route }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="flex items-center gap-2.5 px-3 py-2.5 bg-surface-container-highest/40 hover:bg-surface-container-highest/70 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer active:scale-[0.98] w-full text-left"
    >
      <span className={`shrink-0 ${colorClass}`}>{icon}</span>
      <span className="flex-1 font-body-sm text-[12px] text-on-surface-variant truncate">{label}</span>
      <span className={`font-mono-label text-[13px] font-bold shrink-0 ${colorClass}`}>{value}</span>
    </button>
  );
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return <LoadingState message="Carregando indicadores..." />;
  }

  const criticalCards: CriticalCardProps[] = [
    {
      icon: <Tractor size={18} />, label: 'Disponíveis', value: stats.availableEquipment,
      colorClass: 'text-success', borderClass: 'border-l-success/50',
      route: ROUTES.EQUIPAMENTOS,
    },
    {
      icon: <Wrench size={18} />, label: 'Em Manutenção', value: stats.maintenanceEquipment,
      colorClass: 'text-warning', borderClass: 'border-l-warning/50',
      route: ROUTES.EQUIPAMENTOS,
    },
    {
      icon: <TrendingDown size={18} />, label: 'Parados', value: stats.stoppedEquipment,
      colorClass: 'text-error', borderClass: 'border-l-error/40',
      route: ROUTES.EQUIPAMENTOS,
    },
    {
      icon: <AlertTriangle size={18} />, label: 'Manutenções Vencidas', value: stats.overdueMaintenance,
      sub: 'vencidas', colorClass: 'text-error', borderClass: 'border-l-error/60',
      route: ROUTES.MANUTENCOES, alert: true,
    },
    {
      icon: <ClipboardList size={18} />, label: 'OS Abertas', value: stats.openOrders,
      colorClass: 'text-primary', borderClass: 'border-l-primary/40',
      route: ROUTES.ORDENS_SERVICO,
    },
    {
      icon: <Bell size={18} />, label: 'Alertas Críticos', value: stats.criticalAlerts,
      colorClass: 'text-error', borderClass: 'border-l-error/60',
      route: ROUTES.ALERTAS, alert: true,
    },
  ];

  const compactCards: CompactCardProps[] = [
    { icon: <Tractor size={14} />, label: 'Total de equipamentos', value: stats.totalEquipment, colorClass: 'text-on-surface-variant', route: ROUTES.EQUIPAMENTOS },
    { icon: <ShieldAlert size={14} />, label: 'Equipamentos bloqueados', value: stats.blockedEquipment, colorClass: 'text-error/80', route: ROUTES.EQUIPAMENTOS },
    { icon: <Clock size={14} />, label: 'OS atrasadas', value: stats.overdueOrders, colorClass: 'text-error/80', route: ROUTES.ORDENS_SERVICO },
    { icon: <AlertCircle size={14} />, label: 'Manutenções próximas', value: stats.upcomingMaintenance, colorClass: 'text-warning', route: ROUTES.MANUTENCOES },
    { icon: <CheckSquare size={14} />, label: 'Checklists pendentes', value: stats.pendingChecklists, colorClass: 'text-warning', route: ROUTES.CHECKLISTS },
    { icon: <AlertTriangle size={14} />, label: 'Não conformidades abertas', value: stats.openNonConformities, colorClass: 'text-error/80', route: ROUTES.ALERTAS },
    { icon: <Hammer size={14} />, label: 'Ferramentas emprestadas', value: stats.borrowedTools, colorClass: 'text-on-surface-variant', route: ROUTES.FERRAMENTAS },
    { icon: <Package size={14} />, label: 'Peças abaixo do mínimo', value: stats.lowStockItems, colorClass: 'text-error/80', route: ROUTES.PECAS_INSUMOS },
  ];

  return (
    <div className="space-y-3">
      {/* Linha 1 — indicadores críticos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {criticalCards.map((card) => (
          <CriticalCard key={card.label} {...card} />
        ))}
      </div>

      {/* Linha 2 — indicadores complementares */}
      <div className="glass-card rounded-xl border border-white/5 p-3">
        <p className="text-[10px] font-mono-label text-on-surface-variant/50 uppercase tracking-wider mb-2 px-1">
          Indicadores complementares
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {compactCards.map((card) => (
            <CompactCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};
