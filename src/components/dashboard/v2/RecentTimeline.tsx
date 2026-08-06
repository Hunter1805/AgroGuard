import React from 'react';
import type { DashboardActivity } from '../../../types/dashboard';

export interface RecentTimelineProps {
  activities: DashboardActivity[] | null;
  loading?: boolean;
}

export const RecentTimeline: React.FC<RecentTimelineProps> = ({ activities, loading }) => {
  const items = activities?.slice(0, 6) ?? [];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Atividades recentes
        </h2>
        <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
          Últimas atualizações
        </span>
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-3">
        {loading &&
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-skeleton flex items-center gap-3">
              <div className="w-12 h-3.5 bg-[var(--color-border)] rounded" />
              <div className="h-3.5 bg-[var(--color-border)] rounded flex-1" />
            </div>
          ))}

        {!loading && items.length === 0 && (
          <div className="py-6 text-center text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
            Nenhuma atividade registrada recentemente.
          </div>
        )}

        {!loading &&
          items.map((act) => {
            const dateObj = new Date(act.createdAt);
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={act.id} className="flex items-baseline gap-3 text-[13px]">
                <span className="font-semibold shrink-0 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                  {timeStr}
                </span>
                <p className="truncate flex-1" style={{ color: 'var(--color-text-primary)' }}>
                  <span className="font-medium">{act.title}</span>
                  {act.description && (
                    <span className="ml-1 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                      — {act.description}
                    </span>
                  )}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
