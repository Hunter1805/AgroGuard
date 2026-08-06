import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { requireAuthentication, requirePermission } from '../../shared/middleware/authGuard';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();

interface InvitationPayload {
  email: string;
  role: string;
  scope: {
    allCompanies: boolean;
    allUnits: boolean;
    allFarms: boolean;
    companyIds?: string[];
    unitIds?: string[];
    farmIds?: string[];
  };
}

interface AcceptPayload {
  name: string;
  password?: string;
}

export async function invitationRoutes(app: FastifyInstance) {
  // 1. Listar membros da organização atual
  app.get('/api/v1/users/org', {
    schema: {
      description: 'Listar todos os membros da organização atual com filtros e escopo',
      tags: ['Organizações - Usuários'],
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          status: { type: 'string' },
          role: { type: 'string' },
        },
      },
    },
    preHandler: [requireAuthentication()],
  }, async (request, reply) => {
    const { organizationId } = request.actor!;
    const { search, status, role } = request.query as { search?: string; status?: string; role?: string };

    const memberships = await prisma.organizationMembership.findMany({
      where: {
        organizationId,
        status: status || undefined,
        role: role || undefined,
        user: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
      },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
        scope: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = memberships.map((m) => ({
      membershipId: m.id,
      userId: m.user.id,
      authUserId: m.user.authUserId,
      name: m.user.name,
      email: m.user.email,
      phone: m.user.phone,
      role: m.role,
      status: m.status,
      scope: m.scope,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));

    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  // 2. Convidar novo usuário para a organização
  app.post('/api/v1/users/invitations', {
    schema: {
      description: 'Enviar convite de acesso para um novo funcionário',
      tags: ['Organizações - Convites'],
      body: {
        type: 'object',
        required: ['email', 'role', 'scope'],
        properties: {
          email: { type: 'string', format: 'email' },
          role: { type: 'string' },
          scope: {
            type: 'object',
            required: ['allCompanies', 'allUnits', 'allFarms'],
            properties: {
              allCompanies: { type: 'boolean' },
              allUnits: { type: 'boolean' },
              allFarms: { type: 'boolean' },
              companyIds: { type: 'array', items: { type: 'string' } },
              unitIds: { type: 'array', items: { type: 'string' } },
              farmIds: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'create')],
  }, async (request, reply) => {
    const { organizationId, userId: actorUserId } = request.actor!;
    const body = request.body as InvitationPayload;

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    // Verificar se o e-mail já possui convite ativo ou já é membro ativo na organização
    const existingMembership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        user: { email: { equals: body.email, mode: 'insensitive' } },
      },
    });

    if (existingMembership) {
      throw new AppError('Este usuário já é membro ou possui cadastro ativo nesta organização.', 400, 'USER_ALREADY_MEMBER');
    }

    const existingInvitation = await prisma.userInvitation.findFirst({
      where: {
        organizationId,
        email: { equals: body.email, mode: 'insensitive' },
        status: 'pendente',
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new AppError('Já existe um convite pendente ativo para este e-mail nesta organização.', 400, 'INVITATION_ALREADY_EXISTS');
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Convite expira em 48 horas

    // Criar o registro de convite pendente no banco
    const invitation = await prisma.userInvitation.create({
      data: {
        organizationId,
        email: body.email.toLowerCase(),
        role: body.role,
        scope: {
          allCompanies: body.scope.allCompanies,
          allUnits: body.scope.allUnits,
          allFarms: body.scope.allFarms,
          companyIds: body.scope.companyIds || [],
          unitIds: body.scope.unitIds || [],
          farmIds: body.scope.farmIds || [],
        },
        token,
        status: 'pendente',
        expiresAt,
      },
    });

    // Chamar Supabase Auth Admin para gerar o convite e e-mail
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // O link de redirecionamento aponta para a tela de aceitar convite no frontend
    const acceptLink = `${env.CORS_ORIGIN || 'http://localhost:5173'}/aceitar-convite?token=${token}`;

    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(body.email.toLowerCase(), {
      redirectTo: acceptLink,
    });

    if (inviteError) {
      // Registrar erro, mas manter o convite no banco (o administrador pode reenviar depois se falhar o envio de e-mail)
      request.log.error(inviteError, 'Erro ao disparar convite administrativo no Supabase Auth');
    }

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'invitation',
        entityId: invitation.id,
        action: 'create_invitation',
        newData: { email: body.email, role: body.role },
      },
    });

    const response: ApiResponse<typeof invitation> = { data: invitation };
    return reply.status(201).send(response);
  });

  // 3. Aceitar convite (endpoint público - sem requireAuthentication)
  app.post('/api/v1/users/invitations/:token/accept', {
    schema: {
      description: 'Aceitar um convite de acesso, definindo a senha e nome do usuário',
      tags: ['Organizações - Convites'],
      params: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['name', 'password'],
        properties: {
          name: { type: 'string' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  }, async (request, reply) => {
    const { token } = request.params as { token: string };
    const body = request.body as AcceptPayload;

    const invitation = await prisma.userInvitation.findUnique({
      where: { token },
    });

    if (!invitation || invitation.status !== 'pendente' || invitation.expiresAt < new Date()) {
      throw new AppError('O convite é inválido, já foi aceito ou expirou.', 400, 'INVITATION_INVALID');
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Resolver usuário no Supabase Auth.
    // Como ele foi convidado, ele já deve constar na base de usuários.
    let authUserId = '';
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new AppError('Erro ao listar usuários no Supabase.', 500, 'AUTH_LIST_ERROR');
    }

    const existingAuthUser = users.find(u => u.email?.toLowerCase() === invitation.email.toLowerCase());

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
      // Atualizar a senha e marcar e-mail como confirmado
      const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
        password: body.password,
        email_confirm: true,
        user_metadata: { name: body.name },
      });
      if (updateError) {
        throw new AppError('Falha ao definir credenciais no provedor de autenticação.', 500, 'AUTH_UPDATE_ERROR');
      }
    } else {
      // Caso não exista ainda, criamos o usuário diretamente confirmado
      const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
        email: invitation.email,
        password: body.password,
        email_confirm: true,
        user_metadata: { name: body.name },
      });
      if (createError || !newAuthUser.user) {
        throw new AppError('Erro ao criar usuário no provedor de autenticação.', 500, 'AUTH_CREATE_ERROR');
      }
      authUserId = newAuthUser.user.id;
    }

    // 2. Executar a transação Prisma para ativar o usuário, associar membership e escopo
    const result = await prisma.$transaction(async (tx) => {
      // Buscar ou criar o usuário interno
      let user = await tx.user.findUnique({
        where: { email: invitation.email },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            authUserId,
            name: body.name,
            email: invitation.email,
            status: 'ativo',
            type: 'interno',
          },
        });
      } else {
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            authUserId,
            name: body.name,
            status: 'ativo',
          },
        });
      }

      // Criar a membership na organização
      const membership = await tx.organizationMembership.create({
        data: {
          organizationId: invitation.organizationId,
          userId: user.id,
          role: invitation.role,
          status: 'ativo',
        },
      });

      // Criar o escopo do usuário convidado
      const scopeData = invitation.scope as any;
      await tx.organizationScope.create({
        data: {
          membershipId: membership.id,
          allCompanies: scopeData.allCompanies ?? true,
          allUnits: scopeData.allUnits ?? true,
          allFarms: scopeData.allFarms ?? true,
          companyIds: scopeData.companyIds || [],
          unitIds: scopeData.unitIds || [],
          farmIds: scopeData.farmIds || [],
        },
      });

      // Atualizar o status do convite
      await tx.userInvitation.update({
        where: { id: invitation.id },
        data: { status: 'aceito' },
      });

      // Inicializar preferências do novo usuário
      await tx.userPreference.create({
        data: {
          userId: user.id,
          theme: 'light',
          homeRoute: '/app/dashboard',
          tableDensity: 'comfortable',
          dateFormat: 'dd/MM/yyyy',
          timeFormat: '24h',
          notifications: {
            inApp: true,
            email: true,
            criticalAlerts: true,
            assignedWorkOrders: true,
            overdueTasks: true,
            stockAlerts: true,
          },
        },
      });

      // Registrar auditoria
      await tx.auditLog.create({
        data: {
          organizationId: invitation.organizationId,
          actorUserId: user.id,
          actorName: user.name,
          module: 'users',
          entityType: 'user',
          entityId: user.id,
          action: 'accept_invitation',
        },
      });

      return user;
    });

    const response: ApiResponse<{ message: string; userId: string }> = {
      data: {
        message: 'Convite aceito com sucesso!',
        userId: result.id,
      },
    };
    return reply.status(200).send(response);
  });

  // 4. Reenviar convite pendente
  app.post('/api/v1/users/invitations/:id/resend', {
    schema: {
      description: 'Reenviar convite ativo para o e-mail correspondente',
      tags: ['Organizações - Convites'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'create')],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { organizationId, userId: actorUserId } = request.actor!;

    const invitation = await prisma.userInvitation.findFirst({
      where: { id, organizationId },
    });

    if (!invitation) {
      throw new AppError('Convite não encontrado.', 404, 'INVITATION_NOT_FOUND');
    }

    if (invitation.status !== 'pendente') {
      throw new AppError('Este convite não está mais pendente.', 400, 'INVITATION_NOT_PENDING');
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Renova por 48 horas

    // Atualiza a expiração e o token no banco
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const updated = await prisma.userInvitation.update({
      where: { id },
      data: { expiresAt, token },
    });

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const acceptLink = `${env.CORS_ORIGIN || 'http://localhost:5173'}/aceitar-convite?token=${token}`;

    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(invitation.email, {
      redirectTo: acceptLink,
    });

    if (inviteError) {
      request.log.error(inviteError, 'Erro ao reenviar convite no Supabase Auth');
    }

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'invitation',
        entityId: id,
        action: 'resend_invitation',
      },
    });

    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Convite reenviado com sucesso!' },
    };
    return reply.send(response);
  });

  // 5. Excluir/Cancelar convite pendente
  app.delete('/api/v1/users/invitations/:id', {
    schema: {
      description: 'Cancelar um convite pendente',
      tags: ['Organizações - Convites'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'delete')],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { organizationId, userId: actorUserId } = request.actor!;

    const invitation = await prisma.userInvitation.findFirst({
      where: { id, organizationId },
    });

    if (!invitation) {
      throw new AppError('Convite não encontrado.', 404, 'INVITATION_NOT_FOUND');
    }

    await prisma.userInvitation.update({
      where: { id },
      data: { status: 'cancelado' },
    });

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'invitation',
        entityId: id,
        action: 'cancel_invitation',
      },
    });

    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Convite cancelado com sucesso!' },
    };
    return reply.send(response);
  });

  // 6. Alterar perfil (role) do membro
  app.patch('/api/v1/users/org/:userId/role', {
    schema: {
      description: 'Alterar a função administrativa de um membro',
      tags: ['Organizações - Usuários'],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string' },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'update')],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { organizationId, userId: actorUserId } = request.actor!;
    const { role } = request.body as { role: string };

    const membership = await prisma.organizationMembership.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    if (!membership) {
      throw new AppError('Membro não encontrado nesta organização.', 404, 'MEMBER_NOT_FOUND');
    }

    if (membership.role === 'proprietario' && actorUserId !== userId) {
      throw new AppError('Não é possível alterar a função do proprietário da organização.', 400, 'OWNER_ROLE_IMMUTABLE');
    }

    const updated = await prisma.organizationMembership.update({
      where: { id: membership.id },
      data: { role },
    });

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'membership',
        entityId: membership.id,
        action: 'update_role',
        newData: { role },
      },
    });

    const response: ApiResponse<typeof updated> = { data: updated };
    return reply.send(response);
  });

  // 7. Alterar escopo organizacional do membro
  app.patch('/api/v1/users/org/:userId/scope', {
    schema: {
      description: 'Alterar o escopo geográfico de acesso de um membro',
      tags: ['Organizações - Usuários'],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['allCompanies', 'allUnits', 'allFarms'],
        properties: {
          allCompanies: { type: 'boolean' },
          allUnits: { type: 'boolean' },
          allFarms: { type: 'boolean' },
          companyIds: { type: 'array', items: { type: 'string' } },
          unitIds: { type: 'array', items: { type: 'string' } },
          farmIds: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'update')],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { organizationId, userId: actorUserId } = request.actor!;
    const body = request.body as any;

    const membership = await prisma.organizationMembership.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
      include: { scope: true },
    });

    if (!membership) {
      throw new AppError('Membro não encontrado nesta organização.', 404, 'MEMBER_NOT_FOUND');
    }

    let updatedScope;
    if (membership.scope) {
      updatedScope = await prisma.organizationScope.update({
        where: { membershipId: membership.id },
        data: {
          allCompanies: body.allCompanies,
          allUnits: body.allUnits,
          allFarms: body.allFarms,
          companyIds: body.companyIds || [],
          unitIds: body.unitIds || [],
          farmIds: body.farmIds || [],
        },
      });
    } else {
      updatedScope = await prisma.organizationScope.create({
        data: {
          membershipId: membership.id,
          allCompanies: body.allCompanies,
          allUnits: body.allUnits,
          allFarms: body.allFarms,
          companyIds: body.companyIds || [],
          unitIds: body.unitIds || [],
          farmIds: body.farmIds || [],
        },
      });
    }

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'scope',
        entityId: updatedScope.id,
        action: 'update_scope',
        newData: body,
      },
    });

    const response: ApiResponse<typeof updatedScope> = { data: updatedScope };
    return reply.send(response);
  });

  // 8. Bloquear/Desativar membro da organização
  app.post('/api/v1/users/org/:userId/block', {
    schema: {
      description: 'Bloquear ou reativar o acesso de um membro',
      tags: ['Organizações - Usuários'],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['block'],
        properties: {
          block: { type: 'boolean' },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'update')],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { organizationId, userId: actorUserId } = request.actor!;
    const { block } = request.body as { block: boolean };

    if (userId === actorUserId) {
      throw new AppError('Não é possível bloquear a si mesmo.', 400, 'SELF_BLOCK_FORBIDDEN');
    }

    const membership = await prisma.organizationMembership.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    if (!membership) {
      throw new AppError('Membro não encontrado nesta organização.', 404, 'MEMBER_NOT_FOUND');
    }

    if (membership.role === 'proprietario') {
      throw new AppError('Não é possível bloquear o proprietário da organização.', 400, 'OWNER_BLOCK_FORBIDDEN');
    }

    const updated = await prisma.organizationMembership.update({
      where: { id: membership.id },
      data: { status: block ? 'bloqueado' : 'ativo' },
    });

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'membership',
        entityId: membership.id,
        action: block ? 'block_member' : 'unblock_member',
      },
    });

    const response: ApiResponse<typeof updated> = { data: updated };
    return reply.send(response);
  });

  // 9. Encerrar sessões ativas do usuário no Supabase
  app.post('/api/v1/users/org/:userId/sessions/terminate', {
    schema: {
      description: 'Encerrar todas as sessões ativas de um membro no provedor de autenticação',
      tags: ['Organizações - Usuários'],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
    preHandler: [requireAuthentication(), requirePermission('users', 'update')],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { organizationId, userId: actorUserId } = request.actor!;

    const membership = await prisma.organizationMembership.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
      include: { user: true },
    });

    if (!membership || !membership.user.authUserId) {
      throw new AppError('Membro ou credenciais de login não encontradas.', 404, 'MEMBER_AUTH_NOT_FOUND');
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Revoga todas as sessões do usuário no Supabase
    const { error: signOutError } = await supabase.auth.admin.signOut(membership.user.authUserId);

    if (signOutError) {
      throw new AppError('Falha ao revogar sessões no provedor de autenticação.', 500, 'AUTH_SIGNOUT_ERROR');
    }

    // Registrar auditoria
    const actorUser = await prisma.user.findUnique({ where: { id: actorUserId } });
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorUserId,
        actorName: actorUser?.name || 'Administrador',
        module: 'users',
        entityType: 'user',
        entityId: userId,
        action: 'terminate_sessions',
      },
    });

    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Sessões ativas encerradas com sucesso!' },
    };
    return reply.send(response);
  });
}
