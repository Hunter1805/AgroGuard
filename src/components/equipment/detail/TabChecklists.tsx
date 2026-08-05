import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../ui/StatusBadge';

interface TabChecklistsProps {
  equipment?: Equipment;
}

const mockChecklists = [
  { id: 'CHK-089', date: '04/08/2026 06:30', model: 'Checklist Diário Tratores', status: 'Concluído', nonConformities: 0, operator: 'Paulo Souza' },
  { id: 'CHK-075', date: '03/08/2026 06:45', model: 'Checklist Diário Tratores', status: 'Com Ressalva', nonConformities: 1, operator: 'Carlos Silva' },
  { id: 'CHK-060', date: '02/08/2026 06:30', model: 'Checklist Diário Tratores', status: 'Concluído', nonConformities: 0, operator: 'Paulo Souza' },
];

export const TabChecklists: React.FC<TabChecklistsProps> = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-[14px] font-semibold text-on-surface">Inspeções e Checklists Executados</h4>
          <p className="text-[12px] text-on-surface-variant/70">Histórico de verificações operacionais pré-trabalho.</p>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-[12px] text-left">
          <thead>
            <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
              <th className="px-4 py-2.5 font-medium">Código</th>
              <th className="px-4 py-2.5 font-medium">Data / Hora</th>
              <th className="px-4 py-2.5 font-medium">Modelo de Checklist</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Não Conformidades</th>
              <th className="px-4 py-2.5 font-medium">Operador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {mockChecklists.map((c) => (
              <tr key={c.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label text-primary font-semibold">{c.id}</td>
                <td className="px-4 py-3 font-mono-label">{c.date}</td>
                <td className="px-4 py-3 font-medium text-on-surface">{c.model}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 font-mono-label">
                  {c.nonConformities > 0 ? (
                    <span className="text-warning flex items-center gap-1 font-bold">
                      <AlertCircle size={13} /> {c.nonConformities} item(ns)
                    </span>
                  ) : (
                    <span className="text-success flex items-center gap-1">
                      <CheckCircle2 size={13} /> 0 pendências
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{c.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
