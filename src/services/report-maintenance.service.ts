import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { maintenancePlanService } from './maintenance-plan.service';

export const reportMaintenanceService = {
  async getMaintenanceReport(filters?: ReportFilter): Promise<ReportTableData> {
    let plans = await maintenancePlanService.getAll();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      plans = plans.filter((p: any) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    }

    const columns = [
      { id: 'code', label: 'Cód. Plano', visible: true },
      { id: 'name', label: 'Plano de Manutenção', visible: true },
      { id: 'category', label: 'Categoria', visible: true },
      { id: 'intervalValue', label: 'Intervalo', visible: true },
      { id: 'equipmentCount', label: 'Equipamentos', visible: true, align: 'right' as const },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
      { id: 'estimatedCost', label: 'Custo Estimado', visible: true, format: 'currency' as const, align: 'right' as const },
    ];

    const rows = plans.map((p: any) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      category: p.category || 'Geral',
      intervalValue: `${p.intervalValue} ${p.intervalUnit}`,
      equipmentCount: p.equipmentIds?.length || 1,
      status: p.active ? 'ativo' : 'inativo',
      estimatedCost: (p.tasksCount || 4) * 180,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        estimatedCost: rows.reduce((acc: number, r: any) => acc + r.estimatedCost, 0),
      },
    };
  },
};
