import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, ClipboardList, PlusCircle } from 'lucide-react';
import { ROUTES } from '../../../types/routes';

export interface QuickActionsBarProps {
  onOpenNewOS?: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ onOpenNewOS }) => {
  const navigate = useNavigate();

  const handleOpenOS = () => {
    if (onOpenNewOS) {
      onOpenNewOS();
    } else {
      navigate(ROUTES.ORDEM_NOVA);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap pt-1">
      <span className="text-[12px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider select-none shrink-0">
        Ações rápidas:
      </span>

      <button
        type="button"
        onClick={() => navigate(ROUTES.EQUIPAMENTOS_LEITURAS)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-[13px] font-medium transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
      >
        <Gauge size={15} style={{ color: 'var(--color-brand)' }} />
        Registrar leitura
      </button>

      <button
        type="button"
        onClick={() => navigate(ROUTES.CHECKLISTS)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-[13px] font-medium transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
      >
        <ClipboardList size={15} style={{ color: 'var(--color-brand)' }} />
        Iniciar checklist
      </button>

      <button
        type="button"
        onClick={handleOpenOS}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-[13px] font-medium transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
      >
        <PlusCircle size={15} style={{ color: 'var(--color-brand)' }} />
        Abrir Ordem de Serviço
      </button>
    </div>
  );
};
