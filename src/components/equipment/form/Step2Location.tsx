import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { Select } from '../../ui/Select';
import { equipmentService } from '../../../services/equipment.service';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

export const Step2Location: React.FC<StepProps> = ({ data, onChange }) => {
  const options = equipmentService.getAuxiliaryOptions();

  const farmOptions = options.farms.map((f) => ({ value: f, label: f }));
  const sectorOptions = options.sectors.map((s) => ({ value: s, label: s }));
  const locationOptions = options.locations.map((l) => ({ value: l, label: l }));
  const operatorOptions = [
    { value: '', label: 'Nenhum / Não Atribuído' },
    ...options.operators.map((o) => ({ value: o, label: o })),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          2. Localização e Alocação
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Defina a fazenda, setor de atuação, localização física e operador responsável pelo equipamento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fazenda / Unidade */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Fazenda / Unidade <span className="text-error">*</span>
          </label>
          <Select
            options={farmOptions}
            value={data.farm}
            onChange={(val) => onChange('farm', val)}
            placeholder="Selecione a fazenda"
          />
        </div>

        {/* Setor / Área */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Setor / Área <span className="text-error">*</span>
          </label>
          <Select
            options={sectorOptions}
            value={data.sector}
            onChange={(val) => onChange('sector', val)}
            placeholder="Selecione o setor"
          />
        </div>

        {/* Localização Específica */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Localização Específica <span className="text-error">*</span>
          </label>
          <Select
            options={locationOptions}
            value={data.location}
            onChange={(val) => onChange('location', val)}
            placeholder="Selecione o talhão ou galpão"
          />
        </div>

        {/* Operador Responsável */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Operador / Motorista Responsável
          </label>
          <Select
            options={operatorOptions}
            value={data.operatorName || ''}
            onChange={(val) => onChange('operatorName', val)}
            placeholder="Selecione o operador principal"
          />
        </div>
      </div>
    </div>
  );
};
