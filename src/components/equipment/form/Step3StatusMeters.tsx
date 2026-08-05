import React from 'react';
import { Plus, Trash2, Gauge, Clock } from 'lucide-react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import type { EquipmentStatus, MeterConfig, MeterType } from '../../../types/equipment';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

const STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
  { value: 'operante', label: 'Operante (Disponível)' },
  { value: 'em_operacao', label: 'Em Operação (Em Campo)' },
  { value: 'manutencao', label: 'Em Manutenção (Oficina)' },
  { value: 'parado', label: 'Parado (Aguardando Alocação)' },
  { value: 'bloqueado', label: 'Bloqueado (Segurança / Restrição)' },
  { value: 'inoperante', label: 'Inoperante (Aguardando Peças)' },
];

export const Step3StatusMeters: React.FC<StepProps> = ({ data, onChange }) => {
  const meters: MeterConfig[] = data.meters || [];

  const handleAddMeter = () => {
    const newMeter: MeterConfig = {
      id: `m-${Date.now()}`,
      type: 'horimetro',
      label: `Medidor ${meters.length + 1}`,
      currentValue: 0,
      unit: 'h',
      lastReadingDate: new Date().toLocaleDateString('pt-BR'),
    };
    const updated = [...meters, newMeter];
    onChange('meters', updated);
    updateMeterTypeSummary(updated);
  };

  const handleRemoveMeter = (id: string) => {
    const updated = meters.filter((m) => m.id !== id);
    onChange('meters', updated);
    updateMeterTypeSummary(updated);
  };

  const handleMeterChange = (id: string, field: keyof MeterConfig, value: any) => {
    const updated = meters.map((m) => {
      if (m.id === id) {
        const next = { ...m, [field]: value };
        if (field === 'type') {
          next.unit = value === 'odometro' ? 'km' : value === 'horimetro' ? 'h' : 'un';
        }
        return next;
      }
      return m;
    });
    onChange('meters', updated);
    updateMeterTypeSummary(updated);
  };

  const updateMeterTypeSummary = (list: MeterConfig[]) => {
    const hasHori = list.some((m) => m.type === 'horimetro');
    const hasOdo = list.some((m) => m.type === 'odometro');

    let summaryType: MeterType = 'nenhum';
    if (hasHori && hasOdo) summaryType = 'ambos';
    else if (hasHori) summaryType = 'horimetro';
    else if (hasOdo) summaryType = 'odometro';

    onChange('meterType', summaryType);
    if (list.length > 0) {
      onChange('currentHours', Number(list[0].currentValue) || 0);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          3. Situação Operacional e Coleção de Medidores
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Configure o status de operação, reservatório de combustível e a coleção de medidores (horímetro, odômetro, múltiplos ou nenhum).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Operacional */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Status Operacional <span className="text-error">*</span>
          </label>
          <Select
            options={STATUS_OPTIONS}
            value={data.status}
            onChange={(val) => onChange('status', val as EquipmentStatus)}
            placeholder="Selecione o status"
          />
        </div>

        {/* Nível de Combustível */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[12px] font-medium text-on-surface">
              Nível Atual de Combustível (%)
            </label>
            <span className="font-mono-label text-[12px] font-bold text-primary">
              {data.fuelLevel}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={data.fuelLevel}
            onChange={(e) => onChange('fuelLevel', Number(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Coleção de Medidores */}
      <div className="space-y-4 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-title-md text-[14px] font-semibold text-on-surface flex items-center gap-2">
              <Gauge size={16} className="text-primary" /> Coleção de Medidores
            </h4>
            <p className="text-[11px] text-on-surface-variant/60">
              Adicione horímetros, odômetros ou medidores auxiliares do equipamento.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus size={14} />}
            onClick={handleAddMeter}
          >
            Adicionar Medidor
          </Button>
        </div>

        {meters.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-white/10 bg-surface-container-highest/20 text-center">
            <p className="text-[12px] text-on-surface-variant/60 mb-2">
              Nenhum medidor configurado neste ativo (ex: implementos sem medidor).
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddMeter}
            >
              Criar Primeiro Medidor
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {meters.map((meter, idx) => (
              <div
                key={meter.id}
                className="glass-card p-4 rounded-xl border border-white/10 bg-surface-container-highest/40 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[12px] font-bold text-primary font-mono-label flex items-center gap-1.5">
                    <Clock size={13} /> Medidor #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMeter(meter.id)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1 rounded cursor-pointer"
                    title="Remover medidor"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                      Tipo de Medidor
                    </label>
                    <Select
                      options={[
                        { value: 'horimetro', label: 'Horímetro (h)' },
                        { value: 'odometro', label: 'Odômetro (km)' },
                        { value: 'outros', label: 'Outros Medidores' },
                      ]}
                      value={meter.type}
                      onChange={(val) => handleMeterChange(meter.id, 'type', val)}
                      placeholder=""
                    />
                  </div>

                  <div>
                    <Input
                      label="Rótulo / Identificação"
                      placeholder="Ex: Horímetro Motor"
                      value={meter.label}
                      onChange={(e) => handleMeterChange(meter.id, 'label', e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label={`Leitura Atual (${meter.unit})`}
                      type="number"
                      placeholder="0"
                      value={meter.currentValue}
                      onChange={(e) =>
                        handleMeterChange(meter.id, 'currentValue', Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <Input
                      label="Data da Leitura"
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={meter.lastReadingDate || ''}
                      onChange={(e) =>
                        handleMeterChange(meter.id, 'lastReadingDate', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
