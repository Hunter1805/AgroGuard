import React, { useState } from 'react';
import { Wrench, Plus, Search } from 'lucide-react';
import { useToolMaintenances } from '../../../hooks/useToolMaintenances';
import { Button } from '../../ui/Button';
import { ToolMaintenanceForm } from './ToolMaintenanceForm';
import type { ToolMaintenance } from '../../../types/tool-maintenance';

export const ToolMaintenanceList: React.FC = () => {
  const { maintenances, loading, search, setSearch, completeMaintenance, refetch } = useToolMaintenances();
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: ToolMaintenance['status']) => {
    switch (status) {
      case 'em_execucao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Em Execução</span>;
      case 'concluida':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Concluída</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Aberta</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Wrench className="text-primary" size={18} />
            Manutenções das Ferramentas da Oficina
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Registro de revisões, trocas de componente, lubrificações e consertos de equipamentos próprios.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Enviar para Manutenção
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por ferramenta, fornecedor ou problema..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{maintenances.length} registros</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando manutenções...</div>
        ) : maintenances.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Wrench className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma manutenção registrada</p>
            <p className="text-xs text-on-surface-variant/70">As revisões e consertos das ferramentas aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Ferramenta</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Problema Relatado</th>
                  <th className="px-4 py-3 font-medium">Oficina / Prestador</th>
                  <th className="px-4 py-3 font-medium">Data Abertura</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Custo / Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {maintenances.map(mnt => (
                  <tr key={mnt.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-on-surface block font-sans">{mnt.toolName}</span>
                      <span className="text-[10px] text-primary block font-mono-label font-bold">{mnt.toolCode}</span>
                    </td>
                    <td className="px-4 py-3 font-mono-label uppercase text-[10px] font-bold text-amber-400">{mnt.type}</td>
                    <td className="px-4 py-3 max-w-xs truncate font-sans text-on-surface-variant/90">{mnt.problemDescription}</td>
                    <td className="px-4 py-3 font-sans">{mnt.providerName || 'Oficina Interna'}</td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(mnt.openedDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{getStatusBadge(mnt.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {mnt.status === 'em_execucao' ? (
                        <button
                          onClick={async () => {
                            await completeMaintenance(mnt.id, {
                              serviceExecuted: 'Substituição de vedações e lubrificação técnica',
                              cost: 180,
                            });
                            refetch();
                          }}
                          className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold hover:bg-emerald-500/25 transition-colors"
                        >
                          Concluir Reparo
                        </button>
                      ) : (
                        <span className="font-mono-label font-bold text-on-surface">
                          R$ {(mnt.cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ToolMaintenanceForm onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); refetch(); }} />
      )}
    </div>
  );
};
