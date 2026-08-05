import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench, Activity, ArrowRightLeft, Bookmark, Package, CalendarCheck, History } from 'lucide-react';
import { useTools } from '../../hooks/useTools';
import { ToolStats } from './ToolStats';
import { ToolFilters } from './ToolFilters';
import { ToolTable } from './ToolTable';

import { ToolLoanList } from './loans/ToolLoanList';
import { ToolLoanForm } from './loans/ToolLoanForm';
import { ToolReservationList } from './reservations/ToolReservationList';
import { ToolKitList } from './kits/ToolKitList';
import { ToolCalibrationList } from './calibration/ToolCalibrationList';
import { ToolMaintenanceList } from './maintenance/ToolMaintenanceList';

import { ToolDamageModal } from './modals/ToolDamageModal';
import { ToolTransferModal } from './modals/ToolTransferModal';

import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';
import type { Tool } from '../../types/tools';

interface FerramentasViewProps {
  initialTab?: 'visao_geral' | 'itens' | 'emprestimos' | 'reservas' | 'kits' | 'calibracoes' | 'manutencoes' | 'historico';
}

export const FerramentasView: React.FC<FerramentasViewProps> = ({ initialTab = 'visao_geral' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { tools, stats, loading, filters, updateFilters, resetFilters, refetch } = useTools();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | undefined>(undefined);

  const tabs: { id: 'visao_geral' | 'itens' | 'emprestimos' | 'reservas' | 'kits' | 'calibracoes' | 'manutencoes' | 'historico'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'itens', label: 'Ferramentas', icon: Wrench, count: stats?.totalTools },
    { id: 'emprestimos', label: 'Empréstimos', icon: ArrowRightLeft, count: stats?.loanedTools },
    { id: 'reservas', label: 'Reservas', icon: Bookmark, count: stats?.reservedTools },
    { id: 'kits', label: 'Kits de Ferramentas', icon: Package },
    { id: 'calibracoes', label: 'Calibrações', icon: CalendarCheck, count: stats?.expiredCalibrations },
    { id: 'manutencoes', label: 'Manutenções', icon: Wrench, count: stats?.inMaintenanceTools },
    { id: 'historico', label: 'Histórico Auditável', icon: History },
  ];

  const handleOpenAction = (actionType: string, tool?: Tool) => {
    setSelectedTool(tool);
    setActiveModal(actionType);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-xs">
      <PageHeader
        title="Gestão Profissional de Ferramentas"
        subtitle="Controle de inventário, empréstimos, devoluções, kits de mecânicos, calibrações e baixas"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenAction('emprestar')} className="flex items-center gap-1.5">
              <ArrowRightLeft size={14} /> Registrar Empréstimo
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.FERRAMENTAS_NOVA)} className="flex items-center gap-1.5">
              <Plus size={16} /> Cadastrar Ferramenta
            </Button>
          </div>
        }
      />

      {/* Abas de Navegação Mapeadas */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl px-4 pt-2 flex items-center gap-6 overflow-x-auto shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-surface-container text-on-surface">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {(activeTab === 'visao_geral' || activeTab === 'itens') && (
        <div className="space-y-6">
          <ToolStats stats={stats} />

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <ToolFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

            {loading ? (
              <div className="p-12 text-center text-xs text-on-surface-variant">Carregando inventário de ferramentas...</div>
            ) : tools.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-on-surface-variant/50" />
                </div>
                <p className="text-on-surface font-bold text-sm">Nenhuma ferramenta cadastrada</p>
                <p className="text-on-surface-variant text-xs mt-1">Cadastre a primeira ferramenta para iniciar o controle da oficina.</p>
              </div>
            ) : (
              <ToolTable tools={tools} onOpenAction={handleOpenAction} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'emprestimos' && <ToolLoanList />}

      {activeTab === 'reservas' && <ToolReservationList />}

      {activeTab === 'kits' && <ToolKitList />}

      {activeTab === 'calibracoes' && <ToolCalibrationList />}

      {activeTab === 'manutencoes' && <ToolMaintenanceList />}

      {activeTab === 'historico' && <ToolLoanList />}

      {/* Modais Operacionais Globais */}
      {activeModal === 'emprestar' && (
        <ToolLoanForm initialTool={selectedTool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'dano' && selectedTool && (
        <ToolDamageModal tool={selectedTool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'transferir' && selectedTool && (
        <ToolTransferModal tool={selectedTool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
