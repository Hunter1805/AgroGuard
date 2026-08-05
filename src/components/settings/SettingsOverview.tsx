import React from 'react';
import { Users, Shield, Lock, Bell, History } from 'lucide-react';

interface OverviewProps {
  onNavigate: (section: string) => void;
}

export const SettingsOverview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Indicadores do Módulo Administrativo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl border border-white/10 p-4 space-y-1">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 uppercase">Usuários Ativos</span>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-on-surface">4</span>
            <Users size={20} className="text-primary" />
          </div>
        </div>

        <div className="glass-card rounded-xl border border-white/10 p-4 space-y-1">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 uppercase">Perfis de Acesso</span>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-on-surface">11</span>
            <Shield size={20} className="text-primary" />
          </div>
        </div>

        <div className="glass-card rounded-xl border border-white/10 p-4 space-y-1">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 uppercase">Bloqueados</span>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-error">1</span>
            <Lock size={20} className="text-error" />
          </div>
        </div>

        <div className="glass-card rounded-xl border border-white/10 p-4 space-y-1">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 uppercase">Alertas Ativos</span>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-warning">5</span>
            <Bell size={20} className="text-warning" />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-3">
        <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-wider text-[11px] font-mono-label text-on-surface-variant/70">
          Ações Rápidas Administrativas
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('usuarios')}
            className="p-3 rounded-xl bg-surface-container-high/60 border border-white/10 hover:border-primary/50 text-left transition-all group"
          >
            <Users size={18} className="text-primary mb-1 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-[13px] text-on-surface">Gerenciar Usuários</div>
            <p className="text-[11px] text-on-surface-variant/60">Cadastrar e bloquear</p>
          </button>

          <button
            onClick={() => onNavigate('perfis')}
            className="p-3 rounded-xl bg-surface-container-high/60 border border-white/10 hover:border-primary/50 text-left transition-all group"
          >
            <Shield size={18} className="text-primary mb-1 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-[13px] text-on-surface">Perfis & Matriz</div>
            <p className="text-[11px] text-on-surface-variant/60">Permissões de acesso</p>
          </button>

          <button
            onClick={() => onNavigate('alertas')}
            className="p-3 rounded-xl bg-surface-container-high/60 border border-white/10 hover:border-primary/50 text-left transition-all group"
          >
            <Bell size={18} className="text-warning mb-1 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-[13px] text-on-surface">Regras de Alertas</div>
            <p className="text-[11px] text-on-surface-variant/60">Notificações e prazos</p>
          </button>

          <button
            onClick={() => onNavigate('auditoria')}
            className="p-3 rounded-xl bg-surface-container-high/60 border border-white/10 hover:border-primary/50 text-left transition-all group"
          >
            <History size={18} className="text-primary mb-1 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-[13px] text-on-surface">Auditoria</div>
            <p className="text-[11px] text-on-surface-variant/60">Log de modificações</p>
          </button>
        </div>
      </div>
    </div>
  );
};
