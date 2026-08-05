import React from 'react';
import {
  Activity,
  Gauge,
  ClipboardList,
  Wrench,
  FileText,
  AlertTriangle,
  Disc,
  Package,
  DollarSign,
  File,
  Image,
  History,
} from 'lucide-react';
import type { EquipmentDetailSummary, EquipmentDetailTab } from '../../../types/equipment-detail';
import { Tabs } from '../../ui/Tabs';

interface EquipmentDetailTabsProps {
  activeTab: EquipmentDetailTab;
  onTabChange: (tab: EquipmentDetailTab) => void;
  summary: EquipmentDetailSummary | null;
}

export const EquipmentDetailTabs: React.FC<EquipmentDetailTabsProps> = ({
  activeTab,
  onTabChange,
  summary,
}) => {
  const tabsList = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <Activity size={14} /> },
    { id: 'leituras', label: 'Leituras', icon: <Gauge size={14} /> },
    {
      id: 'checklists',
      label: 'Checklists',
      icon: <ClipboardList size={14} />,
      badge: summary?.pendingChecklists ? summary.pendingChecklists : undefined,
    },
    {
      id: 'manutencoes',
      label: 'Manutenções',
      icon: <Wrench size={14} />,
      badge: summary?.overdueMaintenance ? summary.overdueMaintenance : undefined,
    },
    {
      id: 'ordens-servico',
      label: 'Ordens de Serviço',
      icon: <FileText size={14} />,
      badge: summary?.openOrders ? summary.openOrders : undefined,
    },
    {
      id: 'falhas',
      label: 'Falhas',
      icon: <AlertTriangle size={14} />,
      badge: summary?.openFailures ? summary.openFailures : undefined,
    },
    { id: 'pneus', label: 'Pneus', icon: <Disc size={14} /> },
    { id: 'pecas-insumos', label: 'Peças e Insumos', icon: <Package size={14} /> },
    { id: 'custos', label: 'Custos', icon: <DollarSign size={14} /> },
    { id: 'documentos', label: 'Documentos', icon: <File size={14} /> },
    { id: 'fotos', label: 'Fotos', icon: <Image size={14} /> },
    { id: 'historico', label: 'Histórico', icon: <History size={14} /> },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none border-b border-white/10">
      <Tabs
        tabs={tabsList}
        activeTab={activeTab}
        onTabChange={(id) => onTabChange(id as EquipmentDetailTab)}
        variant="underline"
        className="min-w-max"
      />
    </div>
  );
};
