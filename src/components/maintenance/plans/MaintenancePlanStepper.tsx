import React from 'react';
import { Check, FileText, Wrench, Clock, ShieldCheck, Cpu, Sliders } from 'lucide-react';

interface MaintenancePlanStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const MaintenancePlanStepper: React.FC<MaintenancePlanStepperProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Identificação', subtitle: 'Dados Básicos', icon: FileText },
    { number: 2, title: 'Aplicação', subtitle: 'Frota Alvo', icon: Cpu },
    { number: 3, title: 'Intervalos', subtitle: 'Regra Combinada', icon: Clock },
    { number: 4, title: 'Tarefas', subtitle: 'Peças & Insumos', icon: Wrench },
    { number: 5, title: 'Paradas', subtitle: 'Tolerância & Alertas', icon: Sliders },
    { number: 6, title: 'Revisão', subtitle: 'Auditoria & Salvar', icon: ShieldCheck },
  ];

  return (
    <div className="glass-card p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentStep > s.number;
          const isCurr = currentStep === s.number;
          
          return (
            <React.Fragment key={s.number}>
              <div
                onClick={() => (onStepClick && s.number <= currentStep ? onStepClick(s.number) : null)}
                className={`flex items-center gap-3 py-1.5 px-3 rounded-xl transition-all ${
                  isCurr
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500 font-extrabold shadow-sm'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-gray-400 opacity-70 font-medium'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isCurr
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-extrabold">{s.title}</p>
                  <p className="text-[11px] font-semibold opacity-80">{s.subtitle}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full ${
                    currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
