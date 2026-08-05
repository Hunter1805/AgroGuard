import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../../ui/Button';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirmLeave: () => void;
  onCancel: () => void;
  onSaveDraftAndLeave?: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onConfirmLeave,
  onCancel,
  onSaveDraftAndLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="glass-card bg-surface-container-highest border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning/10 text-warning border border-warning/20">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-title-md text-[17px] font-semibold text-on-surface">
                Alterações Não Salvas
              </h3>
              <p className="text-[12px] text-on-surface-variant/70">
                Você tem modificações não salvas neste formulário.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-[13px] text-on-surface-variant/80">
          Se você sair sem salvar ou registrar rascunho, todas as alterações inseridas nesta sessão serão perdidas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Continuar Editando
          </Button>

          {onSaveDraftAndLeave && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onSaveDraftAndLeave}
              className="w-full sm:w-auto"
            >
              Salvar Rascunho e Sair
            </Button>
          )}

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirmLeave}
            className="w-full sm:w-auto"
          >
            Sair sem Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
