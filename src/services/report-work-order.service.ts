import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { workOrderService } from './work-order.service';

export const reportWorkOrderService = {
  async getWorkOrderReport(filters?: ReportFilter): Promise<ReportTableData> {
    let orders = await workOrderService.getWorkOrders();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(
        (o: any) => o.code.toLowerCase().includes(q) || o.equipmentName.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
      );
    }

    if (filters?.equipmentId) {
      orders = orders.filter((o: any) => o.equipmentId === filters.equipmentId);
    }

    if (filters?.status && filters.status !== 'todos') {
      orders = orders.filter((o: any) => o.status === filters.status);
    }

    const columns = [
      { id: 'code', label: 'Cód. OS', visible: true },
      { id: 'equipmentName', label: 'Equipamento', visible: true },
      { id: 'type', label: 'Tipo', visible: true },
      { id: 'priority', label: 'Prioridade', visible: true, format: 'badge' as const },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
      { id: 'openedAt', label: 'Data Abertura', visible: true, format: 'date' as const },
      { id: 'estimatedHours', label: 'Horas Estimadas', visible: true, format: 'number' as const, align: 'right' as const },
      { id: 'totalCost', label: 'Custo Total', visible: true, format: 'currency' as const, align: 'right' as const },
    ];

    const rows = orders.map((o: any) => ({
      id: o.id,
      code: o.code,
      equipmentName: o.equipmentName,
      type: o.type,
      priority: o.priority,
      status: o.status,
      openedAt: new Date(o.createdAt).toLocaleDateString('pt-BR'),
      estimatedHours: `${o.estimatedHours || 4} h`,
      totalCost: (o.estimatedHours || 4) * 120 + 250,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        totalCost: rows.reduce((acc: number, r: any) => acc + r.totalCost, 0),
      },
    };
  },
};
