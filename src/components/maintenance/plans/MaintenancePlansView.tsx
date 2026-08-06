import React from 'react';
import { PageHeader } from '../../ui/PageHeader';
import { MaintenancePlanList } from './MaintenancePlanList';

export const MaintenancePlansView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-fade-in">
      <PageHeader
        title="Planos de Manutenção Preventiva"
        subtitle="Matriz de regras periódicas por horímetro, odômetro ou tempo para ativos da frota"
      />
      <MaintenancePlanList />
    </div>
  );
};
