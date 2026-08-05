import React from 'react';
import type { StockReservation } from '../../../types/stock-reservation';
import { Bookmark } from 'lucide-react';

interface StockReservationsTabProps {
  reservations: StockReservation[];
}

export const StockReservationsTab: React.FC<StockReservationsTabProps> = ({ reservations }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <Bookmark size={16} className="text-primary" /> Reservas Programadas
      </h3>

      {reservations.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma reserva ativa para este item.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Cód. Reserva</th>
                <th className="px-3.5 py-2 font-medium">Solicitante</th>
                <th className="px-3.5 py-2 font-medium font-mono-label">OS / Equipamento</th>
                <th className="px-3.5 py-2 font-medium">Prev. Uso</th>
                <th className="px-3.5 py-2 font-medium">Qtd Reservada</th>
                <th className="px-3.5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 font-mono-label font-bold text-primary">{r.code}</td>
                  <td className="px-3.5 py-2.5 font-bold text-on-surface">{r.requesterName}</td>
                  <td className="px-3.5 py-2.5 font-mono-label">{r.workOrderCode || r.equipmentName || '—'}</td>
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">{new Date(r.expectedUseDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 font-mono-label font-bold text-emerald-400">{r.approvedQuantity} {r.controlUnit}</td>
                  <td className="px-3.5 py-2.5 capitalize font-bold text-blue-400">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
