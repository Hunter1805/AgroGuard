import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { ChecklistSection, ChecklistAnswer } from '../../../types/checklist';

interface ChecklistSectionNavigationProps {
  sections: ChecklistSection[];
  activeSectionIndex: number;
  onSelectSection: (index: number) => void;
  answersMap: Record<string, ChecklistAnswer>;
  isReviewMode: boolean;
  onGoToReview: () => void;
}

export const ChecklistSectionNavigation: React.FC<ChecklistSectionNavigationProps> = ({
  sections,
  activeSectionIndex,
  onSelectSection,
  answersMap,
  isReviewMode,
  onGoToReview,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center p-1 overflow-x-auto pb-2 border-b border-white/5 font-mono-label">
      {sections.map((sec, idx) => {
        const totalInSec = sec.items.length;
        const answeredInSec = sec.items.filter(
          (i) => answersMap[i.id]?.result !== undefined || answersMap[i.id]?.booleanValue !== undefined || answersMap[i.id]?.textValue !== undefined
        ).length;
        const isCompleted = totalInSec > 0 && answeredInSec === totalInSec;
        const isActive = !isReviewMode && idx === activeSectionIndex;

        return (
          <button
            key={sec.id}
            onClick={() => onSelectSection(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-[12px] whitespace-nowrap cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-primary/20 text-primary border-primary/50 font-bold shadow-md shadow-primary/10'
                : 'bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface-variant border-white/10'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span className="truncate max-w-[170px] font-sans font-medium">{sec.title.replace(/^\d+\.\s*/, '')}</span>
            {isCompleted ? (
              <CheckCircle2 size={15} className="text-success" />
            ) : (
              <span className="text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">
                {answeredInSec}/{totalInSec}
              </span>
            )}
          </button>
        );
      })}

      {/* Botão de Ir para Revisão Final */}
      <button
        onClick={onGoToReview}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[12px] whitespace-nowrap cursor-pointer ml-auto font-bold ${
          isReviewMode
            ? 'bg-secondary/30 text-secondary border-secondary font-bold shadow-lg'
            : 'bg-secondary/15 hover:bg-secondary/25 text-secondary border-secondary/30'
        }`}
      >
        <span>Revisão & Conclusão</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
