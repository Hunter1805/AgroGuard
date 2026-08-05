import React from 'react';
import type { Tool } from '../../../types/tools';
import type { ToolMaintenance } from '../../../types/tool-maintenance';
import type { ToolCalibration } from '../../../types/tool-calibration';
import { DollarSign } from 'lucide-react';

interface ToolCostsTabProps {
  tool: Tool;
  maintenances: ToolMaintenance[];
  calibrations: ToolCalibration[];
}

export const ToolCostsTab: React.FC<ToolCostsTabProps> = ({ tool, maintenances, calibrations }) => {
  const acqCost = tool.acquisitionValue || 0;
  const mntCost = maintenances.reduce((acc, m) => acc + (m.cost || 0), 0);
  const calibCost = calibrations.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalCost = acqCost + mntCost + calibCost;

  return (
    <div className="space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <DollarSign size={16} className="text-emerald-400" /> Resumo de Custos e Valor Patrimonial
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Valor de Aquisição</span>
          <p className="text-lg font-bold text-on-surface font-mono-label mt-1">
            R$ {acqCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custos de Manutenção</span>
          <p className="text-lg font-bold text-amber-400 font-mono-label mt-1">
            R$ {mntCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custos de Calibração</span>
          <p className="text-lg font-bold text-blue-400 font-mono-label mt-1">
            R$ {calibCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo Total Acumulado</span>
          <p className="text-lg font-bold text-emerald-400 font-mono-label mt-1">
            R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
