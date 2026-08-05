import React from 'react';
import type { StockMovement } from '../../../types/stock-movement';
import { ArrowLeftRight } from 'lucide-react';

interface StockMovementsTabProps {
  movements: StockMovement[];
}

export const StockMovementsTab: React.FC<StockMovementsTabProps> = ({ movements }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <ArrowLeftRight size={16} className="text-primary" /> Histórico de Movimentações
      </h3>

      {movements.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma movimentação registrada para este item.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Cód. Mov.</th>
                <th className="px-3.5 py-2 font-medium">Tipo</th>
                <th className="px-3.5 py-2 font-medium">Qtd</th>
                <th className="px-3.5 py-2 font-medium font-mono-label">Data</th>
                <th className="px-3.5 py-2 font-medium font-mono-label">OS / Origem</th>
                <th className="px-3.5 py-2 font-medium">Responsável</th>
                <th className="px-3.5 py-2 font-medium text-right">Custo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {movements.map(mov => (
                <tr key={mov.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 font-mono-label font-bold text-primary">{mov.code}</td>
                  <td className="px-3.5 py-2.5 capitalize font-bold text-on-surface">{mov.type}</td>
                  <td className="px-3.5 py-2.5 font-mono-label font-bold text-on-surface">{mov.quantity} {mov.controlUnit}</td>
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">{new Date(mov.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 font-mono-label">{mov.workOrderCode || mov.supplierName || '—'}</td>
                  <td className="px-3.5 py-2.5">{mov.responsibleName}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono-label font-bold text-on-surface">
                    R$ {mov.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
