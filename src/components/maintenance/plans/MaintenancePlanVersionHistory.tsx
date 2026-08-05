import React from 'react';
import { History, Shield } from 'lucide-react';
import type { MaintenancePlan } from '../../../types/maintenance-plan';

interface MaintenancePlanVersionHistoryProps {
  plan: Partial<MaintenancePlan>;
}

export const MaintenancePlanVersionHistory: React.FC<MaintenancePlanVersionHistoryProps> = ({ plan }) => {
  const currentVer = plan.version || 1;

  return (
    <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
        <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <div>
          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Trilha Imutável de Versionamento</h4>
          <p className="text-[11px] text-gray-400">Nenhuma edição destrói ordens e históricos já emitidos</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs font-semibold">
          <div className="space-y-1">
            <span className="font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Versão v{currentVer} (Em Vigor / Ativa)
            </span>
            <span className="text-gray-500 block">
              Atualização de matriz e gatilhos para a Safra 2026.
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Publicado agora</span>
        </div>

        {currentVer > 1 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 opacity-80">
            <div className="space-y-1">
              <span className="font-bold text-gray-700 dark:text-gray-300">Versão v{currentVer - 1} (Congelada no Histórico)</span>
              <span className="block text-[11px]">Vinculado a {currentVer - 1} ordens no passado (Imutável)</span>
            </div>
            <span className="text-[11px] text-gray-400">Safra Anterior</span>
          </div>
        )}
      </div>
    </div>
  );
};
