import React from 'react';
import { Shield } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';

interface Props {
  equipment: Equipment;
}

export const IdentificationSection: React.FC<Props> = ({ equipment }) => {
  const fields = [
    { label: 'Código / Placa', value: equipment.plateOrCode },
    { label: 'Tipo de Ativo', value: equipment.assetType },
    { label: 'Marca', value: equipment.brand },
    { label: 'Modelo', value: equipment.model },
    { label: 'Ano de Fabricação', value: equipment.year || 'Não informado' },
    { label: 'Número de Patrimônio', value: equipment.patrimony || 'Não informado' },
    { label: 'Número de Série / Chassi', value: equipment.serialNumber || 'Não informado' },
  ];

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
      <h4 className="text-[14px] font-semibold text-on-surface flex items-center gap-2 pb-2 border-b border-white/10">
        <Shield size={16} className="text-primary" /> Seção 1: Identificação e Cadastral
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
        {fields.map((f) => (
          <div key={f.label} className="bg-surface-container-highest/30 p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] font-mono-label text-on-surface-variant/60 uppercase block">
              {f.label}
            </span>
            <span className="font-medium text-on-surface mt-0.5 block truncate">
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
