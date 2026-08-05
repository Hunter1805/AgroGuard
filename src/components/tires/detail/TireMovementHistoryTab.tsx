import React from 'react';
import type { TireMovementLog } from '../../../types/tire-movement';
import { History } from 'lucide-react';

interface TireMovementHistoryTabProps {
  movements: TireMovementLog[];
}

export const TireMovementHistoryTab: React.FC<TireMovementHistoryTabProps> = ({ movements }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <History size={16} className="text-primary" /> Histórico Operacional e Movimentações
      </h3>

      {movements.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma movimentação cadastrada para este pneu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2.5 font-medium">Data / Hora</th>
                <th className="px-3.5 py-2.5 font-medium">Ação</th>
                <th className="px-3.5 py-2.5 font-medium">Equipamento</th>
                <th className="px-3.5 py-2.5 font-medium">Origem / Destino</th>
                <th className="px-3.5 py-2.5 font-medium">Leitura (h/km)</th>
                <th className="px-3.5 py-2.5 font-medium">Responsável</th>
                <th className="px-3.5 py-2.5 font-medium">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {movements.map(m => (
                <tr key={m.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">
                    {new Date(m.date).toLocaleDateString('pt-BR')} {new Date(m.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3.5 py-2.5 font-bold uppercase text-primary text-[10px]">{m.action}</td>
                  <td className="px-3.5 py-2.5 font-medium">{m.equipmentName || '—'}</td>
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">
                    {m.originPositionName && <span className="block text-on-surface-variant/70">De: {m.originPositionName}</span>}
                    {m.destinationPositionName && <span className="block font-bold text-emerald-400">Para: {m.destinationPositionName}</span>}
                    {!m.originPositionName && !m.destinationPositionName && '—'}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono-label">{m.reading ?? '—'}</td>
                  <td className="px-3.5 py-2.5">{m.responsibleName}</td>
                  <td className="px-3.5 py-2.5 text-[11px] text-on-surface-variant/80">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
