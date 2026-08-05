import { describe, it, expect } from 'vitest';
import { requireResourceAccess } from '../../src/shared/middleware/authGuard';

describe('Testes de Isolamento Multitenant Cross-Tenant (Fase 15C)', () => {
  const middleware = requireResourceAccess((req) => req.params.organizationId);

  it('deve permitir acesso quando a organização do recurso for a mesma do ator', async () => {
    const req = {
      actor: { organizationId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      params: { organizationId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    } as any;

    await expect(middleware(req, {} as any)).resolves.not.toThrow();
  });

  it('deve bloquear consulta (HTTP 403) quando Organização A tenta acessar dados da Organização B', async () => {
    const req = {
      actor: { organizationId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      params: { organizationId: '99999999-9999-9999-9999-999999999999' },
    } as any;

    await expect(middleware(req, {} as any)).rejects.toThrow('Acesso negado a recursos de outra organização (Cross-Tenant Block).');
  });
});
