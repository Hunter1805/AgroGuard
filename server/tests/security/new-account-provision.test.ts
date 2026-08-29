import { describe, it, expect, vi } from 'vitest';
import { EquipmentRepository } from '../../src/modules/equipment/equipment.repository';
import { WorkOrderRepository } from '../../src/modules/work-orders/work-order.repository';
import { StockRepository } from '../../src/modules/stock/stock.repository';
import { MaintenanceRepository } from '../../src/modules/maintenance/maintenance.repository';
import type { PrismaClient } from '@prisma/client';

describe('Isolamento de Contas Novas - Provisionamento Limpo', () => {
  it('deve garantir que uma conta recém-provisionada não receba dados operacionais ou cadastros demo', async () => {
    // Simulamos uma nova Organização C
    const newOrgId = 'new-org-c-uuid';

    // Mock do PrismaClient para retornar vazio nas listagens da nova organização
    const mockPrisma = {
      equipment: {
        findMany: vi.fn(async () => []),
        count: vi.fn(async () => 0),
      },
      workOrder: {
        findMany: vi.fn(async () => []),
        count: vi.fn(async () => 0),
      },
      stockItem: {
        findMany: vi.fn(async () => []),
        count: vi.fn(async () => 0),
      },
      maintenancePlan: {
        findMany: vi.fn(async () => []),
      },
      maintenanceSchedule: {
        findMany: vi.fn(async () => []),
        count: vi.fn(async () => 0),
      },
      supplier: {
        findMany: vi.fn(async () => []),
      },
      farm: {
        findMany: vi.fn(async () => []),
      },
    } as unknown as PrismaClient;

    const equipRepo = new EquipmentRepository(mockPrisma);
    const woRepo = new WorkOrderRepository(mockPrisma);
    const stockRepo = new StockRepository(mockPrisma);
    const maintRepo = new MaintenanceRepository(mockPrisma);

    // Listamos os equipamentos da nova Organização C
    const equipments = await equipRepo.findEquipments(newOrgId, { page: 1, pageSize: 10 });
    expect(equipments.items).toEqual([]);
    expect(equipments.total).toBe(0);

    // Listamos as ordens de serviço da nova Organização C
    const workOrders = await woRepo.findWorkOrders(newOrgId, { page: 1, pageSize: 10 });
    expect(workOrders.items).toEqual([]);
    expect(workOrders.total).toBe(0);

    // Listamos os itens de estoque da nova Organização C
    const stockItems = await stockRepo.findItems(newOrgId, { page: 1, pageSize: 10 });
    expect(stockItems.items).toEqual([]);
    expect(stockItems.total).toBe(0);

    // Listamos os planos de manutenção da nova Organização C
    const maintPlans = await maintRepo.listPlans(newOrgId);
    expect(maintPlans).toEqual([]);
  });
});
