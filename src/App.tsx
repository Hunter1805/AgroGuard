import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { ROUTES } from './types/routes';
import type { ServiceOrder } from './types';
import { isCorpUI } from './lib/ui-version';
import { useSidebarState } from './hooks/useSidebarState';

// Layout Legacy
import { Sidebar as SidebarLegacy } from './components/layout/Sidebar';
import { Header as HeaderLegacy } from './components/layout/Header';

// Layout Corporativo v1.1.0
import { SidebarCorp } from './components/layout/SidebarCorp';
import { HeaderCorp } from './components/layout/HeaderCorp';

// Módulos existentes
import { DashboardView } from './components/DashboardView';
import { EquipamentosView } from './components/EquipamentosView';
import { CadastroEquipamentoView } from './components/equipment/CadastroEquipamentoView';
import { EquipmentDetailView } from './components/equipment/detail/EquipmentDetailView';
import { EquipmentReadingsView } from './components/equipment/readings/EquipmentReadingsView';
import { MaintenanceOverview } from './components/maintenance/MaintenanceOverview';
import { MaintenancePlansView } from './components/maintenance/plans/MaintenancePlansView';
import { MaintenanceHistoryView } from './components/maintenance/history/MaintenanceHistoryView';
import { MaintenanceCalendarView } from './components/maintenance/schedule/MaintenanceCalendarView';
import { RelatoriosView } from './components/reports/RelatoriosView';
import { ChecklistsView } from './components/checklists/ChecklistsView';
import { ChecklistExecutionView } from './components/checklists/executions/ChecklistExecutionView';
import { ChecklistTemplateForm } from './components/checklists/templates/ChecklistTemplateForm';
import { WorkOrdersView } from './components/orders/WorkOrdersView';
import { WorkOrderOpeningForm } from './components/orders/form/WorkOrderOpeningForm';
import { WorkOrderDetailView } from './components/orders/detail/WorkOrderDetailView';
import { CentralAlertas } from './components/alerts/CentralAlertas';
import { PneusView } from './components/tires/PneusView';
import { CadastroPneuView } from './components/tires/CadastroPneuView';
import { TireDetailView } from './components/tires/detail/TireDetailView';
import { TireInspectionForm } from './components/tires/inspecoes/TireInspectionForm';
import { FerramentasView } from './components/tools/FerramentasView';
import { CadastroFerramentaView } from './components/tools/CadastroFerramentaView';
import { ToolDetailView } from './components/tools/detail/ToolDetailView';
import { PecasInsumosView } from './components/parts/PecasInsumosView';
import { CadastroPecaInsumoView } from './components/parts/CadastroPecaInsumoView';
import { StockItemDetailView } from './components/parts/detail/StockItemDetailView';
import { CadastrosView } from './components/auxiliary/CadastrosView';
import { MasterDataRouteHandler } from './components/master-data/MasterDataRouteHandler';
import { ConfiguracoesView } from './components/settings/ConfiguracoesView';

// Modais globais
import { NovaOrdemServicoModal } from './components/orders/NovaOrdemServicoModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';

// Hooks
import { useOrders } from './hooks/useOrders';
import { useMaintenance } from './hooks/useMaintenance';

// Fase 18 - Telas e Contexto de Autenticação / Onboarding
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { EmailConfirmationPage } from './components/auth/EmailConfirmationPage';
import { AuthCallbackPage } from './components/auth/AuthCallbackPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { ProvisioningPage } from './components/auth/ProvisioningPage';
import { AccessBlockedPage } from './components/auth/AccessBlockedPage';
import { AcceptInvitationPage } from './components/auth/AcceptInvitationPage';
import { WelcomeOnboardingPage } from './components/onboarding/WelcomeOnboardingPage';
import { UsersListView } from './components/users/UsersListView';

export function App() {
  const { user, profile, loading } = useAuth();

  const [isNewOSOpen, setIsNewOSOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { collapsed, toggle } = useSidebarState();
  const { orders, addOrder } = useOrders();
  const { revisions } = useMaintenance();

  const handleAddOS = async (newOS: ServiceOrder) => {
    const created = await addOrder(newOS);
    setToastMessage(`Ordem de Serviço ${created.id} criada com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Loader de Inicialização Geral
  if (loading) {
    return (
      <div className="min-h-screen w-full flex bg-slate-50 justify-center items-center font-sans text-slate-800">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Iniciando AgroGuard...</span>
        </div>
      </div>
    );
  }

  const mainMarginClass = isCorpUI
    ? collapsed
      ? 'md:ml-[var(--spacing-sidebar-collapsed)]'
      : 'md:ml-[var(--spacing-sidebar-width)]'
    : 'md:ml-sidebar-width';

  // 2. Roteador de Autenticação e Estados
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/criar-conta" element={<RegisterPage />} />
      <Route path="/confirmar-email" element={<EmailConfirmationPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
      <Route path="/aceitar-convite" element={<AcceptInvitationPage />} />
      <Route path="/acesso-bloqueado" element={<AccessBlockedPage />} />

      {/* Rota de Provisionamento e Onboarding */}
      <Route
        path="/criar-ambiente"
        element={
          !user ? (
            <Navigate to="/entrar" replace />
          ) : profile?.organizationId ? (
            <Navigate to="/boas-vindas" replace />
          ) : (
            <ProvisioningPage />
          )
        }
      />

      <Route
        path="/boas-vindas"
        element={
          !user ? (
            <Navigate to="/entrar" replace />
          ) : !profile?.organizationId ? (
            <Navigate to="/criar-ambiente" replace />
          ) : profile?.onboardingCompleted ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <WelcomeOnboardingPage />
          )
        }
      />

      {/* Redirecionamento da raiz */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/entrar" replace />
          ) : !profile?.organizationId ? (
            <Navigate to="/criar-ambiente" replace />
          ) : !profile?.onboardingCompleted ? (
            <Navigate to="/boas-vindas" replace />
          ) : (
            <Navigate to="/app/dashboard" replace />
          )
        }
      />

      {/* Rotas Privadas (Protegidas) dentro do Layout */}
      <Route
        path="/*"
        element={
          !user ? (
            <Navigate to="/entrar" replace />
          ) : !profile?.organizationId ? (
            <Navigate to="/criar-ambiente" replace />
          ) : !profile?.onboardingCompleted ? (
            <Navigate to="/boas-vindas" replace />
          ) : (
            <div className={`h-screen flex overflow-hidden ${isCorpUI ? 'bg-app text-primary' : 'bg-background text-on-background bg-pattern'}`}>
              {/* Toast */}
              {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 glass-card bg-surface-container-highest border border-primary/40 text-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={20} />
                  <span className="text-[13px] font-medium">{toastMessage}</span>
                </div>
              )}

              {/* Sidebar */}
              {isCorpUI ? (
                <SidebarCorp
                  collapsed={collapsed}
                  onToggle={toggle}
                  pendingAlerts={3}
                  mobileOpen={mobileMenuOpen}
                  onMobileClose={() => setMobileMenuOpen(false)}
                />
              ) : (
                <SidebarLegacy
                  onOpenNewOS={() => setIsNewOSOpen(true)}
                  pendingAlerts={3}
                />
              )}

              {/* Área da direita (Header + Main) */}
              <div className={`flex min-w-0 flex-1 flex-col ${mainMarginClass} transition-[margin-left] duration-200`}>
                {isCorpUI ? (
                  <HeaderCorp
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                    onMobileMenuOpen={() => setMobileMenuOpen(true)}
                    pendingAlerts={3}
                  />
                ) : (
                  <HeaderLegacy onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
                )}

                {/* Área rolável principal */}
                <main className="min-h-0 flex-1 overflow-y-auto">
                  <div className="mx-auto w-full max-w-[1600px] p-6">
                    <Routes>
                      {/* Dashboard */}
                      <Route
                        path="app/dashboard"
                        element={
                          <DashboardView
                            setActiveTab={() => {}}
                            serviceOrders={orders}
                            revisions={revisions}
                            onOpenNewOS={() => setIsNewOSOpen(true)}
                          />
                        }
                      />

                      {/* Gestão de Usuários da Org (Fase 18) */}
                      <Route path="app/usuarios" element={<UsersListView />} />

                      {/* Equipamentos */}
                      <Route path="equipamentos" element={<EquipamentosView />} />
                      <Route path="equipamentos/novo" element={<CadastroEquipamentoView />} />
                      <Route path="equipamentos/:equipmentId/editar" element={<CadastroEquipamentoView />} />
                      <Route path="equipamentos/:id/editar" element={<CadastroEquipamentoView />} />
                      <Route path={ROUTES.EQUIPAMENTO_DETALHE} element={<EquipmentDetailView />} />
                      <Route path={ROUTES.EQUIPAMENTO_DETALHE_ABA} element={<EquipmentDetailView />} />
                      <Route path={ROUTES.EQUIPAMENTOS_LEITURAS} element={<EquipmentReadingsView />} />
                      <Route path={ROUTES.EQUIPAMENTO_LEITURAS} element={<EquipmentReadingsView />} />

                      {/* Checklists */}
                      <Route path={ROUTES.CHECKLISTS} element={<ChecklistsView />} />
                      <Route path="checklists/execucoes" element={<ChecklistsView />} />
                      <Route path="checklists/execucoes/:id" element={<ChecklistExecutionView />} />
                      <Route path="checklists/modelos" element={<ChecklistsView />} />
                      <Route path="checklists/modelos/novo" element={<ChecklistTemplateForm />} />
                      <Route path="checklists/modelos/:templateId/editar" element={<ChecklistTemplateForm />} />
                      <Route path="checklists/programacoes" element={<ChecklistsView />} />
                      <Route path="checklists/nao-conformidades" element={<ChecklistsView />} />

                      {/* Manutenções */}
                      <Route path="manutencoes" element={<Navigate to="visao-geral" replace />} />
                      <Route path="manutencoes/visao-geral" element={<MaintenanceOverview />} />
                      <Route path="manutencoes/planos" element={<MaintenancePlansView />} />
                      <Route path="manutencoes/agenda" element={<MaintenanceCalendarView />} />
                      <Route path="manutencoes/historico" element={<MaintenanceHistoryView />} />

                      {/* Ordens de Serviço */}
                      <Route path="ordens-servico" element={<WorkOrdersView />} />
                      <Route path="ordens-servico/nova" element={<WorkOrderOpeningForm />} />
                      <Route path="ordens-servico/:id" element={<WorkOrderDetailView />} />
                      <Route path="ordens-servico/:id/planejamento" element={<WorkOrderDetailView />} />
                      <Route path="ordens-servico/:id/execucao" element={<WorkOrderDetailView />} />
                      <Route path="ordens-servico/:id/liberacao" element={<WorkOrderDetailView />} />
                      <Route path="ordens-servico/:id/encerramento" element={<WorkOrderDetailView />} />

                      {/* Alertas */}
                      <Route path="alertas" element={<CentralAlertas />} />

                      {/* Pneus */}
                      <Route path="pneus" element={<PneusView initialTab="visao_geral" />} />
                      <Route path="pneus/instalados" element={<PneusView initialTab="instalados" />} />
                      <Route path="pneus/inspecoes" element={<PneusView initialTab="inspecoes" />} />
                      <Route path="pneus/inspecoes/nova" element={<TireInspectionForm />} />
                      <Route path="pneus/movimentacoes" element={<PneusView initialTab="movimentacoes" />} />
                      <Route path="pneus/recomendacoes" element={<PneusView initialTab="recomendacoes" />} />
                      <Route path="pneus/historico" element={<PneusView initialTab="historico" />} />
                      <Route path="pneus/novo" element={<CadastroPneuView />} />
                      <Route path="pneus/:id" element={<TireDetailView />} />
                      <Route path="pneus/:id/editar" element={<CadastroPneuView />} />

                      {/* Ferramentas */}
                      <Route path="ferramentas" element={<FerramentasView initialTab="visao_geral" />} />
                      <Route path="ferramentas/itens" element={<FerramentasView initialTab="itens" />} />
                      <Route path="ferramentas/nova" element={<CadastroFerramentaView />} />
                      <Route path="ferramentas/:id" element={<ToolDetailView />} />
                      <Route path="ferramentas/:id/editar" element={<CadastroFerramentaView />} />
                      <Route path="ferramentas/emprestimos" element={<FerramentasView initialTab="emprestimos" />} />
                      <Route path="ferramentas/reservas" element={<FerramentasView initialTab="reservas" />} />
                      <Route path="ferramentas/kits" element={<FerramentasView initialTab="kits" />} />
                      <Route path="ferramentas/calibracoes" element={<FerramentasView initialTab="calibracoes" />} />
                      <Route path="ferramentas/manutencoes" element={<FerramentasView initialTab="manutencoes" />} />
                      <Route path="ferramentas/historico" element={<FerramentasView initialTab="historico" />} />

                      {/* Peças e Insumos */}
                      <Route path="pecas-insumos" element={<PecasInsumosView initialTab="visao_geral" />} />
                      <Route path="pecas-insumos/itens" element={<PecasInsumosView initialTab="itens" />} />
                      <Route path="pecas-insumos/novo" element={<CadastroPecaInsumoView />} />
                      <Route path="pecas-insumos/:id" element={<StockItemDetailView />} />
                      <Route path="pecas-insumos/:id/editar" element={<CadastroPecaInsumoView />} />
                      <Route path="pecas-insumos/movimentacoes" element={<PecasInsumosView initialTab="movimentacoes" />} />
                      <Route path="pecas-insumos/movimentacoes/nova" element={<PecasInsumosView initialTab="movimentacoes" />} />
                      <Route path="pecas-insumos/reservas" element={<PecasInsumosView initialTab="reservas" />} />
                      <Route path="pecas-insumos/inventarios" element={<PecasInsumosView initialTab="inventarios" />} />
                      <Route path="pecas-insumos/lotes" element={<PecasInsumosView initialTab="lotes" />} />
                      <Route path="pecas-insumos/historico" element={<PecasInsumosView initialTab="historico" />} />

                      {/* Relatórios */}
                      <Route path="relatorios" element={<RelatoriosView initialTab="visao_geral" />} />
                      <Route path="relatorios/equipamentos" element={<RelatoriosView initialTab="equipamentos" />} />
                      <Route path="relatorios/leituras" element={<RelatoriosView initialTab="leituras" />} />
                      <Route path="relatorios/manutencoes" element={<RelatoriosView initialTab="manutencoes" />} />
                      <Route path="relatorios/ordens-servico" element={<RelatoriosView initialTab="ordens-servico" />} />
                      <Route path="relatorios/checklists" element={<RelatoriosView initialTab="checklists" />} />
                      <Route path="relatorios/nao-conformidades" element={<RelatoriosView initialTab="checklists" />} />
                      <Route path="relatorios/falhas" element={<RelatoriosView initialTab="falhas" />} />
                      <Route path="relatorios/pneus" element={<RelatoriosView initialTab="pneus" />} />
                      <Route path="relatorios/ferramentas" element={<RelatoriosView initialTab="ferramentas" />} />
                      <Route path="relatorios/pecas-estoque" element={<RelatoriosView initialTab="pecas-estoque" />} />
                      <Route path="relatorios/custos" element={<RelatoriosView initialTab="custos" />} />
                      <Route path="relatorios/indicadores" element={<RelatoriosView initialTab="indicadores" />} />
                      <Route path="relatorios/favoritos" element={<RelatoriosView initialTab="visao_geral" />} />
                      <Route path="relatorios/exportacoes" element={<RelatoriosView initialTab="exportacoes" />} />

                      {/* Cadastros Auxiliares */}
                      <Route path="cadastros" element={<CadastrosView />} />
                      <Route path="cadastros/empresas" element={<MasterDataRouteHandler type="empresas" />} />
                      <Route path="cadastros/unidades" element={<MasterDataRouteHandler type="unidades" />} />
                      <Route path="cadastros/fazendas" element={<MasterDataRouteHandler type="fazendas" />} />
                      <Route path="cadastros/setores" element={<MasterDataRouteHandler type="setores" />} />
                      <Route path="cadastros/localizacoes" element={<MasterDataRouteHandler type="localizacoes" />} />
                      <Route path="cadastros/centros-custo" element={<MasterDataRouteHandler type="centros_custo" />} />
                      <Route path="cadastros/oficinas" element={<MasterDataRouteHandler type="oficinas" />} />
                      <Route path="cadastros/almoxarifados" element={<MasterDataRouteHandler type="almoxarifados" />} />
                      <Route path="cadastros/equipes" element={<MasterDataRouteHandler type="equipes" />} />
                      <Route path="cadastros/tipos-equipamento" element={<MasterDataRouteHandler type="tipos_equipamento" />} />
                      <Route path="cadastros/categorias-equipamento" element={<MasterDataRouteHandler type="categorias_equipamento" />} />
                      <Route path="cadastros/subcategorias-equipamento" element={<MasterDataRouteHandler type="subcategorias_equipamento" />} />
                      <Route path="cadastros/marcas" element={<MasterDataRouteHandler type="marcas" />} />
                      <Route path="cadastros/modelos" element={<MasterDataRouteHandler type="modelos" />} />
                      <Route path="cadastros/combustiveis" element={<MasterDataRouteHandler type="combustiveis" />} />
                      <Route path="cadastros/formas-propriedade" element={<MasterDataRouteHandler type="formas_propriedade" />} />
                      <Route path="cadastros/sistemas" element={<MasterDataRouteHandler type="sistemas" />} />
                      <Route path="cadastros/subsistemas" element={<MasterDataRouteHandler type="subsistemas" />} />
                      <Route path="cadastros/componentes" element={<MasterDataRouteHandler type="componentes" />} />
                      <Route path="cadastros/tipos-falha" element={<MasterDataRouteHandler type="tipos_falha" />} />
                      <Route path="cadastros/sintomas" element={<MasterDataRouteHandler type="sintomas" />} />
                      <Route path="cadastros/causas" element={<MasterDataRouteHandler type="causas" />} />
                      <Route path="cadastros/tipos-manutencao" element={<MasterDataRouteHandler type="tipos_manutencao" />} />
                      <Route path="cadastros/prioridades" element={<MasterDataRouteHandler type="prioridades" />} />
                      <Route path="cadastros/motivos-pausa" element={<MasterDataRouteHandler type="motivos_pausa" />} />
                      <Route path="cadastros/motivos-cancelamento" element={<MasterDataRouteHandler type="motivos_cancelamento" />} />
                      <Route path="cadastros/motivos-adiamento" element={<MasterDataRouteHandler type="motivos_adiamento" />} />
                      <Route path="cadastros/fornecedores" element={<MasterDataRouteHandler type="fornecedores" />} />
                      <Route path="cadastros/categorias-pecas" element={<MasterDataRouteHandler type="categorias_pecas" />} />
                      <Route path="cadastros/categorias-ferramentas" element={<MasterDataRouteHandler type="categorias_ferramentas" />} />
                      <Route path="cadastros/unidades-medida" element={<MasterDataRouteHandler type="unidades_medida" />} />
                      <Route path="cadastros/tipos-documento" element={<MasterDataRouteHandler type="tipos_documento" />} />
                      <Route path="cadastros/tipos-servico" element={<MasterDataRouteHandler type="tipos_servico" />} />
                      <Route path="cadastros/especialidades" element={<MasterDataRouteHandler type="especialidades" />} />

                      {/* Configurações Globais */}
                      <Route path="app/configuracoes" element={<ConfiguracoesView initialTab="visao_geral" />} />

                      {/* Fallback de redirecionamento interno */}
                      <Route path="*" element={<Navigate to="app/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>

              {/* Modais globais */}
              <NovaOrdemServicoModal
                isOpen={isNewOSOpen}
                onClose={() => setIsNewOSOpen(false)}
                onAddOS={handleAddOS}
              />

              <CommandPaletteModal
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                setActiveTab={() => {}}
                onOpenNewOS={() => setIsNewOSOpen(true)}
              />
            </div>
          )
        }
      />
    </Routes>
  );
}

export default App;
