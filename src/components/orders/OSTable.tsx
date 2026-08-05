import React from 'react';
import type { ServiceOrder } from '../../types';
import { Badge } from '../ui/Badge';

interface OSTableProps {
  orders: ServiceOrder[];
}

export const OSTable: React.FC<OSTableProps> = ({ orders }) => {
  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <table className="w-full text-[13px] text-left border-collapse">
        <thead>
          <tr className="text-on-surface-variant/60 font-mono-label text-[11px] uppercase bg-surface-container-highest/30 border-b border-white/5">
            <th className="p-4">OS #</th>
            <th className="p-4">EQUIPAMENTO</th>
            <th className="p-4">TIPO</th>
            <th className="p-4">TÉCNICO</th>
            <th className="p-4">ESTIMATIVA</th>
            <th className="p-4">DATA</th>
            <th className="p-4">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((os) => (
            <tr key={os.id} className="hover:bg-surface-container-highest/30 transition-colors">
              <td className="p-4 font-mono-label text-on-surface font-semibold">{os.id}</td>
              <td className="p-4 text-on-surface font-medium">{os.equipment}</td>
              <td className="p-4 text-on-surface-variant">{os.type}</td>
              <td className="p-4 text-on-surface-variant">{os.technician}</td>
              <td className="p-4 font-mono-label text-on-surface">{os.costEstimate}</td>
              <td className="p-4 font-mono-label text-[12px] text-on-surface-variant">{os.date}</td>
              <td className="p-4">
                <Badge
                  variant={
                    os.status === 'Em Progresso'
                      ? 'tertiary'
                      : os.status === 'Concluída'
                      ? 'primary'
                      : os.status === 'Aguardando Peça'
                      ? 'neutral'
                      : 'error'
                  }
                >
                  {os.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
