import React from 'react';
import { LayoutDashboard, Users, Shield, Building2, Bell, Hash, History, Wrench, ClipboardList, Package } from 'lucide-react';

interface NavProps {
  activeSection: string;
  onSelectSection: (sec: string) => void;
}

const SECTIONS = [
  { id: 'visao_geral', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'perfis', label: 'Perfis & Matriz', icon: Shield },
  { id: 'gerais', label: 'Identidade & Geral', icon: Building2 },
  { id: 'manutencao', label: 'Regras de Manutenção', icon: Wrench },
  { id: 'ordens_servico', label: 'Regras de OS', icon: ClipboardList },
  { id: 'estoque', label: 'Regras de Estoque', icon: Package },
  { id: 'alertas', label: 'Regras de Alertas', icon: Bell },
  { id: 'numeracoes', label: 'Numerações Automáticas', icon: Hash },
  { id: 'auditoria', label: 'Auditoria Administrativa', icon: History },
];

export const SettingsNavigation: React.FC<NavProps> = ({ activeSection, onSelectSection }) => {
  return (
    <div className="flex flex-wrap gap-1.5 p-1.5 glass-card rounded-xl border border-white/10">
      {SECTIONS.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onSelectSection(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60'
            }`}
          >
            <Icon size={14} />
            {sec.label}
          </button>
        );
      })}
    </div>
  );
};
