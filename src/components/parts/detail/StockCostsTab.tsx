import React from 'react';
import type { StockItem } from '../../../types/parts';
import { DollarSign } from 'lucide-react';

interface StockCostsTabProps {
  item: StockItem;
}

export const StockCostsTab: React.FC<StockCostsTabProps> = ({ item }) => {
  return (
    <div className="space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <DollarSign size={16} className="text-emerald-400" /> Resumo de Custos e Avaliação Patrimonial
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo Médio Ponderado</span>
          <p className="text-lg font-bold text-on-surface font-mono-label mt-1">
            R$ {item.averageCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Último Custo de Compra</span>
          <p className="text-lg font-bold text-blue-400 font-mono-label mt-1">
            R$ {(item.lastPurchaseCost || item.averageCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Valor Total Em Estoque</span>
          <p className="text-lg font-bold text-emerald-400 font-mono-label mt-1">
            R$ {item.totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
