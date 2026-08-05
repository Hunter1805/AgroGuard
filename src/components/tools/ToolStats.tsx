import React from 'react';
import { Wrench, CheckCircle2, ArrowRightLeft, CalendarX, Clock, DollarSign } from 'lucide-react';
import type { ToolsDashboardStats } from '../../types/tools';

interface ToolStatsProps {
  stats: ToolsDashboardStats | null;
}

export const ToolStats: React.FC<ToolStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Total Ferramentas</span>
          <Wrench size={16} className="text-primary" />
        </div>
        <p className="text-2xl font-bold text-on-surface font-mono-label">{stats.totalTools}</p>
        <span className="text-[10px] text-on-surface-variant/60 block mt-0.5">Cadastradas no sistema</span>
      </div>

      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Disponíveis</span>
          <CheckCircle2 size={16} className="text-emerald-400" />
        </div>
        <p className="text-2xl font-bold text-emerald-400 font-mono-label">{stats.availableTools}</p>
        <span className="text-[10px] text-emerald-400/80 block mt-0.5">Prontas para empréstimo</span>
      </div>

      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Emprestadas</span>
          <ArrowRightLeft size={16} className="text-amber-400" />
        </div>
        <p className="text-2xl font-bold text-amber-400 font-mono-label">{stats.loanedTools}</p>
        <span className="text-[10px] text-amber-400/80 block mt-0.5">Em uso em campo/OS</span>
      </div>

      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Atrasados</span>
          <Clock size={16} className="text-rose-400" />
        </div>
        <p className="text-2xl font-bold text-rose-400 font-mono-label">{stats.overdueLoans}</p>
        <span className="text-[10px] text-rose-400/80 block mt-0.5">Devoluções pendentes</span>
      </div>

      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Calibração Vencida</span>
          <CalendarX size={16} className="text-orange-400" />
        </div>
        <p className="text-2xl font-bold text-orange-400 font-mono-label">{stats.expiredCalibrations}</p>
        <span className="text-[10px] text-orange-400/80 block mt-0.5">Aferição pendente</span>
      </div>

      <div className="glass-card rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between text-on-surface-variant/70 mb-1">
          <span className="text-[11px] font-mono-label">Valor Patrimonial</span>
          <DollarSign size={16} className="text-primary" />
        </div>
        <p className="text-lg font-bold text-on-surface font-mono-label truncate">
          R$ {(stats.totalPatrimonyValue || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
        </p>
        <span className="text-[10px] text-on-surface-variant/60 block mt-0.5">Valor total investido</span>
      </div>
    </div>
  );
};
