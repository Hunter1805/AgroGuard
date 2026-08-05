import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import type { AssetType } from '../../../types/equipment';
import { Select } from '../../ui/Select';
import { FormSection } from '../../ui/FormSection';
import { Tractor } from 'lucide-react';

interface StepIdentificationProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

const ASSET_TYPE_OPTIONS = [
  { value: 'Trator', label: 'Trator' },
  { value: 'Colhedora', label: 'Colhedora' },
  { value: 'Caminhão', label: 'Caminhão' },
  { value: 'Implemento', label: 'Implemento' },
  { value: 'Veículo', label: 'Veículo Utilitário' },
  { value: 'Moto', label: 'Moto / Triciclo' },
];

export const StepIdentification: React.FC<StepIdentificationProps> = ({ data, onChange }) => {
  return (
    <FormSection
      title="Etapa 1: Identificação do Ativo"
      description="Informe os dados principais para registro do equipamento na frota."
      icon={<Tractor size={18} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de ativo */}
        <Select
          label="Tipo de Ativo"
          required
          value={data.assetType}
          onChange={(v) => onChange('assetType', v as AssetType)}
          options={ASSET_TYPE_OPTIONS}
        />

        {/* Código / Placa */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Código Interno ou Placa <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: MF-265-01 ou ABC-1234"
            value={data.plateOrCode}
            onChange={(e) => onChange('plateOrCode', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Nome descritivo */}
        <div className="md:col-span-2">
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Nome Descritivo do Equipamento <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Trator Massey Ferguson 265 01 4x2"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Marca */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Marca / Fabricante <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Massey Ferguson, Valtra, Jacto"
            value={data.brand}
            onChange={(e) => onChange('brand', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Modelo <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: 265, A750, FH 360"
            value={data.model}
            onChange={(e) => onChange('model', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Ano de fabricação */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Ano de Fabricação
          </label>
          <input
            type="text"
            placeholder="Ex: 2022"
            value={data.year || ''}
            onChange={(e) => onChange('year', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Patrimônio */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Número de Patrimônio
          </label>
          <input
            type="text"
            placeholder="Ex: PAT-0012"
            value={data.patrimony || ''}
            onChange={(e) => onChange('patrimony', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Número de série / Chassi */}
        <div className="md:col-span-2">
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Número de Série / Chassi
          </label>
          <input
            type="text"
            placeholder="Ex: MF265-2010-9901"
            value={data.serialNumber || ''}
            onChange={(e) => onChange('serialNumber', e.target.value)}
            className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 font-mono-label"
          />
        </div>
      </div>
    </FormSection>
  );
};
