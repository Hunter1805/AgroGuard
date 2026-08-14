export interface IndicatorMetric {
  value: number;
  unit: '%' | 'h' | 'dias' | 'UN';
  formattedValue: string;
  insufficientData: boolean;
  tooltipExplanation?: string;
  trend?: 'subiu' | 'desceu' | 'estavel';
  trendPercentage?: number;
}

export interface ReportOperationalIndicators {
  availability: IndicatorMetric;
  mttr: IndicatorMetric;
  mtbf: IndicatorMetric;
  preventiveCompliance: IndicatorMetric;
  complianceRate: IndicatorMetric;
  utilizationRate: IndicatorMetric;

  totalEquipmentCount: number;
  operatingEquipmentCount: number;
  stoppedEquipmentCount: number;
  totalParadaHours: number;
  completedRepairsCount: number;
  totalFailuresCount: number;

  emergencyCorrectivePercent?: IndicatorMetric;
  distributionByType?: Record<string, number>;
  costByType?: Record<string, number>;
  downtimeByType?: Record<string, number>;
  mttrByType?: Record<string, number>;
}
