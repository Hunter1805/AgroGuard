import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardAlert } from '../../../types/dashboard';
import { ROUTES } from '../../../types/routes';

export interface PrioritiesTableProps {
  alerts: DashboardAlert[] | null;
  loading?: boolean;
}

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  critica: { label: 'Crítica', bg: 'var(--color-danger-light)', text: 'var(--color-danger)' },
  alta: { label: 'Alta', bg: 'var(--color-warning-light)', text: 'var(--color-warning)' },
  media: { label: 'Média', bg: 'var(--color-info-light)', text: 'var(--color-info)' },
  baixa: { label: 'Baixa', bg: 'var(--color-surface-secondary)', text: 'var(--color-text-secondary)' },
  informativo: { label: 'Info', bg: 'var(--color-surface-secondary)', text: 'var(--color-text-muted)' },
};

export const PrioritiesTable: React.FC<PrioritiesTableProps> = ({ alerts, loading }) => {
  const navigate = useNavigate();

  const handleAction = (alert: DashboardAlert) => {
    if (alert.targetRoute) {
      navigate(alert.targetRoute);
    } else {
      navigate(ROUTES.ALERTAS);
    }
  };

  const items = alerts?.slice(0, 6) ?? [];

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
        <div>
          <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Prioridades do dia
          </h2>
          <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
            Ocorrências e alertas que exigem ação imediata.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ALERTAS)}
          className="text-[12px] font-medium hover:underline cursor-pointer"
          style={{ color: 'var(--color-brand)' }}
        >
          Ver todos os alertas →
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ fontSize: '13px' }}>
          <thead>
            <tr
              className="border-b text-[12px] font-semibold"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <th className="py-2.5 px-5 w-24">Prioridade</th>
              <th className="py-2.5 px-4">Equipamento</th>
              <th className="py-2.5 px-4">Ocorrência</th>
              <th className="py-2.5 px-4 w-32">Prazo</th>
              <th className="py-2.5 px-4 w-32">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {loading &&
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-skeleton">
                  <td className="py-3 px-5"><div className="h-4 bg-[var(--color-border)] rounded w-16" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-[var(--color-border)] rounded w-32" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-[var(--color-border)] rounded w-48" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-[var(--color-border)] rounded w-20" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-[var(--color-border)] rounded w-20" /></td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Nenhuma prioridade alta ou crítica no momento.
                </td>
              </tr>
            )}

            {!loading &&
              items.map((item) => {
                const badge = PRIORITY_BADGES[item.priority] || PRIORITY_BADGES.media;
                const formattedDate = item.dueAt
                  ? new Date(item.dueAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : 'Imediato';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--color-surface-secondary)] transition-colors"
                  >
                    {/* Prioridade */}
                    <td className="py-3 px-5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Equipamento */}
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {item.equipmentName || 'Equipamento Geral'}
                    </td>

                    {/* Ocorrência */}
                    <td className="py-3 px-4 truncate max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.title}
                    </td>

                    {/* Prazo */}
                    <td className="py-3 px-4 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                      {formattedDate}
                    </td>

                    {/* Ação */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleAction(item)}
                        className="text-[12px] font-medium hover:underline cursor-pointer"
                        style={{ color: 'var(--color-brand)' }}
                      >
                        {item.recommendedAction || 'Resolver'}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
