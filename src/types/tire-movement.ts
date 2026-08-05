export type TireAction =
  | 'cadastro'
  | 'instalacao'
  | 'remocao'
  | 'calibragem'
  | 'rodizio'
  | 'transferencia'
  | 'reparo'
  | 'recapagem'
  | 'substituicao'
  | 'descarte'
  | 'inspecao';

export interface TireMovementLog {
  id: string;
  date: string; // ISO
  tireId: string;
  action: TireAction;
  
  equipmentId?: string;
  equipmentName?: string;
  
  originPositionId?: string;
  originPositionName?: string;
  
  destinationEquipmentId?: string;
  destinationPositionId?: string;
  destinationPositionName?: string;
  
  reading?: number; // horimetro ou odometro
  responsibleId: string;
  responsibleName: string;
  
  cost?: number;
  notes?: string;
  statusAfter: string;
}
