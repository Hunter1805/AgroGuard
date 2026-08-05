export type ReportCategory =
  | 'visao_geral'
  | 'equipamentos'
  | 'leituras'
  | 'manutencoes'
  | 'ordens-servico'
  | 'checklists'
  | 'nao-conformidades'
  | 'falhas'
  | 'pneus'
  | 'ferramentas'
  | 'pecas-estoque'
  | 'custos'
  | 'indicadores'
  | 'favoritos'
  | 'exportacoes';

export interface ReportColumn {
  id: string;
  label: string;
  visible: boolean;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'date' | 'percentage' | 'badge';
}

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  route: string;
  iconName: string;
  popular?: boolean;
}

export interface SavedReport {
  id: string;
  name: string;
  category: ReportCategory;
  reportTypeId: string;
  filters: Record<string, any>;
  visibleColumns: string[];
  exportFormat?: 'csv' | 'pdf' | 'excel' | 'print';
  createdByName: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTableData<T = any> {
  columns: ReportColumn[];
  rows: T[];
  totalRows: number;
  totals?: Record<string, number | string>;
}
