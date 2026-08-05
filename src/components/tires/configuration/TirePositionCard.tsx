import React from 'react';
import { Disc, Plus, Wrench } from 'lucide-react';
import type { TirePosition, Tire } from '../../../types/tires';

interface TirePositionCardProps {
  position: TirePosition;
  installedTire?: Tire;
  onInstall: (positionId: string) => void;
  onRemove: (positionId: string, tire: Tire) => void;
  onCalibrate?: (positionId: string, tire: Tire) => void;
}

export const TirePositionCard: React.FC<TirePositionCardProps> = ({
  position,
  installedTire,
  onInstall,
  onRemove,
  onCalibrate,
}) => {
  const isOccupied = Boolean(installedTire);

  return (
    <div
      className={`rounded-xl p-3.5 border transition-all ${
        isOccupied
          ? installedTire?.condition === 'atencao' || installedTire?.condition === 'critico'
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-surface-container/60 border-white/10'
          : 'bg-surface-container-low/30 border-dashed border-white/20'
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Disc size={15} className={isOccupied ? 'text-primary' : 'text-on-surface-variant/40'} />
          <span className="font-bold text-on-surface text-xs font-mono-label">{position.code}</span>
          <span className="text-[11px] text-on-surface-variant/70">({position.name})</span>
        </div>

        {isOccupied ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              installedTire?.condition === 'bom' || installedTire?.condition === 'novo'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-amber-500/15 text-amber-400'
            }`}
          >
            {installedTire?.condition.toUpperCase()}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-on-surface-variant/50">LIVRE</span>
        )}
      </div>

      {isOccupied && installedTire ? (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono-label font-bold text-primary">{installedTire.internalCode}</span>
            <span className="text-on-surface font-medium">{installedTire.brand} ({installedTire.size})</span>
          </div>

          <div className="flex items-center justify-between font-mono-label text-[11px] text-on-surface-variant/80">
            <span>Pressão: <strong className="text-on-surface">{installedTire.recommendedMinimumPressure || 32} PSI</strong></span>
            <span>Sulco: <strong className="text-on-surface">{installedTire.currentTreadDepth || 14} mm</strong></span>
          </div>

          <div className="flex items-center justify-end gap-1 pt-2 border-t border-white/5">
            {onCalibrate && (
              <button
                onClick={() => onCalibrate(position.id, installedTire)}
                className="px-2 py-1 bg-surface-container rounded-lg text-[10px] font-semibold text-on-surface hover:text-primary transition-colors"
              >
                Calibrar
              </button>
            )}
            <button
              onClick={() => onRemove(position.id, installedTire)}
              className="px-2 py-1 bg-amber-500/15 rounded-lg text-[10px] font-semibold text-amber-400 hover:bg-amber-500/25 transition-colors flex items-center gap-1"
            >
              <Wrench size={11} /> Remover
            </button>
          </div>
        </div>
      ) : (
        <div className="py-2 text-center">
          <button
            onClick={() => onInstall(position.id)}
            className="w-full py-1.5 bg-surface-container hover:bg-surface-container-highest rounded-lg text-[11px] font-bold text-primary flex items-center justify-center gap-1 transition-colors"
          >
            <Plus size={13} /> Instalar Pneu
          </button>
        </div>
      )}
    </div>
  );
};
