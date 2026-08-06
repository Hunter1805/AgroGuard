import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar } from 'lucide-react';
import type { UpcomingMaintenance } from '../../../types/dashboard';
import { ROUTES } from '../../../types/routes';

export interface UpcomingListProps {
  items: UpcomingMaintenance[] | null;
  loading?: boolean;
}

export const UpcomingList: React.FC<UpcomingListProps> = ({ items, loading }) => {
  const navigate = useNavigate();
  const list = items?.slice(0, 5) ?? [];

  return (
    <div
      className="rounded-lg border overflow-hidden flex flex-col h-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Próximas atividades
        </h2>
        <button
          type="button"
          onClick={() => navigate(ROUTES.MANUTENCOES_AGENDA)}
          className="text-[12px] font-medium hover:underline cursor-pointer"
          style={{ color: 'var(--color-brand)' }}
        >
          Agenda →
        </button>
      </div>

      {/* Lista */}
      <div className="divide-y flex-1 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
        {loading &&
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 animate-skeleton flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[var(--color-border)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-[var(--color-border)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-border)] rounded w-1/2" />
              </div>
            </div>
          ))}

        {!loading && list.length === 0 && (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
            Nenhuma atividade programada para os próximos dias.
          </div>
        )}

        {!loading &&
          list.map((item) => {
            const formattedDate = item.dueDate
              ? new Date(item.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
              : 'Em breve';

            return (
              <div
                key={item.id}
                onClick={() => navigate(ROUTES.MANUTENCOES)}
                className="p-3.5 flex items-start gap-3 hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: 'var(--color-brand-light)',
                    color: 'var(--color-brand)',
                  }}
                >
                  <Wrench size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {item.equipmentName}
                  </p>
                  <p className="text-[12px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.planName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formattedDate}
                    </span>
                    {item.status === 'vencida' && (
                      <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>
                        Vencida
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
