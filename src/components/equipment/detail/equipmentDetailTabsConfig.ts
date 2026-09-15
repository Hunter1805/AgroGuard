import type { EquipmentDetailTab } from '../../../types/equipment-detail';
import type { MainGroupTab } from './equipmentDetailTabs.types';

export interface MainGroup {
  id: MainGroupTab;
  label: string;
  subTabs: { id: EquipmentDetailTab; label: string }[];
}

export const MAIN_GROUPS: MainGroup[] = [
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
