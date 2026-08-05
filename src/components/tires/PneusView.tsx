import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Disc, Activity, ClipboardCheck, History, Gauge, Layers, RefreshCw } from 'lucide-react';
import { useTires } from '../../hooks/useTires';
import { TireStats } from './TireStats';
import { TireFilters } from './TireFilters';
import { TireTable } from './TireTable';
import { TireInspectionList } from './inspecoes/TireInspectionList';
import { TireMovementList } from './movements/TireMovementList';
import { TireRecommendationList } from './recommendations/TireRecommendationList';
import { TireInstallationModal } from './movements/TireInstallationModal';
import { TireRotationModal } from './movements/TireRotationModal';
import { TireRemovalModal } from './movements/TireRemovalModal';
import { TireDiscardModal } from './movements/TireDiscardModal';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';
import type { Tire } from '../../types/tires';

interface PneusViewProps {
  initialTab?: 'visao_geral' | 'instalados' | 'inspecoes' | 'movimentacoes' | 'recomendacoes' | 'historico';
}

export const PneusView: React.FC<PneusViewProps> = ({ initialTab = 'visao_geral' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { tires, stats, loading, filters, updateFilters, resetFilters, refetch } = useTires();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTire, setSelectedTire] = useState<Tire | undefined>(undefined);

  const tabs: { id: 'visao_geral' | 'instalados' | 'inspecoes' | 'movimentacoes' | 'recomendacoes' | 'historico'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'instalados', label: 'Pneus Instalados', icon: Layers, count: stats?.instalados },
    { id: 'inspecoes', label: 'Inspeções', icon: ClipboardCheck },
    { id: 'movimentacoes', label: 'Movimentações', icon: History },
    { id: 'recomendacoes', label: 'Recomendações de Pressão', icon: Gauge },
    { id: 'historico', label: 'Histórico Auditável', icon: History },
  ];

  const handleOpenAction = (actionType: string, tire?: Tire) => {
    setSelectedTire(tire);
    setActiveModal(actionType);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in">
      <PageHeader
        title="Gestão Profissional de Pneus"
        subtitle="Controle autônomo de carcaças, pressão, desgaste de sulcos, eixos e rodízios"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenAction('rodizio')}>
              <RefreshCw size={14} className="mr-1" /> Rodízio
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOpenAction('instalar')}>
              Instalar Pneu
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.PNEUS_NOVO)} className="flex items-center gap-1.5">
              <Plus size={16} /> Cadastrar Pneu
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

      {/* Conteúdo Dinâmico da Aba */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          <TireStats stats={stats} />

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <TireFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

            {loading ? (
              <div className="p-12 text-center text-xs text-on-surface-variant">Carregando pneus...</div>
            ) : tires.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <Disc className="w-8 h-8 text-on-surface-variant/50" />
                </div>
                <p className="text-on-surface font-bold text-sm">Nenhum pneu cadastrado</p>
                <p className="text-on-surface-variant text-xs mt-1">Cadastre o primeiro pneu para iniciar o controle da frota.</p>
              </div>
            ) : (
              <TireTable tires={tires} onOpenAction={handleOpenAction} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'instalados' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <TireTable tires={tires.filter(t => t.status === 'instalado')} onOpenAction={handleOpenAction} />
        </div>
      )}

      {activeTab === 'inspecoes' && <TireInspectionList />}

      {(activeTab === 'movimentacoes' || activeTab === 'historico') && <TireMovementList />}

      {activeTab === 'recomendacoes' && <TireRecommendationList />}

      {/* Modais de Movimentação Operacional */}
      {activeModal === 'instalar' && (
        <TireInstallationModal tire={selectedTire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'remover' && selectedTire && (
        <TireRemovalModal tire={selectedTire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'rodizio' && (
        <TireRotationModal onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'descartar' && selectedTire && (
        <TireDiscardModal tire={selectedTire} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
