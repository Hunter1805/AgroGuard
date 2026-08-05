import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { toolsService } from './tools.service';

export const reportToolsService = {
  async getToolsReport(filters?: ReportFilter): Promise<ReportTableData> {
    let tools = await toolsService.getTools();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      tools = tools.filter((t: any) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
    }

    const columns = [
      { id: 'code', label: 'Cód. Ferramenta', visible: true },
      { id: 'name', label: 'Nome da Ferramenta', visible: true },
      { id: 'category', label: 'Categoria', visible: true },
      { id: 'patrimonyNumber', label: 'Patrimônio', visible: true },
      { id: 'totalQuantity', label: 'Estoque Total', visible: true, align: 'right' as const },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
      { id: 'acquisitionValue', label: 'Valor Patrimonial', visible: true, format: 'currency' as const, align: 'right' as const },
    ];

    const rows = tools.map((t: any) => ({
      id: t.id,
      code: t.code,
      name: t.name,
      category: t.category,
      patrimonyNumber: t.patrimonyNumber || '—',
      totalQuantity: `${t.totalQuantity} ${t.unitOfMeasure || 'UN'}`,
      status: t.status,
      acquisitionValue: t.acquisitionValue || 450.00,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        acquisitionValue: rows.reduce((acc: number, r: any) => acc + r.acquisitionValue, 0),
      },
    };
  },
};
