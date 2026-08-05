import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Clock } from 'lucide-react';
import type { DashboardOrder, OrderStatusDash, OrderPriorityDash } from '../../types/dashboard';
import { ROUTES } from '../../types/routes';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';

interface RecentOrdersPanelProps {
  orders: DashboardOrder[];
  loading?: boolean;
  /** @deprecated — mantido por compatibilidade */
  setActiveTab?: (tab: string) => void;
}

const STATUS_CLASSES: Record<OrderStatusDash, string> = {
  'Aberta': 'bg-surface-container-highest text-on-surface-variant border-white/10',
  'Em execução': 'bg-warning/10 text-warning border-warning/20',
  'Aguardando peças': 'bg-error/10 text-error border-error/20',
  'Pausada': 'bg-surface-container-highest text-on-surface-variant/70 border-white/10',
  'Em teste': 'bg-primary/10 text-primary border-primary/20',
  'Finalizada': 'bg-success/10 text-success border-success/20',
  'Cancelada': 'bg-surface-container-highest text-on-surface-variant/50 border-white/5',
};

const PRIORITY_CLASSES: Record<OrderPriorityDash, string> = {
  Alta: 'text-error',
  Média: 'text-warning',
  Baixa: 'text-success',
};

function getOpenDuration(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return '< 1h';
}

export const RecentOrdersPanel: React.FC<RecentOrdersPanelProps> = ({ orders, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-xl flex flex-col border-white/5">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">OS Recentes</h3>
          {orders.length > 0 && (
            <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded font-mono-label">
              {orders.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate(ROUTES.ORDENS_SERVICO)}
          className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
        >
          Ver todas <ArrowRight size={13} />
        </button>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <LoadingState message="Carregando ordens..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="Nenhuma OS aberta"
            description="Não há ordens de serviço no momento."
          />
        ) : (
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="text-on-surface-variant/50 font-mono-label text-[10px] uppercase bg-surface-container-highest/20 border-b border-white/5">
                <th className="px-4 py-2 font-medium">OS #</th>
                <th className="px-4 py-2 font-medium">Equipamento</th>
                <th className="px-4 py-2 font-medium hidden sm:table-cell">Tipo</th>
                <th className="px-4 py-2 font-medium">Prior.</th>
                <th className="px-4 py-2 font-medium hidden md:table-cell">Responsável</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium hidden lg:table-cell">Em aberto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {orders.map((os) => (
                <tr
                  key={os.id}
                  onClick={() => navigate(os.targetRoute)}
                  className="hover:bg-surface-container-highest/30 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-2.5 font-mono-label text-primary font-semibold group-hover:text-primary/80">
                    {os.number}
                  </td>
                  <td className="px-4 py-2.5 truncate max-w-[130px] text-on-surface group-hover:text-primary transition-colors">
                    {os.equipmentName}
                  </td>
                  <td className="px-4 py-2.5 text-on-surface-variant/70 hidden sm:table-cell">{os.type}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-mono-label text-[11px] font-bold ${PRIORITY_CLASSES[os.priority]}`}>
                      {os.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-on-surface-variant/70 hidden md:table-cell">{os.responsible}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_CLASSES[os.status]}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-on-surface-variant/50 font-mono-label text-[10px]">
                      <Clock size={10} /> {getOpenDuration(os.openedAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
