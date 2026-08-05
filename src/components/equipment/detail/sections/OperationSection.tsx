import React from 'react';
import { Activity } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';

interface Props {
  equipment: Equipment;
}

export const OperationSection: React.FC<Props> = ({ equipment }) => {
  const fields = [
    { label: 'Status Operacional', value: equipment.status },
    { label: 'Forma de Propriedade', value: 'Próprio' },
    { label: 'Data de Aquisição', value: '15/01/2021' },
    { label: 'Entrada em Operação', value: '20/01/2021' },
    { label: 'Garantia de Fábrica', value: 'Expirada' },
  ];

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
      <h4 className="text-[14px] font-semibold text-on-surface flex items-center gap-2 pb-2 border-b border-white/10">
        <Activity size={16} className="text-primary" /> Seção 3: Situação Operacional e Contratual
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
