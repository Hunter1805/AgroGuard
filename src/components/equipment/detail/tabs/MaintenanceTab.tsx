import React from 'react';
import { Wrench, Plus, Shield, CheckCircle2 } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentMaintenanceSummary } from '../../../../types/equipment-detail';
import { useEquipmentMaintenance } from '../../../../hooks/useEquipmentMaintenance';
import { Button } from '../../../ui/Button';
import { StatusBadge } from '../../../ui/StatusBadge';
import { EmptyState } from '../../../ui/EmptyState';

interface MaintenanceTabProps {
  equipment: Equipment;
  maintenances: EquipmentMaintenanceSummary[];
  onProgramMaintenance?: () => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  equipment,
  maintenances,
  onProgramMaintenance,
}) => {
  const { activeLink, calculatedStatuses, currentReading, loading } = useEquipmentMaintenance(equipment.id || 'EQ-022');
  const planName = activeLink?.planName || equipment.maintenancePlanName || 'Plano Preventivo Tratores 250h';

  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'vencido': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300';
      case 'urgente': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300';
      case 'proximo': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-300';
      default: return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            Planos Preventivos e Manutenções (Motor Fase 5)
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Controle inteligente integrado à leitura reativa do horímetro com a regra "O que Ocorrer Primeiro".
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onProgramMaintenance}
        >
          Programar Manutenção
        </Button>
      </div>

      {/* Card do Plano Preventivo Vinculado */}
      <div className="glass-card p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-label text-blue-600 dark:text-blue-400 uppercase font-extrabold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Plano Preventivo Vinculado & Monitorado
            </span>
            <h4 className="font-title-md text-lg font-extrabold text-on-surface">
              {planName}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ativo em Vigor (v{activeLink?.planVersion || 1})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-primary/20 font-semibold">
          <div className="bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
            <span className="text-gray-500 text-[10px] font-bold uppercase block">Leitura Reativa (Fase 3D)</span>
            <span className="text-gray-900 dark:text-white text-base font-extrabold block mt-0.5">{currentReading || equipment.currentHours || 6185}h</span>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
            <span className="text-gray-500 text-[10px] font-bold uppercase block">Recorrente Base</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold block mt-0.5">A cada {equipment.maintenanceInterval || 200} h</span>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
            <span className="text-gray-500 text-[10px] font-bold uppercase block">Última Revisão Oficial</span>
            <span className="text-gray-900 dark:text-white font-bold block mt-0.5">{equipment.lastMaintenanceDate || activeLink?.baseDate || '10/07/2026'}</span>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60">
            <span className="text-gray-500 text-[10px] font-bold uppercase block">Regra de Vencimento</span>
            <span className="text-purple-600 dark:text-purple-400 font-extrabold block mt-0.5">⭐ 1º que Ocorrer</span>
          </div>
        </div>

        {/* Status Calculados da Fase 5 */}
        {!loading && calculatedStatuses.length > 0 && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
              Gatilhos Monitorados em Tempo Real ({calculatedStatuses.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {calculatedStatuses.map((calc, idx) => (
                <div key={idx} className="p-3.5 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-sm text-gray-900 dark:text-white block">{calc.intervalName}</span>
                    <span className="text-xs text-gray-500 font-medium">
                      Meta: {calc.dueReading ? `${calc.dueReading}h` : ''} {calc.dueDate ? `ou ${new Date(calc.dueDate).toLocaleDateString('pt-BR')}` : ''}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-extrabold text-xs border ${getStatusStyle(calc.status)}`}>
                    {calc.remainingReading !== undefined ? `${calc.remainingReading}h rest.` : calc.remainingDays !== undefined ? `${calc.remainingDays} dias` : calc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Intervalos e Histórico */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
        <h4 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
          <Wrench size={16} className="text-primary" /> Programação e Histórico de Revisões
        </h4>

        {maintenances.length === 0 ? (
          <EmptyState
            title="Nenhuma manutenção vinculada"
            description="Vincule um plano preventivo para acompanhar os próximos vencimentos de revisão."
            action={
              <Button variant="outline" size="sm" onClick={onProgramMaintenance}>
                Vincular Plano Preventivo
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[11px] font-extrabold uppercase border-b border-white/5">
                  <th className="px-4 py-3">Serviço / Pacote</th>
                  <th className="px-4 py-3">Gatilho</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Progresso</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant font-semibold">
                {maintenances.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3.5 font-extrabold text-on-surface">{m.title}</td>
                    <td className="px-4 py-3.5 text-gray-500 uppercase font-mono">{m.triggerType}</td>
                    <td className="px-4 py-3.5 text-blue-600 dark:text-blue-400 font-bold">{m.dueDate || m.targetValue}</td>
                    <td className="px-4 py-3.5">
                      <div className="w-24 bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            m.progressPercent >= 100 ? 'bg-rose-500' : m.progressPercent > 75 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(m.progressPercent, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline text-xs cursor-pointer"
                        onClick={onProgramMaintenance}
                      >
                        Criar OS Preventiva &rarr;
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
  );
};
