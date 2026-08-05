import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartSeries {
  label: string;
  value: number;
  color?: string;
}

interface ReportChartProps {
  title: string;
  description?: string;
  series: ChartSeries[];
  unit?: string;
}

export const ReportChart: React.FC<ReportChartProps> = ({ title, description, series, unit = '' }) => {
  const maxValue = Math.max(...series.map(s => s.value), 1);

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div>
          <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> {title}
          </h4>
          {description && <p className="text-xs text-on-surface-variant/70 mt-0.5">{description}</p>}
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {series.map((item, idx) => {
          const percentage = Math.round((item.value / maxValue) * 100);
          return (
            <div key={idx} className="space-y-1 font-mono-label">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-on-surface">{item.label}</span>
                <span className="font-bold text-primary">
                  {item.value} {unit}
                </span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color || 'bg-primary'}`}
                  style={{ width: `${Math.max(5, percentage)}%` }}
                  title={`${item.label}: ${item.value} ${unit}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
