import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useSystemSettings } from '../../../hooks/useSystemSettings';
import { systemSettingsService } from '../../../services/system-settings.service';

export const GeneralSettingsForm: React.FC = () => {
  const { refetchSettings } = useSystemSettings();
  const [formData, setFormData] = useState({
    systemName: 'AgroGuard - Gestão Agrícola & Frotas',
    companyName: 'AgroGuard Operações Agrícolas Ltda',
    footerText: 'AgroGuard © 2026 — Todos os direitos reservados.',
    contactInfo: 'suporte@agroguard.com.br | (16) 3456-7890',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await systemSettingsService.updateGeneralSettings(formData);
    await refetchSettings();
    alert('Configurações gerais atualizadas com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl border border-white/10 p-5 space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Building2 size={18} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-on-surface">Identidade da Empresa</h3>
          <p className="text-[11px] text-on-surface-variant/70">Nome da aplicação, razão social e rodapé do sistema.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome do Sistema</label>
          <input
            type="text"
            value={formData.systemName}
            onChange={(e) => setFormData((p) => ({ ...p, systemName: e.target.value }))}
            className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Razão Social da Empresa</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
            className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Texto de Rodapé</label>
          <input
            type="text"
            value={formData.footerText}
            onChange={(e) => setFormData((p) => ({ ...p, footerText: e.target.value }))}
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
          Salvar Identidade
        </button>
      </div>
    </form>
  );
};
