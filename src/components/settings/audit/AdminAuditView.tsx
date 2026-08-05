import React from 'react';
import { useAdminAudit } from '../../../hooks/useAdminAudit';

export const AdminAuditView: React.FC = () => {
  const { events, loading } = useAdminAudit();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[16px] font-bold text-on-surface">Auditoria Administrativa</h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Histórico imutável de alterações de permissões, escopos, parâmetros e bloqueios.
        </p>
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-[13px] text-on-surface-variant animate-pulse">
            Carregando eventos de auditoria...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[13px] text-on-surface-variant">Nenhum evento registrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-white/10 bg-surface-container-high/60 text-[10px] font-semibold text-on-surface-variant/70 uppercase">
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Evento</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Detalhes da Alteração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-container-highest/40 transition-colors">
                    <td className="py-3 px-4 font-mono-label text-on-surface-variant/70">
                      {new Date(ev.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{ev.userName}</div>
                      <div className="text-[10px] text-on-surface-variant/60">{ev.userRole}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-label bg-primary/10 text-primary border border-primary/20 uppercase">
                        {ev.eventType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-on-surface">{ev.module}</td>
                    <td className="py-3 px-4 text-on-surface-variant/80">
                      <div><strong className="text-on-surface">{ev.recordName}</strong></div>
                      {ev.justification && <p className="text-[11px] text-on-surface-variant/60 italic">{ev.justification}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
