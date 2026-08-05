import React from 'react';
import type { StockLot } from '../../../types/stock-lot';
import { CalendarX } from 'lucide-react';

interface StockLotsTabProps {
  lots: StockLot[];
}

export const StockLotsTab: React.FC<StockLotsTabProps> = ({ lots }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <CalendarX size={16} className="text-primary" /> Lotes e Prazos de Validade
      </h3>

      {lots.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum lote registrado para este item.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-label">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Nº Lote</th>
                <th className="px-3.5 py-2 font-medium font-sans">Fornecedor</th>
                <th className="px-3.5 py-2 font-medium">Data Validade</th>
                <th className="px-3.5 py-2 font-medium">Qtd Atual</th>
                <th className="px-3.5 py-2 font-medium font-sans">Status</th>
                <th className="px-3.5 py-2 font-medium text-right">Custo Unit.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {lots.map(l => (
                <tr key={l.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 font-bold text-primary">{l.code}</td>
                  <td className="px-3.5 py-2.5 font-sans">{l.supplierName || '—'}</td>
                  <td className="px-3.5 py-2.5">{l.expirationDate ? new Date(l.expirationDate).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="px-3.5 py-2.5 font-bold text-emerald-400">{l.currentQuantity} UN</td>
                  <td className="px-3.5 py-2.5 font-sans capitalize font-bold text-amber-400">{l.status.replace(/_/g, ' ')}</td>
                  <td className="px-3.5 py-2.5 text-right font-bold text-on-surface">R$ {l.unitCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
