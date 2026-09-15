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
  /** 'bar' (padrão) = barras verticais; 'donut' = rosca com legenda. */
  variant?: 'bar' | 'donut';
}

// Usa a própria classe de texto (ex.: 'text-amber-400') como currentColor do SVG.
const colorClass = (color?: string) => color || 'text-primary';

function formatValue(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

export const ReportChart: React.FC<ReportChartProps> = ({ title, description, series, unit = '', variant = 'bar' }) => {
  const safeSeries = (series || []).filter((s) => Number.isFinite(s.value));
  const maxValue = Math.max(...safeSeries.map((s) => s.value), 1);
  const total = safeSeries.reduce((acc, s) => acc + s.value, 0);
  const hasData = safeSeries.some((s) => s.value > 0);

  return (
    <div className="glass-card rounded-2xl p-5 border-default space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-default pb-2">
        <div>
          <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> {title}
          </h4>
          {description && <p className="text-xs text-on-surface-variant/70 mt-0.5">{description}</p>}
        </div>
      </div>

      {!hasData ? (
        <div className="py-10 text-center text-on-surface-variant/60">
          Sem dados no período selecionado.
        </div>
      ) : variant === 'donut' ? (
        <DonutChart series={safeSeries} total={total} unit={unit} />
      ) : (
        <BarChart series={safeSeries} maxValue={maxValue} unit={unit} />
      )}
    </div>
  );
};

/** Barras verticais com grade e valores — desenhadas em SVG puro. */
const BarChart: React.FC<{ series: ChartSeries[]; maxValue: number; unit: string }> = ({ series, maxValue, unit }) => {
  const chartHeight = 170;
  const barGap = 14;
  const barWidth = 46;
  const width = Math.max(series.length * (barWidth + barGap) + barGap, 280);

  return (
    <div className="pt-2 overflow-x-auto">
      <svg width={width} height={chartHeight} role="img" aria-label="Gráfico de barras">
        <g className="text-[var(--color-border)]">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - 20 - ratio * (chartHeight - 40);
            return <line key={i} x1={0} x2={width} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />;
          })}
        </g>

        {series.map((item, idx) => {
          const valueRatio = item.value / maxValue;
          const barHeight = Math.max(2, valueRatio * (chartHeight - 40));
          const x = barGap + idx * (barWidth + barGap);
          const y = chartHeight - 20 - barHeight;
          return (
            <g key={idx} className={colorClass(item.color)}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={6} fill="currentColor" fillOpacity={0.9}>
                <title>{`${item.label}: ${item.value} ${unit}`}</title>
              </rect>
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-current" fontSize={11} fontWeight="bold">
                {formatValue(item.value)}
              </text>
              <text x={x + barWidth / 2} y={chartHeight - 6} textAnchor="middle" fontSize={10} className="fill-[var(--color-text-secondary)]">
                {truncate(item.label, 10)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[10px] text-on-surface-variant/70 text-right font-mono-label">Valores em {unit}</div>
    </div>
  );
};

/** Rosca (donut) com legenda lateral. */
const DonutChart: React.FC<{ series: ChartSeries[]; total: number; unit: string }> = ({ series, total, unit }) => {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
      <div className="relative w-40 h-40 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={radius} fill="none" className="text-[var(--color-surface-container-highest)]" stroke="currentColor" strokeWidth="4" />
          {series.map((item, idx) => {
            const ratio = total > 0 ? item.value / total : 0;
            const dash = ratio * circumference;
            const offset = offsetAccumulator;
            offsetAccumulator += dash;
            return (
              <circle
                key={idx}
                cx="18"
                cy="18"
                r={radius}
                fill="none"
                className={colorClass(item.color)}
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              >
                <title>{`${item.label}: ${item.value} ${unit}`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex-col items-center justify-center">
          <span className="text-[20px] font-bold text-on-surface leading-none">{formatValue(total)}</span>
          <span className="text-[9px] text-on-surface-variant font-mono-label mt-1">Total ({unit})</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {series.map((item, idx) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className={'w-2.5 h-2.5 rounded-full bg-current shrink-0 ' + colorClass(item.color)} />
                <span className="text-on-surface-variant truncate">{item.label}</span>
              </div>
              <span className="font-mono-label text-on-surface whitespace-nowrap ml-2">
                {formatValue(item.value)} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
