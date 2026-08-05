import type { SupplierMaster } from '../types/material-master-data';

let mockSuppliers: SupplierMaster[] = [
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

export const suppliersService = {
  async getAll(): Promise<SupplierMaster[]> {
    return mockSuppliers;
  },

  async getSuppliers(): Promise<SupplierMaster[]> {
    return mockSuppliers;
  },

  async getSupplierById(id: string): Promise<SupplierMaster | undefined> {
    return mockSuppliers.find(s => s.id === id || s.code === id);
  },

  async saveSupplier(data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    if (data.id) {
      const idx = mockSuppliers.findIndex(s => s.id === data.id);
      if (idx >= 0) {
        mockSuppliers[idx] = { ...mockSuppliers[idx], ...data, updatedAt: new Date().toISOString() };
        return mockSuppliers[idx];
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
    mockSuppliers.unshift(newSup);
    return newSup;
  },

  async create(data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    return this.saveSupplier(data);
  },

  async update(id: string, data: Partial<SupplierMaster>): Promise<SupplierMaster> {
    return this.saveSupplier({ ...data, id });
  },

  async activate(id: string): Promise<void> {
    const s = mockSuppliers.find(sup => sup.id === id);
    if (s) s.status = 'ativo';
  },

  async deactivate(id: string): Promise<void> {
    const s = mockSuppliers.find(sup => sup.id === id);
    if (s) s.status = 'inativo';
  },
};
