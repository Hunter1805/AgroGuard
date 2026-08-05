import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Activity, ArrowLeftRight, Bookmark, ClipboardList, CalendarX, History } from 'lucide-react';
import { useStockItems } from '../../hooks/useStockItems';
import { StockStats } from './StockStats';
import { StockFilters } from './StockFilters';
import { StockItemTable } from './StockItemTable';

import { StockMovementList } from './movements/StockMovementList';
import { StockEntryForm } from './movements/StockEntryForm';
import { StockOutputForm } from './movements/StockOutputForm';
import { StockReservationList } from './reservations/StockReservationList';
import { StockReservationForm } from './reservations/StockReservationForm';
import { StockInventoryList } from './inventories/StockInventoryList';
import { StockLotList } from './lots/StockLotList';

import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';
import type { StockItem } from '../../types/parts';

interface PecasInsumosViewProps {
  initialTab?: 'visao_geral' | 'itens' | 'movimentacoes' | 'reservas' | 'inventarios' | 'lotes' | 'historico';
}

export const PecasInsumosView: React.FC<PecasInsumosViewProps> = ({ initialTab = 'visao_geral' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { items, stats, loading, filters, updateFilters, resetFilters, refetch } = useStockItems();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<StockItem | undefined>(undefined);

  const tabs: { id: 'visao_geral' | 'itens' | 'movimentacoes' | 'reservas' | 'inventarios' | 'lotes' | 'historico'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'itens', label: 'Itens em Estoque', icon: Package, count: stats?.totalItems },
    { id: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight, count: stats?.movementsCountPeriod },
    { id: 'reservas', label: 'Reservas', icon: Bookmark, count: stats?.reservedItems },
    { id: 'inventarios', label: 'Inventários e Ajustes', icon: ClipboardList, count: stats?.inventoryDivergencesCount },
    { id: 'lotes', label: 'Lotes e Validades', icon: CalendarX, count: stats?.lotsExpiringSoon },
    { id: 'historico', label: 'Histórico Auditável', icon: History },
  ];

  const handleOpenAction = (actionType: string, item?: StockItem) => {
    setSelectedItem(item);
    setActiveModal(actionType);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-xs">
      <PageHeader
        title="Gestão Profissional de Peças e Insumos"
        subtitle="Controle de estoque, compras, saídas para OS, reservas, lotes com validade e inventários físicos"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenAction('entrada')} className="flex items-center gap-1.5 font-bold">
              <Plus size={14} /> Entrada de Compras
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.PECAS_INSUMOS_NOVO)} className="flex items-center gap-1.5">
              <Plus size={16} /> Cadastrar Novo Item
            </Button>
          </div>
        }
      />

      {/* Abas de Navegação */}
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
          <StockStats stats={stats} />

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <StockFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

            {loading ? (
              <div className="p-12 text-center text-xs text-on-surface-variant">Carregando inventário de estoque...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-on-surface-variant/50" />
                </div>
                <p className="text-on-surface font-bold text-sm">Nenhum item cadastrado</p>
                <p className="text-on-surface-variant text-xs mt-1">Cadastre peças, filtros, óleos e materiais para iniciar o controle do estoque.</p>
              </div>
            ) : (
              <StockItemTable items={items} onOpenAction={handleOpenAction} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'movimentacoes' && <StockMovementList />}

      {activeTab === 'reservas' && <StockReservationList />}

      {activeTab === 'inventarios' && <StockInventoryList />}

      {activeTab === 'lotes' && <StockLotList />}

      {activeTab === 'historico' && <StockMovementList />}

      {/* Modais Globais */}
      {activeModal === 'entrada' && (
        <StockEntryForm initialItemId={selectedItem?.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'saida' && (
        <StockOutputForm initialItemId={selectedItem?.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'reservar' && (
        <StockReservationForm initialItemId={selectedItem?.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
