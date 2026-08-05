import React, { useState } from 'react';
import { X, Clock, Package, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import type { Equipment } from '../../types';
import type { MaintenancePlan, MaintenanceIntervalBlock } from '../../types/maintenance-plan';

interface Props {
  equipment: Equipment;
  plan: MaintenancePlan | null;
  loading: boolean;
  onClose: () => void;
}

function getNextDueAlert(block: MaintenanceIntervalBlock, currentHours: number): string | null {
  if (block.interval.type !== 'hours') return null;
  const nextDue = Math.ceil(currentHours / block.interval.value) * block.interval.value;
  const remaining = nextDue - currentHours;
  if (remaining <= 0) return 'VENCIDO';
  if (remaining <= 10) return `Vence em ${remaining}h`;
  return null;
}

export const MaintenancePlanDrawer: React.FC<Props> = ({ equipment, plan, loading, onClose }) => {
  const [openBlock, setOpenBlock] = useState<number | null>(0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-surface-container-lowest border-l border-white/8 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono-label text-on-surface-variant/60 uppercase">{equipment.assetType}</p>
            <h2 className="text-[17px] font-bold text-on-surface leading-snug">{equipment.name}</h2>
            <p className="text-[12px] text-on-surface-variant/70 mt-0.5">
              {equipment.brand} {equipment.model}{equipment.year && equipment.year !== '-' ? ` · ${equipment.year}` : ''}
              {equipment.currentHours > 0 && (
                <span className="ml-2 text-primary font-mono-label">· {equipment.currentHours.toLocaleString('pt-BR')}h</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-on-surface-variant transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant text-[13px]">Carregando plano...</div>
          ) : !plan || !plan.intervalBlocks || plan.intervalBlocks.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-on-surface-variant text-[13px]">Nenhum plano de manutenção cadastrado para este equipamento.</p>
              <p className="text-on-surface-variant/50 text-[12px]">O plano será adicionado em breve.</p>
            </div>
          ) : (
            (plan.intervalBlocks || []).map((block, idx) => {
              const alert = getNextDueAlert(block, equipment.currentHours);
              const isOpen = openBlock === idx;
              const totalMinutes = block.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all ${
                    alert === 'VENCIDO'
                      ? 'border-error/40 bg-error/5'
                      : alert
                      ? 'border-tertiary/40 bg-tertiary/5'
                      : 'border-white/8 bg-surface-container-high/50'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenBlock(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {alert ? (
                        <AlertTriangle
                          size={15}
                          className={alert === 'VENCIDO' ? 'text-error flex-shrink-0' : 'text-tertiary flex-shrink-0'}
                        />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0 ml-0.5" />
                      )}
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-on-surface">{block.interval.label}</span>
                        {alert && (
                          <span
                            className={`ml-2 text-[10px] font-mono-label px-1.5 py-0.5 rounded-full ${
                              alert === 'VENCIDO'
                                ? 'bg-error/20 text-error'
                                : 'bg-tertiary/20 text-tertiary'
                            }`}
                          >
                            {alert}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant/60">
                        <Clock size={12} />
                        <span>{totalMinutes}min</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant/60">{block.tasks.length} tarefa{block.tasks.length !== 1 ? 's' : ''}</span>
                      {isOpen ? <ChevronDown size={14} className="text-on-surface-variant" /> : <ChevronRight size={14} className="text-on-surface-variant" />}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                      {block.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="space-y-1.5">
                          <div className="flex gap-2">
                            <span className="text-[11px] font-mono-label text-on-surface-variant/50 mt-0.5 flex-shrink-0">{tIdx + 1}.</span>
                            <p className="text-[12px] text-on-surface leading-relaxed">{task.description}</p>
                          </div>
                          <div className="flex gap-4 pl-4 text-[11px] text-on-surface-variant/60">
                            {task.estimatedMinutes > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {task.estimatedMinutes} min
                              </span>
                            )}
                            {(task.supplies || []).map((s: any, sIdx: number) => (
                              s.description !== '-' && (
                                <span key={sIdx} className="flex items-center gap-1 text-tertiary/80">
                                  <Package size={11} />
                                  {s.description}
                                  {s.quantity && s.quantity !== '-' && ` — ${s.quantity} ${s.unit}`}
                                </span>
                              )
                            ))}
                          </div>
                          {tIdx < block.tasks.length - 1 && <div className="border-b border-white/5 ml-4" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
