import React from 'react';
import { FileText, Tractor, ListChecks, Sliders, CheckSquare } from 'lucide-react';

interface ChecklistTemplateStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ChecklistTemplateStepper: React.FC<ChecklistTemplateStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { num: 1, label: 'Informações', icon: <FileText size={15} /> },
    { num: 2, label: 'Aplicação na Frota', icon: <Tractor size={15} /> },
    { num: 3, label: 'Seções & Itens', icon: <ListChecks size={15} /> },
    { num: 4, label: 'Automações', icon: <Sliders size={15} /> },
    { num: 5, label: 'Revisão', icon: <CheckSquare size={15} /> },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 glass-card bg-surface-container-highest/60 border border-white/10 rounded-2xl mb-6 shadow-md font-mono-label text-[11px]">
      {steps.map((st) => {
        const isCurrent = st.num === currentStep;
        const isCompleted = st.num < currentStep;

        return (
          <button
            key={st.num}
            type="button"
            onClick={() => onStepClick && onStepClick(st.num)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isCurrent
                ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20 scale-105'
                : isCompleted
                ? 'bg-success/20 text-success border border-success/30 font-semibold'
                : 'bg-surface-container text-on-surface-variant/60 border border-white/5'
            }`}
          >
            {st.icon}
            <span>{st.num}. {st.label}</span>
          </button>
        );
      })}
    </div>
  );
};
