import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { Select } from '../../ui/Select';
import { FormSection } from '../../ui/FormSection';
import { Wrench } from 'lucide-react';

interface StepTechnicalProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

const FUEL_TYPE_OPTIONS = [
  { value: 'Diesel S10', label: 'Diesel S10' },
  { value: 'Diesel S500', label: 'Diesel S500' },
  { value: 'Gasolina', label: 'Gasolina' },
  { value: 'Etanol', label: 'Etanol' },
  { value: 'Elétrico', label: 'Elétrico' },
  { value: 'Nenhum', label: 'Nenhum / Não aplicável' },
];

export const StepTechnical: React.FC<StepTechnicalProps> = ({ data, onChange }) => {
  return (
    <FormSection
      title="Etapa 4: Ficha Técnica & Manutenção Preventiva"
      description="Informe especificações do motor, combustível e datas de controle preventivo."
      icon={<Wrench size={18} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de combustível */}
        <Select
          label="Tipo de Combustível"
          value={data.fuelType || 'Diesel S10'}
          onChange={(v) => onChange('fuelType', v)}
          options={FUEL_TYPE_OPTIONS}
        />

        {/* Potência do Motor */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Potência do Motor (cv / hp)
          </label>
          <input
            type="text"
            placeholder="Ex: 75 cv, 360 cv"
            value={data.enginePower || ''}
            onChange={(e) => onChange('enginePower', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Configuração de Pneus */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Configuração de Pneus / Rodado
          </label>
          <input
            type="text"
            placeholder="Ex: 4x2, 4x4, Duplado, Esteira"
            value={data.tireConfig || ''}
            onChange={(e) => onChange('tireConfig', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Última manutenção */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Data da Última Manutenção
          </label>
          <input
            type="text"
            placeholder="Ex: DD/MM/AAAA"
            value={data.lastMaintenanceDate || ''}
            onChange={(e) => onChange('lastMaintenanceDate', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface font-mono-label placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Observações / Notas adicionais */}
        <div className="md:col-span-2">
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Observações ou Histórico Relevante
          </label>
          <textarea
            rows={3}
            placeholder="Observações adicionais sobre o estado do equipamento, adaptações ou histórico de uso..."
            value={data.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md p-3 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>
      </div>
    </FormSection>
  );
};
