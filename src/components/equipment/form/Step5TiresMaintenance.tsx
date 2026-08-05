import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { equipmentService } from '../../../services/equipment.service';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

export const Step5TiresMaintenance: React.FC<StepProps> = ({ data, onChange }) => {
  const options = equipmentService.getAuxiliaryOptions();
  const planOptions = [
    { value: '', label: 'Nenhum plano específico' },
    ...options.maintenancePlans.map((p) => ({ value: p.id, label: p.name })),
  ];

  const handlePlanChange = (planId: string) => {
    const selected = options.maintenancePlans.find((p) => p.id === planId);
    onChange('maintenancePlanId', planId);
    if (selected) {
      onChange('maintenancePlanName', selected.name);
      onChange('maintenanceInterval', selected.interval);
    } else {
      onChange('maintenancePlanName', '');
      onChange('maintenanceInterval', undefined);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          5. Pneus, Rodados e Manutenção Preventiva
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Configure a especificação dos rodados/esteiras e associe o plano de manutenção preventiva periódica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Configuração de Pneus / Rodados */}
        <div className="md:col-span-2">
          <Input
            label="Configuração de Pneus / Rodados / Esteiras"
            placeholder="Ex: Dianteiros 7.50-16 (12 lonas) / Traseiros 18.4-30, Duplado, Esteira de Borracha..."
            value={data.tireConfig || ''}
            onChange={(e) => onChange('tireConfig', e.target.value)}
          />
        </div>

        {/* Plano de Manutenção Preventiva */}
        <div>
          <label className="block text-[12px] font-medium text-on-surface mb-1.5">
            Plano de Manutenção Preventiva Vinculado
          </label>
          <Select
            options={planOptions}
            value={data.maintenancePlanId || ''}
            onChange={handlePlanChange}
            placeholder="Selecione um plano preventivo"
          />
        </div>

        {/* Intervalo de Revisão */}
        <Input
          label="Intervalo Recorrente da Revisão (Horas ou Km)"
          type="number"
          placeholder="Ex: 250 (horas) ou 10000 (km)"
          value={data.maintenanceInterval || ''}
          onChange={(e) => onChange('maintenanceInterval', Number(e.target.value))}
        />

        {/* Data da Última Manutenção */}
        <Input
          label="Data da Última Manutenção Realizada"
          placeholder="DD/MM/AAAA"
          value={data.lastMaintenanceDate || ''}
          onChange={(e) => onChange('lastMaintenanceDate', e.target.value)}
        />

        {/* Data da Próxima Manutenção */}
        <Input
          label="Data Prevista para Próxima Manutenção"
          placeholder="DD/MM/AAAA ou em X horas"
          value={data.nextMaintenanceDate || ''}
          onChange={(e) => onChange('nextMaintenanceDate', e.target.value)}
        />
      </div>
    </div>
  );
};
