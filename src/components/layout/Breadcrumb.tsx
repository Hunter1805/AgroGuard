import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Mapeamento rota → label legível
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/equipamentos': 'Equipamentos',
  '/checklists': 'Checklists',
  '/manutencoes': 'Manutenções — Visão Geral',
  '/manutencoes/planos': 'Planos Preventivos',
  '/manutencoes/agenda': 'Agenda',
  '/manutencoes/historico': 'Histórico',
  '/ordens-servico': 'Ordens de Serviço',
  '/alertas': 'Central de Alertas',
  '/pneus': 'Pneus',
  '/ferramentas': 'Ferramentas',
  '/pecas-insumos': 'Peças e Insumos',
  '/relatorios': 'Relatórios',
  '/cadastros': 'Cadastros',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações',
};

interface BreadcrumbProps {
  /** @deprecated — usar useLocation internamente */
  activeTab?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const { pathname } = useLocation();
  const label = ROUTE_LABELS[pathname] ?? 'AgroGuard';

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono-label text-on-surface-variant/60">
      <span>AgroGuard</span>
      <ChevronRight size={12} />
      <span className="text-on-surface font-medium">{label}</span>
    </div>
  );
};
