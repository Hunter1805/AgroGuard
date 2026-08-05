import React from 'react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import { FormSection } from '../../ui/FormSection';
import { StatusBadge } from '../../ui/StatusBadge';
import { CheckCircle2 } from 'lucide-react';

interface StepReviewProps {
  data: EquipmentFormData;
}

export const StepReview: React.FC<StepReviewProps> = ({ data }) => {
  const unit = data.meterType === 'odometro' ? 'km' : 'horas';

  return (
    <FormSection
      title="Etapa 5: Revisão e Confirmação"
      description="Confira todas as informações fornecidas antes de salvar o cadastro."
      icon={<CheckCircle2 size={18} className="text-primary" />}
    >
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <div className="flex justify-between items-start border-b border-white/10 pb-3">
          <div>
            <span className="font-mono-label text-[11px] text-on-surface-variant/60 uppercase">
              {data.assetType} · {data.plateOrCode || 'Sem código'}
            </span>
            <h3 className="font-title-md text-[18px] font-bold text-on-surface">
              {data.name || 'Sem nome'}
            </h3>
            <p className="text-[12px] text-on-surface-variant/70">
              {data.brand} {data.model} {data.year ? `(${data.year})` : ''}
            </p>
          </div>
          <StatusBadge status={data.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5">
            <span className="text-on-surface-variant/60 block text-[11px]">Fazenda / Setor</span>
            <span className="font-medium text-on-surface">{data.farm} · {data.sector}</span>
          </div>

          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5">
            <span className="text-on-surface-variant/60 block text-[11px]">Localização Específica</span>
            <span className="font-medium text-on-surface">{data.location}</span>
          </div>

          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5">
            <span className="text-on-surface-variant/60 block text-[11px]">Operador Responsável</span>
            <span className="font-medium text-on-surface">{data.operatorName || 'Não atribuído'}</span>
          </div>

          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5 font-mono-label">
            <span className="text-on-surface-variant/60 block text-[11px]">Leitura Inicial</span>
            <span className="font-bold text-primary">
              {data.meterType === 'nenhum' ? 'Sem medidor' : `${data.currentHours} ${unit}`}
            </span>
          </div>

          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5">
            <span className="text-on-surface-variant/60 block text-[11px]">Combustível Inicial</span>
            <span className="font-medium text-on-surface">{data.fuelLevel}%</span>
          </div>

          <div className="bg-surface-container-highest/40 p-3 rounded-lg border border-white/5 font-mono-label">
            <span className="text-on-surface-variant/60 block text-[11px]">Patrimônio / Série</span>
            <span className="font-medium text-on-surface">
              {data.patrimony || 'N/A'} {data.serialNumber ? `(${data.serialNumber})` : ''}
            </span>
          </div>
        </div>

        {data.notes && (
          <div className="bg-surface-container-highest/30 p-3 rounded-lg border border-white/5 text-[12px]">
            <span className="text-on-surface-variant/60 block text-[11px] font-medium mb-1">Observações</span>
            <p className="text-on-surface-variant leading-relaxed">{data.notes}</p>
          </div>
        )}
      </div>
    </FormSection>
  );
};
