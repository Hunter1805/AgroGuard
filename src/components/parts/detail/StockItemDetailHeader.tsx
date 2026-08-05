import React from 'react';
import { ArrowLeft, Package, Edit3, ArrowDownLeft, ArrowUpRight, Bookmark } from 'lucide-react';
import type { StockItem } from '../../../types/parts';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_HELPERS } from '../../../types/routes';

interface StockItemDetailHeaderProps {
  item: StockItem;
  onOpenAction: (actionType: string) => void;
}

export const StockItemDetailHeader: React.FC<StockItemDetailHeaderProps> = ({ item, onOpenAction }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PECAS_INSUMOS)}>
            <ArrowLeft size={16} />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <Package className="text-primary" size={20} />
              <h2 className="text-xl font-bold font-title-lg text-on-surface font-mono-label">{item.internalCode}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30 uppercase">
                {item.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              {item.name} | Categoria: {item.categoryName || item.type} | Marca: {item.brand || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTE_HELPERS.partEdit(item.id))}
            className="flex items-center gap-1.5"
          >
            <Edit3 size={14} /> Editar
          </Button>

          <Button variant="primary" size="sm" onClick={() => onOpenAction('entrada')} className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5">
            <ArrowDownLeft size={14} /> Entrada
          </Button>

          <Button variant="outline" size="sm" onClick={() => onOpenAction('saida')} className="text-rose-400 border-rose-500/30 flex items-center gap-1.5">
            <ArrowUpRight size={14} /> Saída
          </Button>

          <Button variant="outline" size="sm" onClick={() => onOpenAction('reservar')} className="text-blue-400 border-blue-500/30 flex items-center gap-1.5">
            <Bookmark size={14} /> Reservar
          </Button>
        </div>
      </div>
    </div>
  );
};
