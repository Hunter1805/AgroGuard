import React from 'react';
import type { EquipmentTireConfiguration, Tire } from '../../../types/tires';
import { TirePositionCard } from './TirePositionCard';
import { Button } from '../../ui/Button';
import { Sliders } from 'lucide-react';

interface TirePositionMapProps {
  config: EquipmentTireConfiguration;
  installedTires: Tire[];
  onInstall: (positionId: string) => void;
  onRemove: (positionId: string, tire: Tire) => void;
  onCalibrate?: (positionId: string, tire: Tire) => void;
  onOpenConfigModal?: () => void;
}

export const TirePositionMap: React.FC<TirePositionMapProps> = ({
  config,
  installedTires,
  onInstall,
  onRemove,
  onCalibrate,
  onOpenConfigModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h4 className="text-sm font-bold text-on-surface">Mapa de Eixos e Posições do Equipamento</h4>
          <p className="text-xs text-on-surface-variant/70">
            {config.axleCount} eixos configurados ({config.axles.reduce((acc, a) => acc + a.positions.length, 0)} posições totais).
          </p>
        </div>

        {onOpenConfigModal && (
          <Button variant="outline" size="sm" onClick={onOpenConfigModal} className="flex items-center gap-1.5">
            <Sliders size={14} /> Editar Estrutura de Eixos
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {config.axles.map(axle => (
          <div key={axle.id} className="glass-card rounded-2xl p-4 border border-white/10 space-y-3 bg-surface-container-low/20">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-xs text-on-surface uppercase font-mono-label tracking-wider">
                {axle.name} — Rodado {axle.sideConfiguration}
              </span>
              <span className="text-[10px] text-on-surface-variant/60 font-mono-label">Tipo: {axle.type}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {axle.positions.map(position => {
                const tire = installedTires.find(t => t.id === position.installedTireId);
                return (
                  <TirePositionCard
                    key={position.id}
                    position={position}
                    installedTire={tire}
                    onInstall={onInstall}
                    onRemove={onRemove}
                    onCalibrate={onCalibrate}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
