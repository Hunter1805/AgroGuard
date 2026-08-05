import React from 'react';
import type { StockItem } from '../../../types/parts';

interface StockOverviewTabProps {
  item: StockItem;
}

export const StockOverviewTab: React.FC<StockOverviewTabProps> = ({ item }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Identificação & Especificações</h3>

        <div className="grid grid-cols-2 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Cód. Interno</span>
            <span className="font-bold text-primary text-xs">{item.internalCode}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Código de Barras</span>
            <span className="font-bold text-on-surface text-xs">{item.barcode || '—'}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Tipo de Insumo</span>
            <span className="font-bold text-on-surface text-xs uppercase">{item.type.replace(/_/g, ' ')}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Marca / Fabr.</span>
            <span className="font-bold text-on-surface text-xs">{item.brand || 'N/I'} — {item.manufacturerCode || 'N/I'}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2 font-mono-label">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant/70">Unidade de Controle</span>
            <span className="font-bold text-on-surface">{item.controlUnit} ({item.allowsFractionalQuantity ? 'Fracionável' : 'Inteiro'})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant/70">Localização Almoxarifado</span>
            <span className="font-bold text-on-surface">
              {item.location?.detailedLocation || item.location?.warehouseName || 'Almoxarifado Geral'}
            </span>
          </div>
        </div>

        {item.description && (
          <div className="pt-3 border-t border-white/5">
            <span className="text-on-surface-variant/70 text-[11px] block font-mono-label">Descrição</span>
            <p className="text-on-surface text-xs mt-1">{item.description}</p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Controle de Estoque & Custos</h3>

        <div className="grid grid-cols-3 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Qtd Atual</span>
            <span className="font-bold text-on-surface text-sm">{item.currentQuantity} {item.controlUnit}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Reservado</span>
            <span className="font-bold text-amber-400 text-sm">{item.reservedQuantity} {item.controlUnit}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Disponível</span>
            <span className="font-bold text-emerald-400 text-sm">{item.availableQuantity} {item.controlUnit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono-label pt-3 border-t border-white/5">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Estoque Mínimo</span>
            <span className="font-bold text-on-surface text-xs">{item.minimumQuantity} {item.controlUnit}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Ponto de Reposição</span>
            <span className="font-bold text-on-surface text-xs">{item.reorderPoint || item.minimumQuantity} {item.controlUnit}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Custo Médio</span>
            <span className="font-bold text-on-surface text-xs">R$ {item.averageCost.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Valor Em Estoque</span>
            <span className="font-bold text-emerald-400 text-xs">R$ {item.totalStockValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
