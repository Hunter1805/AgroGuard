import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 bg-pattern">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl shadow-2xl border border-white/10 text-center">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4 border border-error/20">
          <Lock size={32} />
        </div>

        <h2 className="text-xl font-bold text-on-background mb-2">Acesso Negado (403)</h2>
        <p className="text-sm text-on-background-variant mb-6">
          Você não possui as permissões necessárias ou seu usuário interno não está ativo no escopo solicitado.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-primary text-on-primary font-medium rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Dashboard</span>
        </button>
      </div>
    </div>
  );
};
