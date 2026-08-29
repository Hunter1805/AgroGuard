import { describe, it, expect, vi } from 'vitest';
import { OrganizationService } from '../../src/modules/organizations/organization.service';
import { OrganizationRepository } from '../../src/modules/organizations/organization.repository';
import { StockService } from '../../src/modules/stock/stock.service';
import { StockRepository } from '../../src/modules/stock/stock.repository';
import type { RequestActor } from '../../src/shared/http/RequestActor';

describe('Isolamento Multitenant Cross-Tenant - Serviços de Backend', () => {
  // --- Testes para OrganizationService ---
  describe('OrganizationService', () => {
    const mockRepo = {
      findOrganizations: vi.fn(),
      findOrganizationById: vi.fn(async (id) => ({ id, name: 'Org Teste' })),
    } as unknown as OrganizationRepository;

    const service = new OrganizationService(mockRepo);

    it('deve permitir getOrganizationDetail se o ator for da mesma organização', async () => {
      const actor = { organizationId: 'org-A', userId: 'user-1' } as RequestActor;
      const result = await service.getOrganizationDetail('org-A', actor);
      expect(result.id).toBe('org-A');
    });

    it('deve bloquear getOrganizationDetail (HTTP 403) se o ator tentar acessar outra organização', async () => {
      const actor = { organizationId: 'org-A', userId: 'user-1' } as RequestActor;
      await expect(service.getOrganizationDetail('org-B', actor)).rejects.toThrow(
        'Acesso negado a recursos de outra organização.'
      );
    });

    it('deve retornar vazio se listOrganizations for chamado sem organizationId no ator', async () => {
      const actor = { userId: 'user-1' } as RequestActor; // sem organizationId
      const result = await service.listOrganizations(actor);
      expect(result).toEqual([]);
      expect(mockRepo.findOrganizations).not.toHaveBeenCalled();
    });
  });

  // --- Testes para StockService ---
  describe('StockService', () => {
    const mockRepo = {
      findItemById: vi.fn(async (id, orgId) => {
        if (id === 'item-A' && orgId === 'org-A') return { id, organizationId: orgId };
        return null;
      }),
      findWorkOrderById: vi.fn(async (id, orgId) => {
        if (id === 'wo-A' && orgId === 'org-A') return { id, organizationId: orgId };
        return null;
      }),
      processMovementTransaction: vi.fn(async () => ({ success: true })),
    } as unknown as StockRepository;

    const service = new StockService(mockRepo);

    it('deve permitir processMovement se o item e a OS pertencerem à mesma organização do ator', async () => {
      const actor = { organizationId: 'org-A', userId: 'user-1' } as RequestActor;
      const result = await service.processMovement(
        actor,
        'warehouse-1',
        'item-A',
        'entrada',
        10,
        5.0,
        'wo-A'
      );
      expect(result).toEqual({ success: true });
    });

    it('deve bloquear processMovement se o item pertencer a outro tenant', async () => {
      const actor = { organizationId: 'org-B', userId: 'user-1' } as RequestActor;
      await expect(
        service.processMovement(actor, 'warehouse-1', 'item-A', 'entrada', 10, 5.0, 'wo-A')
      ).rejects.toThrow('Item de estoque não encontrado ou pertence a outra organização.');
    });

    it('deve bloquear processMovement se a OS pertencer a outro tenant', async () => {
      const actor = { organizationId: 'org-A', userId: 'user-1' } as RequestActor;
      await expect(
        service.processMovement(actor, 'warehouse-1', 'item-A', 'entrada', 10, 5.0, 'wo-B') // wo-B pertence a org-B (findWorkOrderById retornará null para org-A)
      ).rejects.toThrow('Ordem de serviço não encontrada ou pertence a outra organização.');
    });
  });
});
