import React from 'react';
import { Eye, Edit3, ArrowRightLeft, Wrench, Trash2, ArrowUpRight } from 'lucide-react';
import type { Tire } from '../../types/tires';
import { tireCalculationService } from '../../services/tire-calculation.service';
import { useNavigate } from 'react-router-dom';
import { ROUTE_HELPERS } from '../../types/routes';

interface TireTableProps {
  tires: Tire[];
  onOpenAction?: (actionType: string, tire: Tire) => void;
}

export const TireTable: React.FC<TireTableProps> = ({ tires, onOpenAction }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Tire['status']) => {
    switch (status) {
      case 'instalado':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Instalado</span>;
      case 'disponivel':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Disponível</span>;
      case 'em_reparo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Em Reparo</span>;
      case 'em_recapagem':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">Em Recapagem</span>;
      case 'recapado':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-400 border border-teal-500/30">Recapado</span>;
      case 'descartado':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">Descartado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">{status}</span>;
    }
  };

  const getConditionBadge = (condition: Tire['condition']) => {
    switch (condition) {
      case 'novo':
      case 'bom':
        return <span className="text-emerald-400 font-semibold">{condition.toUpperCase()}</span>;
      case 'atencao':
        return <span className="text-amber-400 font-semibold">ATENÇÃO</span>;
      case 'critico':
        return <span className="text-rose-400 font-bold">CRÍTICO</span>;
      default:
        return <span className="text-zinc-500 font-semibold">{condition.toUpperCase()}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
            <th className="px-4 py-3 font-medium">Cód. Interno</th>
            <th className="px-4 py-3 font-medium">Marca / Modelo</th>
            <th className="px-4 py-3 font-medium">Medida</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Sulco Atual / Mín</th>
            <th className="px-4 py-3 font-medium">Vida Útil</th>
            <th className="px-4 py-3 font-medium">Condição</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-on-surface-variant">
          {tires.map(tire => {
            const life = tireCalculationService.calculateRemainingLife(
              tire.initialTreadDepth || 0,
              tire.currentTreadDepth || 0,
              tire.minimumTreadDepth || 0
            );

            return (
              <tr key={tire.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label font-bold text-primary">
                  <button
                    onClick={() => navigate(ROUTE_HELPERS.tireDetail(tire.id))}
                    className="hover:underline flex items-center gap-1"
                  >
                    {tire.internalCode}
                    <ArrowUpRight size={12} className="opacity-70" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-on-surface">{tire.brand || '—'}</span>
                  {tire.model && <span className="text-on-surface-variant/70 text-[11px] block">{tire.model}</span>}
                </td>
                <td className="px-4 py-3 font-mono-label font-medium">{tire.size}</td>
                <td className="px-4 py-3">{getStatusBadge(tire.status)}</td>
                <td className="px-4 py-3 font-mono-label">
                  <span className="font-bold text-on-surface">{tire.currentTreadDepth ?? '—'} mm</span>
                  <span className="text-on-surface-variant/60 text-[11px]"> / {tire.minimumTreadDepth ?? 0} mm</span>
                </td>
                <td className="px-4 py-3 font-mono-label">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${life > 60 ? 'bg-emerald-500' : life > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${life}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold">{life}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">{getConditionBadge(tire.condition)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(ROUTE_HELPERS.tireDetail(tire.id))}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                      title="Ver Detalhes"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => navigate(ROUTE_HELPERS.tireEdit(tire.id))}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                      title="Editar Pneu"
                    >
                      <Edit3 size={15} />
                    </button>

                    {tire.status === 'disponivel' && onOpenAction && (
                      <button
                        onClick={() => onOpenAction('instalar', tire)}
                        className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-emerald-400 transition-colors"
                        title="Instalar em Equipamento"
                      >
                        <ArrowRightLeft size={15} />
                      </button>
                    )}

                    {tire.status === 'instalado' && onOpenAction && (
                      <button
                        onClick={() => onOpenAction('remover', tire)}
                        className="p-1.5 hover:bg-amber-500/10 rounded-lg text-amber-400 transition-colors"
                        title="Remover do Equipamento"
                      >
                        <Wrench size={15} />
                      </button>
                    )}

                    {tire.status !== 'descartado' && onOpenAction && (
                      <button
                        onClick={() => onOpenAction('descartar', tire)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-400 transition-colors"
                        title="Registrar Descarte"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
