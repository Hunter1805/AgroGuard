import type {
  Company, Unit, Farm, Sector, LocationItem, CostCenter, Workshop, Warehouse, Team
} from '../types/organization-master-data';
import { apiClient } from '../lib/api/api-client';

function getTenantId(): string {
  const profileStr = localStorage.getItem('agroguard_user_profile');
  if (profileStr) {
    try {
      const profile = JSON.parse(profileStr);
      return profile.organizationId || 'global';
    } catch {
      // ignore
    }
  }
  return 'global';
}

function getLocalData<T>(key: string, defaultVal: T[]): T[] {
  const tenantId = getTenantId();
  // APENAS a organização demo dedicada recebe dados de demonstração.
  // Contas novas (ou sem organização resolvida) devem iniciar 100% vazias.
  const demoOrgId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const isDemo = tenantId === demoOrgId;

  const storageKey = `agroguard_${key}_${tenantId}`;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  return isDemo ? defaultVal : [];
}

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
  async getCompanies(): Promise<Company[]> {
    try {
      const tenantId = getTenantId();
      if (tenantId && tenantId !== 'global') {
        const res = await apiClient<any>('/organizations/' + tenantId);
        if (res.data?.companies) {
          return res.data.companies.map((c: any) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            corporateName: c.corporateName || c.name,
            tradeName: c.tradeName || c.name,
            cnpj: c.cnpj || '',
            status: c.status || 'ativo',
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            createdBy: c.createdBy || 'Sistema',
          }));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar empresas da API, usando fallback local:', err);
    }
    return getLocalData('companies', mockCompanies);
  },

  async getUnits(): Promise<Unit[]> {
    try {
      const tenantId = getTenantId();
      if (tenantId && tenantId !== 'global') {
        const res = await apiClient<any>('/organizations/' + tenantId);
        if (res.data?.companies) {
          const allUnits: Unit[] = [];
          res.data.companies.forEach((c: any) => {
            if (c.units) {
              c.units.forEach((u: any) => {
                allUnits.push({
                  id: u.id,
                  code: u.code,
                  name: u.name,
                  companyId: c.id,
                  companyName: c.name,
                  type: u.type || 'filial',
                  city: u.city || '',
                  state: u.state || '',
                  status: u.status || 'ativo',
                  createdAt: u.createdAt,
                  updatedAt: u.updatedAt,
                  createdBy: u.createdBy || 'Sistema',
                });
              });
            }
          });
          return allUnits;
        }
      }
    } catch (err) {
      console.error('Erro ao buscar unidades da API, usando fallback local:', err);
    }
    return getLocalData('units', mockUnits);
  },

  async getFarms(): Promise<Farm[]> {
    try {
      const tenantId = getTenantId();
      if (tenantId && tenantId !== 'global') {
        const res = await apiClient<any>('/organizations/' + tenantId);
        if (res.data?.companies) {
          const allFarms: Farm[] = [];
          res.data.companies.forEach((c: any) => {
            if (c.units) {
              c.units.forEach((u: any) => {
                if (u.farms) {
                  u.farms.forEach((f: any) => {
                    allFarms.push({
                      id: f.id,
                      code: f.code,
                      name: f.name,
                      companyId: c.id,
                      unitId: u.id,
                      totalAreaHectares: Number(f.totalAreaHectares || 0),
                      city: f.city || '',
                      state: f.state || '',
                      status: f.status || 'ativo',
                      createdAt: f.createdAt,
                      updatedAt: f.updatedAt,
                      createdBy: f.createdBy || 'Sistema',
                    });
                  });
                }
              });
            }
          });
          return allFarms;
        }
      }
    } catch (err) {
      console.error('Erro ao buscar fazendas da API, usando fallback local:', err);
    }
    return getLocalData('farms', mockFarms);
  },

  async getSectors(): Promise<Sector[]> { return getLocalData('sectors', mockSectors); },
  async getLocations(): Promise<LocationItem[]> { return getLocalData('locations', mockLocations); },
  async getCostCenters(): Promise<CostCenter[]> { return getLocalData('cost_centers', mockCostCenters); },
  async getWorkshops(): Promise<Workshop[]> { return getLocalData('workshops', mockWorkshops); },
  async getWarehouses(): Promise<Warehouse[]> { return getLocalData('warehouses', mockWarehouses); },
  async getTeams(): Promise<Team[]> { return getLocalData('teams', mockTeams); },
};
