import React, { useState } from 'react';
import { ClipboardList, Save } from 'lucide-react';
import { useSystemSettings } from '../../../hooks/useSystemSettings';
import { systemSettingsService } from '../../../services/system-settings.service';

export const WorkOrderRulesForm: React.FC = () => {
  const { refetchSettings } = useSystemSettings();
  const [formData, setFormData] = useState({
    prefix: 'OS',
    requiresApprovalByPriority: true,
    requiresTestBeforeRelease: true,
    calculateMttr: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await systemSettingsService.updateWorkOrderRules(formData);
    await refetchSettings();
    alert('Regras de Ordens de Serviço salvas com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl border border-white/10 p-5 space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <ClipboardList size={18} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-on-surface">Regras de Ordens de Serviço</h3>
          <p className="text-[11px] text-on-surface-variant/70">Prefixo, regras de liberação, testes e métricas.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Prefixo da OS</label>
          <input
            type="text"
            value={formData.prefix}
            onChange={(e) => setFormData((p) => ({ ...p, prefix: e.target.value }))}
            className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-white/10">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Save size={15} />
          Salvar Regras de OS
        </button>
      </div>
    </form>
  );
};
