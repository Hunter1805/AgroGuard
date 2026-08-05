import type {
  PartCategoryMaster, ToolCategoryMaster, DocumentTypeMaster, ServiceTypeMaster, SpecialtyMaster
} from '../types/material-master-data';

let mockPartCategories: PartCategoryMaster[] = [
  { id: 'cat-peca-01', code: 'FILTROS', name: 'Filtros (Ar, Óleo, Combustível, Hidráulico)', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'cat-peca-02', code: 'LUBRIFICANTES', name: 'Óleos e Graxas Lubrificantes', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockToolCategories: ToolCategoryMaster[] = [
  { id: 'cat-ferr-01', code: 'MANUAIS', name: 'Ferramentas Manuais de Aperto', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'cat-ferr-02', code: 'MEDICAO', name: 'Instrumentos de Medição e Aferição', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockDocumentTypes: DocumentTypeMaster[] = [
  { id: 'doc-01', code: 'NF', name: 'Nota Fiscal Eletrônica (NFe)', requiresExpirationDate: false, requiresDocumentNumber: true, requiresFile: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'doc-02', code: 'CERTIFICADO', name: 'Certificado de Calibração', requiresExpirationDate: true, requiresDocumentNumber: true, requiresFile: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockServiceTypes: ServiceTypeMaster[] = [
  { id: 'srv-01', code: 'REVISAO', name: 'Revisão Preventiva Geral', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockSpecialties: SpecialtyMaster[] = [
  { id: 'esp-01', code: 'MECANICO', name: 'Mecânico de Máquinas Agrícolas', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'esp-02', code: 'ELETRICISTA', name: 'Eletricista Automotivo', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

export const materialCatalogService = {
  async getPartCategories(): Promise<PartCategoryMaster[]> { return mockPartCategories; },
  async getToolCategories(): Promise<ToolCategoryMaster[]> { return mockToolCategories; },
  async getDocumentTypes(): Promise<DocumentTypeMaster[]> { return mockDocumentTypes; },
  async getServiceTypes(): Promise<ServiceTypeMaster[]> { return mockServiceTypes; },
  async getSpecialties(): Promise<SpecialtyMaster[]> { return mockSpecialties; },
};
