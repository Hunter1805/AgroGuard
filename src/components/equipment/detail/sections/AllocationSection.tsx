import React from 'react';
import { MapPin } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';

interface Props {
  equipment: Equipment;
}

export const AllocationSection: React.FC<Props> = ({ equipment }) => {
  const fields = [
    { label: 'Unidade / Empresa', value: 'AgroGuard Unidade Principal' },
    { label: 'Fazenda', value: equipment.farm || 'Fazenda Principal' },
    { label: 'Setor / Área', value: equipment.sector || 'Geral' },
    { label: 'Localização Física', value: equipment.location },
    { label: 'Centro de Custo', value: 'CC-4010 (Operações Agrícolas)' },
    { label: 'Operador Responsável', value: equipment.operatorName || 'Não atribuído' },
  ];

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
      <h4 className="text-[14px] font-semibold text-on-surface flex items-center gap-2 pb-2 border-b border-white/10">
        <MapPin size={16} className="text-primary" /> Seção 2: Localização e Alocação
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
