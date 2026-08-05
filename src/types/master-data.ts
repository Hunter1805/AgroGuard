export type MasterDataStatus = 'ativo' | 'inativo' | 'arquivado';

export interface MasterDataBase {
  id: string;
  code: string;
  name: string;
  description?: string;

  status: MasterDataStatus;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;

  archivedAt?: string;
  archivedBy?: string;

  replacementId?: string;
  usageCount?: number;
}

export type MasterDataGroupType = 'organizacao' | 'equipamentos' | 'manutencao' | 'materiais_servicos';

export interface MasterDataCategoryCard {
  id: string;
  code: string;
  title: string;
  description: string;
  group: MasterDataGroupType;
  route: string;
  iconName: string;
  totalCount: number;
  activeCount: number;
  pendingCount?: number;
}
