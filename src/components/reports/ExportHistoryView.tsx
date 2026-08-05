import React from 'react';
import { History, Download, CheckCircle2 } from 'lucide-react';
import { useReportExport } from '../../hooks/useReportExport';

export const ExportHistoryView: React.FC = () => {
  const { logs, loading } = useReportExport();

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <History className="text-primary" size={18} />
            Histórico Auditável de Exportações
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Registro completo de relatórios gerados em CSV, PDF e impressões por usuário e período.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando histórico de exportações...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Download className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma exportação realizada</p>
            <p className="text-xs text-on-surface-variant/70">Os relatórios gerados e exportados aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Relatório</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Formato</th>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium">Data / Hora</th>
                  <th className="px-4 py-3 font-medium font-mono-label">Qtd Registros</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-on-surface">{log.reportName}</td>
                    <td className="px-4 py-3 font-mono-label uppercase text-primary">{log.category}</td>
                    <td className="px-4 py-3 font-mono-label uppercase font-bold text-on-surface">{log.format}</td>
                    <td className="px-4 py-3">{log.periodText}</td>
                    <td className="px-4 py-3">{log.userName}</td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(log.generatedAt).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 font-mono-label font-bold text-emerald-400">{log.recordsCount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} /> {log.status}
                      </span>
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
