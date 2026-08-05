import React from 'react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentHistoryEvent } from '../../../../types/equipment-detail';
import { IdentificationSection } from '../sections/IdentificationSection';
import { AllocationSection } from '../sections/AllocationSection';
import { OperationSection } from '../sections/OperationSection';
import { TechnicalSummarySection } from '../sections/TechnicalSummarySection';
import { RecentActivitySection } from '../sections/RecentActivitySection';

interface OverviewTabProps {
  equipment: Equipment;
  history: EquipmentHistoryEvent[];
  onViewFullHistory: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  equipment,
  history,
  onViewFullHistory,
}) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <IdentificationSection equipment={equipment} />
        <AllocationSection equipment={equipment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <OperationSection equipment={equipment} />
        <TechnicalSummarySection equipment={equipment} />
      </div>

      <RecentActivitySection history={history} onViewFullHistory={onViewFullHistory} />
    </div>
  );
};
