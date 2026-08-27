import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { SettingsNavigation } from './SettingsNavigation';
import { SettingsOverview } from './SettingsOverview';
import { UserList } from './users/UserList';
import { RoleList } from './roles/RoleList';
import { GeneralSettingsForm } from './general/GeneralSettingsForm';
import { MaintenanceRulesForm } from './rules/MaintenanceRulesForm';
import { WorkOrderRulesForm } from './rules/WorkOrderRulesForm';
import { StockRulesForm } from './rules/StockRulesForm';
import { AlertSettingsView } from './alerts/AlertSettingsView';
import { NumberingSettingsView } from './numbering/NumberingSettingsView';
import { AdminAuditView } from './audit/AdminAuditView';
import { ProfileSettings } from './ProfileSettings';
import { SecuritySettings } from './SecuritySettings';

interface ViewProps {
  initialTab?: string;
}

const UnavailableSettings: React.FC<{ label: string }> = ({ label }) => (
  <div role="status" className="rounded-xl border-white/10 bg-surface-container p-6 text-sm text-on-surface-variant">Configuração ainda não disponível: {label}.</div>
);

export const ConfiguracoesView: React.FC<ViewProps> = ({ initialTab = 'visao_geral' }) => {
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const [activeSection, setActiveSection] = useState(queryTab || initialTab);

  useEffect(() => {
    if (queryTab) {
      setActiveSection(queryTab);
    }
  }, [queryTab]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header da Página */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-on-surface tracking-tight">
            Central de Configurações & Administração
          </h2>
          <p className="text-[13px] text-on-surface-variant/70">
            Controle de usuários, perfis, matriz de permissões, parâmetros operacionais e auditoria.
          </p>
        </div>
      </div>

      {/* Navegação entre seções */}
      <SettingsNavigation activeSection={activeSection} onSelectSection={setActiveSection} />

      {/* Conteúdo Dinâmico por Seção */}
      <div className="pt-2">
        {activeSection === 'visao_geral' && <SettingsOverview onNavigate={setActiveSection} />}
        {activeSection === 'perfil' && <ProfileSettings />}
        {activeSection === 'conta' && <ProfileSettings />}
        {activeSection === 'seguranca' && <SecuritySettings />}
        {activeSection === 'preferencias' && <UnavailableSettings label="Preferências" />}
        {activeSection === 'ajuda' && <UnavailableSettings label="Central de Ajuda" />}
        {activeSection === 'usuarios' && <UserList />}
        {activeSection === 'perfis' && <RoleList />}
        {activeSection === 'gerais' && <GeneralSettingsForm />}
        {activeSection === 'manutencao' && <MaintenanceRulesForm />}
        {activeSection === 'ordens_servico' && <WorkOrderRulesForm />}
        {activeSection === 'estoque' && <StockRulesForm />}
        {activeSection === 'alertas' && <AlertSettingsView />}
        {activeSection === 'numeracoes' && <NumberingSettingsView />}
        {activeSection === 'auditoria' && <AdminAuditView />}
      </div>
    </div>
  );
};
