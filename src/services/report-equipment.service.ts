import type { ReportFilter } from '../types/report-filters';
import type { ReportTableData } from '../types/reports';
import { equipmentService } from './equipment.service';

export const reportEquipmentService = {
  async getEquipmentReport(filters?: ReportFilter): Promise<ReportTableData> {
    let equipments = await equipmentService.getAllEquipments();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      equipments = equipments.filter((e: any) => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
    }

    if (filters?.equipmentId) {
      equipments = equipments.filter((e: any) => e.id === filters.equipmentId);
    }

    const columns = [
      { id: 'code', label: 'Código', visible: true },
      { id: 'name', label: 'Equipamento', visible: true },
      { id: 'type', label: 'Tipo', visible: true },
      { id: 'brandModel', label: 'Marca / Modelo', visible: true },
      { id: 'status', label: 'Status', visible: true, format: 'badge' as const },
      { id: 'currentReading', label: 'Leitura Atual', visible: true, format: 'number' as const, align: 'right' as const },
      { id: 'totalCost', label: 'Custo no Período', visible: true, format: 'currency' as const, align: 'right' as const },
      { id: 'paradaHours', label: 'Horas de Parada', visible: true, format: 'number' as const, align: 'right' as const },
    ];

    const rows = equipments.map((e: any) => ({
      id: e.id,
      code: e.code,
      name: e.name,
      type: e.type,
      brandModel: `${e.brand || 'N/I'} ${e.model || ''}`,
      status: e.status,
      currentReading: `${e.currentReading || 0} h`,
      totalCost: (e.hourlyCost || 45) * 120,
      paradaHours: e.status === 'manutencao' || e.status === 'bloqueado' ? 72 : 0,
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
      totals: {
        totalCost: rows.reduce((acc: number, r: any) => acc + r.totalCost, 0),
        paradaHours: rows.reduce((acc: number, r: any) => acc + r.paradaHours, 0),
      },
    };
  },
};
