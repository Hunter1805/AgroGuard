import React from 'react';
import type { WorkOrder } from '../../types/work-order';
import { Activity, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

export const WorkOrderStats: React.FC<{ orders: WorkOrder[] }> = ({ orders }) => {
  const abertas = orders.filter(o => !['encerrada', 'cancelada', 'finalizada'].includes(o.status)).length;
  const emExecucao = orders.filter(o => o.status === 'em_execucao').length;
  const criticas = orders.filter(o => o.priority === 'critica').length;
  const pausadas = orders.filter(o => o.status === 'pausada' || o.status.startsWith('aguardando_')).length;

  const stats = [
    { title: 'OS Abertas', value: abertas, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { title: 'Em Execução', value: emExecucao, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { title: 'Pausadas/Aguardando', value: pausadas, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { title: 'Prioridade Crítica', value: criticas, icon: ShieldAlert, color: 'text-error', bg: 'bg-error/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <div key={idx} className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className={`p-3 rounded-xl ${s.bg}`}>
            <s.icon className={`w-6 h-6 ${s.color}`} />
          </div>
          <div>
            <p className="text-on-surface-variant text-sm font-semibold">{s.title}</p>
            <p className="text-2xl font-black text-on-surface mt-0.5">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
