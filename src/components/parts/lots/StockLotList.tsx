import React from 'react';
import { CalendarX, Search } from 'lucide-react';
import { useStockLots } from '../../../hooks/useStockLots';

export const StockLotList: React.FC = () => {
  const { lots, loading, filters, setFilters } = useStockLots();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Válido</span>;
      case 'proximo_vencimento':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Próximo do Vencimento</span>;
      case 'vencido':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Vencido (Bloqueado)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <CalendarX className="text-primary" size={18} />
            Lotes e Prazos de Validade de Insumos
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Rastreabilidade de lotes de óleos, graxas, aditivos e fluidos com ordenação FEFO.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar lote por código ou item..."
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono-label">
            <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
              <input
                type="checkbox"
                checked={Boolean(filters.expiringOnly)}
                onChange={e => setFilters({ ...filters, expiringOnly: e.target.checked })}
                className="rounded bg-surface-container border-white/10 text-amber-500"
              />
              Vencendo Próximo
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
              <input
                type="checkbox"
                checked={Boolean(filters.expiredOnly)}
                onChange={e => setFilters({ ...filters, expiredOnly: e.target.checked })}
                className="rounded bg-surface-container border-white/10 text-rose-500"
              />
              Vencidos
            </label>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando lotes...</div>
        ) : lots.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarX className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhum lote cadastrado</p>
            <p className="text-xs text-on-surface-variant/70">Os lotes com controle de validade aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Nº do Lote</th>
                  <th className="px-4 py-3 font-medium">Item Insumo</th>
                  <th className="px-4 py-3 font-medium">Data Fabricação</th>
                  <th className="px-4 py-3 font-medium">Data Validade</th>
                  <th className="px-4 py-3 font-medium">Saldo Atual</th>
                  <th className="px-4 py-3 font-medium">Fornecedor</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Custo Unitário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
                {lots.map(lot => (
                  <tr key={lot.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-primary">{lot.code}</td>
                    <td className="px-4 py-3 font-bold text-on-surface font-sans">{lot.itemName}</td>
                    <td className="px-4 py-3 text-[11px]">
                      {lot.manufacturingDate ? new Date(lot.manufacturingDate).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      <span className={lot.status === 'vencido' ? 'text-rose-400 font-bold' : lot.status === 'proximo_vencimento' ? 'text-amber-400 font-bold' : ''}>
                        {lot.expirationDate ? new Date(lot.expirationDate).toLocaleDateString('pt-BR') : 'Sem validade'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{lot.currentQuantity} UN</td>
                    <td className="px-4 py-3 font-sans text-on-surface-variant">{lot.supplierName || '—'}</td>
                    <td className="px-4 py-3 font-sans">{getStatusBadge(lot.status)}</td>
                    <td className="px-4 py-3 text-right font-bold text-on-surface">
                      R$ {lot.unitCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
