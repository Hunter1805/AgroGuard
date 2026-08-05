import React, { useState } from 'react';
import { ArrowLeftRight, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useStockMovements } from '../../../hooks/useStockMovements';
import { Button } from '../../ui/Button';
import { StockEntryForm } from './StockEntryForm';
import { StockOutputForm } from './StockOutputForm';

export const StockMovementList: React.FC = () => {
  const { movements, loading, filters, setFilters, refetch } = useStockMovements();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'entrada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max"><ArrowDownLeft size={12} /> Entrada</span>;
      case 'saida':
      case 'consumo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max"><ArrowUpRight size={12} /> Saída/Consumo</span>;
      case 'devolucao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 w-max">Devolução</span>;
      case 'transferencia':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 w-max">Transferência</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant uppercase w-max">{type}</span>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <ArrowLeftRight className="text-primary" size={18} />
            Movimentações de Estoque
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Registro de entradas de compras, saídas para OS, devoluções, transferências e acertos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveModal('saida')} className="text-rose-400 border-rose-500/30">
            <ArrowUpRight size={14} className="mr-1" /> Registrar Saída
          </Button>
          <Button variant="primary" size="sm" onClick={() => setActiveModal('entrada')} className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowDownLeft size={14} className="mr-1" /> Registrar Entrada
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar movimentação, código, item ou OS..."
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{movements.length} movimentações encontradas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando movimentações...</div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ArrowLeftRight className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma movimentação registrada</p>
            <p className="text-xs text-on-surface-variant/70">As entradas, saídas e consumos por OS aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Cód. Mov.</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Quantidade</th>
                  <th className="px-4 py-3 font-medium">Origem / Destino (OS)</th>
                  <th className="px-4 py-3 font-medium">Data / Hora</th>
                  <th className="px-4 py-3 font-medium">Responsável</th>
                  <th className="px-4 py-3 font-medium text-right">Custo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {movements.map(mov => (
                  <tr key={mov.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{mov.code}</td>
                    <td className="px-4 py-3">{getMovementTypeBadge(mov.type)}</td>
                    <td className="px-4 py-3 font-bold text-on-surface">
                      <div>{mov.itemName}</div>
                      <div className="text-[10px] text-primary font-mono-label">{mov.itemCode}</div>
                    </td>
                    <td className="px-4 py-3 font-mono-label font-bold text-on-surface">
                      {mov.quantity} {mov.controlUnit}
                    </td>
                    <td className="px-4 py-3 font-mono-label">
                      {mov.workOrderCode ? (
                        <span className="text-primary font-bold">{mov.workOrderCode}</span>
                      ) : mov.supplierName ? (
                        <span>{mov.supplierName}</span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(mov.date).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">{mov.responsibleName}</td>
                    <td className="px-4 py-3 text-right font-mono-label font-bold text-on-surface">
                      R$ {mov.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeModal === 'entrada' && (
        <StockEntryForm onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}

      {activeModal === 'saida' && (
        <StockOutputForm onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
