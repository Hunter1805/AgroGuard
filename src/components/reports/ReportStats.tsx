import React from 'react';

interface ReportStatsProps {
  totalRows: number;
  totals?: Record<string, number | string>;
}

export const ReportStats: React.FC<ReportStatsProps> = ({ totalRows, totals }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div className="glass-card rounded-xl p-3.5 border border-white/10">
        <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Registros Encontrados</span>
        <p className="text-lg font-bold text-on-surface font-mono-label mt-0.5">{totalRows}</p>
      </div>

      {totals?.totalCost !== undefined && (
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo Total No Período</span>
          <p className="text-lg font-bold text-emerald-400 font-mono-label mt-0.5">
            R$ {Number(totals.totalCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {totals?.totalStockValue !== undefined && (
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Valor Total Em Estoque</span>
          <p className="text-lg font-bold text-emerald-400 font-mono-label mt-0.5">
            R$ {Number(totals.totalStockValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {totals?.paradaHours !== undefined && (
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Total Horas de Parada</span>
          <p className="text-lg font-bold text-rose-400 font-mono-label mt-0.5">{totals.paradaHours} h</p>
        </div>
      )}
    </div>
  );
};
