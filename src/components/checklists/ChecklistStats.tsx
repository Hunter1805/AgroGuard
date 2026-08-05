import React from 'react';
import { CheckSquare, AlertTriangle, Clock, ShieldAlert, Ban, Activity, FileCheck2 } from 'lucide-react';
import type { ChecklistDashboardStats } from '../../types/checklist';

interface ChecklistStatsProps {
  stats: ChecklistDashboardStats;
}

export const ChecklistStats: React.FC<ChecklistStatsProps> = ({ stats }) => {
  const items = [
    {
      label: 'Previstos Hoje',
      value: stats.previstosHoje,
      icon: <Clock size={20} className="text-secondary" />,
      desc: 'Agenda diária da frota',
    },
    {
      label: 'Concluídos Hoje',
      value: stats.concluidosHoje,
      icon: <CheckSquare size={20} className="text-success" />,
      desc: 'Execuções realizadas',
    },
    {
      label: 'Checklists Atrasados',
      value: stats.atrasados,
      icon: <AlertTriangle size={20} className="text-warning" />,
      desc: 'Penderam pré-operação',
      highlight: stats.atrasados > 0 ? 'text-warning' : 'text-on-surface',
    },
    {
      label: 'Com Não Conformidade',
      value: stats.execucoesComNaoConformidades,
      icon: <FileCheck2 size={20} className="text-error" />,
      desc: 'Apontaram falhas de inspeção',
    },
    {
      label: 'Falhas Críticas',
      value: stats.naoConformidadesCriticas,
      icon: <ShieldAlert size={20} className="text-error" />,
      desc: 'Abertas na oficina',
      highlight: stats.naoConformidadesCriticas > 0 ? 'text-error font-extrabold' : 'text-on-surface',
    },
    {
      label: 'Ativos Bloqueados',
      value: stats.equipamentosBloqueados,
      icon: <Ban size={20} className="text-error" />,
      desc: 'Retidos por segurança',
      highlight: stats.equipamentosBloqueados > 0 ? 'text-error font-extrabold' : 'text-on-surface',
    },
    {
      label: 'Taxa de Conformidade',
      value: `${stats.taxaConformidade}%`,
      icon: <Activity size={20} className="text-primary" />,
      desc: 'Aprovados de primeira',
      highlight: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 animate-fade-in">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:bg-surface-container-highest/70"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono-label font-medium text-on-surface-variant/80 uppercase tracking-wider leading-tight">
              {it.label}
            </span>
            <div className="p-1.5 rounded-lg bg-surface-container border border-white/5 shrink-0">
              {it.icon}
            </div>
          </div>
          <div>
            <p className={`font-title-md text-[22px] font-bold ${it.highlight || 'text-on-surface'}`}>
              {it.value}
            </p>
            <p className="text-[10px] text-on-surface-variant/60 font-mono-label mt-0.5 truncate">
              {it.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
