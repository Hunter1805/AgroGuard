import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc, Plus, ExternalLink, RefreshCw, Sliders } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import { useEquipmentTires } from '../../../../hooks/useEquipmentTires';
import { TirePositionMap } from '../../../tires/configuration/TirePositionMap';
import { EquipmentAxleConfiguration } from '../../../tires/configuration/EquipmentAxleConfiguration';
import { TireInstallationModal } from '../../../tires/movements/TireInstallationModal';
import { TireRemovalModal } from '../../../tires/movements/TireRemovalModal';
import { TireCalibrationModal } from '../../../tires/inspecoes/TireCalibrationModal';
import { TireRotationModal } from '../../../tires/movements/TireRotationModal';
import { Button } from '../../../ui/Button';
import { ROUTES } from '../../../../types/routes';

interface TiresTabProps {
  equipment: Equipment;
  tires?: any;
  onRegisterInspection?: () => void;
}

export const TiresTab: React.FC<TiresTabProps> = ({ equipment, onRegisterInspection }) => {
  const navigate = useNavigate();
  const { config, installedTires, loading, refetch } = useEquipmentTires(equipment.id);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | undefined>(undefined);
  const [selectedTire, setSelectedTire] = useState<any>(undefined);

  const handleOpenInstall = (posId: string) => {
    setSelectedPositionId(posId);
    setActiveModal('instalar');
  };

  const handleOpenRemove = (posId: string, tire: any) => {
    setSelectedPositionId(posId);
    setSelectedTire(tire);
    setActiveModal('remover');
  };

  const handleOpenCalibrate = (posId: string, tire: any) => {
    setSelectedPositionId(posId);
    setSelectedTire(tire);
    setActiveModal('calibrar');
  };

  const handleInspectionClick = () => {
    if (onRegisterInspection) {
      onRegisterInspection();
    } else {
      navigate(`/pneus/inspecoes/nova?equipmentId=${equipment.id}`);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-xs">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            <Disc className="text-primary" size={18} /> Pneus e Mapeamento de Eixos
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Controle de posições em tempo real, calibragens, leituras de sulco e rodízios para o ativo {equipment.plateOrCode || equipment.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveModal('rodizio')}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Rodízio
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<ExternalLink size={14} />}
            onClick={() => navigate(ROUTES.PNEUS)}
          >
            Módulo Pneus
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={handleInspectionClick}
          >
            Registrar Inspeção
          </Button>
        </div>
      </div>

      {/* Cards de Métricas do Equipamento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Pneus Instalados</span>
          <p className="text-[20px] font-bold text-on-surface mt-1 font-mono-label">{installedTires.length}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Configuração de Eixos</span>
          <p className="text-[13px] font-bold text-primary truncate mt-1">
            {config ? `${config.axleCount} Eixos (${config.axles.reduce((acc, a) => acc + a.positions.length, 0)} Posições)` : 'Não configurado'}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Pressão Média</span>
          <p className="text-[12px] font-bold text-emerald-400 font-mono-label truncate mt-1">
            {config?.pressureUnit ? `32 ${config.pressureUnit.toUpperCase()}` : '32 PSI'}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Última Inspeção</span>
          <p className="text-[13px] font-bold text-success font-mono-label mt-1">Recente</p>
        </div>
      </div>

      {/* Mapa de Eixos ou Estado Sem Configuração */}
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Carregando mapa de eixos...</div>
      ) : !config ? (
        <div className="glass-card rounded-xl border border-white/10 p-8 text-center space-y-3">
          <Sliders className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
          <p className="text-sm font-bold text-on-surface">Configuração de Eixos Não Ativada</p>
          <p className="text-xs text-on-surface-variant/70 max-w-md mx-auto">
            Este equipamento ainda não possui uma estrutura de eixos definida. Configure o número de eixos e rodados para gerenciar as posições.
          </p>
          <Button variant="primary" size="sm" onClick={() => setActiveModal('configurar_eixos')}>
            Configurar Estrutura de Eixos
          </Button>
        </div>
      ) : (
        <TirePositionMap
          config={config}
          installedTires={installedTires}
          onInstall={handleOpenInstall}
          onRemove={handleOpenRemove}
          onCalibrate={handleOpenCalibrate}
          onOpenConfigModal={() => setActiveModal('configurar_eixos')}
        />
      )}

      {/* Modais */}
      {activeModal === 'configurar_eixos' && (
        <EquipmentAxleConfiguration
          equipmentId={equipment.id}
          config={config}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); refetch(); }}
        />
      )}
      {activeModal === 'instalar' && (
        <TireInstallationModal
          equipmentId={equipment.id}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); refetch(); }}
        />
      )}
      {activeModal === 'remover' && selectedTire && (
        <TireRemovalModal
          tire={selectedTire}
          equipmentName={`${equipment.plateOrCode || equipment.name} - ${equipment.name}`}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); refetch(); }}
        />
      )}
      {activeModal === 'calibrar' && selectedTire && (
        <TireCalibrationModal
          equipmentId={equipment.id}
          tireId={selectedTire.id}
          positionId={selectedPositionId}
          currentPressure={selectedTire.recommendedMinimumPressure || 32}
          recommendedPressure={selectedTire.recommendedMinimumPressure || 32}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); refetch(); }}
        />
      )}
      {activeModal === 'rodizio' && (
        <TireRotationModal
          equipmentId={equipment.id}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); refetch(); }}
        />
      )}
    </div>
  );
};
