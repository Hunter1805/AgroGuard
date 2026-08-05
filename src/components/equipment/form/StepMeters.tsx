import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import type { EquipmentStatus, MeterType } from '../../../types/equipment';
import { Select } from '../../ui/Select';
import { FormSection } from '../../ui/FormSection';
import { Gauge } from 'lucide-react';

interface StepMetersProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

const STATUS_OPTIONS = [
  { value: 'operante', label: 'Operante (Pronto para uso)' },
  { value: 'em_operacao', label: 'Em Operação (Em uso no campo)' },
  { value: 'manutencao', label: 'Em Manutenção (Em oficina)' },
  { value: 'parado', label: 'Parado / Inoperante' },
  { value: 'bloqueado', label: 'Bloqueado (Aguardando liberação)' },
];

const METER_TYPE_OPTIONS = [
  { value: 'horimetro', label: 'Horímetro (Horas de trabalho — tratores, colhedoras)' },
  { value: 'odometro', label: 'Odômetro (Quilômetros rodados — caminhões, carros, motos)' },
  { value: 'nenhum', label: 'Nenhum medidor (Implementos sem motor)' },
];

export const StepMeters: React.FC<StepMetersProps> = ({ data, onChange }) => {
  const showMeterInput = data.meterType !== 'nenhum';
  const unitLabel = data.meterType === 'odometro' ? 'km' : 'horas';

  return (
    <FormSection
      title="Etapa 3: Status Operacional & Medidores"
      description="Configure a situação de entrada do equipamento e a leitura inicial dos medidores."
      icon={<Gauge size={18} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Inicial */}
        <Select
          label="Status Operacional Inicial"
          required
          value={data.status}
          onChange={(v) => onChange('status', v as EquipmentStatus)}
          options={STATUS_OPTIONS}
        />

        {/* Tipo de Medidor */}
        <Select
          label="Tipo de Medidor"
          required
          value={data.meterType}
          onChange={(v) => onChange('meterType', v as MeterType)}
          options={METER_TYPE_OPTIONS}
        />

        {/* Leitura Inicial */}
        {showMeterInput && (
          <div>
            <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
              Leitura Inicial ({unitLabel}) <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="0"
                value={data.currentHours || ''}
                onChange={(e) => onChange('currentHours', e.target.value)}
                className="w-full bg-surface-container-highest border border-white/10 rounded-md px-3 py-2 text-[13px] text-on-surface font-mono-label placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono-label text-on-surface-variant/50">
                {unitLabel}
              </span>
            </div>
          </div>
        )}

        {/* Nível de Combustível */}
        <div>
          <label className="font-label-sm text-[12px] font-medium text-on-surface-variant block mb-1.5">
            Nível Inicial de Combustível ({data.fuelLevel}%)
          </label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={data.fuelLevel}
              onChange={(e) => onChange('fuelLevel', Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
            />
            <span className="font-mono-label text-[13px] font-semibold text-primary w-12 text-right">
              {data.fuelLevel}%
            </span>
          </div>
        </div>
      </div>
    </FormSection>
  );
};
