import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, AlertTriangle, AlertCircle } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentDetailSummary } from '../../../../types/equipment-detail';
import { ROUTES } from '../../../../types/routes';

export interface OverviewTabCorpProps {
  equipment: Equipment;
  summary?: EquipmentDetailSummary | null;
  loading?: boolean;
}

export const OverviewTabCorp: React.FC<OverviewTabCorpProps> = ({ equipment }) => {
  const navigate = useNavigate();

  const formattedHours = equipment.meters && equipment.meters.length > 0
    ? `${equipment.meters[0].currentValue.toLocaleString('pt-BR')} ${equipment.meters[0].unit}`
    : `${equipment.currentHours.toLocaleString('pt-BR')} h`;

  return (
    <div className="space-y-6 pt-2">
      {/* Grid Superior: Resumo operacional | Próxima manutenção | Alertas ativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bloco 1: Resumo operacional */}
        <div
          className="rounded-lg border p-5 space-y-4 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Resumo operacional
          </h3>

          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Leitura atual</span>
              <strong className="font-semibold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>
                {formattedHours}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Disponibilidade (30 dias)</span>
              <strong className="font-semibold text-[14px]" style={{ color: 'var(--color-success)' }}>
                92,5%
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Horas em operação (30 dias)</span>
              <span style={{ color: 'var(--color-text-primary)' }}>184 h</span>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-secondary)' }}>Horas parada (30 dias)</span>
              <span style={{ color: 'var(--color-text-primary)' }}>15 h</span>
            </div>
          </div>
        </div>

        {/* Bloco 2: Próxima manutenção */}
        <div
          className="rounded-lg border p-5 space-y-4 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Próxima manutenção
            </h3>
            <Wrench size={16} style={{ color: 'var(--color-brand)' }} />
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Tipo</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Preventiva</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Plano</span>
              <span className="font-mono text-[12px] font-semibold" style={{ color: 'var(--color-brand)' }}>PM-001</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
              <span style={{ color: 'var(--color-text-secondary)' }}>Prevista para</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {equipment.nextMaintenanceDate || '12/08/2026'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-secondary)' }}>Prioridade</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                Média
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.MANUTENCOES_PLANOS)}
            className="w-full h-9 rounded border text-[12px] font-medium transition-colors cursor-pointer text-center"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            Ver plano
          </button>
        </div>

        {/* Bloco 3: Alertas ativos */}
        <div
          className="rounded-lg border p-5 space-y-4 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Alertas ativos ({equipment.hasPendingAlert ? '2' : '0'})
            </h3>
            <AlertTriangle size={16} style={{ color: equipment.hasPendingAlert ? 'var(--color-danger)' : 'var(--color-text-muted)' }} />
          </div>

          {equipment.hasPendingAlert ? (
            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-2.5 p-2.5 rounded bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-[var(--color-danger)]" />
                <div>
                  <p className="font-semibold text-[12px] text-[var(--color-danger)]">Temperatura acima do limite</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">Crítico · Detectado há 2h</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-[var(--color-warning)]" />
                <div>
                  <p className="font-semibold text-[12px] text-[var(--color-warning)]">Vazamento de óleo secundário</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">Médio · Detectado há 6h</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[13px] py-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
              Nenhum alerta ativo para este equipamento.
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate(ROUTES.ALERTAS)}
            className="text-[12px] font-medium text-[var(--color-brand)] hover:underline cursor-pointer text-left pt-1"
          >
            Ver todos os alertas →
          </button>
        </div>
      </div>

      {/* Grid Inferior: Localização | Informações do equipamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloco Localização */}
        <div
          className="rounded-lg border p-5 space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Localização
          </h3>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[13px]">
            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Área</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Produção</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Setor</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{equipment.location}</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Posição</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>COMP-02</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Centro de custo</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>CC-IND-02</span>
            </div>
          </div>
        </div>

        {/* Bloco Informações do equipamento */}
        <div
          className="rounded-lg border p-5 space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Informações do equipamento
          </h3>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[13px]">
            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Fabricante</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{equipment.brand || 'Schulz'}</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Modelo</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{equipment.model || 'Pro CSV 10/100'}</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Número de série</span>
              <span className="font-mono text-[12px]" style={{ color: 'var(--color-text-primary)' }}>{equipment.serialNumber || 'SCLZ-2019-000182'}</span>
            </div>

            <div>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Ano de fabricação</span>
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{equipment.year || '2019'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
