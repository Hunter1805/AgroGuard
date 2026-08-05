import React from 'react';
import { Check } from 'lucide-react';
import { FORM_STEPS, type FormStep } from '../../../types/equipment-form';

interface FormStepIndicatorProps {
  currentStep: FormStep;
  completedSteps?: FormStep[];
  onStepClick: (step: FormStep) => void;
}

export const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({
  currentStep,
  completedSteps = [],
  onStepClick,
}) => {
  return (
    <div className="w-full">
      {/* Visualização Horizontal para Desktops / Tablets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {FORM_STEPS.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = step.number < currentStep || completedSteps.includes(step.number);

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onStepClick(step.number)}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary/10 border-primary/50 text-primary shadow-sm'
                  : isCompleted
                  ? 'bg-surface-container-highest/60 border-success/30 text-on-surface'
                  : 'bg-surface-container-highest/20 border-white/5 text-on-surface-variant/60 hover:border-white/15'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : isCompleted
                    ? 'bg-success text-on-primary'
                    : 'bg-surface-container-highest text-on-surface-variant/70 border border-white/10'
                }`}
              >
                {isCompleted ? <Check size={12} /> : step.number}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-[12px] font-medium leading-tight truncate ${isActive ? 'font-semibold text-primary' : 'text-on-surface'}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-on-surface-variant/50 truncate hidden xl:block">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
