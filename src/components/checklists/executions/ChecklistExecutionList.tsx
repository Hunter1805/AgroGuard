import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Eye, ShieldCheck, AlertCircle, CheckCircle2, Ban, XCircle } from 'lucide-react';
import type { ChecklistExecution } from '../../../types/checklist';
import { ChecklistValidationModal } from './ChecklistValidationModal';
import { ROUTE_HELPERS } from '../../../types/routes';
import { EmptyState } from '../../ui/EmptyState';
import { Button } from '../../ui/Button';

interface ChecklistExecutionListProps {
  executions: ChecklistExecution[];
  onOpenNew: () => void;
  onRefresh?: () => void;
}

export const ChecklistExecutionList: React.FC<ChecklistExecutionListProps> = ({
  executions,
  onOpenNew,
}) => {
  const navigate = useNavigate();
  const [validatingExecution, setValidatingExecution] = useState<ChecklistExecution | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 font-mono-label text-[10px]">Em Andamento</span>;
      case 'concluido':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 font-mono-label text-[10px]"><CheckCircle2 size={10} /> Concluído</span>;
      case 'concluido_com_nao_conformidade':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/15 text-error border border-error/30 font-mono-label text-[10px]"><AlertCircle size={10} /> Com NC</span>;
      case 'aguardando_validacao':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-mono-label text-[10px]">Pendente Validação</span>;
      case 'reprovado':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/20 text-error border border-error/40 font-mono-label text-[10px] font-bold"><XCircle size={10} /> Reprovada</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono-label text-[10px]">{status}</span>;
    }
  };

  const getConditionBadge = (cond?: string) => {
    if (!cond || cond === 'liberado') {
      return <span className="text-success font-semibold text-[11px] uppercase">Liberado</span>;
    }
    if (cond === 'liberado_com_restricao') {
      return <span className="text-warning font-semibold text-[11px] uppercase">Liberado com Restrição</span>;
    }
    return (
      <span className="inline-flex items-center gap-1 text-error font-bold text-[11px] uppercase bg-error/10 px-2 py-0.5 rounded border border-error/30">
        <Ban size={12} /> Bloqueado
      </span>
    );
  };

  if (executions.length === 0) {
    return (
      <EmptyState
        title="Nenhuma execução encontrada"
        description="Os checklists realizados ou em preenchimento de inspeção aparecerão nesta listagem."
        action={
          <Button variant="primary" size="sm" onClick={onOpenNew}>
            Iniciar Primeiro Checklist
          </Button>
        }
      />
    );
  }

  return (
    <div className="glass-card bg-surface-container-highest/30 border border-white/10 rounded-xl overflow-hidden shadow-lg animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest/60 text-on-surface-variant font-mono-label text-[10px] uppercase border-b border-white/10">
              <th className="px-4 py-3 font-semibold">Código</th>
              <th className="px-4 py-3 font-semibold">Checklist</th>
              <th className="px-4 py-3 font-semibold">Equipamento</th>
              <th className="px-4 py-3 font-semibold">Operador</th>
              <th className="px-4 py-3 font-semibold">Data / Horímetro</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Condição</th>
              <th className="px-4 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[12px] text-on-surface-variant">
            {executions.map((ex) => (
              <tr key={ex.id} className="hover:bg-surface-container-highest/40 transition-colors">
                <td className="px-4 py-3.5 font-mono-label text-on-surface font-semibold">
                  {ex.code || ex.id}
                </td>
                <td className="px-4 py-3.5 text-on-surface font-medium">
                  {ex.templateName}
                  <span className="block text-[10px] text-on-surface-variant/70 font-mono-label uppercase">
                    v{ex.templateVersion} • {ex.templateType}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <strong className="text-on-surface block">{ex.equipmentCode}</strong>
                  <span className="text-[11px] text-on-surface-variant/80 truncate block max-w-[150px]">
                    {ex.equipmentName}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-on-surface font-medium block">{ex.operatorName}</span>
                  {ex.validatorName && (
                    <span className="text-[10px] text-primary block font-mono-label">
                      Val: {ex.validatorName}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 font-mono-label">
                  <span className="block text-on-surface">{ex.startedAt?.slice(0, 10)}</span>
                  {ex.horimeterReading !== undefined && (
                    <span className="text-[11px] text-primary">{ex.horimeterReading.toLocaleString('pt-BR')} h/km</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {getStatusBadge(ex.status)}
                </td>
                <td className="px-4 py-3.5">
                  {getConditionBadge(ex.finalCondition)}
                </td>
                <td className="px-4 py-3.5 text-right space-x-1">
                  {ex.status === 'em_andamento' ? (
                    <button
                      onClick={() => navigate(ROUTE_HELPERS.checklistExecution(ex.id))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-medium text-[11px] hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <Play size={12} /> Continuar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate(ROUTE_HELPERS.checklistExecution(ex.id))}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container border border-white/10 hover:text-primary transition-colors text-[11px] cursor-pointer"
                        title="Ver ficha do checklist concluído"
                      >
                        <Eye size={13} /> Visualizar
                      </button>
                      <button
                        onClick={() => setValidatingExecution(ex)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/20 border border-secondary/30 text-secondary hover:bg-secondary/30 transition-colors text-[11px] cursor-pointer"
                        title="Validar pelo supervisor"
                      >
                        <ShieldCheck size={13} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {validatingExecution && (
        <ChecklistValidationModal
          execution={validatingExecution}
          isOpen={!!validatingExecution}
          onClose={() => setValidatingExecution(null)}
          onApprove={async (valName, comm) => {
            validatingExecution.status = 'concluido';
            validatingExecution.validatorName = valName;
            if (comm) validatingExecution.generalNotes = comm;
          }}
          onReject={async (reason, valName) => {
            validatingExecution.status = 'reprovado' as any;
            validatingExecution.validatorName = valName;
            validatingExecution.rejectionReason = reason;
          }}
        />
      )}
    </div>
  );
};
