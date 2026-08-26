import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CircleHelp, LogOut, LockKeyhole, Settings, Shield, UserRound, Users, X } from 'lucide-react';
import type { UserProfileData } from '../../context/AuthContext';

interface AccountMenuProps {
  profile: UserProfileData | null;
  loading: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  ADMIN_ORGANIZACAO: 'Administrador',
  GESTOR: 'Gestor',
  OPERADOR: 'Operador',
};

const MenuLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }> = ({ to, icon, children, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] rounded-md">
    {icon}<span>{children}</span>
  </Link>
);

export const AccountMenu: React.FC<AccountMenuProps> = ({ profile, loading, onClose, onSignOut }) => {
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'ADMIN_ORGANIZACAO';
  if (loading) return <div role="status" className="absolute right-0 top-full mt-2 w-80 rounded-lg border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg">Carregando dados da conta...</div>;

  return (
    <div role="menu" aria-label="Menu da conta" className="absolute right-0 top-full mt-2 w-80 rounded-lg border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-50 overflow-hidden">
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[var(--color-sidebar)] text-white text-sm font-semibold">{profile?.name ? profile.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : '—'}</div>
          <div className="min-w-0">
            <p className="font-semibold text-[13px] truncate">{profile?.name || 'Perfil não disponível'}</p>
            <p className="text-[11px] text-[var(--color-text-muted)] truncate">{profile?.email || 'E-mail não disponível'}</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{profile?.role ? (roleLabels[profile.role] || profile.role) : 'Função não disponível'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar menu da conta" className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><X size={15} /></button>
        </div>
        <div className="mt-3 grid-cols-2 gap-2 text-[11px]">
          <div><span className="block text-[var(--color-text-muted)]">Organização</span><strong className="font-medium">{profile?.organizationName || 'Não vinculada'}</strong></div>
          <div><span className="block text-[var(--color-text-muted)]">Workspace</span><strong className="font-medium">{profile?.workspaceName || 'Não informado'}</strong></div>
        </div>
      </div>
      <nav className="p-2" aria-label="Opções da conta">
        <MenuLink to="/app/configuracoes?tab=perfil" icon={<UserRound size={15} />} onClick={onClose}>Meu Perfil</MenuLink>
        <MenuLink to="/app/configuracoes?tab=conta" icon={<Settings size={15} />} onClick={onClose}>Minha Conta</MenuLink>
        <MenuLink to="/app/configuracoes?tab=gerais" icon={<Building2 size={15} />} onClick={onClose}>Organização</MenuLink>
        {isAdmin && <MenuLink to="/app/configuracoes?tab=usuarios" icon={<Users size={15} />} onClick={onClose}>Usuários e Permissões</MenuLink>}
        <MenuLink to="/app/configuracoes?tab=preferencias" icon={<Shield size={15} />} onClick={onClose}>Preferências</MenuLink>
        <MenuLink to="/app/configuracoes?tab=seguranca" icon={<LockKeyhole size={15} />} onClick={onClose}>Segurança</MenuLink>
        <MenuLink to="/app/configuracoes?tab=ajuda" icon={<CircleHelp size={15} />} onClick={onClose}>Ajuda</MenuLink>
      </nav>
      <div className="border-t border-[var(--color-border)] p-2">
        <button type="button" role="menuitem" onClick={onSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-danger)] hover:bg-[var(--color-surface-secondary)] rounded-md"><LogOut size={15} />Sair</button>
      </div>
    </div>
  );
};
