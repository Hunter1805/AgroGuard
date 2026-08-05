import React from 'react';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentFailureSummary, EquipmentRecurrentFailureGroup } from '../../../../types/equipment-detail';
import { Button } from '../../../ui/Button';
import { PriorityBadge } from '../../../ui/PriorityBadge';
import { EmptyState } from '../../../ui/EmptyState';

interface FailuresTabProps {
  equipment?: Equipment;
  failures: EquipmentFailureSummary[];
  recurrentFailures: EquipmentRecurrentFailureGroup[];
  onRegisterFailure?: () => void;
}

export const FailuresTab: React.FC<FailuresTabProps> = ({
  failures,
  recurrentFailures,
  onRegisterFailure,
}) => {
  const criticalCount = failures.filter((f) => f.criticality === 'Alto' || f.criticality === 'Crítico').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Falhas, Sintomas e Anomalias Técnicas
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Registro de quebras, desvios operacionais e diagnóstico de causas raízes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onRegisterFailure}
        >
          Registrar Falha
        </Button>
      </div>

      {/* Cards Indicadores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Total de Falhas</span>
          <p className="text-[20px] font-bold text-on-surface mt-1">{failures.length}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Falhas Críticas</span>
          <p className="text-[20px] font-bold text-error mt-1">{criticalCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Falhas Recorrentes</span>
          <p className="text-[20px] font-bold text-warning mt-1">{recurrentFailures.length}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Sistema Mais Afetado</span>
          <p className="text-[14px] font-bold text-primary truncate mt-1">Sistema Hidráulico</p>
        </div>
      </div>

      {/* Bloco de Falhas Recorrentes */}
      {recurrentFailures.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-warning/30 bg-warning/5 space-y-3">
          <h4 className="text-[13px] font-bold text-on-surface flex items-center gap-2">
            <RefreshCw size={15} className="text-warning" /> Padrões de Falhas Recorrentes Identificados
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
            {recurrentFailures.map((rf, idx) => (
              <div key={idx} className="bg-surface-container-highest/50 p-3 rounded-lg border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface">{rf.system} ({rf.subsystem})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/20 text-warning font-mono-label">
                    {rf.occurrencesCount}x Ocorrências
                  </span>
                </div>
                <p className="text-on-surface-variant/80 text-[11px]">{rf.symptom}</p>
                <p className="text-[10px] text-on-surface-variant/50 font-mono-label pt-1">
                  Último registro: {rf.lastOccurrenceDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listagem de Falhas */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <AlertTriangle size={15} className="text-error" /> Histórico de Apontamento de Falhas
        </h4>

        {failures.length === 0 ? (
          <EmptyState
            title="Nenhuma falha registrada"
            description="Não existem registros de falhas ou sintomas reportados para este equipamento."
            action={
              <Button variant="outline" size="sm" onClick={onRegisterFailure}>
                Registrar Primeira Falha
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Cód.</th>
                  <th className="px-3.5 py-2.5 font-medium">Data</th>
                  <th className="px-3.5 py-2.5 font-medium">Sistema / Componente</th>
                  <th className="px-3.5 py-2.5 font-medium">Sintoma Relatado</th>
                  <th className="px-3.5 py-2.5 font-medium">Causa Identificada</th>
                  <th className="px-3.5 py-2.5 font-medium">Criticidade</th>
                  <th className="px-3.5 py-2.5 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {failures.map((f) => (
                  <tr key={f.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-mono-label font-bold text-error">{f.code}</td>
                    <td className="px-3.5 py-3 font-mono-label">{f.date}</td>
                    <td className="px-3.5 py-3 font-medium text-on-surface">
                      {f.system} {f.component ? `(${f.component})` : ''}
                    </td>
                    <td className="px-3.5 py-3">{f.symptom}</td>
                    <td className="px-3.5 py-3 italic text-on-surface-variant/70">{f.causeIdentified || 'Em análise'}</td>
                    <td className="px-3.5 py-3"><PriorityBadge priority={f.criticality} /></td>
                    <td className="px-3.5 py-3 font-mono-label">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
