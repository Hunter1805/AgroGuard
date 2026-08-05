import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  ClipboardList,
  Wrench,
  FileText,
  BarChart3,
  Users,
  Settings,
  Plus,
  Bell,
  CircleDot,
  Package,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  ListChecks,
  History,
  BookOpen,
  Hammer,
} from 'lucide-react';
import { AgroGuardLogo } from '../AgroGuardLogo';
import { ROUTES } from '../../types/routes';

interface SidebarProps {
  onOpenNewOS: () => void;
  pendingAlerts?: number;
}

// Componente de item de navegação com NavLink
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isSubItem?: boolean;
  end?: boolean;
}> = ({ to, icon, label, badge, isSubItem = false, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `w-full flex items-center justify-between rounded-md transition-all cursor-pointer group
        ${isSubItem ? 'px-3 py-1.5' : 'px-3 py-2'}
        ${isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
        }`
      }
    >
      <div className={`flex items-center ${isSubItem ? 'gap-2 pl-4' : 'gap-2.5'}`}>
        <span className={isSubItem ? 'opacity-60 text-[14px]' : ''}>{icon}</span>
        <span className={`font-body-sm ${isSubItem ? 'text-[12px]' : 'text-[13px]'}`}>
          {label}
        </span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label opacity-80 group-hover:opacity-100">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

// Componente de grupo expansível (Manutenções)
const ExpandableGroup: React.FC<{
  icon: React.ReactNode;
  label: string;
  badge?: number;
  children: React.ReactNode;
  activePaths: string[];
}> = ({ icon, label, badge, children, activePaths }) => {
  const location = useLocation();
  const isAnyChildActive = activePaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  return (
    <div>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full flex items-center justify-between rounded-md px-3 py-2 transition-all cursor-pointer group
          ${isAnyChildActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-body-sm text-[13px]">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {badge !== undefined && badge > 0 && (
            <span className="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label opacity-80 group-hover:opacity-100">
              {badge}
            </span>
          )}
          {isOpen
            ? <ChevronDown size={14} className="opacity-60" />
            : <ChevronRight size={14} className="opacity-60" />
          }
        </div>
      </button>

      {isOpen && (
        <ul className="mt-0.5 space-y-0.5 border-l border-white/5 ml-4">
          {children}
        </ul>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewOS, pendingAlerts = 3 }) => {
  return (
    <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 w-sidebar-width z-50 bg-surface-container/80 backdrop-blur-md border-r border-white/5 selection:bg-primary/20">
      {/* Logo */}
      <div className="p-4 border-b border-white/5 flex items-center">
        <AgroGuardLogo size="md" showSubtitle={true} />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">

        {/* ── OPERAÇÃO ── */}
        <div>
          <h2 className="px-3 mb-2 font-label-caps text-[11px] text-on-surface-variant/50 uppercase tracking-wider">
            Operação
          </h2>
          <ul className="space-y-0.5">
            <li>
              <NavItem to={ROUTES.DASHBOARD} icon={<LayoutDashboard size={18} />} label="Dashboard" end />
            </li>
            <li>
              <NavItem to={ROUTES.EQUIPAMENTOS} icon={<Tractor size={18} />} label="Equipamentos" />
            </li>
            <li>
              <NavItem to={ROUTES.CHECKLISTS} icon={<ClipboardList size={18} />} label="Checklists" />
            </li>
            <li>
              <ExpandableGroup
                icon={<Wrench size={18} />}
                label="Manutenções"
                activePaths={[ROUTES.MANUTENCOES, ROUTES.MANUTENCOES_PLANOS, ROUTES.MANUTENCOES_AGENDA, ROUTES.MANUTENCOES_HISTORICO]}
              >
                <li>
                  <NavItem to={ROUTES.MANUTENCOES} icon={<CircleDot size={13} />} label="Visão Geral" isSubItem end />
                </li>
                <li>
                  <NavItem to={ROUTES.MANUTENCOES_PLANOS} icon={<BookOpen size={13} />} label="Planos Preventivos" isSubItem />
                </li>
                <li>
                  <NavItem to={ROUTES.MANUTENCOES_AGENDA} icon={<CalendarDays size={13} />} label="Agenda" isSubItem />
                </li>
                <li>
                  <NavItem to={ROUTES.MANUTENCOES_HISTORICO} icon={<History size={13} />} label="Histórico" isSubItem />
                </li>
              </ExpandableGroup>
            </li>
            <li>
              <NavItem to={ROUTES.ORDENS_SERVICO} icon={<ListChecks size={18} />} label="Ordens de Serviço" />
            </li>
            <li>
              <NavItem
                to={ROUTES.ALERTAS}
                icon={<Bell size={18} />}
                label="Central de Alertas"
                badge={pendingAlerts}
              />
            </li>
            <li>
              <NavItem to={ROUTES.PNEUS} icon={<CircleDot size={18} />} label="Pneus" />
            </li>
            <li>
              <NavItem to={ROUTES.FERRAMENTAS} icon={<Hammer size={18} />} label="Ferramentas" />
            </li>
            <li>
              <NavItem to={ROUTES.PECAS_INSUMOS} icon={<Package size={18} />} label="Peças e Insumos" />
            </li>
          </ul>
        </div>

        {/* ── GESTÃO ── */}
        <div>
          <h2 className="px-3 mb-2 font-label-caps text-[11px] text-on-surface-variant/50 uppercase tracking-wider">
            Gestão
          </h2>
          <ul className="space-y-0.5">
            <li>
              <NavItem to={ROUTES.RELATORIOS} icon={<BarChart3 size={18} />} label="Relatórios" />
            </li>
            <li>
              <NavItem to={ROUTES.CADASTROS} icon={<FileText size={18} />} label="Cadastros" />
            </li>
            <li>
              <NavItem to={ROUTES.USUARIOS} icon={<Users size={18} />} label="Usuários" />
            </li>
            <li>
              <NavItem to={ROUTES.CONFIGURACOES} icon={<Settings size={18} />} label="Configurações" />
            </li>
          </ul>
        </div>
      </div>

      {/* Botão Nova OS */}
      <div className="p-4 border-t border-white/5">
        <button
          id="sidebar-nova-os-btn"
          onClick={onOpenNewOS}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-body-sm text-[13px] font-medium py-2 rounded-md transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Plus size={18} /> Nova Ordem de Serviço
        </button>
      </div>
    </nav>
  );
};
