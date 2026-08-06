import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { createUserSchema } from './user.schemas';
import { requireAuthentication } from '../../shared/middleware/authGuard';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();
const repo = new UserRepository(prisma);
const service = new UserService(repo);

export async function userRoutes(app: FastifyInstance) {
  app.get('/api/v1/users/me', {
    schema: {
      description: 'Obter perfil do usuário autenticado',
      tags: ['Usuários'],
    },
    preHandler: [requireAuthentication()],
  }, async (request, reply) => {
    const { authUserId } = request.actor!;

    const user = await prisma.user.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          where: { status: 'ativo' },
          include: {
            organization: {
              include: {
                onboardingState: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return reply.send({
        data: {
          id: '',
          authUserId,
          name: '',
          email: '',
          role: '',
          organizationId: '',
          status: 'novo',
          onboardingCompleted: false,
          onboardingStep: 0,
        },
      });
    }

    const membership = user.memberships[0];

    const data = {
      id: user.id,
      authUserId: user.authUserId,
      name: user.name,
      email: user.email,
      role: membership ? membership.role : '',
      organizationId: membership ? membership.organizationId : '',
      status: membership ? membership.status : 'sem_organizacao',
      onboardingCompleted: membership && membership.organization.onboardingState ? membership.organization.onboardingState.completed : false,
      onboardingStep: membership && membership.organization.onboardingState ? membership.organization.onboardingState.currentStep : 0,
    };

    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  app.get('/api/v1/users', {
    schema: {
      description: 'Listar usuários com paginação e busca',
      tags: ['Usuários'],
    },
  }, async (request, reply) => {
    const { page, pageSize, search } = request.query as { page?: number; pageSize?: number; search?: string };
    const result = await service.listUsers(page, pageSize, search);
    const response: ApiResponse<typeof result.data> = { data: result.data, meta: result.meta };
    return reply.send(response);
  });

  app.get('/api/v1/users/:id', {
    schema: {
      description: 'Obter ficha do usuário',
      tags: ['Usuários'],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await service.getUserById(id);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  app.post('/api/v1/users', {
    schema: {
      description: 'Cadastrar novo usuário',
      tags: ['Usuários'],
    },
  }, async (request, reply) => {
    const body = createUserSchema.parse(request.body);
    const data = await service.createUser(body);
    const response: ApiResponse<typeof data> = { data };
    return reply.status(201).send(response);
  });

  app.get('/api/v1/roles', {
    schema: {
      description: 'Listar perfis de acesso',
      tags: ['Usuários'],
    },
  }, async (request, reply) => {
    const data = await service.listRoles();
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });
}
