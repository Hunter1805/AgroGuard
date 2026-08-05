import React from 'react';
import { Eye, Edit3, ArrowUpRight, ArrowDownLeft, Bookmark } from 'lucide-react';
import type { StockItem } from '../../types/parts';
import { useNavigate } from 'react-router-dom';
import { ROUTE_HELPERS } from '../../types/routes';

interface StockItemTableProps {
  items: StockItem[];
  onOpenAction: (actionType: string, item: StockItem) => void;
}

export const StockItemTable: React.FC<StockItemTableProps> = ({ items, onOpenAction }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: StockItem['status']) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Ativo</span>;
      case 'estoque_baixo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Estoque Baixo</span>;
      case 'sem_estoque':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Sem Estoque</span>;
      case 'bloqueado':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">Bloqueado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Item</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Marca / Ref</th>
            <th className="px-4 py-3 font-medium">Qtd Atual</th>
            <th className="px-4 py-3 font-medium">Reservado</th>
            <th className="px-4 py-3 font-medium">Disponível</th>
            <th className="px-4 py-3 font-medium">Estoque Mín</th>
            <th className="px-4 py-3 font-medium">Localização</th>
            <th className="px-4 py-3 font-medium text-right">Custo Médio</th>
            <th className="px-4 py-3 font-medium text-right">Valor Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-on-surface-variant">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-surface-container-highest/20 transition-colors">
              <td className="px-4 py-3 font-mono-label font-bold text-primary">{item.internalCode}</td>
              <td className="px-4 py-3 font-bold text-on-surface">
                <div>{item.name}</div>
                {item.barcode && <div className="text-[10px] font-mono-label text-on-surface-variant/60">EAN: {item.barcode}</div>}
              </td>
              <td className="px-4 py-3 capitalize font-semibold text-on-surface-variant/90">{item.type.replace(/_/g, ' ')}</td>
              <td className="px-4 py-3 font-mono-label">
                <div>{item.brand || 'Geral'}</div>
                {item.manufacturerCode && <div className="text-[10px] text-on-surface-variant/60">{item.manufacturerCode}</div>}
              </td>
              <td className="px-4 py-3 font-mono-label font-bold text-on-surface">
                {item.currentQuantity} {item.controlUnit}
              </td>
              <td className="px-4 py-3 font-mono-label font-bold text-amber-400">
                {item.reservedQuantity} {item.controlUnit}
              </td>
              <td className="px-4 py-3 font-mono-label font-bold text-emerald-400">
                {item.availableQuantity} {item.controlUnit}
              </td>
              <td className="px-4 py-3 font-mono-label text-on-surface-variant/80">
                {item.minimumQuantity} {item.controlUnit}
              </td>
              <td className="px-4 py-3 truncate max-w-[140px] text-on-surface-variant/80">
                {item.location?.detailedLocation || item.location?.warehouseName || 'Almoxarifado'}
              </td>
              <td className="px-4 py-3 text-right font-mono-label">
                R$ {item.averageCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right font-mono-label font-bold text-on-surface">
                R$ {item.totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => navigate(ROUTE_HELPERS.partDetail(item.id))}
                    className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-on-surface"
                    title="Ver Ficha"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onOpenAction('entrada', item)}
                    className="p-1 hover:bg-emerald-500/15 rounded text-emerald-400"
                    title="Registrar Entrada"
                  >
                    <ArrowDownLeft size={15} />
                  </button>
                  <button
                    onClick={() => onOpenAction('saida', item)}
                    className="p-1 hover:bg-rose-500/15 rounded text-rose-400"
                    title="Registrar Saída"
                  >
                    <ArrowUpRight size={15} />
                  </button>
                  <button
                    onClick={() => onOpenAction('reservar', item)}
                    className="p-1 hover:bg-blue-500/15 rounded text-blue-400"
                    title="Reservar Item"
                  >
                    <Bookmark size={15} />
                  </button>
                  <button
                    onClick={() => navigate(ROUTE_HELPERS.partEdit(item.id))}
                    className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-on-surface"
                    title="Editar"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
