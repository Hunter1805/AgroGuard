import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { tiresService } from './tires.service';

export const reportTiresService = {
  async getTiresReport(filters?: ReportFilter): Promise<ReportTableData> {
    let tires = await tiresService.getTires();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      tires = tires.filter(
        (t: any) =>
          (t.internalCode && t.internalCode.toLowerCase().includes(q)) ||
          (t.brand && t.brand.toLowerCase().includes(q)) ||
          (t.model && t.model.toLowerCase().includes(q))
      );
    }

    const columns = [
      { id: 'code', label: 'Cód. Interno / Fogo', visible: true },
      { id: 'brandModel', label: 'Marca / Modelo', visible: true },
      { id: 'size', label: 'Medida', visible: true },
      { id: 'currentTreadDepthMm', label: 'Sulco Atual', visible: true, align: 'right' as const },
      { id: 'currentPressurePsi', label: 'Pressão Atual', visible: true, align: 'right' as const },
      { id: 'equipmentName', label: 'Equipamento', visible: true },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
      { id: 'purchaseCost', label: 'Custo Compra', visible: true, format: 'currency' as const, align: 'right' as const },
    ];

    const rows = tires.map((t: any) => ({
      id: t.id,
      code: t.internalCode || t.id,
      brandModel: `${t.brand || ''} ${t.model || ''}`.trim() || 'N/I',
      size: t.size,
      currentTreadDepthMm: `${t.currentTreadDepth || 12} mm`,
      currentPressurePsi: `${t.currentPressure || 32} PSI`,
      equipmentName: t.assignedEquipmentId ? `Equipamento (${t.assignedEquipmentId})` : 'Almoxarifado',
      status: t.status,
      purchaseCost: t.acquisitionValue || 3500.00,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        purchaseCost: rows.reduce((acc: number, r: any) => acc + r.purchaseCost, 0),
      },
    };
  },
};
