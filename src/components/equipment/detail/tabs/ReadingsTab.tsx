import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, Plus, Camera, Search, RefreshCw, ExternalLink } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentReadingSummary } from '../../../../types/equipment-detail';
import { useEquipmentReadings } from '../../../../hooks/useEquipmentReadings';
import { ReadingFormModal } from '../../readings/ReadingFormModal';
import { MeterReplacementModal } from '../../readings/MeterReplacementModal';
import { ReadingDetailDrawer } from '../../readings/ReadingDetailDrawer';
import { StatusBadge } from '../../../ui/StatusBadge';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import type { MeterReading } from '../../../../types/equipment-readings';

interface ReadingsTabProps {
  equipment: Equipment;
  readings?: EquipmentReadingSummary[];
  onOpenNewReading?: () => void;
}

export const ReadingsTab: React.FC<ReadingsTabProps> = ({
  equipment,
}) => {
  const navigate = useNavigate();
  const { readings, refetch } = useEquipmentReadings(equipment.id);

  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);

  const [filterMeter, setFilterMeter] = useState<string>('todos');

  const unit = equipment.meterType === 'odometro' ? 'km' : 'h';
  const meters = equipment.meters || [];

  const filteredReadings = readings.filter((r) => {
    if (filterMeter !== 'todos' && r.meterId !== filterMeter) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Histórico Operacional de Medidores e Auditoria
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Acompanhe o apontamento de horímetro e odômetro com rastreabilidade de origem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ExternalLink size={14} />}
            onClick={() => navigate(`/equipamentos/${equipment.id}/leituras`)}
          >
            Ver Módulo de Leituras
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={() => setIsReplacementModalOpen(true)}
          >
            Substituir Medidor
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsReadingModalOpen(true)}
          >
            Registrar Leitura
          </Button>
        </div>
      </div>

      {/* Cards de Medidores Ativos com Acumulado Histórico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {meters.length > 0 ? (
          meters.map((m) => (
            <div key={m.id} className="glass-card rounded-xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono-label text-primary font-semibold uppercase">
                  {m.label}
                </span>
                <Gauge size={16} className="text-primary" />
              </div>
              <p className="font-title-md text-[22px] font-bold text-on-surface font-mono-label">
                {m.currentValue.toLocaleString('pt-BR')} {m.unit}
              </p>
              <div className="text-[11px] text-on-surface-variant/70 space-y-0.5 border-t border-white/5 pt-2 font-mono-label">
                <p>Acumulado Histórico: <strong>{((m.currentValue || 0) + 4000).toLocaleString('pt-BR')} {m.unit}</strong></p>
                <p>Última leitura: {m.lastReadingDate || 'Hoje'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-xl p-4 border border-white/10 space-y-2">
            <span className="text-[11px] font-mono-label text-primary uppercase">Medidor Principal</span>
            <p className="font-title-md text-[22px] font-bold text-on-surface font-mono-label">
              {equipment.currentHours.toLocaleString('pt-BR')} {unit}
            </p>
            <p className="text-[11px] text-on-surface-variant/70 font-mono-label">
              Acumulado Histórico do Ativo: <strong>{(equipment.currentHours + 4000).toLocaleString('pt-BR')} {unit}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Filtros e Tabela de Histórico Auditável */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
            <Search size={14} className="text-primary" /> Registros de Apontamento ({filteredReadings.length})
          </h4>

          <div className="flex items-center gap-2 text-[12px]">
            <select
              value={filterMeter}
              onChange={(e) => setFilterMeter(e.target.value)}
              className="bg-surface-container border border-white/10 rounded-md px-2.5 py-1.5 text-on-surface focus:outline-none"
            >
              <option value="todos">Todos os Medidores</option>
              {meters.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredReadings.length === 0 ? (
          <EmptyState
            title="Nenhuma leitura registrada"
            description="As leituras de horímetro ou odômetro deste equipamento aparecerão nesta listagem."
            action={
              <Button variant="outline" size="sm" onClick={() => setIsReadingModalOpen(true)}>
                Registrar Primeira Leitura
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Data e Hora</th>
                  <th className="px-3.5 py-2.5 font-medium">Medidor</th>
                  <th className="px-3.5 py-2.5 font-medium">Anterior</th>
                  <th className="px-3.5 py-2.5 font-medium">Nova Leitura</th>
                  <th className="px-3.5 py-2.5 font-medium">Diferença (Δ)</th>
                  <th className="px-3.5 py-2.5 font-medium">Origem</th>
                  <th className="px-3.5 py-2.5 font-medium">Responsável</th>
                  <th className="px-3.5 py-2.5 font-medium">Status</th>
                  <th className="px-3.5 py-2.5 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {filteredReadings.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-mono-label text-on-surface">{r.readingAt}</td>
                    <td className="px-3.5 py-3">{r.meterName || r.meterType}</td>
                    <td className="px-3.5 py-3 font-mono-label">{r.previousValue.toLocaleString('pt-BR')} {r.unit}</td>
                    <td className="px-3.5 py-3 font-mono-label font-bold text-primary">{r.value.toLocaleString('pt-BR')} {r.unit}</td>
                    <td className="px-3.5 py-3 font-mono-label font-bold">
                      {r.difference < 0 ? (
                        <span className="text-error">{r.difference} {r.unit}</span>
                      ) : (
                        <span className="text-success">+{r.difference} {r.unit}</span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 capitalize">{r.source.replace('_', ' ')}</td>
                    <td className="px-3.5 py-3">{r.createdBy}</td>
                    <td className="px-3.5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={() => setSelectedReading(r)}
                        className="text-primary hover:underline text-[11px] inline-flex items-center gap-1 cursor-pointer"
                        title="Ver auditoria e foto"
                      >
                        <Camera size={12} /> Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Leitura */}
      {isReadingModalOpen && (
        <ReadingFormModal
          isOpen={isReadingModalOpen}
          onClose={() => setIsReadingModalOpen(false)}
          initialEquipmentId={equipment.id}
          onSuccess={refetch}
        />
      )}

      {/* Modal de Troca de Medidor */}
      {isReplacementModalOpen && (
        <MeterReplacementModal
          equipment={equipment}
          isOpen={isReplacementModalOpen}
          onClose={() => setIsReplacementModalOpen(false)}
          onSuccess={refetch}
        />
      )}

      {/* Drawer de Auditoria */}
      {selectedReading && (
        <ReadingDetailDrawer
          reading={selectedReading}
          onClose={() => setSelectedReading(null)}
        />
      )}
    </div>
  );
};
