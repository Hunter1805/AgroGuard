export type ToolKitType =
  | 'operador'
  | 'mecanico'
  | 'veiculo'
  | 'equipamento'
  | 'oficina'
  | 'equipe'
  | 'outro';

export type ToolKitStatus =
  | 'completo'
  | 'incompleto'
  | 'com_divergencia'
  | 'em_conferencia'
  | 'bloqueado'
  | 'desativado';

export type ToolKitItemInspectionResult =
  | 'conforme'
  | 'ausente'
  | 'divergente'
  | 'danificado'
  | 'substituido'
  | 'nao_se_aplica';

export interface ToolKitItem {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  expectedQuantity: number;
  currentQuantity: number;
  isRequired: boolean;
  expectedCondition: string;
  notes?: string;
}

export interface ToolKit {
  id: string;
  code: string;
  name: string;
  type: ToolKitType;
  description?: string;
  responsibleName: string;
  equipmentId?: string;
  equipmentName?: string;
  vehicleName?: string;
  teamName?: string;
  location?: string;
  deliveryDate?: string;
  inspectionFrequencyDays?: number;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  responsibilityTermSigned?: boolean;
  status: ToolKitStatus;
  items: ToolKitItem[];
  notes?: string;
}

export interface ToolKitInspectionItem {
  itemId: string;
  toolId: string;
  toolName: string;
  expectedQuantity: number;
  foundQuantity: number;
  condition: string;
  result: ToolKitItemInspectionResult;
  notes?: string;
}

export interface ToolKitInspection {
  id: string;
  kitId: string;
  kitCode: string;
  kitName: string;
  date: string;
  inspectorName: string;
  location?: string;
  items: ToolKitInspectionItem[];
  finalResult: 'completo' | 'incompleto' | 'com_divergencia' | 'bloqueado';
  notes?: string;
}
