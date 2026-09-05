import type { SupplierMaster } from '../types/material-master-data';

const defaultSuppliers: SupplierMaster[] = [
  {
    id: 'for-01',
    code: 'FOR-001',
    name: 'AgroPeças Distribuidora S.A.',
    personType: 'juridica',
    corporateName: 'AgroPeças Distribuidora S.A.',
    tradeName: 'AgroPeças',
    documentNumber: '12.345.678/0001-99',
    stateRegistration: '123.456.789.111',
    phone: '(16) 3456-7890',
    email: 'contato@agropecas.com.br',
    contactPersonName: 'Juliana Paes',
    city: 'Ribeirão Preto',
    state: 'SP',
    classifications: ['pecas', 'insumos', 'ferramentas'],
    averageDeliveryDays: 2,
    paymentTerms: 'Faturado 30 dias',
    ratingStars: 5,
    status: 'ativo',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
    createdBy: 'Sistema',
  },
  {
    id: 'for-02',
    code: 'FOR-002',
    name: 'Borracharia & Pneus São José',
    personType: 'juridica',
    corporateName: 'Borracharia São José Eireli',
    tradeName: 'Pneus São José',
    documentNumber: '98.765.432/0001-11',
    phone: '(16) 99876-5432',
    email: 'vendas@pneussaojose.com.br',
    contactPersonName: 'José Ribeiro',
    city: 'Sertãozinho',
    state: 'SP',
    classifications: ['pneus', 'oficina'],
    averageDeliveryDays: 1,
    paymentTerms: 'À vista ou 14d',
    ratingStars: 4,
    status: 'ativo',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
    createdBy: 'Sistema',
  },
];

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

function getLocalSuppliers(): SupplierMaster[] {
  const tenantId = getTenantId();
  // APENAS a organização demo dedicada recebe dados de demonstração.
  // Contas novas (ou sem organização resolvida) devem iniciar 100% vazias.
  const demoOrgId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const isDemo = tenantId === demoOrgId;

  const storageKey = `agroguard_suppliers_${tenantId}`;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return isDemo ? defaultSuppliers : [];
}

function saveLocalSuppliers(data: SupplierMaster[]) {
  const tenantId = getTenantId();
  const storageKey = `agroguard_suppliers_${tenantId}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export const suppliersService = {
  async getAll(): Promise<SupplierMaster[]> {
    return getLocalSuppliers();
  },

  async getSuppliers(): Promise<SupplierMaster[]> {
    return getLocalSuppliers();
  },

  async getSupplierById(id: string): Promise<SupplierMaster | undefined> {
    const list = getLocalSuppliers();
    return list.find(s => s.id === id || s.code === id);
  },

  async saveSupplier(data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    const list = getLocalSuppliers();
    if (data.id) {
      const idx = list.findIndex(s => s.id === data.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
        saveLocalSuppliers(list);
        return list[idx];
      }
    }
    const newSup: SupplierMaster = {
      id: `for-${Date.now()}`,
      code: `FOR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.tradeName || data.corporateName || 'Fornecedor',
      personType: data.personType || 'juridica',
      corporateName: data.corporateName || '',
      tradeName: data.tradeName || '',
      documentNumber: data.documentNumber || '',
      classifications: data.classifications || ['pecas'],
      status: 'ativo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Usuário Logado',
    };
    list.unshift(newSup);
    saveLocalSuppliers(list);
    return newSup;
  },

  async create(data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    return this.saveSupplier(data);
  },

  async update(id: string, data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    return this.saveSupplier({ ...data, id });
  },

  async activate(id: string): Promise<void> {
    const list = getLocalSuppliers();
    const s = list.find(sup => sup.id === id);
    if (s) {
      s.status = 'ativo';
      saveLocalSuppliers(list);
    }
  },

  async deactivate(id: string): Promise<void> {
    const list = getLocalSuppliers();
    const s = list.find(sup => sup.id === id);
    if (s) {
      s.status = 'inativo';
      saveLocalSuppliers(list);
    }
  },
};
