export interface MasterDataDependencyItem {
  moduleName: string;
  count: number;
  relatedSummary: string;
  targetRoute?: string;
}

export interface MasterDataDependencyCheckResult {
  hasDependencies: boolean;
  canDelete: boolean; // Só true se count == 0
  dependencies: MasterDataDependencyItem[];
}
