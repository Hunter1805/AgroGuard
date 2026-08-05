import type { MasterDataCategoryCard } from '../types/master-data';
import { ROUTES } from '../types/routes';

export const MASTER_DATA_CARDS: MasterDataCategoryCard[] = [
  // Grupo Organização
  { id: 'emp', code: 'EMPRESAS', title: 'Empresas', description: 'Razão social, CNPJ, inscrições estaduais e responsáveis.', group: 'organizacao', route: ROUTES.CADASTROS_EMPRESAS, iconName: 'Building2', totalCount: 1, activeCount: 1 },
  { id: 'und', code: 'UNIDADES', title: 'Unidades', description: 'Matriz, filiais, centros de distribuição e bases agrícolas.', group: 'organizacao', route: ROUTES.CADASTROS_UNIDADES, iconName: 'Building', totalCount: 2, activeCount: 2 },
  { id: 'fzm', code: 'FAZENDAS', title: 'Fazendas', description: 'Propriedades rurais, áreas em hectares e produtores.', group: 'organizacao', route: ROUTES.CADASTROS_FAZENDAS, iconName: 'Trees', totalCount: 1, activeCount: 1 },
  { id: 'sec', code: 'SETORES', title: 'Setores', description: 'Divisões operacionais de preparo, plantio e colheita.', group: 'organizacao', route: ROUTES.CADASTROS_SETORES, iconName: 'Layers', totalCount: 1, activeCount: 1 },
  { id: 'loc', code: 'LOCALIZACOES', title: 'Localizações', description: 'Hierarquia de pátios, oficinas, galpões e armários.', group: 'organizacao', route: ROUTES.CADASTROS_LOCALIZACOES, iconName: 'MapPin', totalCount: 2, activeCount: 2 },
  { id: 'cc', code: 'CENTROS_COSTO', title: 'Centros de Custo', description: 'Contas gerenciais para apropriação de despesas.', group: 'organizacao', route: ROUTES.CADASTROS_CENTROS_COSTO, iconName: 'Wallet', totalCount: 1, activeCount: 1 },
  { id: 'ofc', code: 'OFICINAS', title: 'Oficinas', description: 'Oficinas internas, móveis e unidades terceirizadas.', group: 'organizacao', route: ROUTES.CADASTROS_OFICINAS, iconName: 'Wrench', totalCount: 1, activeCount: 1 },
  { id: 'alm', code: 'ALMOXARIFADOS', title: 'Almoxarifados', description: 'Depósitos de peças, insumos e ferramentas.', group: 'organizacao', route: ROUTES.CADASTROS_ALMOXARIFADOS, iconName: 'Warehouse', totalCount: 1, activeCount: 1 },
  { id: 'eqp', code: 'EQUIPES', title: 'Equipes', description: 'Equipes técnicas de mecânica, elétrica e operação.', group: 'organizacao', route: ROUTES.CADASTROS_EQUIPES, iconName: 'Users', totalCount: 1, activeCount: 1 },

  // Grupo Equipamentos
  { id: 'te', code: 'TIPOS_EQUIPAMENTO', title: 'Tipos de Equipamento', description: 'Tratores, colhedoras, caminhões e implementos.', group: 'equipamentos', route: ROUTES.CADASTROS_TIPOS_EQUIPAMENTO, iconName: 'Tractor', totalCount: 3, activeCount: 3 },
  { id: 'cat', code: 'CATEGORIAS_EQUIPAMENTO', title: 'Categorias', description: 'Classificação por porte e aplicação operacional.', group: 'equipamentos', route: ROUTES.CADASTROS_CATEGORIAS_EQUIPAMENTO, iconName: 'Tag', totalCount: 1, activeCount: 1 },
  { id: 'sub', code: 'SUBCATEGORIAS_EQUIPAMENTO', title: 'Subcategorias', description: 'Divisões específicas das categorias.', group: 'equipamentos', route: ROUTES.CADASTROS_SUBCATEGORIAS_EQUIPAMENTO, iconName: 'Tags', totalCount: 1, activeCount: 1 },
  { id: 'mar', code: 'MARCAS', title: 'Marcas', description: 'Fabricantes e marcas de frotas e insumos.', group: 'equipamentos', route: ROUTES.CADASTROS_MARCAS, iconName: 'Bookmark', totalCount: 3, activeCount: 3 },
  { id: 'mod', code: 'MODELOS', title: 'Modelos', description: 'Modelos com combustíveis e medidores sugeridos.', group: 'equipamentos', route: ROUTES.CADASTROS_MODELOS, iconName: 'Cpu', totalCount: 2, activeCount: 2 },
  { id: 'comb', code: 'COMBUSTIVEIS', title: 'Combustíveis', description: 'Diesel S10, gasolina, etanol e energia elétrica.', group: 'equipamentos', route: ROUTES.CADASTROS_COMBUSTIVEIS, iconName: 'Fuel', totalCount: 2, activeCount: 2 },
  { id: 'prop', code: 'FORMAS_PROPRIEDADE', title: 'Formas de Propriedade', description: 'Próprio, alugado, arrendado e comodato.', group: 'equipamentos', route: ROUTES.CADASTROS_FORMAS_PROPRIEDADE, iconName: 'Key', totalCount: 2, activeCount: 2 },

  // Grupo Manutenção
  { id: 'sis', code: 'SISTEMAS', title: 'Sistemas Técnicos', description: 'Motor, transmissão, hidráulico e elétrico.', group: 'manutencao', route: ROUTES.CADASTROS_SISTEMAS, iconName: 'Settings', totalCount: 4, activeCount: 4 },
  { id: 'subsis', code: 'SUBSISTEMAS', title: 'Subsistemas', description: 'Lubrificação, arrefecimento e freios.', group: 'manutencao', route: ROUTES.CADASTROS_SUBSISTEMAS, iconName: 'Sliders', totalCount: 2, activeCount: 2 },
  { id: 'comp', code: 'COMPONENTES', title: 'Componentes', description: 'Bombas, filtros, válvulas e sensores.', group: 'manutencao', route: ROUTES.CADASTROS_COMPONENTES, iconName: 'Box', totalCount: 2, activeCount: 2 },
  { id: 'tf', code: 'TIPOS_FALHA', title: 'Tipos de Falha', description: 'Mecânica, vazamento, elétrica e desgaste.', group: 'manutencao', route: ROUTES.CADASTROS_TIPOS_FALHA, iconName: 'AlertTriangle', totalCount: 2, activeCount: 2 },
  { id: 'sim', code: 'SINTOMAS', title: 'Sintomas', description: 'Sinais visíveis e ruídos que indicam falha.', group: 'manutencao', route: ROUTES.CADASTROS_SINTOMAS, iconName: 'Activity', totalCount: 1, activeCount: 1 },
  { id: 'cau', code: 'CAUSAS', title: 'Causas', description: 'Desgaste natural, falha de operação e falta de manutenção.', group: 'manutencao', route: ROUTES.CADASTROS_CAUSAS, iconName: 'HelpCircle', totalCount: 1, activeCount: 1 },
  { id: 'tm', code: 'TIPOS_MANUTENCAO', title: 'Tipos de Manutenção', description: 'Preventiva, corretiva, preditiva e inspeção.', group: 'manutencao', route: ROUTES.CADASTROS_TIPOS_MANUTENCAO, iconName: 'Tool', totalCount: 2, activeCount: 2 },
  { id: 'pri', code: 'PRIORIDADES', title: 'Prioridades', description: 'Níveis 1 a 4 com prazos de atendimento.', group: 'manutencao', route: ROUTES.CADASTROS_PRIORIDADES, iconName: 'Flame', totalCount: 4, activeCount: 4 },
  { id: 'mot', code: 'MOTIVOS_OPERACIONAIS', title: 'Motivos Operacionais', description: 'Motivos de pausa, cancelamento e adiamento de OS.', group: 'manutencao', route: ROUTES.CADASTROS_MOTIVOS_PAUSA, iconName: 'PauseCircle', totalCount: 1, activeCount: 1 },

  // Grupo Materiais e Serviços
  { id: 'for', code: 'FORNECEDORES', title: 'Fornecedores', description: 'Cadastro comercial de fornecedores com CNPJ/CPF.', group: 'materiais_servicos', route: ROUTES.CADASTROS_FORNECEDORES, iconName: 'Truck', totalCount: 2, activeCount: 2 },
  { id: 'catpec', code: 'CATEGORIAS_PECAS', title: 'Categorias de Peças', description: 'Filtros, óleos, graxas e componentes mecânicos.', group: 'materiais_servicos', route: ROUTES.CADASTROS_CATEGORIAS_PECAS, iconName: 'Package', totalCount: 2, activeCount: 2 },
  { id: 'catferr', code: 'CATEGORIAS_FERRAMENTAS', title: 'Categorias de Ferramentas', description: 'Ferramentas manuais, elétricas e medição.', group: 'materiais_servicos', route: ROUTES.CADASTROS_CATEGORIAS_FERRAMENTAS, iconName: 'Hammer', totalCount: 2, activeCount: 2 },
  { id: 'um', code: 'UNIDADES_MEDIDA', title: 'Unidades de Medida', description: 'Unidades, litros, quilos, horas e bar.', group: 'materiais_servicos', route: ROUTES.CADASTROS_UNIDADES_MEDIDA, iconName: 'Ruler', totalCount: 5, activeCount: 5 },
  { id: 'doc', code: 'TIPOS_DOCUMENTO', title: 'Tipos de Documento', description: 'Notas fiscais, laudos e certificados.', group: 'materiais_servicos', route: ROUTES.CADASTROS_TIPOS_DOCUMENTO, iconName: 'FileText', totalCount: 2, activeCount: 2 },
];

export const masterDataService = {
  async getCategoryCards(): Promise<MasterDataCategoryCard[]> {
    return MASTER_DATA_CARDS;
  },

  async getOverviewStats() {
    const totalCategories = MASTER_DATA_CARDS.length;
    const totalActiveRecords = MASTER_DATA_CARDS.reduce((acc, c) => acc + c.activeCount, 0);

    return {
      totalCategories,
      totalActiveRecords,
      activeSuppliersCount: 2,
      registeredLocationsCount: 2,
      equipmentModelsCount: 2,
      maintenanceSystemsCount: 4,
    };
  },

  async searchMasterData(query: string) {
    if (!query) return [];
    const q = query.toLowerCase();
    return MASTER_DATA_CARDS.filter(
      c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  },
};
