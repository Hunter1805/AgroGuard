import React from 'react';
import { Bookmark } from 'lucide-react';
import { useToolReservations } from '../../../hooks/useToolReservations';

interface ToolReservationsTabProps {
  toolId: string;
}

export const ToolReservationsTab: React.FC<ToolReservationsTabProps> = ({ toolId }) => {
  const { reservations, loading } = useToolReservations();
  const toolRes = reservations.filter(r => r.toolId === toolId);

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <Bookmark size={16} className="text-primary" /> Reservas Programadas para esta Ferramenta
      </h3>

      {loading ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Carregando reservas...</p>
      ) : toolRes.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma reserva ativa para esta ferramenta.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-label">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 uppercase border-b border-white/5">
                <th className="px-3.5 py-2">Código</th>
                <th className="px-3.5 py-2 font-sans">Solicitante</th>
                <th className="px-3.5 py-2">OS / Ativo</th>
                <th className="px-3.5 py-2">Previsão Retirada</th>
                <th className="px-3.5 py-2">Qtd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {toolRes.map(r => (
                <tr key={r.id}>
                  <td className="px-3.5 py-2 text-primary font-bold">{r.code}</td>
                  <td className="px-3.5 py-2 font-sans text-on-surface">{r.requesterName}</td>
                  <td className="px-3.5 py-2">{r.workOrderCode || r.equipmentName || '—'}</td>
                  <td className="px-3.5 py-2">{new Date(r.expectedPickupDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2 font-bold text-emerald-400">{r.quantity} UN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
