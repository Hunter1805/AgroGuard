import type { ReportCategory } from './reports';

export type ReportExportFormat = 'csv' | 'pdf' | 'excel' | 'print';

export type ReportExportStatus = 'gerando' | 'concluido' | 'falhou' | 'expirado';

export interface ReportExportLog {
  id: string;
  reportName: string;
  category: ReportCategory;
  format: ReportExportFormat;
  periodText: string;
  filtersSummary?: string;
  userName: string;
  generatedAt: string;
  recordsCount: number;
  fileSizeBytes?: number;
  status: ReportExportStatus;
  downloadUrl?: string;
}
