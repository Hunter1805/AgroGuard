import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Truck,
  Bike,
  Wrench,
  MapPin,
  User,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import type { Equipment } from '../../../types/equipment';
import { StatusBadge } from '../../ui/StatusBadge';

interface EquipmentDetailHeaderProps {
  equipment: Equipment;
  onBack?: () => void;
}

function getAssetIcon(assetType: string) {
  switch (assetType) {
    case 'Caminhão':
    case 'Veículo':
      return <Truck size={24} />;
    case 'Moto':
      return <Bike size={24} />;
    case 'Implemento':
      return <Wrench size={24} />;
    default:
      return <Tractor size={24} />;
  }
}

export const EquipmentDetailHeader: React.FC<EquipmentDetailHeaderProps> = ({
  equipment,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/equipamentos');
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 bg-surface-container-highest/30 space-y-4 shadow-xl">
      {/* Botão de navegação voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Voltar para Frota
        </button>

        <span className="text-[11px] font-mono-label text-on-surface-variant/50 flex items-center gap-1">
          <Clock size={12} /> Atualizado recentemente
        </span>
      </div>

      {/* Identificação Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
            {getAssetIcon(equipment.assetType)}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-label text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
                {equipment.plateOrCode}
              </span>
              <span className="text-[11px] text-on-surface-variant/70 font-mono-label">
                {equipment.assetType} {equipment.assetId ? `· ID ${equipment.assetId}` : ''}
              </span>
              {equipment.patrimony && (
                <span className="text-[11px] font-mono-label text-on-surface-variant/60 bg-surface-container-highest px-2 py-0.5 rounded border border-white/5">
                  Patrimônio: {equipment.patrimony}
                </span>
              )}
            </div>

            <h1 className="font-title-md text-[22px] font-bold text-on-surface tracking-tight leading-snug">
              {equipment.name}
            </h1>

            <p className="text-[13px] text-on-surface-variant/80">
              {equipment.brand} {equipment.model} {equipment.year ? `(${equipment.year})` : ''}
            </p>
          </div>
        </div>

        {/* Status e Alocação */}
        <div className="flex flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
          <StatusBadge status={equipment.status} />

          <div className="flex items-center gap-4 text-[12px] text-on-surface-variant/80 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-primary" />
              <strong className="text-on-surface">{equipment.location}</strong> ({equipment.farm || 'Fazenda Principal'})
            </span>

            {equipment.operatorName && (
              <span className="flex items-center gap-1">
                <User size={13} className="text-primary" />
                <strong className="text-on-surface">{equipment.operatorName}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
