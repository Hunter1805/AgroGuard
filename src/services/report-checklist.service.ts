import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { checklistExecutionService } from './checklist-execution.service';

export const reportChecklistService = {
  async getChecklistReport(filters?: ReportFilter): Promise<ReportTableData> {
    let executions = await checklistExecutionService.getChecklistExecutions();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      executions = executions.filter((e: any) => e.code.toLowerCase().includes(q) || e.equipmentName.toLowerCase().includes(q));
    }

    const columns = [
      { id: 'code', label: 'Cód. Execução', visible: true },
      { id: 'equipmentName', label: 'Equipamento', visible: true },
      { id: 'templateTitle', label: 'Modelo de Checklist', visible: true },
      { id: 'executorName', label: 'Operador / Inspetor', visible: true },
      { id: 'date', label: 'Data', visible: true, format: 'date' as const },
      { id: 'nonConformitiesCount', label: 'Não Conf.', visible: true, align: 'right' as const },
      { id: 'status', label: 'Resultado', visible: true, format: 'badge' as const },
    ];

    const rows = executions.map((e: any) => ({
      id: e.id,
      code: e.code,
      equipmentName: e.equipmentName,
      templateTitle: e.templateTitle || 'Checklist Diário',
      executorName: e.executorName,
      date: new Date(e.date).toLocaleDateString('pt-BR'),
      nonConformitiesCount: e.nonConformitiesCount || 0,
      status: e.status,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        nonConformitiesCount: rows.reduce((acc: number, r: any) => acc + r.nonConformitiesCount, 0),
      },
    };
  },
};
