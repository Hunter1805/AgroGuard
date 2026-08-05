import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { SystemUser } from '../../../types/users';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
}

const MODULES_LIST = [
  'Dashboard & Métricas',
  'Central de Alertas',
  'Equipamentos & Frota',
  'Checklists Diários',
  'Manutenções Preventivas',
  'Ordens de Serviço',
  'Pneus & Rodados',
  'Ferramentas & Kits',
  'Peças & Insumos',
  'Relatórios e Indicadores',
  'Cadastros Auxiliares',
  'Usuários & Permissões',
  'Configurações Globais',
  'Auditoria Administrativa',
];

export const EffectivePermissionsDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border-l border-white/10 flex flex-col h-full shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-on-surface">Permissões Efetivas</h3>
              <p className="text-[11px] text-on-surface-variant/70 font-mono-label">{user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="glass-card rounded-xl border border-white/10 p-3 space-y-1 text-[12px]">
            <p className="text-on-surface"><strong>Perfil Principal:</strong> {user.primaryRoleName || 'Administrador'}</p>
            <p className="text-on-surface"><strong>Status:</strong> <span className="text-success uppercase font-mono-label">{user.status}</span></p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase text-on-surface-variant/60 tracking-wider">Acesso por Módulo</h4>
            <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden glass-card">
              {MODULES_LIST.map((mod) => (
                <div key={mod} className="p-3 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-on-surface">{mod}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium">
                    <CheckCircle2 size={13} />
                    Permitido
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-surface-container-high/40 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface-container-highest border border-white/10 text-[12px] font-medium text-on-surface">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
