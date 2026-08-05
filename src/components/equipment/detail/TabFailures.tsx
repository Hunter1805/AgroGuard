import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { PriorityBadge } from '../../ui/PriorityBadge';

interface TabFailuresProps {
  equipment?: Equipment;
}

const mockFailures = [
  { id: 'FL-014', date: '02/08/2026', system: 'Sistema Hidráulico', symptom: 'Pressão de óleo abaixo do mínimo', cause: 'Filtro de sucção obstruído', priority: 'Crítico' as const, status: 'Em Investigação' },
  { id: 'FL-009', date: '20/07/2026', system: 'Sistema Elétrico', symptom: 'Bateria descarregando com motor ligado', cause: 'Correia do alternador frouxa', priority: 'Médio' as const, status: 'Resolvido' },
];

export const TabFailures: React.FC<TabFailuresProps> = () => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[14px] font-semibold text-on-surface">Falhas e Sintomas Reportados</h4>
        <p className="text-[12px] text-on-surface-variant/70">Histórico de anomalias técnicas e causas identificadas.</p>
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-[12px] text-left">
          <thead>
            <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
              <th className="px-4 py-2.5 font-medium">Cód.</th>
              <th className="px-4 py-2.5 font-medium">Data</th>
              <th className="px-4 py-2.5 font-medium">Sistema Afetado</th>
              <th className="px-4 py-2.5 font-medium">Sintoma Relatado</th>
              <th className="px-4 py-2.5 font-medium">Severidade</th>
              <th className="px-4 py-2.5 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {mockFailures.map((f) => (
              <tr key={f.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label text-error font-bold">{f.id}</td>
                <td className="px-4 py-3 font-mono-label">{f.date}</td>
                <td className="px-4 py-3 font-medium text-on-surface">{f.system}</td>
                <td className="px-4 py-3">{f.symptom}</td>
                <td className="px-4 py-3"><PriorityBadge priority={f.priority} /></td>
                <td className="px-4 py-3 font-mono-label">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
