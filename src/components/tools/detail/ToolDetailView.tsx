import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, ArrowRightLeft, Bookmark, Wrench, CalendarCheck, DollarSign, History } from 'lucide-react';
import { useToolDetail } from '../../../hooks/useToolDetail';
import { ToolDetailHeader } from './ToolDetailHeader';
import { ToolOverviewTab } from './ToolOverviewTab';
import { ToolLoansTab } from './ToolLoansTab';
import { ToolReservationsTab } from './ToolReservationsTab';
import { ToolMaintenanceTab } from './ToolMaintenanceTab';
import { ToolCalibrationTab } from './ToolCalibrationTab';
import { ToolCostsTab } from './ToolCostsTab';
import { ToolHistoryTab } from './ToolHistoryTab';

import { ToolLoanForm } from '../loans/ToolLoanForm';
import { ToolCalibrationForm } from '../calibration/ToolCalibrationForm';
import { ToolDamageModal } from '../modals/ToolDamageModal';
import { ToolTransferModal } from '../modals/ToolTransferModal';
import { ToolDecommissionModal } from '../modals/ToolDecommissionModal';

export const ToolDetailView: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { tool, loans, calibrations, maintenances, history, loading, error, refetch } = useToolDetail(toolId);

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'emprestimos' | 'reservas' | 'manutencoes' | 'calibracoes' | 'custos' | 'auditoria'>('visao_geral');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center text-xs text-on-surface-variant">Carregando ficha da ferramenta...</div>;

  if (error || !tool) {
    return (
      <div className="p-8 glass-card rounded-2xl border border-rose-500/20 text-center space-y-2">
        <p className="text-sm font-bold text-rose-400">Ferramenta não encontrada</p>
        <p className="text-xs text-on-surface-variant">{error || 'O código informado não existe no sistema.'}</p>
      </div>
    );
  }

  const tabs: { id: 'visao_geral' | 'emprestimos' | 'reservas' | 'manutencoes' | 'calibracoes' | 'custos' | 'auditoria'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'emprestimos', label: 'Empréstimos', icon: ArrowRightLeft, count: loans.length },
    { id: 'reservas', label: 'Reservas', icon: Bookmark },
    { id: 'manutencoes', label: 'Manutenções', icon: Wrench, count: maintenances.length },
    { id: 'calibracoes', label: 'Calibrações', icon: CalendarCheck, count: calibrations.length },
    { id: 'custos', label: 'Custos', icon: DollarSign },
    { id: 'auditoria', label: 'Trilha de Auditoria', icon: History, count: history.length },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-xs">
      <ToolDetailHeader tool={tool} onOpenAction={m => setActiveModal(m)} />

      {/* Navegação por Abas Internas */}
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

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'visao_geral' && <ToolOverviewTab tool={tool} />}
      {activeTab === 'emprestimos' && <ToolLoansTab loans={loans} />}
      {activeTab === 'reservas' && <ToolReservationsTab toolId={tool.id} />}
      {activeTab === 'manutencoes' && <ToolMaintenanceTab maintenances={maintenances} />}
      {activeTab === 'calibracoes' && <ToolCalibrationTab calibrations={calibrations} />}
      {activeTab === 'custos' && <ToolCostsTab tool={tool} maintenances={maintenances} calibrations={calibrations} />}
      {activeTab === 'auditoria' && <ToolHistoryTab history={history} />}

      {/* Modais Operacionais */}
      {activeModal === 'emprestar' && (
        <ToolLoanForm initialTool={tool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'calibrar' && (
        <ToolCalibrationForm toolId={tool.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'dano' && (
        <ToolDamageModal tool={tool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'transferir' && (
        <ToolTransferModal tool={tool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'baixa' && (
        <ToolDecommissionModal tool={tool} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
