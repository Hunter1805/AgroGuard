import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { partsService } from './parts.service';

export const reportStockService = {
  async getStockReport(filters?: ReportFilter): Promise<ReportTableData> {
    let items = await partsService.getStockItems();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((i: any) => i.name.toLowerCase().includes(q) || i.internalCode.toLowerCase().includes(q));
    }

    const columns = [
      { id: 'internalCode', label: 'Cód. Interno', visible: true },
      { id: 'name', label: 'Item / Peça', visible: true },
      { id: 'type', label: 'Tipo', visible: true },
      { id: 'currentQuantity', label: 'Qtd Atual', visible: true, align: 'right' as const },
      { id: 'reservedQuantity', label: 'Reservado', visible: true, align: 'right' as const },
      { id: 'availableQuantity', label: 'Disponível', visible: true, align: 'right' as const },
      { id: 'averageCost', label: 'Custo Médio', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'totalStockValue', label: 'Valor Total', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
    ];

    const rows = items.map((i: any) => ({
      id: i.id,
      internalCode: i.internalCode,
      name: i.name,
      type: i.type,
      currentQuantity: `${i.currentQuantity} ${i.controlUnit}`,
      reservedQuantity: `${i.reservedQuantity} ${i.controlUnit}`,
      availableQuantity: `${i.availableQuantity} ${i.controlUnit}`,
      averageCost: i.averageCost,
      totalStockValue: i.totalStockValue,
      status: i.status,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        totalStockValue: rows.reduce((acc: number, r: any) => acc + r.totalStockValue, 0),
      },
    };
  },
};
