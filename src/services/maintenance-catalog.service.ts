import type {
  SystemMaster, SubsystemMaster, ComponentMaster, FailureTypeMaster,
  SymptomMaster, CauseMaster, MaintenanceTypeMaster, PriorityMaster, OperationalReasonMaster
} from '../types/maintenance-master-data';

let mockSystems: SystemMaster[] = [
  { id: 'sis-01', code: 'MOTOR', name: 'Motor de Combustão', description: 'Sistema de propulsão e bloco do motor', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'sis-02', code: 'TRANSMISSAO', name: 'Transmissão / Embreagem', description: 'Caixa de marchas e diferencial', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'sis-03', code: 'HIDRAULICO', name: 'Sistema Hidráulico', description: 'Bomba, comandos e cilindros hidráulicos', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'sis-04', code: 'ELETRICO', name: 'Sistema Elétrico / Eletrônico', description: 'Bateria, alternador, sensores e módulos', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockSubsystems: SubsystemMaster[] = [
  { id: 'subsis-01', code: 'LUBRIFICACAO', name: 'Sistema de Lubrificação', systemId: 'sis-01', systemName: 'Motor de Combustão', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'subsis-02', code: 'ARREFECIMENTO', name: 'Sistema de Arrefecimento', systemId: 'sis-01', systemName: 'Motor de Combustão', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockComponents: ComponentMaster[] = [
  { id: 'comp-01', code: 'BOMBA_OLEO', name: 'Bomba de Óleo do Cárter', systemId: 'sis-01', subsystemId: 'subsis-01', systemName: 'Motor', subsystemName: 'Lubrificação', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'comp-02', code: 'FILTRO_LUB', name: 'Filtro Lubrificante Blindado', systemId: 'sis-01', subsystemId: 'subsis-01', systemName: 'Motor', subsystemName: 'Lubrificação', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockFailureTypes: FailureTypeMaster[] = [
  { id: 'tf-01', code: 'FALHA_MECANICA', name: 'Mecânica / Quebra de Componente', defaultCriticality: 'alta', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'tf-02', code: 'FALHA_VAZAMENTO', name: 'Vazamento de Óleo ou Fluido', defaultCriticality: 'media', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockSymptoms: SymptomMaster[] = [
  { id: 'sim-01', code: 'RUÍDO_ESTRANHO', name: 'Ruído metálico anômalo no motor', systemId: 'sis-01', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockCauses: CauseMaster[] = [
  { id: 'cau-01', code: 'DESGASTE_NATURAL', name: 'Desgaste natural por tempo de uso', category: 'desgaste_natural', systemId: 'sis-01', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockMaintenanceTypes: MaintenanceTypeMaster[] = [
  { id: 'tm-01', code: 'PREVENTIVA', name: 'Manutenção Preventiva Programada', color: 'emerald', requiresApproval: false, requiresEquipmentParada: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'tm-02', code: 'CORRETIVA', name: 'Manutenção Corretiva Emergencial', color: 'rose', requiresApproval: false, requiresEquipmentParada: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockPriorities: PriorityMaster[] = [
  { id: 'pri-01', code: 'BAIXA', name: 'Baixa (Até 7 dias)', numericLevel: 1, color: 'blue', defaultDeadlineValue: 7, defaultDeadlineUnit: 'dias', requiresEquipmentBlock: false, requiresApproval: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'pri-02', code: 'MEDIA', name: 'Média (Até 48 horas)', numericLevel: 2, color: 'amber', defaultDeadlineValue: 48, defaultDeadlineUnit: 'horas', requiresEquipmentBlock: false, requiresApproval: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'pri-03', code: 'ALTA', name: 'Alta (Até 24 horas)', numericLevel: 3, color: 'orange', defaultDeadlineValue: 24, defaultDeadlineUnit: 'horas', requiresEquipmentBlock: false, requiresApproval: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'pri-04', code: 'CRITICA', name: 'Crítica / Emergencial (Imediata)', numericLevel: 4, color: 'rose', defaultDeadlineValue: 4, defaultDeadlineUnit: 'horas', requiresEquipmentBlock: true, requiresApproval: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockOperationalReasons: OperationalReasonMaster[] = [
  { id: 'mot-01', code: 'AGUARDANDO_PECAS', name: 'Aguardando Chegada de Peças', group: 'pausa_os', requiresComplementaryJustification: true, requiresApproval: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

export const maintenanceCatalogService = {
  async getSystems(): Promise<SystemMaster[]> { return mockSystems; },
  async getSubsystems(): Promise<SubsystemMaster[]> { return mockSubsystems; },
  async getComponents(): Promise<ComponentMaster[]> { return mockComponents; },
  async getFailureTypes(): Promise<FailureTypeMaster[]> { return mockFailureTypes; },
  async getSymptoms(): Promise<SymptomMaster[]> { return mockSymptoms; },
  async getCauses(): Promise<CauseMaster[]> { return mockCauses; },
  async getMaintenanceTypes(): Promise<MaintenanceTypeMaster[]> { return mockMaintenanceTypes; },
  async getPriorities(): Promise<PriorityMaster[]> { return mockPriorities; },
  async getOperationalReasons(): Promise<OperationalReasonMaster[]> { return mockOperationalReasons; },
};
