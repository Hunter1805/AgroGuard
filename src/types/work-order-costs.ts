export interface WorkOrderCostSummary {
  orderId: string;
  partsCost: number;
  suppliesCost: number;
  internalLaborCost: number;
  externalLaborCost: number;
  toolsOrRentalsCost: number;
  transportCost: number;
  otherCosts: number;
  totalCost: number;
}
