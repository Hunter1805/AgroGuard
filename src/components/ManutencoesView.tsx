import React from 'react';
import { useMaintenance } from '../hooks/useMaintenance';
import { PreventiveTable } from './maintenance/PreventiveTable';

export const ManutencoesView: React.FC = () => {
  const { queue, loading } = useMaintenance();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Fila de Manutenções</h2>
          <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Manutenções preventivas, corretivas e calibrações agendadas.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-on-surface-variant text-[13px]">Carregando manutenções...</div>
      ) : (
        <PreventiveTable items={queue} />
      )}
    </div>
  );
};
