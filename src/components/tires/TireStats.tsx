import React from 'react';
import { Disc, CheckCircle2, PackageCheck, Wrench, AlertTriangle, AlertCircle, RefreshCw, DollarSign } from 'lucide-react';

interface TireStatsProps {
  stats: {
    total: number;
    instalados: number;
    estoque: number;
    emReparo: number;
    emRecapagem: number;
    anomalias: number;
    sulcoCritico: number;
    pressaoIrregular: number;
    inspecoesAtrasadas: number;
    proximosSubstituicao: number;
    custoAcumulado: number;
    custoMedio: number;
  } | null;
}

export const TireStats: React.FC<TireStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      label: 'Total de Pneus',
      value: stats.total,
      icon: Disc,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Instalados',
      value: stats.instalados,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Em Estoque',
      value: stats.estoque,
      icon: PackageCheck,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Em Reparo / Recapagem',
      value: stats.emReparo + stats.emRecapagem,
      icon: Wrench,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Com Anomalia / Atenção',
      value: stats.anomalias,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Sulco Crítico (<= mín)',
      value: stats.sulcoCritico,
      icon: AlertCircle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      label: 'Pressão Irregular',
      value: stats.pressaoIrregular,
      icon: RefreshCw,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Custo Médio por Pneu',
      value: `R$ ${stats.custoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="glass-card rounded-xl p-3 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-label text-on-surface-variant/70 truncate">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.bg}`}>
                <Icon size={14} className={item.color} />
              </div>
            </div>
            <p className="text-[18px] font-bold text-on-surface mt-2 truncate font-mono-label">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};
