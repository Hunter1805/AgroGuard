import React, { useState } from 'react';
import { Package, Save } from 'lucide-react';
import { useSystemSettings } from '../../../hooks/useSystemSettings';
import { systemSettingsService } from '../../../services/system-settings.service';

export const StockRulesForm: React.FC = () => {
  const { refetchSettings } = useSystemSettings();
  const [formData, setFormData] = useState({
    allowNegativeStock: false,
    lotConsumptionMethod: 'FEFO' as 'FEFO' | 'FIFO' | 'LIFO',
    blockExpiredLot: true,
    expirationAlertDays: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await systemSettingsService.updateStockRules(formData);
    await refetchSettings();
    alert('Regras de Estoque salvas com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl border border-white/10 p-5 space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Package size={18} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-on-surface">Regras de Estoque & Peças</h3>
          <p className="text-[11px] text-on-surface-variant/70">Consumo FEFO, validação de lotes e estoque negativo.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Método de Lote</label>
          <select
            value={formData.lotConsumptionMethod}
            onChange={(e) => setFormData((p) => ({ ...p, lotConsumptionMethod: e.target.value as any }))}
            className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
          >
            <option value="FEFO">FEFO (Validade mais próxima primeiro)</option>
            <option value="FIFO">FIFO (Primeiro a entrar, primeiro a sair)</option>
            <option value="LIFO">LIFO (Último a entrar, primeiro a sair)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Alerta de Validade (Dias)</label>
          <input
            type="number"
            value={formData.expirationAlertDays}
            onChange={(e) => setFormData((p) => ({ ...p, expirationAlertDays: Number(e.target.value) }))}
            className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-white/10">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Save size={15} />
          Salvar Regras de Estoque
        </button>
      </div>
    </form>
  );
};
