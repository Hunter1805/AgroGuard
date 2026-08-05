import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle, Bookmark, CalendarX } from 'lucide-react';
import type { StockDashboardStats } from '../../types/parts';

interface StockStatsProps {
  stats: StockDashboardStats | null;
}

export const StockStats: React.FC<StockStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total de Itens',
      value: stats.totalItems,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
      description: 'Cadastrados no sistema',
    },
    {
      title: 'Valor do Estoque',
      value: `R$ ${stats.totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Patrimônio estocado',
    },
    {
      title: 'Abaixo do Mínimo',
      value: stats.itemsBelowMinimum,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      description: 'Necessitam reposição',
    },
    {
      title: 'Sem Estoque',
      value: stats.itemsOutOfStock,
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      description: 'Saldo zerado no almoxarifado',
    },
    {
      title: 'Itens Reservados',
      value: stats.reservedItems,
      icon: Bookmark,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      description: `Com ${stats.pendingReservations} solicitações`,
    },
    {
      title: 'Lotes Vencendo/Vencidos',
      value: stats.lotsExpiringSoon + stats.expiredLots,
      icon: CalendarX,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      description: `${stats.expiredLots} lote(s) vencido(s)`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`glass-card rounded-2xl p-4 border ${card.bg} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-label text-on-surface-variant/70 font-semibold">{card.title}</span>
              <Icon size={16} className={card.color} />
            </div>
            <div className={`text-xl font-bold font-title-lg ${card.color} font-mono-label`}>
              {card.value}
            </div>
            <p className="text-[10px] text-on-surface-variant/60">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
};
