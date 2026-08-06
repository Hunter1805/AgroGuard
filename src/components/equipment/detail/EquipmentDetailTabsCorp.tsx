import React from 'react';
import type { EquipmentDetailSummary, EquipmentDetailTab } from '../../../types/equipment-detail';

export type MainGroupTab = 'visao-geral' | 'operacao' | 'manutencao' | 'recursos-custos' | 'arquivos-historico';

interface EquipmentDetailTabsCorpProps {
  activeMainTab: MainGroupTab;
  onMainTabChange: (tab: MainGroupTab) => void;
  activeSubTab: EquipmentDetailTab;
  onSubTabChange: (tab: EquipmentDetailTab) => void;
  summary: EquipmentDetailSummary | null;
}

export const MAIN_GROUPS: { id: MainGroupTab; label: string; subTabs: { id: EquipmentDetailTab; label: string }[] }[] = [
  {
    id: 'visao-geral',
    label: 'Visão Geral',
    subTabs: [{ id: 'visao-geral', label: 'Visão Geral' }],
  },
  {
    id: 'operacao',
    label: 'Operação',
    subTabs: [
      { id: 'leituras', label: 'Leituras' },
      { id: 'checklists', label: 'Checklists' },
      { id: 'falhas', label: 'Falhas' },
    ],
  },
  {
    id: 'manutencao',
    label: 'Manutenção',
    subTabs: [
      { id: 'manutencoes', label: 'Planos & Preventivas' },
      { id: 'ordens-servico', label: 'Ordens de Serviço' },
    ],
  },
  {
    id: 'recursos-custos',
    label: 'Recursos e Custos',
    subTabs: [
      { id: 'pneus', label: 'Pneus' },
      { id: 'pecas-insumos', label: 'Peças e Insumos' },
      { id: 'custos', label: 'Custos' },
    ],
  },
  {
    id: 'arquivos-historico',
    label: 'Arquivos e Histórico',
    subTabs: [
      { id: 'fotos', label: 'Fotos' },
      { id: 'documentos', label: 'Documentos' },
      { id: 'historico', label: 'Histórico' },
    ],
  },
];

export const EquipmentDetailTabsCorp: React.FC<EquipmentDetailTabsCorpProps> = ({
  activeMainTab,
  onMainTabChange,
  activeSubTab,
  onSubTabChange,
}) => {
  const currentGroup = MAIN_GROUPS.find((g) => g.id === activeMainTab) || MAIN_GROUPS[0];

  return (
    <div className="space-y-3">
      {/* 5 Grupos Principais */}
      <div className="flex border-b border-[var(--color-border)] overflow-x-auto">
        {MAIN_GROUPS.map((group) => {
          const isActive = group.id === activeMainTab;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                onMainTabChange(group.id);
                if (group.subTabs.length > 0) {
                  onSubTabChange(group.subTabs[0].id);
                }
              }}
              className="px-5 py-3 text-[14px] font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap"
              style={{
                borderColor: isActive ? 'var(--color-brand)' : 'transparent',
                color: isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)',
              }}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Sub-navegação interna se o grupo tiver mais de 1 sub-aba */}
      {currentGroup.subTabs.length > 1 && (
        <div className="flex gap-2 border-b border-[var(--color-border)] pb-2 overflow-x-auto text-[13px]">
          {currentGroup.subTabs.map((sub) => {
            const isSubActive = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSubTabChange(sub.id)}
                className="px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: isSubActive ? 'var(--color-brand-light)' : 'transparent',
                  color: isSubActive ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
