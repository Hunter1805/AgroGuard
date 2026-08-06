import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, FileText, History, DollarSign, ClipboardCheck } from 'lucide-react';
import { useTireDetail } from '../../../hooks/useTireDetail';
import { TireDetailHeader } from './TireDetailHeader';
import { TireOverviewTab } from './TireOverviewTab';
import { TireInspectionHistoryTab } from './TireInspectionHistoryTab';
import { TireMovementHistoryTab } from './TireMovementHistoryTab';
import { TireCostsTab } from './TireCostsTab';
import { TireTimelineTab } from './TireTimelineTab';
import { TireInstallationModal } from '../movements/TireInstallationModal';
import { TireRemovalModal } from '../movements/TireRemovalModal';
import { TireDiscardModal } from '../movements/TireDiscardModal';

export const TireDetailView: React.FC = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const { tire, movements, inspections, calibrations, loading, error, refetch } = useTireDetail(tireId);

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'inspecoes' | 'movimentacoes' | 'custos' | 'auditoria'>('visao_geral');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (loading) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Carregando detalhes do pneu...</div>;
  }

  if (error || !tire) {
    return (
      <div className="p-8 glass-card rounded-2xl border border-rose-500/20 text-center space-y-2">
        <p className="text-sm font-bold text-rose-400">Pneu não encontrado</p>
        <p className="text-xs text-on-surface-variant">{error || 'O código informado não existe no sistema.'}</p>
      </div>
    );
  }

  const tabs: { id: 'visao_geral' | 'inspecoes' | 'movimentacoes' | 'custos' | 'auditoria'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'inspecoes', label: 'Inspeções & Calibragens', icon: ClipboardCheck, count: inspections.length },
    { id: 'movimentacoes', label: 'Histórico Operacional', icon: History, count: movements.length },
    { id: 'custos', label: 'Custos Acumulados', icon: DollarSign },
    { id: 'auditoria', label: 'Trilha de Auditoria', icon: FileText },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in">
      <TireDetailHeader tire={tire} onOpenAction={modalType => setActiveModal(modalType)} />

      {/* Navegação por Abas Internas */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl px-4 pt-2 flex items-center gap-2 overflow-x-auto shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-2.5 pt-1.5 px-3 border-b-2 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-brand)] text-[var(--color-brand)] font-bold'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'}`} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected
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

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'visao_geral' && <TireOverviewTab tire={tire} />}
      {activeTab === 'inspecoes' && <TireInspectionHistoryTab inspections={inspections} calibrations={calibrations} />}
      {activeTab === 'movimentacoes' && <TireMovementHistoryTab movements={movements} />}
      {activeTab === 'custos' && <TireCostsTab tire={tire} movements={movements} />}
      {activeTab === 'auditoria' && <TireTimelineTab movements={movements} />}

      {/* Modais Operacionais */}
      {activeModal === 'instalar' && (
        <TireInstallationModal tire={tire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'remover' && (
        <TireRemovalModal tire={tire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'descarte' && (
        <TireDiscardModal tire={tire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
