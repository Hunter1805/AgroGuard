import React from 'react';
import type { WorkOrderTimelineEvent } from '../../../types/work-order';
import { Clock, Play, Pause, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export const WorkOrderTimelineTab: React.FC<{ events: WorkOrderTimelineEvent[] }> = ({ events }) => {
  const getIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('início') || act.includes('retomada')) return <Play size={14} className="text-white" />;
    if (act.includes('pausa')) return <Pause size={14} className="text-white" />;
    if (act.includes('concluída') || act.includes('liberado') || act.includes('aprovado')) return <CheckCircle2 size={14} className="text-white" />;
    if (act.includes('cancelamento') || act.includes('reprovado')) return <AlertTriangle size={14} className="text-white" />;
    if (act.includes('criação') || act.includes('planejamento')) return <FileText size={14} className="text-white" />;
    return <Clock size={14} className="text-white" />;
  };

  const getColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('início') || act.includes('retomada') || act.includes('liberado')) return 'bg-emerald-500 shadow-emerald-500/30';
    if (act.includes('pausa')) return 'bg-amber-500 shadow-amber-500/30';
    if (act.includes('cancelamento') || act.includes('reprovado')) return 'bg-error shadow-error/30';
    if (act.includes('concluída')) return 'bg-blue-500 shadow-blue-500/30';
    return 'bg-primary shadow-primary/30';
  };

  if (!events || events.length === 0) {
    return <div className="p-8 text-center text-on-surface-variant font-bold">Nenhum evento registrado no histórico desta OS.</div>;
  }

  // Ordena do mais recente para o mais antigo (ou vice-versa, preferimos mais recente no topo)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h3 className="text-lg font-black font-title-md text-on-surface mb-6">Linha do Tempo Auditável</h3>
      
      <div className="relative border-l-2 border-white/10 dark:border-gray-800 ml-4 space-y-8 pb-12">
        {sortedEvents.map((evt) => (
          <div key={evt.id} className="relative pl-8 group">
            {/* Dot */}
            <div className={`absolute -left-[15px] top-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg ring-4 ring-surface ${getColor(evt.action)} transition-transform group-hover:scale-110`}>
              {getIcon(evt.action)}
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/5 transition-colors hover:bg-surface-container/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-extrabold text-sm text-on-surface">{evt.action}</h4>
                <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full whitespace-nowrap">
                  {new Date(evt.date).toLocaleString('pt-BR')}
                </span>
              </div>
              
              <p className="text-sm text-on-surface-variant mb-3">{evt.description}</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-primary/80">
                  <span className="opacity-70">Responsável:</span>
                  <span className="text-primary">{evt.userName}</span>
                </div>
                
                {evt.previousStatus && evt.newStatus && evt.previousStatus !== evt.newStatus && (
                  <div className="flex items-center gap-2 text-on-surface-variant/80 bg-black/5 dark:bg-black/20 px-2 py-0.5 rounded-lg">
                    <span className="line-through opacity-60">{evt.previousStatus.replace(/_/g, ' ')}</span>
                    <ArrowRight size={12} className="text-on-surface-variant" />
                    <span className="text-on-surface font-extrabold uppercase">{evt.newStatus.replace(/_/g, ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
