import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Gauge, Plus, ArrowLeft } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { useEquipmentReadings } from '../../../hooks/useEquipmentReadings';
import { ReadingsStats } from './ReadingsStats';
import { ReadingsFilters } from './ReadingsFilters';
import { ReadingsTable } from './ReadingsTable';
import { ReadingFormModal } from './ReadingFormModal';
import { ReadingDetailDrawer } from './ReadingDetailDrawer';
import { ReadingApprovalModal } from './ReadingApprovalModal';
import { ReadingCorrectionModal } from './ReadingCorrectionModal';
import { ReadingCancellationModal } from './ReadingCancellationModal';
import { LoadingState } from '../../ui/LoadingState';
import { ErrorState } from '../../ui/ErrorState';
import { Button } from '../../ui/Button';

export const EquipmentReadingsView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    readings,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    approveReading,
    rejectReading,
    correctReading,
    cancelReading,
    refetch,
  } = useEquipmentReadings(id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<MeterReading | null>(null);
  const [correctionTarget, setCorrectionTarget] = useState<MeterReading | null>(null);
  const [cancellationTarget, setCancellationTarget] = useState<MeterReading | null>(null);

  // Se a URL possuir ?novo=true, abrir o modal de registro automaticamente
  useEffect(() => {
    if (searchParams.get('novo') === 'true') {
      setIsFormOpen(true);
    }
  }, [searchParams]);

  if (loading && readings.length === 0) {
    return (
      <div className="flex-1 p-6">
        <LoadingState message="Carregando leituras de horímetro e odômetro da frota..." />
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
    <div className="space-y-6 pb-14">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-2xl border border-white/10">
          <div className="space-y-1">
            {id && (
              <button
                onClick={() => navigate(`/equipamentos/${id}`)}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer mb-1"
              >
                <ArrowLeft size={14} /> Voltar para Ficha do Equipamento
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Gauge size={22} />
              </div>
              <h1 className="font-title-md text-[22px] font-bold text-on-surface tracking-tight">
                Leituras de Equipamentos
              </h1>
            </div>
            <p className="text-[13px] text-on-surface-variant/80">
              Registre e acompanhe os horímetros e odômetros da frota com rastreabilidade auditável.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => setIsFormOpen(true)}
          >
            Registrar Leitura
          </Button>
        </div>

        {/* Indicadores do Módulo */}
        <ReadingsStats stats={stats} />

        {/* Filtros de Pesquisa */}
        <ReadingsFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Tabela Principal de Leituras */}
        <ReadingsTable
          readings={readings}
          onSelectReading={setSelectedReading}
          onApproveReading={setApprovalTarget}
          onRejectReading={setApprovalTarget}
          onCorrectReading={setCorrectionTarget}
          onCancelReading={setCancellationTarget}
          onOpenNewReading={() => setIsFormOpen(true)}
        />

      {/* Modal de Registro Rápido */}
      {isFormOpen && (
        <ReadingFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialEquipmentId={id}
          onSuccess={refetch}
        />
      )}

      {/* Drawer de Auditoria e Detalhes */}
      {selectedReading && (
        <ReadingDetailDrawer
          reading={selectedReading}
          onClose={() => setSelectedReading(null)}
          onApprove={setApprovalTarget}
          onReject={setApprovalTarget}
          onCorrect={setCorrectionTarget}
          onCancel={setCancellationTarget}
        />
      )}

      {/* Modal de Aprovação / Rejeição */}
      {approvalTarget && (
        <ReadingApprovalModal
          reading={approvalTarget}
          isOpen={!!approvalTarget}
          onClose={() => setApprovalTarget(null)}
          onConfirmApprove={async (readingId) => {
            await approveReading(readingId);
          }}
          onConfirmReject={async (readingId, reason) => {
            await rejectReading(readingId, reason);
          }}
        />
      )}

      {/* Modal de Correção Auditável */}
      {correctionTarget && (
        <ReadingCorrectionModal
          reading={correctionTarget}
          isOpen={!!correctionTarget}
          onClose={() => setCorrectionTarget(null)}
          onConfirmCorrection={async (readingId, val, justification) => {
            await correctReading(readingId, val, justification);
          }}
        />
      )}

      {/* Modal de Cancelamento Auditável */}
      {cancellationTarget && (
        <ReadingCancellationModal
          reading={cancellationTarget}
          isOpen={!!cancellationTarget}
          onClose={() => setCancellationTarget(null)}
          onConfirmCancel={async (readingId, reason) => {
            await cancelReading(readingId, reason);
          }}
        />
      )}
    </div>
  );
};
