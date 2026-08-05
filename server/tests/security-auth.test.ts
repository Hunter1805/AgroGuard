import { describe, it, expect } from 'vitest';
import { requireAuthentication, requirePermission, requireOrganizationScope, requireResourceAccess } from '../src/shared/middleware/authGuard';
import { schedulerService } from '../src/shared/jobs/scheduler.service';
import { ReadingsAutomationJob } from '../src/jobs/readings.job';

describe('Segurança, Autenticação e Automações (Fase 14)', () => {
  it('deve bloquear requisição sem ator autenticado no requireAuthentication', async () => {
    const middleware = requireAuthentication();
    const mockReq = {} as any;
    await expect(middleware(mockReq, {} as any)).rejects.toThrow('Autenticação necessária para acessar este recurso.');
  });

  it('deve negar permissão se a ação não for permitida', async () => {
    const middleware = requirePermission('equipments', 'excluir');
    const mockReq = {
      actor: {
        permissions: [{ module: 'equipments', action: 'visualizar', allowed: true }],
      },
    } as any;

    await expect(middleware(mockReq, {} as any)).rejects.toThrow("Permissão insuficiente para 'excluir' em 'equipments'.");
  });

  it('deve permitir acesso se a permissão for total (all/all)', async () => {
    const middleware = requirePermission('equipments', 'excluir');
    const mockReq = {
      actor: {
        permissions: [{ module: 'all', action: 'all', allowed: true }],
      },
    } as any;

    await expect(middleware(mockReq, {} as any)).resolves.not.toThrow();
  });

  it('deve bloquear acesso cross-tenant entre organizações diferentes', async () => {
    const middleware = requireResourceAccess((req) => req.params.orgId);
    const mockReq = {
      actor: { organizationId: 'org-111' },
      params: { orgId: 'org-999' },
    } as any;

    await expect(middleware(mockReq, {} as any)).rejects.toThrow('Acesso negado a recursos de outra organização');
  });

  it('deve executar job agendado de automação de leituras com sucesso', async () => {
    const job = new ReadingsAutomationJob();
    schedulerService.registerJob(job);
    const result = await schedulerService.runJob('readings-check', { triggeredAt: new Date() });

    expect(result.success).toBe(true);
    expect(result.jobName).toBe('readings-check');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});
