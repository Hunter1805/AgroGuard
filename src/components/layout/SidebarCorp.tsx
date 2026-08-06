import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  ClipboardList,
  Wrench,
  ListChecks,
  Package,
  Hammer,
  CircleDot,
  BarChart3,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  BookOpen,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
} from 'lucide-react';
import { ROUTES } from '../../types/routes';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface SidebarCorpProps {
  collapsed: boolean;
  onToggle: () => void;
  pendingAlerts?: number;
  /** drawer mobile aberto */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── NavItem ──────────────────────────────────────────────────────────────────
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  end?: boolean;
  collapsed?: boolean;
  sub?: boolean;
}> = ({ to, icon, label, badge, end = false, collapsed = false, sub = false }) => (
  <NavLink
    to={to}
    end={end}
    aria-label={label}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      [
        'relative flex items-center rounded-md transition-colors duration-150 group select-none',
        sub
          ? 'py-1.5 pl-2 pr-3 text-[13px]'
          : collapsed
          ? 'justify-center py-2.5 px-0'
          : 'gap-2.5 px-3 py-2 text-[13px]',
        isActive
          ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
          : 'text-[rgba(255,255,255,0.62)] hover:bg-[var(--color-sidebar-hover)] hover:text-white',
      ].join(' ')
    }
  >
    {/* Indicador ativo na esquerda */}
    {!sub && (
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          [
            'absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full transition-opacity duration-150',
            isActive ? 'bg-[var(--color-brand)] opacity-100' : 'opacity-0',
          ].join(' ')
        }
        tabIndex={-1}
        aria-hidden
      />
    )}

    <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
      {icon}
    </span>

    {!collapsed && (
      <span className="flex-1 truncate leading-none">{label}</span>
    )}

    {!collapsed && badge !== undefined && badge > 0 && (
      <span
        className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--color-danger)] text-white text-[10px] font-semibold px-1"
        aria-label={`${badge} alertas`}
      >
        {badge}
      </span>
    )}

    {/* Tooltip quando recolhida */}
    {collapsed && (
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md bg-[#0a1929] text-white text-[12px] px-2.5 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
      >
        {label}
        {badge !== undefined && badge > 0 && (
          <span className="ml-1.5 bg-[var(--color-danger)] text-white text-[10px] px-1 rounded-full">
            {badge}
          </span>
        )}
      </span>
    )}
  </NavLink>
);

// ─── Expandable Group ─────────────────────────────────────────────────────────
const ExpandableGroup: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  activePaths: string[];
  collapsed?: boolean;
}> = ({ icon, label, children, activePaths, collapsed = false }) => {
  const location = useLocation();
  const isAnyChildActive = activePaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );
  const [open, setOpen] = useState(isAnyChildActive);

  if (collapsed) {
    // Quando recolhida: leva ao primeiro filho com tooltip
    return (
      <NavLink
        to={activePaths[0] ?? '/'}
        title={label}
        aria-label={label}
        className={[
          'relative flex justify-center items-center rounded-md py-2.5 transition-colors duration-150 group',
          isAnyChildActive
            ? 'bg-[var(--color-sidebar-active)] text-white'
            : 'text-[rgba(255,255,255,0.62)] hover:bg-[var(--color-sidebar-hover)] hover:text-white',
        ].join(' ')}
      >
        <span className="flex items-center justify-center w-[18px] h-[18px]">{icon}</span>
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md bg-[#0a1929] text-white text-[12px] px-2.5 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          {label}
        </span>
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={[
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors duration-150 cursor-pointer select-none',
          isAnyChildActive
            ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
            : 'text-[rgba(255,255,255,0.62)] hover:bg-[var(--color-sidebar-hover)] hover:text-white',
        ].join(' ')}
      >
        <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">{icon}</span>
        <span className="flex-1 text-left leading-none truncate">{label}</span>
        {open
          ? <ChevronDown size={13} className="shrink-0 opacity-50" />
          : <ChevronRight size={13} className="shrink-0 opacity-50" />
        }
      </button>

      {open && (
        <ul className="mt-0.5 ml-7 pl-2 space-y-0.5 border-l border-white/10">
          {children}
        </ul>
      )}
    </div>
  );
};

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ label: string; collapsed: boolean }> = ({ label, collapsed }) =>
  collapsed ? (
    <div className="h-px bg-white/10 mx-2 my-3" aria-hidden />
  ) : (
    <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-[rgba(255,255,255,0.38)] select-none">
      {label}
    </p>
  );

// ─── Sidebar Corporativa ───────────────────────────────────────────────────────
export const SidebarCorp: React.FC<SidebarCorpProps> = ({
  collapsed,
  onToggle,
  pendingAlerts = 0,
  mobileOpen = false,
  onMobileClose,
}) => {
  const sidebarWidth = collapsed
    ? 'w-[var(--spacing-sidebar-collapsed)]'
    : 'w-[var(--spacing-sidebar-width)]';

  const content = (
    <nav
      className={[
        'flex flex-col h-full transition-[width] duration-200 overflow-hidden',
        sidebarWidth,
      ].join(' ')}
      style={{ backgroundColor: 'var(--color-sidebar)' }}
      aria-label="Navegação principal"
    >
      {/* ── Cabeçalho: logo + toggle ── */}
      <div
        className={[
          'flex items-center shrink-0 h-16 border-b border-white/10',
          collapsed ? 'justify-center' : 'justify-between px-4',
        ].join(' ')}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 select-none min-w-0">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-[14px] tracking-tight leading-none truncate">
              AgroGuard
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="shrink-0 p-1.5 rounded-md text-[rgba(255,255,255,0.45)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* ── Itens de navegação ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-0.5 px-2">

        {/* OPERAÇÃO */}
        <SectionLabel label="Operação" collapsed={collapsed} />

        <NavItem to={ROUTES.DASHBOARD} icon={<LayoutDashboard size={16} />} label="Dashboard" end collapsed={collapsed} />
        <NavItem to={ROUTES.EQUIPAMENTOS} icon={<Tractor size={16} />} label="Equipamentos" collapsed={collapsed} />
        <NavItem to={ROUTES.ORDENS_SERVICO} icon={<ListChecks size={16} />} label="Ordens de Serviço" collapsed={collapsed} />

        <ExpandableGroup
          icon={<Wrench size={16} />}
          label="Manutenções"
          activePaths={[ROUTES.MANUTENCOES_VISAO_GERAL, ROUTES.MANUTENCOES_PLANOS, ROUTES.MANUTENCOES_AGENDA, ROUTES.MANUTENCOES_HISTORICO]}
          collapsed={collapsed}
        >
          <li><NavItem to={ROUTES.MANUTENCOES_VISAO_GERAL} icon={<LayoutDashboard size={13} />} label="Visão Geral" end sub /></li>
          <li><NavItem to={ROUTES.MANUTENCOES_PLANOS} icon={<BookOpen size={13} />} label="Planos Preventivos" sub /></li>
          <li><NavItem to={ROUTES.MANUTENCOES_AGENDA} icon={<CalendarDays size={13} />} label="Agenda" sub /></li>
          <li><NavItem to={ROUTES.MANUTENCOES_HISTORICO} icon={<History size={13} />} label="Histórico" sub /></li>
        </ExpandableGroup>

        <NavItem to={ROUTES.CHECKLISTS} icon={<ClipboardList size={16} />} label="Checklists" collapsed={collapsed} />

        {/* RECURSOS */}
        <SectionLabel label="Recursos" collapsed={collapsed} />

        <NavItem to={ROUTES.PECAS_INSUMOS} icon={<Package size={16} />} label="Peças e Insumos" collapsed={collapsed} />
        <NavItem to={ROUTES.FERRAMENTAS} icon={<Hammer size={16} />} label="Ferramentas" collapsed={collapsed} />
        <NavItem to={ROUTES.PNEUS} icon={<CircleDot size={16} />} label="Pneus" collapsed={collapsed} />

        {/* GESTÃO */}
        <SectionLabel label="Gestão" collapsed={collapsed} />

        <NavItem to={ROUTES.RELATORIOS} icon={<BarChart3 size={16} />} label="Relatórios" collapsed={collapsed} />
        <NavItem to={ROUTES.CADASTROS} icon={<FileText size={16} />} label="Cadastros" collapsed={collapsed} />
        <NavItem to={ROUTES.CONFIGURACOES} icon={<Settings size={16} />} label="Configurações" collapsed={collapsed} />
      </div>

      {/* ── Rodapé: alertas ── */}
      <div className="shrink-0 border-t border-white/10 px-2 py-2">
        <NavItem
          to={ROUTES.ALERTAS}
          icon={<Bell size={16} />}
          label="Central de Alertas"
          badge={pendingAlerts}
          collapsed={collapsed}
        />
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-50">
        {content}
      </div>

      {/* Mobile: drawer overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
            onClick={onMobileClose}
            aria-hidden
          />
          {/* Drawer */}
          <div className="fixed left-0 top-0 h-screen z-50 md:hidden animate-slide-in-left">
            <div
              className="flex flex-col h-full"
              style={{
                width: 'var(--spacing-sidebar-width)',
                backgroundColor: 'var(--color-sidebar)',
              }}
            >
              {content}
            </div>
          </div>
        </>
      )}
    </>
  );
};
