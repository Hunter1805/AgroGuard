export interface GeneralCompanySettings {
  systemName: string;
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  contactInfo: string;

  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  decimalSeparator: string;
  firstDayOfWeek: number; // 0 para domingo, 1 para segunda

  defaultDistanceUnit: 'km' | 'mi';
  defaultPressureUnit: 'psi' | 'bar';
  defaultAreaUnit: 'ha' | 'm2';
  defaultVolumeUnit: 'L' | 'm3';
  defaultMassUnit: 'kg' | 't';
  horimeterDecimals: 1 | 2;
  odometerDecimals: 0 | 1;

  maxFileSizeMb: number;
  allowedFileFormats: string[];
}

export interface MaintenanceRulesSettings {
  alertDaysAhead: number;
  alertHoursAhead: number;
  alertKmAhead: number;
  delayToleranceHours: number;
  urgentMaintenanceCriteria: 'alta_prioridade' | 'atraso_critico';
  requiresManagerApproval: boolean;
  blockOnOverdue: boolean;
  defaultWorkshopId?: string;
  defaultResponsibleId?: string;
}

export interface WorkOrderRulesSettings {
  prefix: string;
  requiresApprovalByPriority: boolean;
  requiresTestBeforeRelease: boolean;
  requiresReleaseApproval: boolean;
  requiresSignature: boolean;
  requiresCancellationReason: boolean;
  requiresReopenReason: boolean;
  blockCloseWithPendingResources: boolean;
  calculateMttr: boolean;
  calculateDowntime: boolean;
  defaultResponsibleId?: string;
  defaultWorkshopId?: string;
}

export interface StockRulesSettings {
  allowNegativeStock: boolean;
  requireApprovalForAdjustment: boolean;
  requireWorkOrderForConsumption: boolean;
  lotConsumptionMethod: 'FEFO' | 'FIFO' | 'LIFO';
  blockExpiredLot: boolean;
  expirationAlertDays: number;
  requireLossApproval: boolean;
  inventoryRecountRequired: boolean;
  quantityDecimals: number;
}

export interface TireRulesSettings {
  defaultPressureUnit: 'psi' | 'bar';
  defaultMinTreadDepthMm: number;
  inspectionIntervalDays: number;
  requirePhotoOnAnomaly: boolean;
  blockOnCriticalTire: boolean;
  maxRecapCount: number;
}

export interface ToolRulesSettings {
  defaultLoanDays: number;
  blockOnExpiredCalibration: boolean;
  requireCheckoutSignature: boolean;
  requireReturnSignature: boolean;
  delayToleranceDays: number;
  periodicKitCheckDays: number;
}

export interface NumberingRuleItem {
  id: string;
  entityName: string;
  prefix: string;
  nextNumber: number;
  digitsCount: number;
  yearlyReset: boolean;
  includeYear: boolean;
  sampleGenerated: string;
}

export interface SystemSettings {
  general: GeneralCompanySettings;
  maintenance: MaintenanceRulesSettings;
  workOrders: WorkOrderRulesSettings;
  stock: StockRulesSettings;
  tires: TireRulesSettings;
  tools: ToolRulesSettings;
  numberingRules: NumberingRuleItem[];
}
