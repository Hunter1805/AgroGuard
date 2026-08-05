import React, { useState } from 'react';
import { Bookmark, Plus, Search, XCircle } from 'lucide-react';
import { useToolReservations } from '../../../hooks/useToolReservations';
import { Button } from '../../ui/Button';
import { ToolReservationForm } from './ToolReservationForm';

export const ToolReservationList: React.FC = () => {
  const { reservations, loading, search, setSearch, cancelReservation, refetch } = useToolReservations();
  const [showFormModal, setShowFormModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Bookmark className="text-primary" size={18} />
            Reservas de Ferramentas
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Garantia de disponibilidade de ferramentas para preventivas e Ordens de Serviço futuras.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowFormModal(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Criar Reserva
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por reserva, ferramenta, solicitante ou OS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{reservations.length} reservas registradas</span>
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
                  <th className="px-4 py-3 font-medium">Ferramenta</th>
                  <th className="px-4 py-3 font-medium">Qtd.</th>
                  <th className="px-4 py-3 font-medium">Solicitante</th>
                  <th className="px-4 py-3 font-medium">OS / Ativo</th>
                  <th className="px-4 py-3 font-medium">Previsão Retirada</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{res.code}</td>
                    <td className="px-4 py-3 font-bold text-on-surface">{res.toolName}</td>
                    <td className="px-4 py-3 font-mono-label font-bold text-emerald-400">{res.quantity} UN</td>
                    <td className="px-4 py-3">{res.requesterName}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono-label font-bold text-on-surface block">{res.workOrderCode || 'Geral'}</span>
                      <span className="text-[10px] text-on-surface-variant/70 block">{res.equipmentName || 'Sem equipamento'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">
                      {new Date(res.expectedPickupDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          res.status === 'aprovada'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-surface-container text-on-surface-variant border-white/10'
                        }`}
                      >
                        {res.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {res.status === 'aprovada' && (
                        <button
                          onClick={async () => {
                            await cancelReservation(res.id, 'Cancelado pelo operador');
                            refetch();
                          }}
                          className="p-1 hover:bg-rose-500/15 rounded text-rose-400 transition-colors"
                          title="Cancelar Reserva"
                        >
                          <XCircle size={15} />
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

      {showFormModal && (
        <ToolReservationForm onClose={() => setShowFormModal(false)} onSuccess={() => { setShowFormModal(false); refetch(); }} />
      )}
    </div>
  );
};
