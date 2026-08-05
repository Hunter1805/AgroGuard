import React from 'react';
import { AlertTriangle, ClockAlert, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { ReadingValidationResult } from '../../../types/equipment-readings';

interface ReadingValidationAlertProps {
  validation: ReadingValidationResult | null;
}

export const ReadingValidationAlert: React.FC<ReadingValidationAlertProps> = ({ validation }) => {
  if (!validation) return null;

  if (validation.type === 'normal') {
    return (
      <div className="bg-success/10 border border-success/30 rounded-xl p-3 text-success flex items-start gap-2.5 text-[12px] animate-fade-in">
        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Leitura Normal</strong>
          <span>{validation.message}</span>
        </div>
      </div>
    );
  }

  if (validation.type === 'regressiva') {
    return (
      <div className="bg-error/15 border border-error/40 rounded-xl p-3.5 text-error flex items-start gap-3 text-[12px] animate-fade-in shadow-lg">
        <RefreshCw size={18} className="shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold text-[13px]">Alerta: Leitura Regressiva Detectada!</strong>
          <p className="opacity-90">{validation.message}</p>
          <p className="text-[11px] font-mono-label font-bold text-error pt-1">
            Motivos comuns: erro de digitação, troca de medidor ou reinício de painel.
          </p>
        </div>
      </div>
    );
  }

  if (validation.type === 'muito_alta') {
    return (
      <div className="bg-warning/15 border border-warning/40 rounded-xl p-3.5 text-warning flex items-start gap-3 text-[12px] animate-fade-in shadow-lg">
        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold text-[13px]">Aviso: Diferença Acima da Média Esperada!</strong>
          <p className="opacity-90">{validation.message}</p>
        </div>
      </div>
    );
  }

  if (validation.type === 'duplicada') {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 text-warning flex items-start gap-2.5 text-[12px] animate-fade-in">
        <ClockAlert size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Leitura Igual à Anterior</strong>
          <span>{validation.message}</span>
        </div>
      </div>
    );
  }

  return null;
};
