import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import type { ActiveAlert } from '../../types';
import { ROUTES } from '../../types/routes';

interface AlertsPanelProps {
  alerts: ActiveAlert[];
  /** @deprecated use navigate internamente */
  setActiveTab?: (tab: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-xl flex flex-col h-72 border-white/5">
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <AlertOctagon size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Alertas Ativos</h3>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded font-mono-label">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={() => navigate(ROUTES.ALERTAS)}
          className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
        >
          Ver Central <ArrowRight size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-white/5">
          {alerts.map((item) => (
            <li
              key={item.id}
              className="p-3 hover:bg-surface-container-highest/30 transition-colors flex gap-3 items-start group cursor-pointer"
              onClick={() => navigate(ROUTES.ALERTAS)}
            >
              <div className="mt-0.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full border-2 border-surface ${
                    item.severity === 'error'
                      ? 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.5)]'
                      : item.severity === 'tertiary'
                      ? 'bg-tertiary shadow-[0_0_8px_rgba(250,189,0,0.3)]'
                      : 'bg-primary'
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-body-sm text-[13px] font-medium text-on-surface truncate">{item.equipment}</p>
                  <span className="text-[10px] text-on-surface-variant/50 font-mono-label whitespace-nowrap">{item.timeAgo}</span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant/70 mt-0.5 line-clamp-1">{item.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
