import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { equipmentService } from './equipment.service';

export const reportCostsService = {
  async getCostsReport(filters?: ReportFilter): Promise<ReportTableData> {
    let equipments = await equipmentService.getAllEquipments();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      equipments = equipments.filter((e: any) => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
    }

    if (filters?.equipmentId) {
      equipments = equipments.filter((e: any) => e.id === filters.equipmentId);
    }

    const columns = [
      { id: 'code', label: 'Cód. Equipamento', visible: true },
      { id: 'name', label: 'Equipamento', visible: true },
      { id: 'partsCost', label: 'Custo Peças', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'tiresCost', label: 'Custo Pneus', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'laborCost', label: 'Mão de Obra', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'totalCost', label: 'Custo Total', visible: true, format: 'currency' as const, align: 'right' as const },
    ];

    const rows = equipments.map((e: any) => {
      const partsCost = (e.hourlyCost || 40) * 45;
      const tiresCost = 3500;
      const laborCost = (e.hourlyCost || 40) * 30;
      const totalCost = partsCost + tiresCost + laborCost;

      return {
        id: e.id,
        code: e.code,
        name: e.name,
        partsCost,
        tiresCost,
        laborCost,
        totalCost,
      };
    });

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        partsCost: rows.reduce((acc: number, r: any) => acc + r.partsCost, 0),
        tiresCost: rows.reduce((acc: number, r: any) => acc + r.tiresCost, 0),
        laborCost: rows.reduce((acc: number, r: any) => acc + r.laborCost, 0),
        totalCost: rows.reduce((acc: number, r: any) => acc + r.totalCost, 0),
      },
    };
  },
};
