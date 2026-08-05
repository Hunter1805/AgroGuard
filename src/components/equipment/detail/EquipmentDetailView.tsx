import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipmentDetail } from '../../../hooks/useEquipmentDetail';
import { LoadingState } from '../../ui/LoadingState';
import { ErrorState } from '../../ui/ErrorState';
import { EquipmentDetailHeader } from './EquipmentDetailHeader';
import { EquipmentStatusNotice } from './EquipmentStatusNotice';
import { EquipmentSummaryCards } from './EquipmentSummaryCards';
import { EquipmentDetailActions } from './EquipmentDetailActions';
import { EquipmentDetailTabs } from './EquipmentDetailTabs';

// As 12 Abas
import { OverviewTab } from './tabs/OverviewTab';
import { ReadingsTab } from './tabs/ReadingsTab';
import { ChecklistsTab } from './tabs/ChecklistsTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';
import { OrdersTab } from './tabs/OrdersTab';
import { FailuresTab } from './tabs/FailuresTab';
import { TiresTab } from './tabs/TiresTab';
import { PartsTab } from './tabs/PartsTab';
import { CostsTab } from './tabs/CostsTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { PhotosTab } from './tabs/PhotosTab';
import { HistoryTab } from './tabs/HistoryTab';

import { ArchiveConfirmModal } from '../ArchiveConfirmModal';
import { equipmentService } from '../../../services/equipment.service';

export const EquipmentDetailView: React.FC = () => {
  const navigate = useNavigate();
  const {
    equipment,
    summary,
    detailData,
    activeTab,
    loading,
    error,
    changeTab,
    refetch,
  } = useEquipmentDetail();

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirmArchive = async (reason: string) => {
    if (!equipment) return;
    setIsArchiving(true);
    try {
      await equipmentService.archiveEquipment(equipment.id, reason);
      navigate('/equipamentos');
    } finally {
      setIsArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <LoadingState message="Carregando ficha operacional do equipamento..." />
      </div>
    );
  }

  if (error || !equipment || !detailData) {
    return (
      <div className="flex-1 p-6">
        <ErrorState
          title="Equipamento não encontrado"
          message="O equipamento solicitado não existe ou não está mais disponível na frota ativa."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6 pb-14">
        {/* 1. Cabeçalho Completo */}
        <EquipmentDetailHeader equipment={equipment} />

        {/* 2. Aviso de Status Crítico (quando aplicável) */}
        <EquipmentStatusNotice equipment={equipment} />

        {/* 3. Cards Compactos de Métricas */}
        <EquipmentSummaryCards equipment={equipment} summary={summary} />

        {/* 4. Ações Principais e Secundárias */}
        <EquipmentDetailActions
          equipment={equipment}
          onArchiveEquipment={() => setIsArchiveOpen(true)}
        />

        {/* 5. Barra com as 12 Abas Operacionais */}
        <EquipmentDetailTabs
          activeTab={activeTab}
          onTabChange={changeTab}
          summary={summary}
        />

        {/* 6. Conteúdo da Aba Ativa */}
        <div className="pt-2">
          {activeTab === 'visao-geral' && (
            <OverviewTab
              equipment={equipment}
              history={detailData.history}
              onViewFullHistory={() => changeTab('historico')}
            />
          )}

          {activeTab === 'leituras' && (
            <ReadingsTab
              equipment={equipment}
              readings={detailData.readings}
            />
          )}

          {activeTab === 'checklists' && (
            <ChecklistsTab
              equipment={equipment}
              checklists={detailData.checklists}
            />
          )}

          {activeTab === 'manutencoes' && (
            <MaintenanceTab
              equipment={equipment}
              maintenances={detailData.maintenances}
            />
          )}

          {activeTab === 'ordens-servico' && (
            <OrdersTab
              equipment={equipment}
              orders={detailData.orders}
            />
          )}

          {activeTab === 'falhas' && (
            <FailuresTab
              equipment={equipment}
              failures={detailData.failures}
              recurrentFailures={detailData.recurrentFailures}
            />
          )}

          {activeTab === 'pneus' && (
            <TiresTab
              equipment={equipment}
              tires={detailData.tires}
            />
          )}

          {activeTab === 'pecas-insumos' && (
            <PartsTab
              equipment={equipment}
              parts={detailData.parts}
            />
          )}

          {activeTab === 'custos' && (
            <CostsTab
              equipment={equipment}
              costs={detailData.costs}
            />
          )}

          {activeTab === 'documentos' && (
            <DocumentsTab
              equipment={equipment}
              documents={detailData.documents}
            />
          )}

          {activeTab === 'fotos' && (
            <PhotosTab
              equipment={equipment}
              photos={detailData.photos}
            />
          )}

          {activeTab === 'historico' && (
            <HistoryTab
              equipment={equipment}
              history={detailData.history}
            />
          )}
        </div>
      </div>

      {/* Modal de confirmação de arquivamento */}
      {isArchiveOpen && (
        <ArchiveConfirmModal
          isOpen={isArchiveOpen}
          equipmentName={`${equipment.name} (${equipment.plateOrCode})`}
          onConfirm={handleConfirmArchive}
          onCancel={() => setIsArchiveOpen(false)}
          isSubmitting={isArchiving}
        />
      )}
    </div>
  );
};
