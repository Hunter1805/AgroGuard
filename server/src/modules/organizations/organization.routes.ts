import type { FastifyInstance } from 'fastify';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { prisma } from '../../shared/db/prisma';
const repo = new OrganizationRepository(prisma);
const service = new OrganizationService(repo);

export async function organizationRoutes(app: FastifyInstance) {
  app.get('/api/v1/organizations', {
    schema: {
      description: 'Listar estrutura organizacional (empresas, unidades, fazendas)',
      tags: ['Organizações'],
    },
  }, async (request, reply) => {
    const data = await service.listOrganizations(request.actor);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  app.get('/api/v1/organizations/:id', {
    schema: {
      description: 'Detalhes de uma organização',
      tags: ['Organizações'],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await service.getOrganizationDetail(id, request.actor);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });
}
