import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle2, AlertTriangle, Eye, Ban, Wrench, ShieldAlert } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { useChecklistExecution } from '../../../../hooks/useChecklistExecution';
import { useChecklistNonConformities } from '../../../../hooks/useChecklistNonConformities';
import { StartChecklistModal } from '../../../checklists/executions/StartChecklistModal';
import { NonConformityDetailDrawer } from '../../../checklists/nonconformities/NonConformityDetailDrawer';
import { NonConformityResolutionModal } from '../../../checklists/nonconformities/NonConformityResolutionModal';
import { ROUTE_HELPERS } from '../../../../types/routes';
import type { ChecklistNonConformity } from '../../../../types/checklist';

interface ChecklistsTabProps {
  equipment?: Equipment;
  checklists?: any;
  onStartChecklist?: () => void;
}

export const ChecklistsTab: React.FC<ChecklistsTabProps> = ({
  equipment,
  onStartChecklist,
}) => {
  const navigate = useNavigate();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [selectedNCForDetail, setSelectedNCForDetail] = useState<ChecklistNonConformity | null>(null);
  const [selectedNCForResolve, setSelectedNCForResolve] = useState<ChecklistNonConformity | null>(null);

  const { executions, setFilters: setExecFilters, loading: execLoading } = useChecklistExecution();
  const { nonConformities, resolveNonConformity, linkOrder } = useChecklistNonConformities(equipment?.id);

  useEffect(() => {
    if (equipment?.id) {
      setExecFilters((p) => ({ ...p, equipmentId: equipment.id }));
    }
  }, [equipment?.id, setExecFilters]);

  const handleStartClick = () => {
    if (onStartChecklist) {
      onStartChecklist();
    } else {
      setIsStartModalOpen(true);
    }
  };

  const pendingNCs = nonConformities.filter((n) => n.status !== 'resolvida' && n.status !== 'cancelada');

  return (
    <div className="space-y-6 animate-fade-in text-[12px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-highest/40 p-4 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            Inspeções & Checklists da Máquina
          </h3>
          <p className="text-[12px] text-on-surface-variant/80">
            Histórico auditable do ativo e controle em tempo real de não conformidades (Fase 4).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={handleStartClick}
          className="shadow-lg shadow-primary/20 scale-102 font-bold"
        >
          Iniciar Checklist para Esta Máquina
        </Button>
      </div>

      {/* Cards Indicadores Específicos Deste Equipamento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-label">
        <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant/70 uppercase">Total de Inspeções</span>
          <p className="text-[20px] font-bold text-on-surface mt-1">{executions.length}</p>
        </div>

        <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant/70 uppercase">Condição Operacional</span>
          <p className={`text-[15px] font-bold mt-1 uppercase ${equipment?.status === 'bloqueado' ? 'text-error flex items-center gap-1' : 'text-success'}`}>
            {equipment?.status === 'bloqueado' ? <><Ban size={15} /> Bloqueada</> : 'Liberada'}
          </p>
        </div>

        <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant/70 uppercase">Falhas / Avarias Abertas</span>
          <p className={`text-[20px] font-bold mt-1 ${pendingNCs.length > 0 ? 'text-error flex items-center gap-1' : 'text-success'}`}>
            {pendingNCs.length > 0 && <AlertTriangle size={17} />} {pendingNCs.length}
          </p>
        </div>

        <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant/70 uppercase">Último Apontamento</span>
          <p className="text-[14px] font-bold text-primary mt-1">
            {executions[0]?.startedAt?.slice(0, 10) || 'Sem histórico'}
          </p>
        </div>
      </div>

      {/* Tabela de Pendências / Não Conformidades Deste Ativo */}
      {pendingNCs.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[13px] font-mono-label font-bold text-error uppercase flex items-center gap-1.5">
            <ShieldAlert size={15} /> Avarias Mecânicas Pendentes nesta Máquina ({pendingNCs.length})
          </h4>
          <div className="glass-card bg-error/5 border border-error/30 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-error/10 text-error font-mono-label text-[10px] uppercase border-b border-error/20">
                    <th className="px-3.5 py-2 font-bold">Código / Avaria</th>
                    <th className="px-3.5 py-2 font-bold">Criticidade</th>
                    <th className="px-3.5 py-2 font-bold">Ação Imediata</th>
                    <th className="px-3.5 py-2 text-right">Tratamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-error/15">
                  {pendingNCs.map((nc) => (
                    <tr key={nc.id} className="hover:bg-error/10 transition-colors">
                      <td className="px-3.5 py-2.5 font-semibold text-on-surface">
                        <span className="text-error font-mono-label mr-2">{nc.code}</span> {nc.title}
                      </td>
                      <td className="px-3.5 py-2.5 uppercase text-[11px] font-mono-label font-extrabold text-error">
                        {nc.criticality} {nc.blockedEquipment && '(Bloqueante)'}
                      </td>
                      <td className="px-3.5 py-2.5 text-[11px] text-on-surface-variant">
                        {nc.immediateAction || 'Notificada oficina'}
                      </td>
                      <td className="px-3.5 py-2.5 text-right space-x-1">
                        <Button variant="outline" size="sm" onClick={() => setSelectedNCForDetail(nc)} className="text-[11px]">
                          Ver Detalhes
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => setSelectedNCForResolve(nc)} icon={<Wrench size={13} />} className="text-[11px]">
                          Resolver Falha
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Histórico de Execuções de Checklists */}
      <div className="space-y-2">
        <h4 className="text-[13px] font-mono-label font-bold text-on-surface uppercase flex items-center gap-1.5">
          <CheckCircle2 size={15} className="text-primary" /> Execuções Anteriores
        </h4>
        
        <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
          {execLoading ? (
            <div className="py-8 text-center text-on-surface-variant font-mono-label animate-pulse">Carregando inspeções desta máquina...</div>
          ) : executions.length === 0 ? (
            <EmptyState
              title="Nenhum checklist realizado nesta máquina"
              description="Realize a primeira verificação pré-operacional, diária ou de segurança em campo."
              action={
                <Button variant="primary" size="sm" onClick={() => setIsStartModalOpen(true)}>
                  Iniciar Primeiro Checklist
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-left">
                <thead>
                  <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/10">
                    <th className="px-3.5 py-2.5 font-medium">Código</th>
                    <th className="px-3.5 py-2.5 font-medium">Modelo / Tipo</th>
                    <th className="px-3.5 py-2.5 font-medium">Data / Horímetro</th>
                    <th className="px-3.5 py-2.5 font-medium">Operador</th>
                    <th className="px-3.5 py-2.5 font-medium">Condição</th>
                    <th className="px-3.5 py-2.5 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-on-surface-variant">
                  {executions.map((ex) => (
                    <tr key={ex.id} className="hover:bg-surface-container-highest/20 transition-colors">
                      <td className="px-3.5 py-3 font-mono-label font-bold text-primary">{ex.code || ex.id}</td>
                      <td className="px-3.5 py-3 font-medium text-on-surface">{ex.templateName}</td>
                      <td className="px-3.5 py-3 font-mono-label">
                        <span className="block text-on-surface">{ex.startedAt?.slice(0, 10)}</span>
                        {ex.horimeterReading !== undefined && <span className="text-[11px] text-secondary">{ex.horimeterReading} {equipment?.meterType === 'odometro' ? 'km' : 'h'}</span>}
                      </td>
                      <td className="px-3.5 py-3">{ex.operatorName}</td>
                      <td className="px-3.5 py-3 font-mono-label uppercase text-[11px]">
                        {ex.finalCondition === 'bloqueado' ? (
                          <span className="text-error font-bold flex items-center gap-1"><Ban size={12} /> Bloqueado</span>
                        ) : ex.finalCondition === 'liberado_com_restricao' ? (
                          <span className="text-warning font-semibold">Com Restrição</span>
                        ) : (
                          <span className="text-success font-semibold">Liberado</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <button
                          onClick={() => navigate(ROUTE_HELPERS.checklistExecution(ex.id))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container border border-white/10 hover:text-primary transition-colors text-[11px] cursor-pointer"
                        >
                          <Eye size={13} /> Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <StartChecklistModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        initialEquipmentId={equipment?.id}
      />

      <NonConformityDetailDrawer
        nonConformity={selectedNCForDetail}
        isOpen={!!selectedNCForDetail}
        onClose={() => setSelectedNCForDetail(null)}
        onOpenResolve={(nc) => setSelectedNCForResolve(nc)}
        onLinkOrder={linkOrder}
      />

      <NonConformityResolutionModal
        nonConformity={selectedNCForResolve}
        isOpen={!!selectedNCForResolve}
        onClose={() => setSelectedNCForResolve(null)}
        onResolve={(id, sol, by, photo, unblock) => resolveNonConformity(id, sol, by, photo, unblock)}
      />
    </div>
  );
};
