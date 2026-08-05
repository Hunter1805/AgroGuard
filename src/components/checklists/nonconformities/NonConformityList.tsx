import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Wrench, Eye, Ban, Link2 } from 'lucide-react';
import type { ChecklistNonConformity } from '../../../types/checklist';
import { NonConformityFilters } from './NonConformityFilters';
import { NonConformityDetailDrawer } from './NonConformityDetailDrawer';
import { NonConformityResolutionModal } from './NonConformityResolutionModal';
import { useChecklistNonConformities } from '../../../hooks/useChecklistNonConformities';
import { EmptyState } from '../../ui/EmptyState';

interface NonConformityListProps {
  initialEquipmentId?: string;
}

export const NonConformityList: React.FC<NonConformityListProps> = ({ initialEquipmentId }) => {
  const {
    nonConformities,
    loading,
    error,
    filters,
    setFilters,
    resolveNonConformity,
    linkOrder,
  } = useChecklistNonConformities(initialEquipmentId);

  const [selectedForDetail, setSelectedForDetail] = useState<ChecklistNonConformity | null>(null);
  const [selectedForResolve, setSelectedForResolve] = useState<ChecklistNonConformity | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <span className="px-2 py-0.5 rounded-full bg-error/15 text-error border border-error/30 font-mono-label text-[10px] font-bold">Aberta</span>;
      case 'em_tratamento':
        return <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 font-mono-label text-[10px]">Em Tratamento</span>;
      case 'aguardando_os':
        return <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-mono-label text-[10px]">Aguardando OS</span>;
      case 'resolvida':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 font-mono-label text-[10px] font-semibold"><CheckCircle2 size={11} /> Resolvida</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono-label text-[10px]">{status}</span>;
    }
  };

  const getCriticalityBadge = (crit: string) => {
    return (
      <span className={`inline-flex items-center gap-1 uppercase font-mono-label font-extrabold text-[11px] ${
        crit === 'critica' || crit === 'alta' ? 'text-error' : crit === 'media' ? 'text-warning' : 'text-primary'
      }`}>
        {crit === 'critica' && <ShieldAlert size={13} />}
        {crit}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center font-mono-label text-on-surface-variant animate-pulse">Carregando avarias mecânicas e pendências...</div>;

  return (
    <div className="space-y-4 animate-fade-in text-[12px]">
      <NonConformityFilters
        filters={filters}
        onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
        onClear={() => setFilters({ search: '', status: 'todos', criticality: 'todas', equipmentId: initialEquipmentId || '', onlyBlocked: false })}
      />

      {error && <div className="p-3 bg-error/15 text-error rounded-xl font-medium">{error}</div>}

      {nonConformities.length === 0 ? (
        <EmptyState
          title="Nenhuma pendência operacional encontrada"
          description="Excelente! A frota não apresenta avarias mecânicas abertas nem itens não conformes sob os filtros selecionados."
        />
      ) : (
        <div className="glass-card bg-surface-container-highest/30 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/60 text-on-surface-variant font-mono-label text-[10px] uppercase border-b border-white/10">
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Falha / Avaria</th>
                  <th className="px-4 py-3 font-semibold">Equipamento</th>
                  <th className="px-4 py-3 font-semibold">Criticidade</th>
                  <th className="px-4 py-3 font-semibold">Status / Vínculo</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[12px] text-on-surface-variant">
                {nonConformities.map((nc) => (
                  <tr key={nc.id} className="hover:bg-surface-container-highest/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono-label text-on-surface font-bold">
                      {nc.code}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <strong className="text-on-surface block truncate">{nc.title}</strong>
                      <span className="text-[11px] text-on-surface-variant/70 block truncate">{nc.checklistName} • {nc.itemTitle}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <strong className="text-on-surface block">{nc.equipmentCode}</strong>
                      {nc.blockedEquipment && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-label uppercase font-extrabold bg-error/20 text-error px-1.5 rounded">
                          <Ban size={11} /> Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {getCriticalityBadge(nc.criticality)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div>{getStatusBadge(nc.status)}</div>
                        {nc.generatedOrderId && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-secondary font-mono-label font-bold">
                            <Link2 size={11} /> {nc.generatedOrderId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedForDetail(nc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container border border-white/10 hover:text-primary transition-colors text-[11px] cursor-pointer"
                        title="Ver ficha de avaria e fotos"
                      >
                        <Eye size={13} /> Visualizar
                      </button>
                      {nc.status !== 'resolvida' && nc.status !== 'cancelada' && (
                        <button
                          onClick={() => setSelectedForResolve(nc)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-[11px] cursor-pointer"
                        >
                          <Wrench size={13} /> Resolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NonConformityDetailDrawer
        nonConformity={selectedForDetail}
        isOpen={!!selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
        onOpenResolve={(n) => setSelectedForResolve(n)}
        onLinkOrder={linkOrder}
      />

      <NonConformityResolutionModal
        nonConformity={selectedForResolve}
        isOpen={!!selectedForResolve}
        onClose={() => setSelectedForResolve(null)}
        onResolve={(id, sol, by, photo, unblock) => resolveNonConformity(id, sol, by, photo, unblock)}
      />
    </div>
  );
};
