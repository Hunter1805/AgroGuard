import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import type { AssetType } from '../../../types/equipment';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { equipmentService } from '../../../services/equipment.service';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: 'Trator', label: 'Trator' },
  { value: 'Colhedora', label: 'Colhedora' },
  { value: 'Caminhão', label: 'Caminhão' },
  { value: 'Implemento', label: 'Implemento' },
  { value: 'Veículo', label: 'Veículo Utilitário' },
  { value: 'Moto', label: 'Motocicleta' },
];

export const Step1Identification: React.FC<StepProps> = ({ data, onChange }) => {
  const options = equipmentService.getAuxiliaryOptions();
  const brandOptions = options.brands.map((b) => ({ value: b, label: b }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          1. Identificação e Dados Básicos
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Informe o tipo de ativo, nome descritivo, marca, modelo e registros de patrimônio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Ativo */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Tipo de Ativo <span className="text-error">*</span>
          </label>
          <Select
            options={ASSET_TYPE_OPTIONS}
            value={data.assetType}
            onChange={(val) => onChange('assetType', val as AssetType)}
            placeholder="Selecione o tipo de ativo"
          />
        </div>

        {/* Placa / Código Interno */}
        <Input
          label="Placa / Código Interno *"
          placeholder="Ex: MF-265-01, TR-01, ABC-1234"
          value={data.plateOrCode}
          onChange={(e) => onChange('plateOrCode', e.target.value)}
        />

        {/* Nome Descritivo */}
        <div className="md:col-span-2">
          <Input
            label="Nome Descritivo do Equipamento *"
            placeholder="Ex: TRATOR MASSEY FERGUSON 265 01 4X2"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        {/* Marca */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Marca / Fabricante <span className="text-error">*</span>
          </label>
          <Select
            options={brandOptions}
            value={data.brand}
            onChange={(val) => onChange('brand', val)}
            placeholder="Selecione ou digite a marca"
          />
        </div>

        {/* Modelo */}
        <Input
          label="Modelo *"
          placeholder="Ex: 265, A750, FH 360"
          value={data.model}
          onChange={(e) => onChange('model', e.target.value)}
        />

        {/* Ano de Fabricação */}
        <Input
          label="Ano de Fabricação"
          type="number"
          placeholder="Ex: 2022"
          value={data.year || ''}
          onChange={(e) => onChange('year', e.target.value)}
        />

        {/* Patrimônio */}
        <Input
          label="Número de Patrimônio (Tag)"
          placeholder="Ex: PAT-0012"
          value={data.patrimony || ''}
          onChange={(e) => onChange('patrimony', e.target.value)}
        />

        {/* Número de Série / Chassi */}
        <div className="md:col-span-2">
          <Input
            label="Número de Série / Chassi / VIN"
            placeholder="Ex: MF265-2010-9901X"
            value={data.serialNumber || ''}
            onChange={(e) => onChange('serialNumber', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
