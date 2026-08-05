import type {
  Company, Unit, Farm, Sector, LocationItem, CostCenter, Workshop, Warehouse, Team
} from '../types/organization-master-data';

let mockCompanies: Company[] = [
  {
    id: 'emp-01',
    code: 'EMP-001',
    name: 'AgroGuard Operações Agrícolas Ltda',
    corporateName: 'AgroGuard Operações Agrícolas Ltda',
    tradeName: 'AgroGuard Agrícola',
    cnpj: '12.345.678/0001-90',
    segment: 'Agronegócio / Grãos e Cana',
    city: 'Ribeirão Preto',
    state: 'SP',
    responsibleName: 'Fernando Costa',
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockUnits: Unit[] = [
  {
    id: 'und-01',
    code: 'UND-001',
    name: 'Unidade Central Ribeirão',
    companyId: 'emp-01',
    companyName: 'AgroGuard Agrícola',
    type: 'matriz',
    city: 'Ribeirão Preto',
    state: 'SP',
    responsibleName: 'Roberto Alves',
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
  {
    id: 'und-02',
    code: 'UND-002',
    name: 'Unidade Sertãozinho',
    companyId: 'emp-01',
    companyName: 'AgroGuard Agrícola',
    type: 'filial',
    city: 'Sertãozinho',
    state: 'SP',
    responsibleName: 'Carlos Silva',
    status: 'ativo',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockFarms: Farm[] = [
  {
    id: 'fzm-01',
    code: 'FZM-001',
    name: 'Fazenda Santa Maria',
    companyId: 'emp-01',
    unitId: 'und-01',
    totalAreaHectares: 1250,
    city: 'Ribeirão Preto',
    state: 'SP',
    responsibleName: 'Marcos Souza',
    status: 'ativo',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockSectors: Sector[] = [
  {
    id: 'sec-01',
    code: 'SEC-001',
    name: 'Setor de Preparo de Solo',
    companyId: 'emp-01',
    unitId: 'und-01',
    farmId: 'fzm-01',
    responsibleName: 'Carlos Silva',
    status: 'ativo',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockLocations: LocationItem[] = [
  {
    id: 'loc-01',
    code: 'LOC-001',
    name: 'Oficina Central de Manutenção',
    type: 'oficina',
    companyId: 'emp-01',
    unitId: 'und-01',
    farmId: 'fzm-01',
    responsibleName: 'Carlos Silva',
    status: 'ativo',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
  {
    id: 'loc-02',
    code: 'LOC-002',
    name: 'Armário A1 (Ferramentas de Medição)',
    type: 'armario',
    parentLocationId: 'loc-01',
    parentLocationName: 'Oficina Central de Manutenção',
    status: 'ativo',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockCostCenters: CostCenter[] = [
  {
    id: 'cc-01',
    code: 'CC-1001',
    name: 'Manutenção de Frotas Agrícolas',
    companyId: 'emp-01',
    unitId: 'und-01',
    managerName: 'Fernando Costa',
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockWorkshops: Workshop[] = [
  {
    id: 'ofc-01',
    code: 'OFC-001',
    name: 'Oficina Interna Matriz',
    type: 'interna',
    companyId: 'emp-01',
    unitId: 'und-01',
    responsibleName: 'Carlos Silva',
    specialties: ['Mecânica Pesada', 'Hidráulica', 'Elétrica'],
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockWarehouses: Warehouse[] = [
  {
    id: 'alm-01',
    code: 'ALM-001',
    name: 'Almoxarifado Geral de Peças',
    companyId: 'emp-01',
    unitId: 'und-01',
    responsibleName: 'Roberto Alves',
    allowsStock: true,
    allowsTools: true,
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

let mockTeams: Team[] = [
  {
    id: 'eqp-01',
    code: 'EQP-001',
    name: 'Equipe de Manutenção Mecânica A',
    type: 'mecanica',
    supervisorName: 'Carlos Silva',
    membersCount: 6,
    shift: 'diurno',
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    createdBy: 'Sistema',
  },
];

export const organizationService = {
  async getCompanies(): Promise<Company[]> { return mockCompanies; },
  async getUnits(): Promise<Unit[]> { return mockUnits; },
  async getFarms(): Promise<Farm[]> { return mockFarms; },
  async getSectors(): Promise<Sector[]> { return mockSectors; },
  async getLocations(): Promise<LocationItem[]> { return mockLocations; },
  async getCostCenters(): Promise<CostCenter[]> { return mockCostCenters; },
  async getWorkshops(): Promise<Workshop[]> { return mockWorkshops; },
  async getWarehouses(): Promise<Warehouse[]> { return mockWarehouses; },
  async getTeams(): Promise<Team[]> { return mockTeams; },
};
