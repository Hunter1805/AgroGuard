export type ToolLoanStatus =
  | 'rascunho'
  | 'ativo'
  | 'parcialmente_devolvido'
  | 'atrasado'
  | 'concluido'
  | 'cancelado';

export interface ToolLoanItem {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  quantity: number;
  returnedQuantity: number;
  conditionAtCheckout: string;
  conditionAtReturn?: string;
  notes?: string;
}

export interface ToolLoan {
  id: string;
  code: string;
  status: ToolLoanStatus;
  borrowerName: string;
  borrowerTeam?: string;
  workOrderId?: string;
  workOrderCode?: string;
  equipmentId?: string;
  equipmentName?: string;
  locationOfUse?: string;
  checkoutDate: string; // ISO String
  expectedReturnDate: string; // ISO String
  actualReturnDate?: string; // ISO String
  responsibleCheckoutId: string;
  responsibleCheckoutName: string;
  responsibleReturnId?: string;
  responsibleReturnName?: string;
  items: ToolLoanItem[];
  notes?: string;
  signatureMock?: boolean;
}

export interface ToolLoanFilter {
  search?: string;
  status?: ToolLoanStatus | 'todos';
  borrowerName?: string;
  workOrderId?: string;
  overdueOnly?: boolean;
}
