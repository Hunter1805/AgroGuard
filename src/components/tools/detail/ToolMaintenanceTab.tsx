import React from 'react';
import type { ToolMaintenance } from '../../../types/tool-maintenance';
import { Wrench } from 'lucide-react';

interface ToolMaintenanceTabProps {
  maintenances: ToolMaintenance[];
}

export const ToolMaintenanceTab: React.FC<ToolMaintenanceTabProps> = ({ maintenances }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <Wrench size={16} className="text-primary" /> Histórico de Manutenções Próprias
      </h3>

      {maintenances.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma manutenção realizada nesta ferramenta.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Data</th>
                <th className="px-3.5 py-2 font-medium">Tipo</th>
                <th className="px-3.5 py-2 font-medium">Problema</th>
                <th className="px-3.5 py-2 font-medium">Fornecedor</th>
                <th className="px-3.5 py-2 font-medium text-right">Custo (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
              {maintenances.map(m => (
                <tr key={m.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5">{new Date(m.openedDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 uppercase font-bold text-amber-400 text-[10px]">{m.type}</td>
                  <td className="px-3.5 py-2.5 font-sans">{m.problemDescription}</td>
                  <td className="px-3.5 py-2.5 font-sans">{m.providerName || 'Interna'}</td>
                  <td className="px-3.5 py-2.5 text-right font-bold text-on-surface">R$ {(m.cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
