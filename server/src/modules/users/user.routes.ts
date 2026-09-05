import { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/db/prisma';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { createUserSchema } from './user.schemas';
import { requireAuthentication } from '../../shared/middleware/authGuard';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';

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
    const actor = request.actor!;
    const { authUserId } = actor;
    const routeStart = performance.now();
    const mark = (name: string, start: number) => request.log.info({ durationMs: Number((performance.now() - start).toFixed(2)), url: request.url }, `[USER_ME_PERF] ${name}`);
    request.log.info({ authUserId }, '[AUTH_TRACE] GET /users/me START');

    if (!actor.userId || !actor.profile) {
      mark('response_sent', routeStart);
      throw new AppError('Perfil não provisionado no banco local.', 404, 'PROFILE_NOT_PROVISIONED');
    }
    const user = actor.profile;
    const membershipStart = performance.now();
    mark('membership_start', membershipStart);
    const membership = actor.membership;
    mark('membership_end', membershipStart);

    const organizationStart = performance.now();
    mark('organization_start', organizationStart);
    const workspaceStart = performance.now();
    mark('company_workspace_start', workspaceStart);
    const [organization, workspace] = membership
      ? await Promise.all([
          prisma.organization.findUnique({
            where: { id: membership.organizationId },
            select: {
              name: true,
              onboardingState: { select: { completed: true, currentStep: true } },
            },
          }),
          prisma.company.findFirst({
            where: { organizationId: membership.organizationId, status: 'ativo' },
            orderBy: { createdAt: 'asc' },
            select: { name: true },
          }),
        ])
      : [null, null];
    mark('organization_end', organizationStart);
    mark('company_workspace_end', workspaceStart);

    const data = {
     id: user.id,
     authUserId: user.authUserId,
     name: user.name,
     email: user.email,
     phone: user.phone || undefined,
     role: membership ? membership.role : '',
      organizationId: membership ? membership.organizationId : '',
      organizationName: organization?.name || '',
      workspaceName: workspace?.name || organization?.name || '',
      status: membership ? membership.status : 'sem_organizacao',
      onboardingCompleted: organization?.onboardingState?.completed || false,
      onboardingStep: organization?.onboardingState?.currentStep || 0,
    };

    const totalMs = performance.now() - routeStart;
    request.log.info({ authUserId, totalMs, hasOrganization: !!membership }, `[AUTH_TRACE] GET /users/me END (${totalMs}ms)`);
    const response: ApiResponse<typeof data> = { data };
    mark('response_sent', routeStart);
    return reply.send(response);
  });

  app.patch('/api/v1/users/me', {
    schema: {
      description: 'Atualizar dados editáveis do usuário autenticado',
      tags: ['Usuários'],
    },
    preHandler: [requireAuthentication()],
  }, async (request, reply) => {
    const { authUserId } = request.actor!;
    const body = request.body as { name?: string; phone?: string };
    if (!body.name?.trim()) {
      throw new AppError('O nome completo é obrigatório.', 422, 'VALIDATION_ERROR');
    }
    const user = await prisma.user.update({
      where: { authUserId },
      data: { name: body.name.trim(), phone: body.phone?.trim() || null },
    });
    const response: ApiResponse<typeof user> = { data: user };
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
