import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle2 } from 'lucide-react';
import { useEquipments } from '../hooks/useEquipments';
import { PageHeader } from './ui/PageHeader';
import { EquipmentStats } from './equipment/EquipmentStats';
import { EquipmentFilters } from './equipment/EquipmentFilters';
import { EquipmentTable } from './equipment/EquipmentTable';
import { EquipmentCard } from './equipment/EquipmentCard';
import { ArchiveConfirmModal } from './equipment/ArchiveConfirmModal';
import { ReadingFormModal } from './equipment/readings/ReadingFormModal';
import { LoadingState } from './ui/LoadingState';
import { ErrorState } from './ui/ErrorState';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';
import type { Equipment } from '../types/equipment';

export const EquipamentosView: React.FC = () => {
  const navigate = useNavigate();
  const {
    equipments,
    stats,
    locations,
    filterAssetType,
    setFilterAssetType,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    filterMaintenanceStatus,
    setFilterMaintenanceStatus,
    filterAlertOnly,
    setFilterAlertOnly,
    filterReadingOverdueOnly,
    setFilterReadingOverdueOnly,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    loading,
    error,
    refetch,
    archiveEquipment,
    clearAllFilters,
  } = useEquipments();

  // Estados dos modais
  const [archivingEquipment, setArchivingEquipment] = useState<Equipment | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const [readingModalEquipment, setReadingModalEquipment] = useState<Equipment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleQuickReading = (equipment: Equipment) => {
    setReadingModalEquipment(equipment);
  };

  const handleNewEquipment = () => {
    navigate('/equipamentos/novo');
  };

  const handleEditEquipment = (equipment: Equipment) => {
    navigate(`/equipamentos/${equipment.id}/editar`);
  };

  const handleConfirmArchive = async (reason: string) => {
    if (!archivingEquipment) return;
    setIsArchiving(true);
    try {
      await archiveEquipment(archivingEquipment.id, reason);
      setArchivingEquipment(null);
      setToastMessage(`Equipamento ${archivingEquipment.name} arquivado.`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsArchiving(false);
    }
  };

  if (loading && equipments.length === 0) {
    return (
      <div className="flex-1 p-6">
        <LoadingState message="Carregando frota de equipamentos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-surface-container-highest border border-primary/40 text-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} />
          <span className="text-[12px] font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 pb-14">
        {/* Cabeçalho */}
        <PageHeader
          title="Gestão de Frota e Equipamentos"
          subtitle="Cadastre, monitore a telemetria/leitura e acompanhe o estado operacional dos ativos."
          actions={
            <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={handleNewEquipment}>
              Cadastrar Equipamento
            </Button>
          }
        />

        {/* Cards de Métricas */}
        <EquipmentStats stats={stats} />

        {/* Filtros */}
        <EquipmentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          assetType={filterAssetType}
          onAssetTypeChange={setFilterAssetType}
          status={filterStatus}
          onStatusChange={setFilterStatus}
          location={filterLocation}
          onLocationChange={setFilterLocation}
          locationsList={locations}
          maintenanceStatus={filterMaintenanceStatus}
          onMaintenanceStatusChange={setFilterMaintenanceStatus}
          hasPendingAlert={filterAlertOnly}
          onHasPendingAlertChange={setFilterAlertOnly}
          isReadingOverdue={filterReadingOverdueOnly}
          onIsReadingOverdueChange={setFilterReadingOverdueOnly}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewEquipment={handleNewEquipment}
          onClearFilters={clearAllFilters}
        />

        {/* Listagem em Tabela ou Cards */}
        {equipments.length === 0 ? (
          <EmptyState
            title="Nenhum equipamento encontrado"
            description="Tente ajustar os filtros de busca ou cadastre um novo ativo na frota."
            action={
              <Button variant="outline" size="sm" onClick={handleNewEquipment}>
                Cadastrar Equipamento
              </Button>
            }
          />
        ) : viewMode === 'table' ? (
          <EquipmentTable
            equipments={equipments}
            onEditEquipment={handleEditEquipment}
            onArchiveEquipment={(eq) => setArchivingEquipment(eq)}
            onOpenQuickReading={handleQuickReading}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipments.map((eq) => (
              <EquipmentCard
                key={eq.id}
                item={eq}
                onEditEquipment={handleEditEquipment}
                onArchiveEquipment={(selected) => setArchivingEquipment(selected)}
                onOpenQuickReading={handleQuickReading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de arquivamento */}
      {archivingEquipment && (
        <ArchiveConfirmModal
          isOpen={!!archivingEquipment}
          equipmentName={`${archivingEquipment.name} (${archivingEquipment.plateOrCode})`}
          onConfirm={handleConfirmArchive}
          onCancel={() => setArchivingEquipment(null)}
          isSubmitting={isArchiving}
        />
      )}

      {/* Modal de Registro Rápido de Leitura */}
      {readingModalEquipment && (
        <ReadingFormModal
          isOpen={!!readingModalEquipment}
          onClose={() => setReadingModalEquipment(null)}
          initialEquipmentId={readingModalEquipment.id}
          onSuccess={() => {
            refetch();
            setToastMessage(`Leitura de ${readingModalEquipment.plateOrCode} registrada!`);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}
    </div>
  );
};
