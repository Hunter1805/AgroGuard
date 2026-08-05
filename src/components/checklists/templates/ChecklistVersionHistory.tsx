import React from 'react';
import { GitBranch, Clock } from 'lucide-react';

interface ChecklistVersionHistoryProps {
  templateCode?: string;
  templateName?: string;
}

export const ChecklistVersionHistory: React.FC<ChecklistVersionHistoryProps> = ({
  templateCode = 'MOD-001',
  templateName = 'Checklist Diário de Trator e Implemento',
}) => {
  const versions = [
    { ver: 3, date: '01/08/2026', author: 'Eng. Mecânico (Carlos Roberto)', notes: 'Inclusão obrigatória de foto na falha do nível de óleo.', active: true },
    { ver: 2, date: '20/06/2026', author: 'Supervisor OperACional', notes: 'Ajustada criticidade dos rodados para Média.', active: false },
    { ver: 1, date: '10/05/2026', author: 'Coord. de Manutenção', notes: 'Versão inaugural do modelo para a safra de 2026.', active: false },
  ];

  return (
    <div className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg text-[12px] animate-fade-in">
      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10 text-secondary">
        <GitBranch size={20} />
        <h3 className="font-title-md text-[15px] font-bold text-on-surface">Histórico de Versões • {templateCode} ({templateName})</h3>
      </div>

      <p className="text-[12px] text-on-surface-variant/80">
        As execuções passadas permanecem congeladas na versão em que foram criadas para garantir auditoria perfeita.
      </p>

      <div className="relative pl-6 border-l border-white/10 space-y-5">
        {versions.map((v) => (
          <div key={v.ver} className="relative space-y-1">
            <span className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface ${v.active ? 'bg-primary' : 'bg-on-surface-variant/50'}`} />
            <div className="flex items-center justify-between font-mono-label">
              <span className={`text-[13px] font-bold ${v.active ? 'text-primary' : 'text-on-surface'}`}>
                Versão {v.ver} {v.active && '(Ativo Agora)'}
              </span>
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <Clock size={12} /> {v.date}
              </span>
            </div>
            <p className="text-[12px] font-medium text-on-surface-variant/90">Autor: {v.author}</p>
            <p className="text-[11px] text-on-surface-variant/70 italic bg-surface-container/50 p-2 rounded-lg border border-white/5">
              "{v.notes}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
