import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import type { MasterDataCategoryCard } from '../../types/master-data';

interface CardProps {
  card: MasterDataCategoryCard;
}

export const MasterDataGroupCard: React.FC<CardProps> = ({ card }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(card.route)}
      className="glass-card rounded-xl border border-white/10 p-4 hover:border-primary/40 hover:bg-surface-container-highest/60 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Layers size={16} />
            </div>
            <span className="font-mono-label text-[10px] uppercase text-on-surface-variant/60 tracking-wider">
              {card.code}
            </span>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant group-hover:text-primary transition-colors">
            {card.activeCount} ativos
          </span>
        </div>

        <h4 className="text-[15px] font-semibold text-on-surface group-hover:text-primary transition-colors mt-2">
          {card.title}
        </h4>
        <p className="text-[12px] text-on-surface-variant/70 line-clamp-2 mt-1">
          {card.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3 text-on-surface-variant/60">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-success" />
            {card.totalCount} registros
          </span>
          {card.pendingCount ? (
            <span className="flex items-center gap-1 text-warning">
              <AlertCircle size={12} />
              {card.pendingCount} pendentes
            </span>
          ) : null}
        </div>

        <span className="flex items-center gap-1 font-medium text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
          Acessar
          <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
};
