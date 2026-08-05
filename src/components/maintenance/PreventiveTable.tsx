import React from 'react';
import type { MaintenanceItem } from '../../types';
import { Badge } from '../ui/Badge';

interface PreventiveTableProps {
  items: MaintenanceItem[];
}

export const PreventiveTable: React.FC<PreventiveTableProps> = ({ items }) => {
  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <table className="w-full text-[13px] text-left border-collapse">
        <thead>
          <tr className="text-on-surface-variant/60 font-mono-label text-[11px] uppercase bg-surface-container-highest/30 border-b border-white/5">
            <th className="p-4">CÓDIGO</th>
            <th className="p-4">EQUIPAMENTO</th>
            <th className="p-4">TIPO</th>
            <th className="p-4">DESCRIÇÃO</th>
            <th className="p-4">PRAZO</th>
            <th className="p-4">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface-container-highest/30 transition-colors">
              <td className="p-4 font-mono-label text-on-surface font-medium">{item.id}</td>
              <td className="p-4 font-medium text-on-surface">{item.equipment}</td>
              <td className="p-4 text-on-surface-variant">{item.type}</td>
              <td className="p-4 text-on-surface-variant/80 max-w-md">{item.description}</td>
              <td className="p-4 font-mono-label text-[12px]">{item.due}</td>
              <td className="p-4">
                <Badge
                  variant={
                    item.status === 'vencida' ? 'error' : item.status === 'pendente' ? 'tertiary' : 'primary'
                  }
                >
                  {item.status.toUpperCase()}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
