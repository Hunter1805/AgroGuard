import type { ReportExportLog, ReportExportFormat } from '../types/report-export';
import type { ReportTableData } from '../types/reports';

let exportLogsStore: ReportExportLog[] = [
  {
    id: 'EXP-001',
    reportName: 'Relatório Consolidado de Custos',
    category: 'custos',
    format: 'csv',
    periodText: 'Últimos 30 dias',
    userName: 'Roberto Alves',
    generatedAt: '2026-08-04T14:30:00Z',
    recordsCount: 31,
    status: 'concluido',
  },
];

export const reportExportService = {
  async getExportHistory(): Promise<ReportExportLog[]> {
    return exportLogsStore;
  },

  async exportReport(
    reportName: string,
    category: any,
    format: ReportExportFormat,
    tableData: ReportTableData,
    userName: string = 'Roberto Alves'
  ): Promise<void> {
    const visibleCols = tableData.columns.filter(c => c.visible);

    if (format === 'csv') {
      const headerRow = visibleCols.map(c => `"${c.label}"`).join(';');
      const dataRows = tableData.rows.map(row =>
        visibleCols.map(c => `"${row[c.id] ?? ''}"`).join(';')
      );
      const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'print' || format === 'pdf') {
      window.print();
    }

    const log: ReportExportLog = {
      id: `EXP-${Date.now()}`,
      reportName,
      category,
      format,
      periodText: 'Período Selecionado',
      userName,
      generatedAt: new Date().toISOString(),
      recordsCount: tableData.rows.length,
      status: 'concluido',
    };

    exportLogsStore.unshift(log);
  },
};
