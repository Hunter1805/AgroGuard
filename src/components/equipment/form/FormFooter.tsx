import React from 'react';
import { ArrowLeft, ArrowRight, Save, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { FormStep } from '../../../types/equipment-form';

interface FormFooterProps {
  currentStep: FormStep;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  currentStep,
  isSubmitting,
  onPrev,
  onNext,
  onSaveDraft,
  onSubmit,
}) => {
  return (
    <footer className="bg-surface-container/95 backdrop-blur-md border-t border-white/10 px-6 py-3.5 sticky bottom-0 z-30 flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        icon={<FileText size={14} />}
        onClick={onSaveDraft}
        disabled={isSubmitting}
      >
        Salvar Rascunho
      </Button>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          icon={<ArrowLeft size={16} />}
          onClick={onPrev}
          disabled={currentStep === 1 || isSubmitting}
        >
          Anterior
        </Button>

        {currentStep < 6 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onNext}
            disabled={isSubmitting}
          >
            Próximo <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={<Save size={16} />}
            isLoading={isSubmitting}
            onClick={(e) => onSubmit(e)}
          >
            Concluir & Salvar Equipamento
          </Button>
        )}
      </div>
    </footer>
  );
};
