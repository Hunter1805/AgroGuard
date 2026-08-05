import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { equipmentService } from '../../../services/equipment.service';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

export const Step4TechnicalInfo: React.FC<StepProps> = ({ data, onChange }) => {
  const options = equipmentService.getAuxiliaryOptions();
  const fuelOptions = options.fuelTypes.map((f) => ({ value: f, label: f }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          4. Ficha e Informações Técnicas
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Especifique detalhes do motor, transmissão, capacidade e especificações técnicas do fabricante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Combustível */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Tipo de Combustível
          </label>
          <Select
            options={fuelOptions}
            value={data.fuelType || ''}
            onChange={(val) => onChange('fuelType', val)}
            placeholder="Selecione o combustível"
          />
        </div>

        {/* Potência do Motor */}
        <Input
          label="Potência do Motor (cv / hp)"
          placeholder="Ex: 75 cv, 360 cv, 150 hp"
          value={data.enginePower || ''}
          onChange={(e) => onChange('enginePower', e.target.value)}
        />

        {/* Sistema de Transmissão */}
        <Input
          label="Sistema de Transmissão / Câmbio"
          placeholder="Ex: Manual 8x2, Powershift, CVT"
          value={data.transmissionType || ''}
          onChange={(e) => onChange('transmissionType', e.target.value)}
        />

        {/* Capacidade do Tanque */}
        <Input
          label="Capacidade do Tanque (Litros)"
          placeholder="Ex: 120 L, 300 L"
          value={data.tankCapacity || ''}
          onChange={(e) => onChange('tankCapacity', e.target.value)}
        />

        {/* Peso Operacional */}
        <Input
          label="Peso Operacional (kg / toneladas)"
          placeholder="Ex: 3.800 kg, 12,5 t"
          value={data.operatingWeight || ''}
          onChange={(e) => onChange('operatingWeight', e.target.value)}
        />

        {/* Observações Gerais */}
        <div className="md:col-span-2">
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Observações Técnicas e Notas de Campo
          </label>
          <textarea
            rows={3}
            value={data.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Adicione observações, restrições operacionais ou particularidades deste ativo..."
            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-[12px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
