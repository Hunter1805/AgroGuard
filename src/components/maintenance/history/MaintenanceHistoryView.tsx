import React from 'react';
import { useMaintenanceHistory } from '../../../hooks/useMaintenanceHistory';
import { MaintenanceHistoryFilters } from './MaintenanceHistoryFilters';
import { MaintenanceHistoryTable } from './MaintenanceHistoryTable';
import { MaintenanceHistoryDrawer } from './MaintenanceHistoryDrawer';
import { PageHeader } from '../../ui/PageHeader';

interface MaintenanceHistoryViewProps {
  equipmentIdFilter?: string;
}

export const MaintenanceHistoryView: React.FC<MaintenanceHistoryViewProps> = ({ equipmentIdFilter }) => {
  const {
    history,
    filters,
    loading,
    error,
    selectedEntry,
    isDrawerOpen,
    updateFilters,
    resetFilters,
    openDrawer,
    closeDrawer,
  } = useMaintenanceHistory(equipmentIdFilter);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-fadeIn">
      {!equipmentIdFilter && (
        <PageHeader
          title="Histórico Auditável de Manutenções"
          subtitle="Linha do tempo e registros definitivos de ordens de serviço e preventivas encerradas"
        />
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {!equipmentIdFilter && (
        <MaintenanceHistoryFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onResetFilters={resetFilters}
        />
      )}

      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-gray-500">
          Exibindo <strong className="text-gray-800 dark:text-white">{history.length}</strong> registros definitivos de auditoria e execução na fazenda
        </p>
      </div>

      <MaintenanceHistoryTable
        entries={history}
        loading={loading}
        onSelectEntry={(entry) => openDrawer(entry)}
      />

      <MaintenanceHistoryDrawer
        entry={selectedEntry}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};
