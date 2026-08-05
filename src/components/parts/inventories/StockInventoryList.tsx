import React, { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle2 } from 'lucide-react';
import { useStockInventories } from '../../../hooks/useStockInventories';
import { Button } from '../../ui/Button';
import { StockInventoryForm } from './StockInventoryForm';

export const StockInventoryList: React.FC = () => {
  const { inventories, loading, filters, setFilters, approveInventory, refetch } = useStockInventories();
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Concluído</span>;
      case 'aguardando_aprovacao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Divergente / Aguardando Aprovação</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <ClipboardList className="text-primary" size={18} />
            Inventários Físicos e Ajustes
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Conferência periódica de saldos físicos com lançamento auditado de ajustes.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowForm(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Novo Inventário
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por título, código ou responsável..."
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{inventories.length} inventários</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando inventários...</div>
        ) : inventories.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhum inventário realizado</p>
            <p className="text-xs text-on-surface-variant/70">Crie um inventário para conferir os saldos físicos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Cód. Inventário</th>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Tipo / Almoxarifado</th>
                  <th className="px-4 py-3 font-medium">Data Planejada</th>
                  <th className="px-4 py-3 font-medium">Responsável</th>
                  <th className="px-4 py-3 font-medium">Divergências</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {inventories.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{inv.code}</td>
                    <td className="px-4 py-3 font-bold text-on-surface">{inv.title}</td>
                    <td className="px-4 py-3 font-mono-label">
                      <span className="capitalize">{inv.type.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-on-surface-variant/70 block">{inv.warehouseName || 'Almoxarifado Geral'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(inv.plannedDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{inv.responsibleName}</td>
                    <td className="px-4 py-3 font-mono-label">
                      {inv.divergentItemsCount > 0 ? (
                        <span className="text-amber-400 font-bold">{inv.divergentItemsCount} item(ns) ({inv.totalDifferenceValue < 0 ? '-' : ''}R$ {Math.abs(inv.totalDifferenceValue).toFixed(2)})</span>
                      ) : (
                        <span className="text-emerald-400">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === 'aguardando_aprovacao' && (
                        <button
                          onClick={async () => {
                            await approveInventory(inv.id, 'Fernando Costa (Gerente)');
                            refetch();
                          }}
                          className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 rounded hover:bg-emerald-500/25 font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle2 size={13} /> Aprovar Ajuste
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <StockInventoryForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refetch(); }} />
      )}
    </div>
  );
};
