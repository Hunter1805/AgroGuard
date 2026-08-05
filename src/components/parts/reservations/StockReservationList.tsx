import React, { useState } from 'react';
import { Bookmark, Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useStockReservations } from '../../../hooks/useStockReservations';
import { Button } from '../../ui/Button';
import { StockReservationForm } from './StockReservationForm';

export const StockReservationList: React.FC = () => {
  const { reservations, loading, filters, setFilters, fulfillReservation, cancelReservation, refetch } = useStockReservations();
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovada':
      case 'separada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Separada / Aprovada</span>;
      case 'atendida':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Atendida</span>;
      case 'cancelada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Cancelada</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Bookmark className="text-primary" size={18} />
            Reservas de Peças e Insumos
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Material fisicamente separado ou garantido para Ordens de Serviço e Preventivas programadas.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowForm(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Criar Reserva
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar reserva, item, solicitante ou OS..."
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{reservations.length} reservas encontradas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando reservas...</div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bookmark className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma reserva ativa</p>
            <p className="text-xs text-on-surface-variant/70">As reservas para preventivas e OSs agendadas aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Cód. Reserva</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Qtd Reservada</th>
                  <th className="px-4 py-3 font-medium">Solicitante</th>
                  <th className="px-4 py-3 font-medium">OS / Ativo</th>
                  <th className="px-4 py-3 font-medium">Prev. Utilização</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{res.code}</td>
                    <td className="px-4 py-3 font-bold text-on-surface">{res.itemName}</td>
                    <td className="px-4 py-3 font-mono-label font-bold text-emerald-400">
                      {res.approvedQuantity} {res.controlUnit}
                    </td>
                    <td className="px-4 py-3">{res.requesterName}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono-label font-bold text-on-surface block">{res.workOrderCode || 'Geral'}</span>
                      <span className="text-[10px] text-on-surface-variant/70 block">{res.equipmentName || '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(res.expectedUseDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{getStatusBadge(res.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {(res.status === 'aprovada' || res.status === 'separada') && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={async () => {
                              await fulfillReservation(res.id, res.approvedQuantity - res.fulfilledQuantity, 'Roberto Alves');
                              refetch();
                            }}
                            className="px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded hover:bg-emerald-500/25 font-bold text-[10px] flex items-center gap-1"
                            title="Entregar Material (Baixa de Reserva)"
                          >
                            <CheckCircle2 size={13} /> Entregar
                          </button>
                          <button
                            onClick={async () => {
                              await cancelReservation(res.id, 'Cancelada pelo operador');
                              refetch();
                            }}
                            className="p-1 hover:bg-rose-500/15 rounded text-rose-400"
                            title="Cancelar Reserva"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
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
        <StockReservationForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refetch(); }} />
      )}
    </div>
  );
};
