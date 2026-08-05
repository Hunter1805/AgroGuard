import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  reason?: string;
  moduleName?: string;
}

export const AccessDeniedState: React.FC<AccessDeniedProps> = ({
  reason = 'Seu perfil de acesso não possui permissão para visualizar este módulo.',
  moduleName,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[70vh]">
      <div className="glass-card max-w-lg w-full rounded-2xl border border-error/30 p-8 text-center space-y-4 shadow-2xl bg-error/5">
        <div className="w-16 h-16 rounded-2xl bg-error/10 text-error border border-error/20 mx-auto flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-[20px] font-bold text-on-surface">Acesso Não Autorizado</h2>
          {moduleName && (
            <span className="text-[12px] font-mono-label text-error uppercase tracking-wider">
              Módulo: {moduleName}
            </span>
          )}
        </div>

        <p className="text-[13px] text-on-surface-variant/80 leading-relaxed">
          {reason} Entre em contato com o administrador do sistema se você acredita que deveria ter acesso a este recurso.
        </p>

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg bg-surface-container-highest border border-white/10 text-[13px] font-medium text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
