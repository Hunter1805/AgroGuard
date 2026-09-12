import React from 'react';
import { Activity, BarChart3, CheckCircle2, Clock3, Gauge, Target, TrendingUp, Wrench } from 'lucide-react';
import { OperationalIndicatorsView } from '../reports/indicators/OperationalIndicatorsView';

const principles = [
  { icon: Target, title: 'Metas mensuráveis', text: 'Acompanhe resultados com números claros e comparáveis.' },
  { icon: TrendingUp, title: 'Evolução no tempo', text: 'Compare períodos e identifique tendências de melhoria ou desvio.' },
  { icon: CheckCircle2, title: 'Decisão baseada em dados', text: 'Use os indicadores para priorizar ações e recursos.' },
];

export const KpiDashboardView: React.FC = () => (
  <div className="space-y-6 pb-14 animate-fade-in">
    <div className="bg-surface rounded-2xl border-default shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Gestão estratégica</p>
          <h1 className="mt-2 text-2xl font-bold text-primary flex items-center gap-3">
            <BarChart3 className="text-brand" size={26} /> Indicadores e KPIs
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-secondary">
            Valores quantitativos para medir o sucesso operacional e o progresso da empresa em direção aos seus objetivos estratégicos.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-brand-light border-[var(--color-brand)]/20 px-4 py-3 text-brand">
          <Activity size={19} />
          <span className="text-xs font-semibold">Painel de desempenho</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {principles.map(({ icon: Icon, title, text }) => (
        <div key={title} className="bg-surface rounded-xl border-default shadow-sm p-5">
          <Icon size={20} className="text-brand" />
          <h2 className="mt-3 text-sm font-bold text-primary">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-secondary">{text}</p>
        </div>
      ))}
    </div>

    <div className="bg-surface rounded-2xl border-default shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gauge size={19} className="text-brand" />
        <div>
          <h2 className="text-base font-bold text-primary">KPIs operacionais</h2>
          <p className="text-xs text-secondary">Indicadores calculados com base nos equipamentos, ordens de serviço e checklists cadastrados.</p>
        </div>
      </div>
      <OperationalIndicatorsView />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-surface rounded-xl border-default shadow-sm p-5 flex gap-3">
        <Clock3 className="text-info shrink-0" size={20} />
        <div><h2 className="text-sm font-bold text-primary">Como interpretar</h2><p className="mt-1 text-xs leading-5 text-secondary">MTTR menor indica reparos mais rápidos. MTBF maior indica maior confiabilidade entre falhas.</p></div>
      </div>
      <div className="bg-surface rounded-xl border-default shadow-sm p-5 flex gap-3">
        <Wrench className="text-warning shrink-0" size={20} />
        <div><h2 className="text-sm font-bold text-primary">Dados insuficientes</h2><p className="mt-1 text-xs leading-5 text-secondary">Quando ainda não houver registros suficientes, o sistema sinaliza isso em vez de inventar um resultado.</p></div>
      </div>
    </div>
  </div>
);
