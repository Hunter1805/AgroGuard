import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { ROUTES } from './types/routes';
import type { ServiceOrder } from './types';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Módulos existentes
import { DashboardView } from './components/DashboardView';
import { EquipamentosView } from './components/EquipamentosView';
import { CadastroEquipamentoView } from './components/equipment/CadastroEquipamentoView';
import { EquipmentDetailView } from './components/equipment/detail/EquipmentDetailView';
import { EquipmentReadingsView } from './components/equipment/readings/EquipmentReadingsView';
import { MaintenanceOverview } from './components/maintenance/MaintenanceOverview';
// Módulo Profissional de Relatórios e Indicadores (Fase 10)
import { RelatoriosView } from './components/reports/RelatoriosView';

// Novo Módulo Profissional de Checklists (Fase 4)
import { ChecklistsView } from './components/checklists/ChecklistsView';
import { ChecklistExecutionView } from './components/checklists/executions/ChecklistExecutionView';
import { ChecklistTemplateForm } from './components/checklists/templates/ChecklistTemplateForm';

// Módulo Profissional de Ordens de Serviço (Fase 6)
import { WorkOrdersView } from './components/orders/WorkOrdersView';
import { WorkOrderOpeningForm } from './components/orders/form/WorkOrderOpeningForm';
import { WorkOrderDetailView } from './components/orders/detail/WorkOrderDetailView';

// Módulo Profissional de Pneus (Fase 7)
import { CentralAlertas } from './components/alerts/CentralAlertas';
import { PneusView } from './components/tires/PneusView';
import { CadastroPneuView } from './components/tires/CadastroPneuView';
import { TireDetailView } from './components/tires/detail/TireDetailView';
import { TireInspectionForm } from './components/tires/inspecoes/TireInspectionForm';

// Módulo Profissional de Ferramentas (Fase 8)
import { FerramentasView } from './components/tools/FerramentasView';
import { CadastroFerramentaView } from './components/tools/CadastroFerramentaView';
import { ToolDetailView } from './components/tools/detail/ToolDetailView';

// Módulo Profissional de Peças e Insumos (Fase 9)
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



// ─── App ─────────────────────────────────────────────────────────────────────

export function App() {
  const [isNewOSOpen, setIsNewOSOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { orders, addOrder } = useOrders();
  const { revisions } = useMaintenance();

  const handleAddOS = async (newOS: ServiceOrder) => {
    const created = await addOrder(newOS);
    setToastMessage(`Ordem de Serviço ${created.id} criada com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden bg-pattern">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-surface-container-highest border border-primary/40 text-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={20} />
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        onOpenNewOS={() => setIsNewOSOpen(true)}
        pendingAlerts={3}
      />

      {/* Área principal */}
      <main className="flex-1 md:ml-sidebar-width flex flex-col h-screen overflow-hidden">
        <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Roteamento */}
        <Routes>
          {/* Dashboard */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <DashboardView
                setActiveTab={() => {}}
                serviceOrders={orders}
                revisions={revisions}
              />
            }
          />

          {/* Equipamentos */}
          <Route path={ROUTES.EQUIPAMENTOS} element={<EquipamentosView />} />
          <Route path="/equipamentos/novo" element={<CadastroEquipamentoView />} />
          <Route path="/equipamentos/:equipmentId/editar" element={<CadastroEquipamentoView />} />
          <Route path="/equipamentos/:id/editar" element={<CadastroEquipamentoView />} />
          
          {/* Ficha Detalhada (Fase 3C) */}
          <Route path={ROUTES.EQUIPAMENTO_DETALHE} element={<EquipmentDetailView />} />
          <Route path={ROUTES.EQUIPAMENTO_DETALHE_ABA} element={<EquipmentDetailView />} />

          {/* Leituras Avançadas (Fase 3D) */}
          <Route path={ROUTES.EQUIPAMENTOS_LEITURAS} element={<EquipmentReadingsView />} />
          <Route path={ROUTES.EQUIPAMENTO_LEITURAS} element={<EquipmentReadingsView />} />

          {/* Checklists (Fase 4 — Módulo Completo de Checklists) */}
          <Route path={ROUTES.CHECKLISTS} element={<ChecklistsView />} />
          <Route path="/checklists/execucoes" element={<ChecklistsView />} />
          <Route path="/checklists/execucoes/:id" element={<ChecklistExecutionView />} />
          <Route path="/checklists/modelos" element={<ChecklistsView />} />
          <Route path="/checklists/modelos/novo" element={<ChecklistTemplateForm />} />
          <Route path="/checklists/modelos/:templateId/editar" element={<ChecklistTemplateForm />} />
          <Route path="/checklists/programacoes" element={<ChecklistsView />} />
          <Route path="/checklists/nao-conformidades" element={<ChecklistsView />} />

          {/* Manutenções — Fase 5 (Módulo Profissional de Preventivas) */}
          <Route path={ROUTES.MANUTENCOES} element={<MaintenanceOverview initialTab="visao_geral" />} />
          <Route path={ROUTES.MANUTENCOES_PLANOS} element={<MaintenanceOverview initialTab="planos" />} />
          <Route path={ROUTES.MANUTENCOES_AGENDA} element={<MaintenanceOverview initialTab="agenda" />} />
          <Route path={ROUTES.MANUTENCOES_HISTORICO} element={<MaintenanceOverview initialTab="historico" />} />
          <Route path="/manutencoes/vinculos" element={<MaintenanceOverview initialTab="planos" />} />

          {/* Ordens de Serviço (Fase 6) */}
          <Route path={ROUTES.ORDENS_SERVICO} element={<WorkOrdersView />} />
          <Route path={ROUTES.ORDEM_NOVA} element={<WorkOrderOpeningForm />} />
          <Route path={ROUTES.ORDEM_DETALHE} element={<WorkOrderDetailView />} />
          {/* As demais rotas (editar, planejamento, execucao) podem redirecionar para a view de Detalhes ou abrir modais */}
          <Route path={ROUTES.ORDEM_PLANEJAMENTO} element={<WorkOrderDetailView />} />
          <Route path={ROUTES.ORDEM_EXECUCAO} element={<WorkOrderDetailView />} />
          <Route path={ROUTES.ORDEM_LIBERACAO} element={<WorkOrderDetailView />} />
          <Route path={ROUTES.ORDEM_ENCERRAMENTO} element={<WorkOrderDetailView />} />

          {/* Central de Alertas */}
          <Route path={ROUTES.ALERTAS} element={<CentralAlertas />} />

          {/* Pneus (Fase 7 — Módulo Autônomo e Profissional de Pneus) */}
          <Route path={ROUTES.PNEUS} element={<PneusView initialTab="visao_geral" />} />
          <Route path={ROUTES.PNEUS_INSTALADOS} element={<PneusView initialTab="instalados" />} />
          <Route path={ROUTES.PNEUS_INSPECOES} element={<PneusView initialTab="inspecoes" />} />
          <Route path={ROUTES.PNEUS_INSPECAO_NOVA} element={<TireInspectionForm />} />
          <Route path={ROUTES.PNEUS_MOVIMENTACOES} element={<PneusView initialTab="movimentacoes" />} />
          <Route path={ROUTES.PNEUS_RECOMENDACOES} element={<PneusView initialTab="recomendacoes" />} />
          <Route path={ROUTES.PNEUS_HISTORICO} element={<PneusView initialTab="historico" />} />
          <Route path={ROUTES.PNEUS_NOVO} element={<CadastroPneuView />} />
          <Route path={ROUTES.PNEU_DETALHE} element={<TireDetailView />} />
          <Route path={ROUTES.PNEU_EDITAR} element={<CadastroPneuView />} />

          {/* Ferramentas (Fase 8 — Módulo Autônomo e Profissional de Ferramentas) */}
          <Route path={ROUTES.FERRAMENTAS} element={<FerramentasView initialTab="visao_geral" />} />
          <Route path={ROUTES.FERRAMENTAS_ITENS} element={<FerramentasView initialTab="itens" />} />
          <Route path={ROUTES.FERRAMENTAS_NOVA} element={<CadastroFerramentaView />} />
          <Route path={ROUTES.FERRAMENTA_DETALHE} element={<ToolDetailView />} />
          <Route path={ROUTES.FERRAMENTA_EDITAR} element={<CadastroFerramentaView />} />
          <Route path={ROUTES.FERRAMENTAS_EMPRESTIMOS} element={<FerramentasView initialTab="emprestimos" />} />
          <Route path={ROUTES.FERRAMENTAS_RESERVAS} element={<FerramentasView initialTab="reservas" />} />
          <Route path={ROUTES.FERRAMENTAS_KITS} element={<FerramentasView initialTab="kits" />} />
          <Route path={ROUTES.FERRAMENTAS_CALIBRACOES} element={<FerramentasView initialTab="calibracoes" />} />
          <Route path={ROUTES.FERRAMENTAS_MANUTENCOES} element={<FerramentasView initialTab="manutencoes" />} />
          <Route path={ROUTES.FERRAMENTAS_HISTORICO} element={<FerramentasView initialTab="historico" />} />

          {/* Peças e Insumos (Fase 9 — Módulo Autônomo e Profissional) */}
          <Route path={ROUTES.PECAS_INSUMOS} element={<PecasInsumosView initialTab="visao_geral" />} />
          <Route path={ROUTES.PECAS_INSUMOS_ITENS} element={<PecasInsumosView initialTab="itens" />} />
          <Route path={ROUTES.PECAS_INSUMOS_NOVO} element={<CadastroPecaInsumoView />} />
          <Route path={ROUTES.PECAS_INSUMO_DETALHE} element={<StockItemDetailView />} />
          <Route path={ROUTES.PECAS_INSUMO_EDITAR} element={<CadastroPecaInsumoView />} />
          <Route path={ROUTES.PECAS_INSUMOS_MOVIMENTACOES} element={<PecasInsumosView initialTab="movimentacoes" />} />
          <Route path={ROUTES.PECAS_INSUMOS_MOVIMENTACAO_NOVA} element={<PecasInsumosView initialTab="movimentacoes" />} />
          <Route path={ROUTES.PECAS_INSUMOS_RESERVAS} element={<PecasInsumosView initialTab="reservas" />} />
          <Route path={ROUTES.PECAS_INSUMOS_INVENTARIOS} element={<PecasInsumosView initialTab="inventarios" />} />
          <Route path={ROUTES.PECAS_INSUMOS_LOTES} element={<PecasInsumosView initialTab="lotes" />} />
          <Route path={ROUTES.PECAS_INSUMOS_HISTORICO} element={<PecasInsumosView initialTab="historico" />} />

          {/* Relatórios (Fase 10 — Módulo Autônomo e Profissional de Relatórios e Indicadores) */}
          <Route path={ROUTES.RELATORIOS} element={<RelatoriosView initialTab="visao_geral" />} />
          <Route path={ROUTES.RELATORIOS_EQUIPAMENTOS} element={<RelatoriosView initialTab="equipamentos" />} />
          <Route path={ROUTES.RELATORIOS_LEITURAS} element={<RelatoriosView initialTab="leituras" />} />
          <Route path={ROUTES.RELATORIOS_MANUTENCOES} element={<RelatoriosView initialTab="manutencoes" />} />
          <Route path={ROUTES.RELATORIOS_ORDENS_SERVICO} element={<RelatoriosView initialTab="ordens-servico" />} />
          <Route path={ROUTES.RELATORIOS_CHECKLISTS} element={<RelatoriosView initialTab="checklists" />} />
          <Route path={ROUTES.RELATORIOS_NAO_CONFORMIDADES} element={<RelatoriosView initialTab="checklists" />} />
          <Route path={ROUTES.RELATORIOS_FALHAS} element={<RelatoriosView initialTab="falhas" />} />
          <Route path={ROUTES.RELATORIOS_PNEUS} element={<RelatoriosView initialTab="pneus" />} />
          <Route path={ROUTES.RELATORIOS_FERRAMENTAS} element={<RelatoriosView initialTab="ferramentas" />} />
          <Route path={ROUTES.RELATORIOS_PECAS_ESTOQUE} element={<RelatoriosView initialTab="pecas-estoque" />} />
          <Route path={ROUTES.RELATORIOS_CUSTOS} element={<RelatoriosView initialTab="custos" />} />
          <Route path={ROUTES.RELATORIOS_INDICADORES} element={<RelatoriosView initialTab="indicadores" />} />
          <Route path={ROUTES.RELATORIOS_FAVORITOS} element={<RelatoriosView initialTab="visao_geral" />} />
          <Route path={ROUTES.RELATORIOS_EXPORTACOES} element={<RelatoriosView initialTab="exportacoes" />} />

          {/* Cadastros Auxiliares (Fase 11 — Módulo Completo de Master Data) */}
          <Route path={ROUTES.CADASTROS} element={<CadastrosView />} />

          {/* Organização */}
          <Route path={ROUTES.CADASTROS_EMPRESAS} element={<MasterDataRouteHandler type="empresas" />} />
          <Route path={ROUTES.CADASTROS_UNIDADES} element={<MasterDataRouteHandler type="unidades" />} />
          <Route path={ROUTES.CADASTROS_FAZENDAS} element={<MasterDataRouteHandler type="fazendas" />} />
          <Route path={ROUTES.CADASTROS_SETORES} element={<MasterDataRouteHandler type="setores" />} />
          <Route path={ROUTES.CADASTROS_LOCALIZACOES} element={<MasterDataRouteHandler type="localizacoes" />} />
          <Route path={ROUTES.CADASTROS_CENTROS_COSTO} element={<MasterDataRouteHandler type="centros_custo" />} />
          <Route path={ROUTES.CADASTROS_OFICINAS} element={<MasterDataRouteHandler type="oficinas" />} />
          <Route path={ROUTES.CADASTROS_ALMOXARIFADOS} element={<MasterDataRouteHandler type="almoxarifados" />} />
          <Route path={ROUTES.CADASTROS_EQUIPES} element={<MasterDataRouteHandler type="equipes" />} />

          {/* Equipamentos */}
          <Route path={ROUTES.CADASTROS_TIPOS_EQUIPAMENTO} element={<MasterDataRouteHandler type="tipos_equipamento" />} />
          <Route path={ROUTES.CADASTROS_CATEGORIAS_EQUIPAMENTO} element={<MasterDataRouteHandler type="categorias_equipamento" />} />
          <Route path={ROUTES.CADASTROS_SUBCATEGORIAS_EQUIPAMENTO} element={<MasterDataRouteHandler type="subcategorias_equipamento" />} />
          <Route path={ROUTES.CADASTROS_MARCAS} element={<MasterDataRouteHandler type="marcas" />} />
          <Route path={ROUTES.CADASTROS_MODELOS} element={<MasterDataRouteHandler type="modelos" />} />
          <Route path={ROUTES.CADASTROS_COMBUSTIVEIS} element={<MasterDataRouteHandler type="combustiveis" />} />
          <Route path={ROUTES.CADASTROS_FORMAS_PROPRIEDADE} element={<MasterDataRouteHandler type="formas_propriedade" />} />

          {/* Manutenção */}
          <Route path={ROUTES.CADASTROS_SISTEMAS} element={<MasterDataRouteHandler type="sistemas" />} />
          <Route path={ROUTES.CADASTROS_SUBSISTEMAS} element={<MasterDataRouteHandler type="subsistemas" />} />
          <Route path={ROUTES.CADASTROS_COMPONENTES} element={<MasterDataRouteHandler type="componentes" />} />
          <Route path={ROUTES.CADASTROS_TIPOS_FALHA} element={<MasterDataRouteHandler type="tipos_falha" />} />
          <Route path={ROUTES.CADASTROS_SINTOMAS} element={<MasterDataRouteHandler type="sintomas" />} />
          <Route path={ROUTES.CADASTROS_CAUSAS} element={<MasterDataRouteHandler type="causas" />} />
          <Route path={ROUTES.CADASTROS_TIPOS_MANUTENCAO} element={<MasterDataRouteHandler type="tipos_manutencao" />} />
          <Route path={ROUTES.CADASTROS_PRIORIDADES} element={<MasterDataRouteHandler type="prioridades" />} />
          <Route path={ROUTES.CADASTROS_MOTIVOS_PAUSA} element={<MasterDataRouteHandler type="motivos_pausa" />} />
          <Route path={ROUTES.CADASTROS_MOTIVOS_CANCELAMENTO} element={<MasterDataRouteHandler type="motivos_cancelamento" />} />
          <Route path={ROUTES.CADASTROS_MOTIVOS_ADIAMENTO} element={<MasterDataRouteHandler type="motivos_adiamento" />} />

          {/* Materiais e Serviços */}
          <Route path={ROUTES.CADASTROS_FORNECEDORES} element={<MasterDataRouteHandler type="fornecedores" />} />
          <Route path={ROUTES.CADASTROS_CATEGORIAS_PECAS} element={<MasterDataRouteHandler type="categorias_pecas" />} />
          <Route path={ROUTES.CADASTROS_CATEGORIAS_FERRAMENTAS} element={<MasterDataRouteHandler type="categorias_ferramentas" />} />
          <Route path={ROUTES.CADASTROS_UNIDADES_MEDIDA} element={<MasterDataRouteHandler type="unidades_medida" />} />
          <Route path={ROUTES.CADASTROS_TIPOS_DOCUMENTO} element={<MasterDataRouteHandler type="tipos_documento" />} />
          <Route path={ROUTES.CADASTROS_TIPOS_SERVICO} element={<MasterDataRouteHandler type="tipos_servico" />} />
          <Route path={ROUTES.CADASTROS_ESPECIALIDADES} element={<MasterDataRouteHandler type="especialidades" />} />

          {/* Usuários e Configurações Globais (Fase 12) */}
          <Route path={ROUTES.USUARIOS} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES} element={<ConfiguracoesView initialTab="visao_geral" />} />
          <Route path={ROUTES.CONFIGURACOES_USUARIOS} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_USUARIO_NOVO} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_USUARIO_DETALHE} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_USUARIO_EDITAR} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_PERFIS} element={<ConfiguracoesView initialTab="perfis" />} />
          <Route path={ROUTES.CONFIGURACOES_PERFIL_NOVO} element={<ConfiguracoesView initialTab="perfis" />} />
          <Route path={ROUTES.CONFIGURACOES_PERFIL_DETALHE} element={<ConfiguracoesView initialTab="perfis" />} />
          <Route path={ROUTES.CONFIGURACOES_PERFIL_EDITAR} element={<ConfiguracoesView initialTab="perfis" />} />
          <Route path={ROUTES.CONFIGURACOES_PERMISSOES} element={<ConfiguracoesView initialTab="perfis" />} />
          <Route path={ROUTES.CONFIGURACOES_ESCOPOS} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_PREFERENCIAS} element={<ConfiguracoesView initialTab="usuarios" />} />
          <Route path={ROUTES.CONFIGURACOES_GERAIS} element={<ConfiguracoesView initialTab="gerais" />} />
          <Route path={ROUTES.CONFIGURACOES_ALERTAS} element={<ConfiguracoesView initialTab="alertas" />} />
          <Route path={ROUTES.CONFIGURACOES_NUMERACOES} element={<ConfiguracoesView initialTab="numeracoes" />} />
          <Route path={ROUTES.CONFIGURACOES_AUDITORIA} element={<ConfiguracoesView initialTab="auditoria" />} />

          {/* Redirect raiz */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </main>

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
  );
}

export default App;
