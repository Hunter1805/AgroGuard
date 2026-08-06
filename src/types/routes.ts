import type { EquipmentDetailTab } from './equipment-detail';

// ─── Rotas do Sistema AgroGuard ──────────────────────────────────────────────
// Centraliza todas as rotas em um único lugar para evitar strings soltas.

export const ROUTES = {
  DASHBOARD: '/',
  EQUIPAMENTOS: '/equipamentos',
  EQUIPAMENTO_NOVO: '/equipamentos/novo',
  EQUIPAMENTO_EDITAR: '/equipamentos/:equipmentId/editar',
  EQUIPAMENTO_DETALHE: '/equipamentos/:id',
  EQUIPAMENTO_DETALHE_ABA: '/equipamentos/:id/:tab',
  EQUIPAMENTOS_LEITURAS: '/equipamentos/leituras',
  EQUIPAMENTO_LEITURAS: '/equipamentos/:id/leituras',
  LEITURAS_HISTORICO: '/equipamentos/leituras',

  CHECKLISTS: '/checklists',
  CHECKLISTS_EXECUCOES: '/checklists/execucoes',
  CHECKLISTS_EXECUCAO_NOVA: '/checklists/execucoes/nova',
  CHECKLISTS_EXECUCAO: '/checklists/execucoes/:id',
  CHECKLISTS_MODELOS: '/checklists/modelos',
  CHECKLISTS_MODELO_NOVO: '/checklists/modelos/novo',
  CHECKLISTS_MODELO_EDITAR: '/checklists/modelos/:templateId/editar',
  CHECKLISTS_PROGRAMACOES: '/checklists/programacoes',
  CHECKLISTS_NAO_CONFORMIDADES: '/checklists/nao-conformidades',

  MANUTENCOES: '/manutencoes',
  MANUTENCOES_VISAO_GERAL: '/manutencoes/visao-geral',
  MANUTENCOES_PLANOS: '/manutencoes/planos',
  MANUTENCOES_PLANO_NOVO: '/manutencoes/planos/novo',
  MANUTENCOES_PLANO_DETALHE: '/manutencoes/planos/:planId',
  MANUTENCOES_PLANO_EDITAR: '/manutencoes/planos/:planId/editar',
  MANUTENCOES_AGENDA: '/manutencoes/agenda',
  MANUTENCOES_HISTORICO: '/manutencoes/historico',
  MANUTENCOES_PROGRAMACAO_DETALHE: '/manutencoes/programacoes/:scheduleId',
  EQUIPAMENTO_MANUTENCOES: '/equipamentos/:equipmentId/manutencoes',
  EQUIPAMENTO_MANUTENCOES_PROGRAMAR: '/equipamentos/:equipmentId/manutencoes/programar',

  ORDENS_SERVICO: '/ordens-servico',
  ORDEM_NOVA: '/ordens-servico/nova',
  ORDEM_DETALHE: '/ordens-servico/:orderId',
  ORDEM_EDITAR: '/ordens-servico/:orderId/editar',
  ORDEM_PLANEJAMENTO: '/ordens-servico/:orderId/planejamento',
  ORDEM_EXECUCAO: '/ordens-servico/:orderId/execucao',
  ORDEM_LIBERACAO: '/ordens-servico/:orderId/liberacao',
  ORDEM_ENCERRAMENTO: '/ordens-servico/:orderId/encerramento',

  ALERTAS: '/alertas',

  PNEUS: '/pneus',
  PNEUS_INSTALADOS: '/pneus/instalados',
  PNEUS_INSPECOES: '/pneus/inspecoes',
  PNEUS_INSPECAO_NOVA: '/pneus/inspecoes/nova',
  PNEUS_INSPECAO_DETALHE: '/pneus/inspecoes/:inspectionId',
  PNEUS_MOVIMENTACOES: '/pneus/movimentacoes',
  PNEUS_RECOMENDACOES: '/pneus/recomendacoes',
  PNEUS_HISTORICO: '/pneus/historico',
  PNEUS_NOVO: '/pneus/novo',
  PNEU_DETALHE: '/pneus/:tireId',
  PNEU_EDITAR: '/pneus/:tireId/editar',
  EQUIPAMENTO_PNEUS: '/equipamentos/:equipmentId/pneus',

  FERRAMENTAS: '/ferramentas',
  FERRAMENTAS_ITENS: '/ferramentas/itens',
  FERRAMENTAS_NOVA: '/ferramentas/nova',
  FERRAMENTA_DETALHE: '/ferramentas/:toolId',
  FERRAMENTA_EDITAR: '/ferramentas/:toolId/editar',
  FERRAMENTAS_EMPRESTIMOS: '/ferramentas/emprestimos',
  FERRAMENTAS_EMPRESTIMO_NOVO: '/ferramentas/emprestimos/novo',
  FERRAMENTAS_EMPRESTIMO_DETALHE: '/ferramentas/emprestimos/:loanId',
  FERRAMENTAS_RESERVAS: '/ferramentas/reservas',
  FERRAMENTAS_KITS: '/ferramentas/kits',
  FERRAMENTAS_KIT_NOVO: '/ferramentas/kits/novo',
  FERRAMENTAS_KIT_DETALHE: '/ferramentas/kits/:kitId',
  FERRAMENTAS_KIT_EDITAR: '/ferramentas/kits/:kitId/editar',
  FERRAMENTAS_CALIBRACOES: '/ferramentas/calibracoes',
  FERRAMENTAS_MANUTENCOES: '/ferramentas/manutencoes',
  FERRAMENTAS_HISTORICO: '/ferramentas/historico',

  PECAS_INSUMOS: '/pecas-insumos',
  PECAS_INSUMOS_ITENS: '/pecas-insumos/itens',
  PECAS_INSUMOS_NOVO: '/pecas-insumos/novo',
  PECAS_INSUMO_DETALHE: '/pecas-insumos/:itemId',
  PECAS_INSUMO_EDITAR: '/pecas-insumos/:itemId/editar',
  PECAS_INSUMOS_MOVIMENTACOES: '/pecas-insumos/movimentacoes',
  PECAS_INSUMOS_MOVIMENTACAO_NOVA: '/pecas-insumos/movimentacoes/nova',
  PECAS_INSUMOS_RESERVAS: '/pecas-insumos/reservas',
  PECAS_INSUMOS_INVENTARIOS: '/pecas-insumos/inventarios',
  PECAS_INSUMOS_INVENTARIO_NOVO: '/pecas-insumos/inventarios/novo',
  PECAS_INSUMOS_LOTES: '/pecas-insumos/lotes',
  PECAS_INSUMOS_HISTORICO: '/pecas-insumos/historico',

  RELATORIOS: '/relatorios',
  RELATORIOS_EQUIPAMENTOS: '/relatorios/equipamentos',
  RELATORIOS_LEITURAS: '/relatorios/leituras',
  RELATORIOS_MANUTENCOES: '/relatorios/manutencoes',
  RELATORIOS_ORDENS_SERVICO: '/relatorios/ordens-servico',
  RELATORIOS_CHECKLISTS: '/relatorios/checklists',
  RELATORIOS_NAO_CONFORMIDADES: '/relatorios/nao-conformidades',
  RELATORIOS_FALHAS: '/relatorios/falhas',
  RELATORIOS_PNEUS: '/relatorios/pneus',
  RELATORIOS_FERRAMENTAS: '/relatorios/ferramentas',
  RELATORIOS_PECAS_ESTOQUE: '/relatorios/pecas-estoque',
  RELATORIOS_CUSTOS: '/relatorios/custos',
  RELATORIOS_INDICADORES: '/relatorios/indicadores',
  RELATORIOS_FAVORITOS: '/relatorios/favoritos',
  RELATORIOS_EXPORTACOES: '/relatorios/exportacoes',

  CADASTROS: '/cadastros',

  // Organização
  CADASTROS_EMPRESAS: '/cadastros/empresas',
  CADASTROS_UNIDADES: '/cadastros/unidades',
  CADASTROS_FAZENDAS: '/cadastros/fazendas',
  CADASTROS_SETORES: '/cadastros/setores',
  CADASTROS_LOCALIZACOES: '/cadastros/localizacoes',
  CADASTROS_CENTROS_COSTO: '/cadastros/centros-custo',
  CADASTROS_OFICINAS: '/cadastros/oficinas',
  CADASTROS_ALMOXARIFADOS: '/cadastros/almoxarifados',
  CADASTROS_EQUIPES: '/cadastros/equipes',

  // Equipamentos
  CADASTROS_TIPOS_EQUIPAMENTO: '/cadastros/tipos-equipamento',
  CADASTROS_CATEGORIAS_EQUIPAMENTO: '/cadastros/categorias-equipamento',
  CADASTROS_SUBCATEGORIAS_EQUIPAMENTO: '/cadastros/subcategorias-equipamento',
  CADASTROS_MARCAS: '/cadastros/marcas',
  CADASTROS_MODELOS: '/cadastros/modelos',
  CADASTROS_COMBUSTIVEIS: '/cadastros/combustiveis',
  CADASTROS_FORMAS_PROPRIEDADE: '/cadastros/formas-propriedade',

  // Manutenção
  CADASTROS_SISTEMAS: '/cadastros/sistemas',
  CADASTROS_SUBSISTEMAS: '/cadastros/subsistemas',
  CADASTROS_COMPONENTES: '/cadastros/componentes',
  CADASTROS_TIPOS_FALHA: '/cadastros/tipos-falha',
  CADASTROS_SINTOMAS: '/cadastros/sintomas',
  CADASTROS_CAUSAS: '/cadastros/causas',
  CADASTROS_TIPOS_MANUTENCAO: '/cadastros/tipos-manutencao',
  CADASTROS_PRIORIDADES: '/cadastros/prioridades',
  CADASTROS_MOTIVOS_PAUSA: '/cadastros/motivos-pausa',
  CADASTROS_MOTIVOS_CANCELAMENTO: '/cadastros/motivos-cancelamento',
  CADASTROS_MOTIVOS_ADIAMENTO: '/cadastros/motivos-adiamento',

  // Materiais e serviços
  CADASTROS_FORNECEDORES: '/cadastros/fornecedores',
  CADASTROS_CATEGORIAS_PECAS: '/cadastros/categorias-pecas',
  CADASTROS_CATEGORIAS_FERRAMENTAS: '/cadastros/categorias-ferramentas',
  CADASTROS_UNIDADES_MEDIDA: '/cadastros/unidades-medida',
  CADASTROS_TIPOS_DOCUMENTO: '/cadastros/tipos-documento',
  CADASTROS_TIPOS_SERVICO: '/cadastros/tipos-servico',
  CADASTROS_ESPECIALIDADES: '/cadastros/especialidades',

  // Compatibilidade com rotas organizadas
  CADASTROS_EQUIPAMENTOS_TIPOS: '/cadastros/equipamentos/tipos',
  CADASTROS_EQUIPAMENTOS_MARCAS: '/cadastros/equipamentos/marcas',
  CADASTROS_EQUIPAMENTOS_MODELOS: '/cadastros/equipamentos/modelos',
  CADASTROS_EQUIPAMENTOS_COMBUSTIVEIS: '/cadastros/equipamentos/combustiveis',
  CADASTROS_ORG_EMPRESAS: '/cadastros/organizacao/empresas',
  CADASTROS_ORG_UNIDADES: '/cadastros/organizacao/unidades',
  CADASTROS_ORG_FAZENDAS: '/cadastros/organizacao/fazendas',
  CADASTROS_ORG_SETORES: '/cadastros/organizacao/setores',
  CADASTROS_ORG_LOCALIZACOES: '/cadastros/organizacao/localizacoes',
  CADASTROS_MANUTENCAO_SISTEMAS: '/cadastros/manutencao/sistemas',
  CADASTROS_MANUTENCAO_SUBSISTEMAS: '/cadastros/manutencao/subsistemas',
  CADASTROS_MANUTENCAO_FALHAS: '/cadastros/manutencao/tipos-falha',
  CADASTROS_MANUTENCAO_PRIORIDADES: '/cadastros/manutencao/prioridades',
  CADASTROS_ESTOQUE_CATEGORIAS: '/cadastros/estoque/categorias',
  CADASTROS_ESTOQUE_UNIDADES: '/cadastros/estoque/unidades',
  CADASTROS_ESTOQUE_FORNECEDORES: '/cadastros/estoque/fornecedores',
  CADASTROS_ESTOQUE_OFICINAS: '/cadastros/estoque/oficinas',

  USUARIOS: '/usuarios',
  CONFIGURACOES: '/configuracoes',
  CONFIGURACOES_USUARIOS: '/configuracoes/usuarios',
  CONFIGURACOES_USUARIO_NOVO: '/configuracoes/usuarios/novo',
  CONFIGURACOES_USUARIO_DETALHE: '/configuracoes/usuarios/:userId',
  CONFIGURACOES_USUARIO_EDITAR: '/configuracoes/usuarios/:userId/editar',
  CONFIGURACOES_PERFIS: '/configuracoes/perfis',
  CONFIGURACOES_PERFIL_NOVO: '/configuracoes/perfis/novo',
  CONFIGURACOES_PERFIL_DETALHE: '/configuracoes/perfis/:roleId',
  CONFIGURACOES_PERFIL_EDITAR: '/configuracoes/perfis/:roleId/editar',
  CONFIGURACOES_PERMISSOES: '/configuracoes/permissoes',
  CONFIGURACOES_ESCOPOS: '/configuracoes/escopos',
  CONFIGURACOES_PREFERENCIAS: '/configuracoes/preferencias',
  CONFIGURACOES_GERAIS: '/configuracoes/gerais',
  CONFIGURACOES_ALERTAS: '/configuracoes/alertas',
  CONFIGURACOES_NUMERACOES: '/configuracoes/numeracoes',
  CONFIGURACOES_AUDITORIA: '/configuracoes/auditoria',
} as const;

export const ROUTE_HELPERS = {
  equipmentDetail: (id: string) => `/equipamentos/${id}`,
  equipmentDetailTab: (id: string, tab: EquipmentDetailTab) => `/equipamentos/${id}/${tab}`,
  equipmentEdit: (id: string) => `/equipamentos/${id}/editar`,
  equipmentReadings: (id?: string) => (id ? `/equipamentos/${id}/leituras` : '/equipamentos/leituras'),
  equipmentMaintenance: (id: string) => `/equipamentos/${id}/manutencoes`,
  equipmentMaintenanceSchedule: (id: string) => `/equipamentos/${id}/manutencoes/programar`,
  checklistExecution: (id: string) => `/checklists/execucoes/${id}`,
  checklistNewExecution: (equipmentId?: string) => (equipmentId ? `/checklists/execucoes/nova?equipmentId=${equipmentId}` : '/checklists/execucoes/nova'),
  checklistTemplateEdit: (templateId: string) => `/checklists/modelos/${templateId}/editar`,
  maintenancePlanDetail: (planId: string) => `/manutencoes/planos/${planId}`,
  maintenancePlanEdit: (planId: string) => `/manutencoes/planos/${planId}/editar`,
  maintenanceScheduleDetail: (scheduleId: string) => `/manutencoes/programacoes/${scheduleId}`,
  tireDetail: (tireId: string) => `/pneus/${tireId}`,
  tireEdit: (tireId: string) => `/pneus/${tireId}/editar`,
  tireInspectionDetail: (inspectionId: string) => `/pneus/inspecoes/${inspectionId}`,
  equipmentPneus: (equipmentId: string) => `/equipamentos/${equipmentId}/pneus`,
  toolDetail: (toolId: string) => `/ferramentas/${toolId}`,
  toolEdit: (toolId: string) => `/ferramentas/${toolId}/editar`,
  toolLoanDetail: (loanId: string) => `/ferramentas/emprestimos/${loanId}`,
  toolKitDetail: (kitId: string) => `/ferramentas/kits/${kitId}`,
  toolKitEdit: (kitId: string) => `/ferramentas/kits/${kitId}/editar`,
  partDetail: (itemId: string) => `/pecas-insumos/${itemId}`,
  partEdit: (itemId: string) => `/pecas-insumos/${itemId}/editar`,
  partMovementNew: (workOrderId?: string) => (workOrderId ? `/pecas-insumos/movimentacoes/nova?workOrderId=${workOrderId}` : '/pecas-insumos/movimentacoes/nova'),
  partReservations: (workOrderId?: string, maintenanceScheduleId?: string) => {
    if (workOrderId) return `/pecas-insumos/reservas?workOrderId=${workOrderId}`;
    if (maintenanceScheduleId) return `/pecas-insumos/reservas?maintenanceScheduleId=${maintenanceScheduleId}`;
    return '/pecas-insumos/reservas';
  },
  reportEquipment: (equipmentId?: string) => (equipmentId ? `/relatorios/equipamentos?equipmentId=${equipmentId}` : '/relatorios/equipamentos'),
  reportWorkOrder: (equipmentId?: string) => (equipmentId ? `/relatorios/ordens-servico?equipmentId=${equipmentId}` : '/relatorios/ordens-servico'),
  reportCosts: (equipmentId?: string) => (equipmentId ? `/relatorios/custos?equipmentId=${equipmentId}` : '/relatorios/custos'),
  reportMaintenance: (planId?: string) => (planId ? `/relatorios/manutencoes?planId=${planId}` : '/relatorios/manutencoes'),
  userDetail: (id: string) => `/configuracoes/usuarios/${id}`,
  userEdit: (id: string) => `/configuracoes/usuarios/${id}/editar`,
  roleDetail: (id: string) => `/configuracoes/perfis/${id}`,
  roleEdit: (id: string) => `/configuracoes/perfis/${id}/editar`,
};

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export type ActiveTab =
  | 'dashboard'
  | 'equipamentos'
  | 'checklists'
  | 'manutencoes'
  | 'manutencoes-planos'
  | 'manutencoes-agenda'
  | 'manutencoes-historico'
  | 'ordens'
  | 'alertas'
  | 'pneus'
  | 'ferramentas'
  | 'pecas-insumos'
  | 'relatorios'
  | 'cadastros'
  | 'usuarios'
  | 'configuracoes';

export const ACTIVE_TAB_TO_ROUTE: Record<ActiveTab, string> = {
  'dashboard': ROUTES.DASHBOARD,
  'equipamentos': ROUTES.EQUIPAMENTOS,
  'checklists': ROUTES.CHECKLISTS,
  'manutencoes': ROUTES.MANUTENCOES,
  'manutencoes-planos': ROUTES.MANUTENCOES_PLANOS,
  'manutencoes-agenda': ROUTES.MANUTENCOES_AGENDA,
  'manutencoes-historico': ROUTES.MANUTENCOES_HISTORICO,
  'ordens': ROUTES.ORDENS_SERVICO,
  'alertas': ROUTES.ALERTAS,
  'pneus': ROUTES.PNEUS,
  'ferramentas': ROUTES.FERRAMENTAS,
  'pecas-insumos': ROUTES.PECAS_INSUMOS,
  'relatorios': ROUTES.RELATORIOS,
  'cadastros': ROUTES.CADASTROS,
  'usuarios': ROUTES.USUARIOS,
  'configuracoes': ROUTES.CONFIGURACOES,
};
