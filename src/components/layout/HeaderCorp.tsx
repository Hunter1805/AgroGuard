import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Sun, Moon, Menu, Search, ChevronDown, X } from 'lucide-react';
import { ROUTES } from '../../types/routes';
import { isExplicitMockMode } from '../../config/data-source.config';
import { useAuth } from '../../context/AuthContext';
import { AccountMenu } from './AccountMenu';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface HeaderCorpProps {
  onOpenCommandPalette: () => void;
  onMobileMenuOpen?: () => void;
  pendingAlerts?: number;
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.DASHBOARD]:      'Dashboard',
  [ROUTES.EQUIPAMENTOS]:   'Equipamentos',
  [ROUTES.ORDENS_SERVICO]: 'Ordens de Serviço',
  [ROUTES.MANUTENCOES]:    'Manutenções',
  '/manutencoes/visao-geral': 'Visão Geral',
  [ROUTES.MANUTENCOES_PLANOS]: 'Planos Preventivos',
  [ROUTES.MANUTENCOES_AGENDA]: 'Agenda',
  [ROUTES.MANUTENCOES_HISTORICO]: 'Histórico',
  [ROUTES.CHECKLISTS]:     'Checklists',
  [ROUTES.ALERTAS]:        'Central de Alertas',
  [ROUTES.PNEUS]:          'Pneus',
  [ROUTES.FERRAMENTAS]:    'Ferramentas',
  [ROUTES.PECAS_INSUMOS]:  'Peças e Insumos',
  [ROUTES.RELATORIOS]:     'Relatórios',
  [ROUTES.CADASTROS]:      'Cadastros',
  [ROUTES.CONFIGURACOES]:  'Configurações',
  [ROUTES.USUARIOS]:       'Usuários',
};

const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; to: string }[] = [];

  let accumulated = '';
  for (const seg of segments) {
    accumulated += '/' + seg;
    const label = ROUTE_LABELS[accumulated];
    if (label) crumbs.push({ label, to: accumulated });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px]">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.to}>
          {i > 0 && (
            <span className="text-[var(--color-text-muted)] select-none">/</span>
          )}
          {i < crumbs.length - 1 ? (
            <Link
              to={crumb.to}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-primary)] font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ─── Painel de notificações ───────────────────────────────────────────────────
interface Notification {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'danger',  title: 'Alerta crítico',       description: 'Trator John Deere 8R — Troca de óleo vencida.',  time: 'há 5 min' },
  { id: '2', type: 'warning', title: 'Manutenção próxima',   description: 'Colheitadeira S700 — Revisão em 50h.',           time: 'há 1h' },
  { id: '3', type: 'info',    title: 'OS criada',            description: 'OS 00421 aberta para CA-001.',                   time: 'há 2h' },
];

const TYPE_COLORS: Record<Notification['type'], string> = {
  danger:  'var(--color-danger)',
  warning: 'var(--color-warning)',
  info:    'var(--color-info)',
};

const NotificationsPanel: React.FC<{
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClose: () => void;
}> = ({ notifications, onMarkAllRead, onClose }) => (
  <div
    className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border border-[var(--color-border)] bg-[var(--color-surface)] z-50 animate-slide-in-up"
    role="dialog"
    aria-label="Notificações"
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Notificações</span>
      <div className="flex items-center gap-2">
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[12px] text-[var(--color-brand)] hover:underline cursor-pointer"
          >
            Marcar lidas
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Fechar notificações"
          className="p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>

    <div className="max-h-72 overflow-y-auto divide-y divide-[var(--color-border)]">
      {notifications.map((n) => (
        <div key={n.id} className="px-4 py-3 hover:bg-[var(--color-surface-secondary)] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: TYPE_COLORS[n.type] }}
            />
            <span className="text-[12px] font-medium" style={{ color: TYPE_COLORS[n.type] }}>
              {n.title}
            </span>
          </div>
          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{n.description}</p>
          <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">{n.time}</span>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="px-4 py-6 text-center text-[13px] text-[var(--color-text-muted)]">
          Nenhuma notificação nova
        </p>
      )}
    </div>

    <div className="px-4 py-2.5 border-t border-[var(--color-border)]">
      <Link
        to={ROUTES.ALERTAS}
        className="text-[12px] text-[var(--color-brand)] hover:underline"
        onClick={onClose}
      >
        Ver todos os alertas →
      </Link>
    </div>
  </div>
);

// ─── Header Corporativo ───────────────────────────────────────────────────────
export const HeaderCorp: React.FC<HeaderCorpProps> = ({
  onOpenCommandPalette,
  onMobileMenuOpen,
  pendingAlerts = 0,
}) => {
  const { profile, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(isExplicitMockMode ? MOCK_NOTIFICATIONS : []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const bellRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Atalho de teclado Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenCommandPalette]);

  // Fecha menus ao clicar fora ou pressionar Escape.
  useEffect(() => {
    if (!showNotifications && !showAccountMenu) return;
    const handler = (e: MouseEvent) => {
      if (showNotifications && bellRef.current && !bellRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (showAccountMenu && accountRef.current && !accountRef.current.contains(e.target as Node)) setShowAccountMenu(false);
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShowNotifications(false); setShowAccountMenu(false); } };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', keyHandler); };
  }, [showNotifications, showAccountMenu]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const unread = pendingAlerts > 0 ? pendingAlerts : notifications.length;
  const userName = profile?.name || (authLoading ? 'Carregando...' : '');
  const initials = userName ? userName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : '—';

  return (
    <header
      className="flex items-center justify-between w-full px-6 shrink-0 border-b"
      style={{
        height: 'var(--spacing-topbar)',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* ── Esquerda: hamburger mobile + breadcrumb ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger mobile */}
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Abrir menu"
          title="Abrir menu"
          className="md:hidden p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <Breadcrumb />
      </div>

      {/* ── Direita: busca + ações ── */}
      <div className="flex items-center gap-1.5 shrink-0 pl-4">

        {/* Campo de busca */}
        <div
          className="relative flex items-center transition-all duration-200"
          style={{ width: searchFocused ? '280px' : '180px' }}
        >
          <Search
            size={14}
            className="absolute left-3 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="search"
            placeholder="Buscar…"
            aria-label="Busca global (Ctrl+K)"
            onFocus={() => { setSearchFocused(true); onOpenCommandPalette(); }}
            onBlur={() => setSearchFocused(false)}
            readOnly
            className="w-full pl-8 pr-10 py-2 text-[13px] rounded-md border cursor-pointer"
            style={{
              borderColor: searchFocused ? 'var(--color-brand)' : 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)',
              color: 'var(--color-text-secondary)',
              outline: 'none',
              height: '36px',
            }}
          />
          <kbd
            className="absolute right-2.5 text-[10px] px-1 rounded border select-none"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notificações / sino */}
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label={`${unread} notificações`}
            title="Notificações"
            className="relative p-2 rounded-md transition-colors cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-white text-[9px] font-bold px-0.5"
                style={{ backgroundColor: 'var(--color-danger)' }}
                aria-hidden
              >
                {unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationsPanel
              notifications={notifications}
              onMarkAllRead={() => setNotifications([])}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* Ajuda */}
        <button
          type="button"
          aria-label="Ajuda"
          title="Ajuda"
          className="p-2 rounded-md transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <HelpCircle size={18} />
        </button>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
          className="p-2 rounded-md transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Separador */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Perfil do usuário */}
        <div className="relative" ref={accountRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={showAccountMenu}
          aria-label="Menu do usuário"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-primary)' }}
          onClick={() => setShowAccountMenu((value) => !value)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
            style={{ backgroundColor: 'var(--color-sidebar)' }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
            <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {userName}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {profile?.role ? ({ ADMIN: 'Administrador', ADMIN_ORGANIZACAO: 'Administrador', GESTOR: 'Gestor', OPERADOR: 'Operador', proprietario: 'Proprietário', administrador: 'Administrador', tecnico: 'Técnico', supervisor: 'Supervisor' }[profile.role] || profile.role) : 'Função não disponível'}
            </span>
          </div>
          <ChevronDown size={13} className="hidden sm:block" style={{ color: 'var(--color-text-muted)' }} />
        </button>
        {showAccountMenu && <AccountMenu profile={profile} loading={authLoading} onClose={() => setShowAccountMenu(false)} onSignOut={async () => { await logout(); navigate('/entrar', { replace: true }); }} />}
        </div>
      </div>
    </header>
  );
};
