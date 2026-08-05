import React, { useState } from 'react';
import { X, User, ShieldCheck, Globe, Sliders } from 'lucide-react';
import type { SystemUser } from '../../../types/users';

interface DetailProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
}

type DetailTab = 'visao_geral' | 'perfis' | 'escopo' | 'preferencias';

export const UserDetailView: React.FC<DetailProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('visao_geral');

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[14px]">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-on-surface">{user.name}</h3>
              <p className="text-[12px] text-on-surface-variant/70">{user.email} • {user.jobTitle || 'Sem cargo definido'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('visao_geral')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${activeTab === 'visao_geral' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            <User size={14} />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('perfis')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${activeTab === 'perfis' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            <ShieldCheck size={14} />
            Perfis & Permissões
          </button>
          <button
            onClick={() => setActiveTab('escopo')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${activeTab === 'escopo' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            <Globe size={14} />
            Escopo de Acesso
          </button>
          <button
            onClick={() => setActiveTab('preferencias')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${activeTab === 'preferencias' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            <Sliders size={14} />
            Preferências
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 text-[13px] space-y-3">
          {activeTab === 'visao_geral' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl border border-white/10 p-3 space-y-1">
                <span className="text-[11px] font-mono-label text-on-surface-variant/60 uppercase">Identificação</span>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Telefone:</strong> {user.phone || '—'}</p>
                <p><strong>Matrícula:</strong> {user.employeeCode || '—'}</p>
              </div>
              <div className="glass-card rounded-xl border border-white/10 p-3 space-y-1">
                <span className="text-[11px] font-mono-label text-on-surface-variant/60 uppercase">Status & Acesso</span>
                <p><strong>Status:</strong> <span className="text-success uppercase font-mono-label">{user.status}</span></p>
                <p><strong>Tipo:</strong> <span className="uppercase font-mono-label">{user.type}</span></p>
                <p><strong>Último Acesso:</strong> {user.lastAccessAt ? new Date(user.lastAccessAt).toLocaleString('pt-BR') : 'Sem registro'}</p>
              </div>
            </div>
          )}

          {activeTab === 'perfis' && (
            <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
              <h4 className="font-semibold text-on-surface">Perfil Principal</h4>
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary font-medium">
                {user.primaryRoleName || 'Mecânico Diesel'}
              </div>
              <p className="text-[12px] text-on-surface-variant/70">
                Este perfil define o conjunto primário de permissões do usuário na aplicação.
              </p>
            </div>
          )}

          {activeTab === 'escopo' && (
            <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
              <h4 className="font-semibold text-on-surface">Empresas e Unidades Autorizadas</h4>
              <ul className="list-disc list-inside text-on-surface-variant text-[12px] space-y-1">
                <li>Empresa Matriz: AgroGuard Agrícola</li>
                <li>Unidades: Unidade Central Ribeirão Preto, Unidade Sertãozinho</li>
                <li>Fazendas: Fazenda Santa Maria</li>
              </ul>
            </div>
          )}

          {activeTab === 'preferencias' && (
            <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2 text-[12px]">
              <p><strong>Tema de Interface:</strong> Escuro (AgroGuard Dark)</p>
              <p><strong>Formato de Data:</strong> DD/MM/YYYY</p>
              <p><strong>Densidade de Tabelas:</strong> Confortável</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-surface-container-highest border border-white/10 text-[12px] text-on-surface">
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
