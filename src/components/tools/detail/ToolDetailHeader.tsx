import React from 'react';
import { ArrowLeft, Wrench, ArrowRightLeft, Edit3, Trash2, CalendarCheck } from 'lucide-react';
import type { Tool } from '../../../types/tools';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_HELPERS } from '../../../types/routes';

interface ToolDetailHeaderProps {
  tool: Tool;
  onOpenAction: (actionType: string) => void;
}

export const ToolDetailHeader: React.FC<ToolDetailHeaderProps> = ({ tool, onOpenAction }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.FERRAMENTAS)}>
            <ArrowLeft size={16} />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <Wrench className="text-primary" size={20} />
              <h2 className="text-xl font-bold font-title-lg text-on-surface font-mono-label">{tool.code}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30">
                {tool.status.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              {tool.name} — {tool.brand} ({tool.category}) | Patrimônio: {tool.patrimonyNumber || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTE_HELPERS.toolEdit(tool.id))}
            className="flex items-center gap-1.5"
          >
            <Edit3 size={14} /> Editar
          </Button>

          {tool.status === 'disponivel' && tool.availableQuantity > 0 && (
            <Button variant="primary" size="sm" onClick={() => onOpenAction('emprestar')} className="flex items-center gap-1.5">
              <ArrowRightLeft size={14} /> Emprestar
            </Button>
          )}

          {tool.requiresCalibration && (
            <Button variant="outline" size="sm" onClick={() => onOpenAction('calibrar')} className="flex items-center gap-1.5">
              <CalendarCheck size={14} /> Calibrar
            </Button>
          )}

          {tool.status !== 'baixada' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenAction('transferir')}>
                Transferir
              </Button>

              <Button variant="outline" size="sm" onClick={() => onOpenAction('dano')} className="text-amber-400 border-amber-500/30">
                Dano
              </Button>

              <Button variant="outline" size="sm" onClick={() => onOpenAction('baixa')} className="text-rose-400 border-rose-500/30">
                <Trash2 size={14} /> Baixa
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
