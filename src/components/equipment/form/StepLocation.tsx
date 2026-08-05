import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { FormSection } from '../../ui/FormSection';
import { MapPin } from 'lucide-react';

interface StepLocationProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({ data, onChange }) => {
  return (
    <FormSection
      title="Etapa 2: Localização e Alocação"
      description="Defina em qual fazenda, setor e localização o equipamento estará alocado."
      icon={<MapPin size={18} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fazenda / Unidade */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Fazenda / Unidade Principal <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Fazenda São João"
            value={data.farm}
            onChange={(e) => onChange('farm', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Setor / Área */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Setor / Cultura <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Café, Grãos, Logística, Oficina"
            value={data.sector}
            onChange={(e) => onChange('sector', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Localização Específica */}
        <div className="md:col-span-2">
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Localização Atual Específica <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Talhão 1, Galpão de Máquinas, Oficina Central"
            value={data.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Operador responsável */}
        <div className="md:col-span-2">
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Operador Responsável Inicial
          </label>
          <input
            type="text"
            placeholder="Ex: Carlos Silva (deixe em branco se não houver um exclusivo)"
            value={data.operatorName || ''}
            onChange={(e) => onChange('operatorName', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>
    </FormSection>
  );
};
