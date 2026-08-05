import React from 'react';
import { Tractor } from 'lucide-react';
import type { FleetStatusBreakdown } from '../../types';

interface FleetStatusProps {
  fleetStatus: FleetStatusBreakdown | null;
}

export const FleetStatus: React.FC<FleetStatusProps> = ({ fleetStatus }) => {
  const total = fleetStatus?.total || 124;
  const operantes = fleetStatus?.operantes || 82;
  const emManutencao = fleetStatus?.emManutencao || 24;
  const inoperantes = fleetStatus?.inoperantes || 18;

  return (
    <div className="glass-card rounded-xl flex flex-col h-64 border-white/5">
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surface/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Tractor size={16} className="text-on-surface-variant" />
          <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Status da Frota</h3>
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-center">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-highest"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              ></path>
              <path
                className="text-error"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="15, 100"
                strokeWidth="4"
              ></path>
              <path
                className="text-tertiary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="35, 100"
                strokeDashoffset="-15"
                strokeWidth="4"
              ></path>
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="50, 100"
                strokeDashoffset="-50"
                strokeWidth="4"
              ></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[20px] font-bold text-on-surface leading-none">{total}</span>
              <span className="text-[9px] text-on-surface-variant font-mono-label mt-1">Total</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-on-surface-variant">Operantes</span>
              </div>
              <span className="font-mono-label text-on-surface">{operantes}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <span className="text-on-surface-variant">Em Manutenção</span>
              </div>
              <span className="font-mono-label text-on-surface">{emManutencao}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-on-surface-variant">Inoperantes</span>
              </div>
              <span className="font-mono-label text-on-surface">{inoperantes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
