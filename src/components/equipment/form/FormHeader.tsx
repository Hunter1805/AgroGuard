import React from 'react';
import { Tractor, X, CheckCircle2 } from 'lucide-react';

interface FormHeaderProps {
  isEditing: boolean;
  equipmentCode?: string;
  isDraftSaved: boolean;
  onClose: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  isEditing,
  equipmentCode,
  isDraftSaved,
  onClose,
}) => {
  return (
    <header className="bg-surface-container/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Tractor size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-title-md text-[18px] font-bold text-on-surface tracking-tight">
              {isEditing ? `Editar Equipamento ${equipmentCode ? `(${equipmentCode})` : ''}` : 'Novo Equipamento'}
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                isEditing
                  ? 'bg-warning/15 text-warning border border-warning/30'
                  : 'bg-primary/15 text-primary border border-primary/30'
              }`}
            >
              {isEditing ? 'Edição' : 'Cadastro Fullscreen'}
            </span>
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant/70">
            Formulário guiado em 6 etapas estruturadas da frota AgroGuard.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isDraftSaved && (
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-md">
            <CheckCircle2 size={13} /> Rascunho salvo
          </span>
        )}

        <button
          onClick={onClose}
          title="Fechar formulário"
          className="p-2 rounded-lg bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-[12px]"
        >
          <span className="hidden sm:inline">Fechar</span>
          <X size={16} />
        </button>
      </div>
    </header>
  );
};
