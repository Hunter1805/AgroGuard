import type { SystemSettings } from '../types/system-settings';

let mockSystemSettings: SystemSettings = {
  general: {
    systemName: 'AgroGuard - Gestão Agrícola & Frotas',
    companyName: 'AgroGuard Operações Agrícolas Ltda',
    primaryColor: '#10B981',
    secondaryColor: '#0F5518',
    footerText: 'AgroGuard © 2026 — Todos os direitos reservados.',
    contactInfo: 'suporte@agroguard.com.br | (16) 3456-7890',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'BRL',
    decimalSeparator: ',',
    firstDayOfWeek: 1,
    defaultDistanceUnit: 'km',
    defaultPressureUnit: 'psi',
    defaultAreaUnit: 'ha',
    defaultVolumeUnit: 'L',
    defaultMassUnit: 'kg',
    horimeterDecimals: 1,
    odometerDecimals: 0,
    maxFileSizeMb: 10,
    allowedFileFormats: ['.pdf', '.jpg', '.png', '.xlsx'],
  },
  maintenance: {
    alertDaysAhead: 7,
    alertHoursAhead: 50,
    alertKmAhead: 500,
    delayToleranceHours: 24,
    urgentMaintenanceCriteria: 'atraso_critico',
    requiresManagerApproval: true,
    blockOnOverdue: false,
    defaultWorkshopId: 'ofc-01',
    defaultResponsibleId: 'usr-01',
  },
  workOrders: {
    prefix: 'OS',
    requiresApprovalByPriority: true,
    requiresTestBeforeRelease: true,
    requiresReleaseApproval: true,
    requiresSignature: true,
    requiresCancellationReason: true,
    requiresReopenReason: true,
    blockCloseWithPendingResources: true,
    calculateMttr: true,
    calculateDowntime: true,
  },
  stock: {
    allowNegativeStock: false,
    requireApprovalForAdjustment: true,
    requireWorkOrderForConsumption: true,
    lotConsumptionMethod: 'FEFO',
    blockExpiredLot: true,
    expirationAlertDays: 30,
    requireLossApproval: true,
    inventoryRecountRequired: true,
    quantityDecimals: 2,
  },
  tires: {
    defaultPressureUnit: 'psi',
    defaultMinTreadDepthMm: 3.0,
    inspectionIntervalDays: 15,
    requirePhotoOnAnomaly: true,
    blockOnCriticalTire: true,
    maxRecapCount: 3,
  },
  tools: {
    defaultLoanDays: 7,
    blockOnExpiredCalibration: true,
    requireCheckoutSignature: true,
    requireReturnSignature: true,
    delayToleranceDays: 2,
    periodicKitCheckDays: 30,
  },
  numberingRules: [
    { id: 'num-os', entityName: 'Ordens de Serviço', prefix: 'OS', nextNumber: 4030, digitsCount: 5, yearlyReset: true, includeYear: true, sampleGenerated: 'OS-2026-04030' },
    { id: 'num-eq', entityName: 'Equipamentos / Ativos', prefix: 'EQ', nextNumber: 129, digitsCount: 4, yearlyReset: false, includeYear: false, sampleGenerated: 'EQ-0129' },
    { id: 'num-chk', entityName: 'Checklists Diários', prefix: 'CHK', nextNumber: 1580, digitsCount: 6, yearlyReset: true, includeYear: true, sampleGenerated: 'CHK-2026-001580' },
    { id: 'num-pneu', entityName: 'Pneus e Rodados', prefix: 'PN', nextNumber: 840, digitsCount: 5, yearlyReset: false, includeYear: false, sampleGenerated: 'PN-00840' },
    { id: 'num-inv', entityName: 'Inventários de Estoque', prefix: 'INV', nextNumber: 18, digitsCount: 4, yearlyReset: true, includeYear: true, sampleGenerated: 'INV-2026-0018' },
  ],
};

export const systemSettingsService = {
  async getSettings(): Promise<SystemSettings> {
    return mockSystemSettings;
  },

  async updateGeneralSettings(general: Partial<SystemSettings['general']>): Promise<SystemSettings> {
    mockSystemSettings.general = { ...mockSystemSettings.general, ...general };
    return mockSystemSettings;
  },

  async updateMaintenanceRules(rules: Partial<SystemSettings['maintenance']>): Promise<SystemSettings> {
    mockSystemSettings.maintenance = { ...mockSystemSettings.maintenance, ...rules };
    return mockSystemSettings;
  },

  async updateWorkOrderRules(rules: Partial<SystemSettings['workOrders']>): Promise<SystemSettings> {
    mockSystemSettings.workOrders = { ...mockSystemSettings.workOrders, ...rules };
    return mockSystemSettings;
  },

  async updateStockRules(rules: Partial<SystemSettings['stock']>): Promise<SystemSettings> {
    mockSystemSettings.stock = { ...mockSystemSettings.stock, ...rules };
    return mockSystemSettings;
  },

  async updateTireRules(rules: Partial<SystemSettings['tires']>): Promise<SystemSettings> {
    mockSystemSettings.tires = { ...mockSystemSettings.tires, ...rules };
    return mockSystemSettings;
  },

  async updateToolRules(rules: Partial<SystemSettings['tools']>): Promise<SystemSettings> {
    mockSystemSettings.tools = { ...mockSystemSettings.tools, ...rules };
    return mockSystemSettings;
  },
};
