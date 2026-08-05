import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, ArrowLeftRight, Bookmark, CalendarX, Wrench, DollarSign, FileText, History } from 'lucide-react';
import { useStockItemDetail } from '../../../hooks/useStockItemDetail';
import { StockItemDetailHeader } from './StockItemDetailHeader';
import { StockOverviewTab } from './StockOverviewTab';
import { StockMovementsTab } from './StockMovementsTab';
import { StockReservationsTab } from './StockReservationsTab';
import { StockLotsTab } from './StockLotsTab';
import { StockCompatibilityTab } from './StockCompatibilityTab';
import { StockCostsTab } from './StockCostsTab';
import { StockDocumentsTab } from './StockDocumentsTab';
import { StockHistoryTab } from './StockHistoryTab';

import { StockEntryForm } from '../movements/StockEntryForm';
import { StockOutputForm } from '../movements/StockOutputForm';
import { StockReservationForm } from '../reservations/StockReservationForm';

export const StockItemDetailView: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { item, movements, reservations, lots, history, loading, error, refetch } = useStockItemDetail(itemId);

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'movimentacoes' | 'reservas' | 'lotes' | 'compatibilidade' | 'custos' | 'documentos' | 'auditoria'>('visao_geral');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center text-xs text-on-surface-variant">Carregando ficha do item de estoque...</div>;

  if (error || !item) {
    return (
      <div className="p-8 glass-card rounded-2xl border border-rose-500/20 text-center space-y-2">
        <p className="text-sm font-bold text-rose-400">Item não encontrado</p>
        <p className="text-xs text-on-surface-variant">{error || 'O código informado não existe no sistema.'}</p>
      </div>
    );
  }

  const tabs: { id: 'visao_geral' | 'movimentacoes' | 'reservas' | 'lotes' | 'compatibilidade' | 'custos' | 'documentos' | 'auditoria'; label: string; icon: any; count?: number }[] = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Activity },
    { id: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight, count: movements.length },
    { id: 'reservas', label: 'Reservas', icon: Bookmark, count: reservations.length },
    { id: 'lotes', label: 'Lotes', icon: CalendarX, count: lots.length },
    { id: 'compatibilidade', label: 'Compatibilidade', icon: Wrench },
    { id: 'custos', label: 'Custos', icon: DollarSign },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'auditoria', label: 'Trilha de Auditoria', icon: History, count: history.length },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-xs">
      <StockItemDetailHeader item={item} onOpenAction={m => setActiveModal(m)} />

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

      {activeTab === 'visao_geral' && <StockOverviewTab item={item} />}
      {activeTab === 'movimentacoes' && <StockMovementsTab movements={movements} />}
      {activeTab === 'reservas' && <StockReservationsTab reservations={reservations} />}
      {activeTab === 'lotes' && <StockLotsTab lots={lots} />}
      {activeTab === 'compatibilidade' && <StockCompatibilityTab item={item} />}
      {activeTab === 'custos' && <StockCostsTab item={item} />}
      {activeTab === 'documentos' && <StockDocumentsTab />}
      {activeTab === 'auditoria' && <StockHistoryTab history={history} />}

      {activeModal === 'entrada' && (
        <StockEntryForm initialItemId={item.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'saida' && (
        <StockOutputForm initialItemId={item.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
      {activeModal === 'reservar' && (
        <StockReservationForm initialItemId={item.id} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
