import React, { useState } from 'react';
import { CheckSquare, ListChecks, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { useChecklists } from '../../hooks/useChecklists';
import { useChecklistExecution } from '../../hooks/useChecklistExecution';
import { useChecklistTemplateForm } from '../../hooks/useChecklistTemplateForm';
import { ChecklistStats } from './ChecklistStats';
import { ChecklistExecutionFilters } from './executions/ChecklistExecutionFilters';
import { ChecklistExecutionList } from './executions/ChecklistExecutionList';
import { StartChecklistModal } from './executions/StartChecklistModal';
import { ChecklistTemplateList } from './templates/ChecklistTemplateList';
import { ChecklistScheduleList } from './schedules/ChecklistScheduleList';
import { NonConformityList } from './nonconformities/NonConformityList';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';

export const ChecklistsView: React.FC = () => {
  const { activeTab, setActiveTab, stats, loading: statsLoading } = useChecklists('execucoes');
  const { executions, loading: execLoading, filters, setFilters } = useChecklistExecution();
  const { templates, duplicateTemplate, createNewVersion, archiveTemplate } = useChecklistTemplateForm();
  
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const tabs = [
    { id: 'execucoes' as const, label: 'Execuções de Inspeção', icon: <CheckSquare size={16} />, count: executions.length },
    { id: 'modelos' as const, label: 'Modelos de Checklists', icon: <ListChecks size={16} />, count: templates.length },
    { id: 'programacoes' as const, label: 'Programações & Agendas', icon: <Calendar size={16} /> },
    { id: 'nao_conformidades' as const, label: 'Não Conformidades (Pendências)', icon: <AlertTriangle size={16} />, count: stats?.execucoesComNaoConformidades },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <PageHeader
        title="Módulo Profissional de Checklists"
        subtitle="Gerencie inspeções pré-operacionais, programações periódicas, modelos configuráveis e tratamento auditable de não conformidades."
      />

      <div className="flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm flex-wrap gap-3">
        <div className="space-y-0.5">
          <h3 className="font-title-md text-[15px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <CheckSquare size={18} className="text-[var(--color-brand)]" /> Central de Inspeção Operacional
          </h3>
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            Acompanhe em tempo real a conformidade dos ativos da frota e previna avarias precoces.
          </p>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setIsStartModalOpen(true)}
          className="font-bold"
        >
          Iniciar Novo Checklist
        </Button>
      </div>

      {statsLoading ? (
        <div className="h-28 rounded-xl bg-[var(--color-surface)] animate-pulse border border-[var(--color-border)]" />
      ) : (
        stats && <ChecklistStats stats={stats} />
      )}

      {/* Abas de Navegação */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl px-4 pt-2 flex items-center gap-2 overflow-x-auto shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-2.5 pt-1.5 px-3 border-b-2 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)] font-bold'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-[var(--color-brand-light)] text-[var(--color-brand)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conteúdo de Cada Aba */}
      <div className="pt-2 animate-fade-in">
        {activeTab === 'execucoes' && (
          <div className="space-y-4">
            <ChecklistExecutionFilters
              filters={filters}
              onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
              onClear={() => setFilters({ search: '', equipmentId: '', templateId: 'todos', type: 'todos', status: 'todos', operator: '', onlyWithNonConformity: false, onlyWithCriticalItem: false, onlyBlockedEquipment: false, onlyOverdue: false })}
            />
            {execLoading ? (
              <div className="py-12 text-center text-on-surface-variant font-mono-label animate-pulse">Carregando inspeções...</div>
            ) : (
              <ChecklistExecutionList executions={executions} onOpenNew={() => setIsStartModalOpen(true)} />
            )}
          </div>
        )}

        {activeTab === 'modelos' && (
          <ChecklistTemplateList
            templates={templates}
            onDuplicate={duplicateTemplate}
            onNewVersion={createNewVersion}
            onArchive={archiveTemplate}
          />
        )}

        {activeTab === 'programacoes' && <ChecklistScheduleList />}

        {activeTab === 'nao_conformidades' && <NonConformityList />}
      </div>

      <StartChecklistModal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} />
    </div>
  );
};
