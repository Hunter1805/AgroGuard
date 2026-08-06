import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isCorpUI } from '../../../lib/ui-version';
import { useEquipmentDetail } from '../../../hooks/useEquipmentDetail';
import { LoadingState } from '../../ui/LoadingState';
import { ErrorState } from '../../ui/ErrorState';
import { EquipmentDetailHeader } from './EquipmentDetailHeader';
import { EquipmentDetailHeaderCorp } from './EquipmentDetailHeaderCorp';
import { EquipmentStatusNotice } from './EquipmentStatusNotice';
import { EquipmentSummaryCards } from './EquipmentSummaryCards';
import { EquipmentDetailActions } from './EquipmentDetailActions';
import { EquipmentDetailTabs } from './EquipmentDetailTabs';
import { EquipmentDetailTabsCorp, type MainGroupTab } from './EquipmentDetailTabsCorp';

// As 12 Abas
import { OverviewTab } from './tabs/OverviewTab';
import { OverviewTabCorp } from './v2/OverviewTabCorp';
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

  const [activeMainGroup, setActiveMainGroup] = useState<MainGroupTab>('visao-geral');
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
    <div className="space-y-6 pb-14">
        {isCorpUI ? (
          <>
            {/* 1. Cabeçalho Corporativo v1.1.0 */}
            <EquipmentDetailHeaderCorp
              equipment={equipment}
              onArchiveEquipment={() => setIsArchiveOpen(true)}
            />

            {/* 2. 5 Grupos de Navegação Corporativos */}
            <EquipmentDetailTabsCorp
              activeMainTab={activeMainGroup}
              onMainTabChange={setActiveMainGroup}
              activeSubTab={activeTab}
              onSubTabChange={changeTab}
              summary={summary}
            />

            {/* 3. Conteúdo da Aba Ativa */}
            <div className="pt-2">
              {activeTab === 'visao-geral' && (
                <OverviewTabCorp
                  equipment={equipment}
                  summary={summary}
                  loading={loading}
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
          </>
        ) : (
          <>
            {/* Layout Legacy */}
            <EquipmentDetailHeader equipment={equipment} />
            <EquipmentStatusNotice equipment={equipment} />
            <EquipmentSummaryCards equipment={equipment} summary={summary} />
            <EquipmentDetailActions
              equipment={equipment}
              onArchiveEquipment={() => setIsArchiveOpen(true)}
            />
            <EquipmentDetailTabs
              activeTab={activeTab}
              onTabChange={changeTab}
              summary={summary}
            />
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
          </>
        )}

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

