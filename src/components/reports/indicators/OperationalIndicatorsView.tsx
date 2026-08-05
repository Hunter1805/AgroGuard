import React from 'react';
import { BarChart2, Info, Clock, Tractor, Wrench, CheckSquare, Activity } from 'lucide-react';
import { useOperationalIndicators } from '../../../hooks/useOperationalIndicators';
import { useReportFilters } from '../../../hooks/useReportFilters';
import { ReportGlobalFilters } from '../ReportGlobalFilters';

export const OperationalIndicatorsView: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useReportFilters();
  const { indicators, loading } = useOperationalIndicators(filters);

  if (loading) return <div className="p-8 text-center text-xs text-on-surface-variant">Calculando indicadores gerenciais...</div>;

  const cards = [
    {
      title: 'Disponibilidade da Frota',
      metric: indicators?.availability,
      formula: 'Tempo Disponível ÷ Tempo Total Previsto × 100',
      icon: Tractor,
      color: 'text-blue-400',
    },
    {
      title: 'MTTR (Tempo Médio de Reparo)',
      metric: indicators?.mttr,
      formula: 'Tempo Efetivo de Reparo ÷ Reparos Concluídos',
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      title: 'MTBF (Tempo Médio Entre Falhas)',
      metric: indicators?.mtbf,
      formula: 'Tempo Total de Operação ÷ Qtd de Falhas',
      icon: Clock,
      color: 'text-emerald-400',
    },
    {
      title: 'Cumprimento Preventivo',
      metric: indicators?.preventiveCompliance,
      formula: 'Preventivas no Prazo ÷ Total Preventivas × 100',
      icon: Wrench,
      color: 'text-indigo-400',
    },
    {
      title: 'Taxa de Conformidade',
      metric: indicators?.complianceRate,
      formula: 'Itens Conformes ÷ Total Itens Avaliados × 100',
      icon: CheckSquare,
      color: 'text-teal-400',
    },
    {
      title: 'Taxa de Utilização da Frota',
      metric: indicators?.utilizationRate,
      formula: 'Tempo Utilizado ÷ Tempo Disponível × 100',
      icon: Activity,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <BarChart2 className="text-primary" size={20} /> Painel de Indicadores Operacionais Gerenciais
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Cálculos auditados das métricas de manutenção e desempenho da frota
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <ReportGlobalFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            const isInsufficient = c.metric?.insufficientData;
            return (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-sm">{c.title}</span>
                    <Icon className={c.color} size={18} />
                  </div>

                  <div className="mt-3">
                    <p className={`text-2xl font-bold font-mono-label ${isInsufficient ? 'text-on-surface-variant/50 text-base' : c.color}`}>
                      {c.metric?.formattedValue}
                    </p>
                    {isInsufficient && (
                      <p className="text-[11px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
                        <Info size={13} /> Dados insuficientes para o período
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono-label text-on-surface-variant/70 block">Fórmula: {c.formula}</span>
                  {c.metric?.tooltipExplanation && (
                    <p className="text-[10px] text-on-surface-variant/60 italic">{c.metric.tooltipExplanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
