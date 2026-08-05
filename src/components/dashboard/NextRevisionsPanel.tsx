import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { RevisionSchedule } from '../../types';
import { ROUTES } from '../../types/routes';

interface NextRevisionsPanelProps {
  revisions: RevisionSchedule[];
  /** @deprecated use navigate internamente */
  setActiveTab?: (tab: string) => void;
}

export const NextRevisionsPanel: React.FC<NextRevisionsPanelProps> = ({ revisions }) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-xl flex flex-col h-72 border-white/5">
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Próximas Revisões</h3>
        </div>
        <button onClick={() => navigate(ROUTES.MANUTENCOES_AGENDA)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {revisions.map((rev) => (
          <div
            key={rev.id}
            onClick={() => navigate(ROUTES.EQUIPAMENTOS)}
            className="bg-surface-container-highest/40 border border-white/5 rounded-md p-3 flex justify-between items-center group hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded bg-surface border border-white/5 flex items-center justify-center text-[10px] font-mono-label ${
                  rev.isTomorrow ? 'text-tertiary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {rev.dateBadge}
              </div>
              <div>
                <p className="font-body-sm text-[13px] font-medium text-on-surface group-hover:text-primary transition-colors">
                  {rev.equipment}
                </p>
                <p className="text-[11px] text-on-surface-variant/70">{rev.details}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant/30" />
          </div>
        ))}
      </div>
    </div>
  );
};
