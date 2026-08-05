import React from 'react';
import { BarChart2 } from 'lucide-react';
import type { MonthlyCostBar } from '../../types';

interface CostChartProps {
  period: '6M' | 'YTD';
  setPeriod: (period: '6M' | 'YTD') => void;
  chartData: MonthlyCostBar[];
}

export const CostChart: React.FC<CostChartProps> = ({ period, setPeriod, chartData }) => {
  return (
    <div className="glass-card rounded-xl p-5 border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[14px] font-semibold text-on-surface">Evolução de Custos</h3>
        </div>
        <div className="flex gap-1 bg-surface-container-highest/50 p-1 rounded-md border border-white/5">
          <button
            onClick={() => setPeriod('6M')}
            className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              period === '6M'
                ? 'bg-surface-container text-on-surface shadow-sm border border-white/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            6 Meses
          </button>
          <button
            onClick={() => setPeriod('YTD')}
            className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
              period === 'YTD'
                ? 'bg-surface-container text-on-surface shadow-sm border border-white/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            YTD
          </button>
        </div>
      </div>

      <div className="h-56 flex items-end justify-between gap-3 relative pb-6 pt-4">
        <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] font-mono-label text-on-surface-variant/50">
          <span>50k</span>
          <span>40k</span>
          <span>30k</span>
          <span>20k</span>
          <span>10k</span>
          <span>0</span>
        </div>

        <div className="ml-14 w-full h-full relative flex items-end justify-between gap-2">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] border-b border-white">
            <div className="w-full border-b border-white h-0"></div>
            <div className="w-full border-b border-white h-0"></div>
            <div className="w-full border-b border-white h-0"></div>
            <div className="w-full border-b border-white h-0"></div>
            <div className="w-full border-b border-white h-0"></div>
          </div>

          {chartData.map((bar, idx) => (
            <div
              key={idx}
              className={`w-full transition-colors rounded-t relative group ${
                bar.isCurrent
                  ? 'bg-primary/80 border-t border-primary/50 glow-success'
                  : 'bg-primary/20 hover:bg-primary/30 border border-primary/10'
              }`}
              style={{ height: `${bar.heightPercent}%` }}
            >
              <div className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded text-[10px] font-mono-label opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${
                bar.isCurrent ? 'text-primary font-bold' : 'text-on-surface'
              }`}>
                {bar.costLabel}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 ml-14 left-0 right-0 flex justify-between text-[11px] font-mono-label text-on-surface-variant/70 px-2">
          {chartData.map((bar, idx) => (
            <span key={idx} className={bar.isCurrent ? 'text-primary font-bold' : ''}>
              {bar.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
