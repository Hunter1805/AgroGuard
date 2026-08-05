import type { MasterDataBase } from './master-data';

export interface SystemMaster extends MasterDataBase {
  applicableEquipmentTypes?: string[];
}

export interface SubsystemMaster extends MasterDataBase {
  systemId: string;
  systemName?: string;
}

export interface ComponentMaster extends MasterDataBase {
  systemId: string;
  subsystemId: string;
  systemName?: string;
  subsystemName?: string;
  manufacturerPartNumber?: string;
}

export interface FailureTypeMaster extends MasterDataBase {
  defaultCriticality: 'baixa' | 'media' | 'alta' | 'critica';
}

export interface SymptomMaster extends MasterDataBase {
  systemId?: string;
  subsystemId?: string;
}

export type CauseCategory =
  | 'desgaste_natural'
  | 'falha_operacao'
  | 'falta_manutencao'
  | 'material_inadequado'
  | 'montagem_incorreta'
  | 'contaminacao'
  | 'sobrecarga'
  | 'condicao_ambiental'
  | 'defeito_fabricacao'
  | 'outro';

export interface CauseMaster extends MasterDataBase {
  category: CauseCategory;
  systemId?: string;
  subsystemId?: string;
}

export interface MaintenanceTypeMaster extends MasterDataBase {
  color: string;
  requiresApproval: boolean;
  requiresEquipmentParada: boolean;
}

export interface PriorityMaster extends MasterDataBase {
  numericLevel: 1 | 2 | 3 | 4; // Nível numérico único
  color: string;
  defaultDeadlineValue: number;
  defaultDeadlineUnit: 'horas' | 'dias';
  requiresEquipmentBlock: boolean;
  requiresApproval: boolean;
}

export type OperationalReasonGroup =
  | 'pausa_os'
  | 'cancelamento_os'
  | 'adiamento_os'
  | 'bloqueio_equipamento'
  | 'inatividade_equipamento'
  | 'baixa_patrimonial'
  | 'ajuste_estoque'
  | 'perda_estoque'
  | 'descarte_estoque';

export interface OperationalReasonMaster extends MasterDataBase {
  group: OperationalReasonGroup;
  requiresComplementaryJustification: boolean;
  requiresApproval: boolean;
}
