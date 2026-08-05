import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../config/env';

export interface RequestActor {
  userId: string;
  organizationId: string;
  companyIds: string[];
  unitIds: string[];
  farmIds: string[];
  roleIds: string[];
  isMockActor: boolean;
}

declare module 'fastify' {
  interface FastifyRequest {
    actor?: RequestActor;
  }
}

export async function requestActorMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Em desenvolvimento e testes, resolve o contexto de usuário provisório se ativado
  const mockEnabled = process.env.MOCK_ACTOR_ENABLED !== 'false';

  if (mockEnabled) {
    request.actor = {
      userId: process.env.MOCK_ACTOR_USER_ID || 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380bb1',
      organizationId: process.env.MOCK_ACTOR_ORGANIZATION_ID || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      companyIds: ['b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'],
      unitIds: ['c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'],
      farmIds: ['d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'],
      roleIds: ['c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'],
      isMockActor: true,
    };
  }
}
