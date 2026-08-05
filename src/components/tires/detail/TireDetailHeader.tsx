import React from 'react';
import { ArrowLeft, Disc, Wrench, RefreshCw, Trash2, Edit3 } from 'lucide-react';
import type { Tire } from '../../../types/tires';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_HELPERS } from '../../../types/routes';

interface TireDetailHeaderProps {
  tire: Tire;
  onOpenAction: (actionType: string) => void;
}

export const TireDetailHeader: React.FC<TireDetailHeaderProps> = ({ tire, onOpenAction }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PNEUS)}>
            <ArrowLeft size={16} />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <Disc className="text-primary" size={20} />
              <h2 className="text-xl font-bold font-title-lg text-on-surface font-mono-label">{tire.internalCode}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30">
                {tire.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              {tire.brand} {tire.model} ({tire.size}) — Série: {tire.serialNumber || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTE_HELPERS.tireEdit(tire.id))}
            className="flex items-center gap-1.5"
          >
            <Edit3 size={14} /> Editar
          </Button>

          {tire.status === 'disponivel' && (
            <Button variant="primary" size="sm" onClick={() => onOpenAction('instalar')}>
              Instalar Pneu
            </Button>
          )}

          {tire.status === 'instalado' && (
            <Button variant="outline" size="sm" onClick={() => onOpenAction('remover')} className="text-amber-400 border-amber-500/30">
              Remover Pneu
            </Button>
          )}

          {tire.status !== 'descartado' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenAction('reparo')} className="flex items-center gap-1">
                <Wrench size={14} /> Reparo
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenAction('recapagem')} className="flex items-center gap-1">
                <RefreshCw size={14} /> Recapagem
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenAction('descarte')} className="text-rose-400 border-rose-500/30">
                <Trash2 size={14} /> Descarte
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
