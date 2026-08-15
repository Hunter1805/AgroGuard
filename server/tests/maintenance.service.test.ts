import { describe, expect, it, vi } from 'vitest';
import { MaintenanceService } from '../src/modules/maintenance/maintenance.service';
import { AppError } from '../src/shared/errors/AppError';
import { MaintenanceScheduleStatus } from '@prisma/client';

const actor = { organizationId: 'org-a', userId: 'user-a' } as any;
const audit = { log: vi.fn() } as any;
const baseRepo = () => ({
  findPlan: vi.fn(), listPlans: vi.fn(), createPlan: vi.fn(), updatePlan: vi.fn(), archivePlan: vi.fn(),
  findEquipment: vi.fn(), findLink: vi.fn(), createLink: vi.fn(), deleteLink: vi.fn(), listLinks: vi.fn(),
  findSchedule: vi.fn(), listSchedules: vi.fn(), createSchedule: vi.fn(), updateSchedule: vi.fn(), findWorkOrder: vi.fn(),
  createInterval: vi.fn(), updateInterval: vi.fn(),
});

describe('MaintenanceService', () => {
  it('cria plano usando a organização do ator', async () => { const repo = baseRepo(); repo.createPlan.mockResolvedValue({ id: 'p1', name: 'Plano' }); const result = await new MaintenanceService(repo as any, audit).createPlan(actor, { name: 'Plano' }); expect(result.id).toBe('p1'); expect(repo.createPlan).toHaveBeenCalledWith(expect.objectContaining({ organizationId: 'org-a' })); });
  it('bloqueia vínculo duplicado', async () => {
    const repo = baseRepo(); repo.findPlan.mockResolvedValue({ id: 'p1' }); repo.findEquipment.mockResolvedValue({ id: 'e1' }); repo.findLink.mockResolvedValue({ id: 'l1' }); await expect(new MaintenanceService(repo as any, audit).linkEquipment(actor, 'p1', { equipmentId: 'e1' })).rejects.toMatchObject({ code: 'DUPLICATE_RECORD' });
  });
  it('valida transição inválida e permite conclusão', async () => { const repo = baseRepo(); repo.findSchedule.mockResolvedValue({ id: 's1', status: MaintenanceScheduleStatus.SCHEDULED }); const service = new MaintenanceService(repo as any, audit); await expect(service.updateStatus(actor, 's1', { status: MaintenanceScheduleStatus.COMPLETED })).rejects.toBeInstanceOf(AppError); repo.findSchedule.mockResolvedValue({ id: 's1', status: MaintenanceScheduleStatus.IN_PROGRESS }); repo.updateSchedule.mockResolvedValue({ id: 's1', status: MaintenanceScheduleStatus.COMPLETED }); await expect(service.updateStatus(actor, 's1', { status: MaintenanceScheduleStatus.COMPLETED })).resolves.toBeTruthy(); });
});
