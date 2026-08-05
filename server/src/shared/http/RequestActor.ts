import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';
import type { AuthenticatedActor, EffectivePermission } from './AuthenticatedActor';

const prisma = new PrismaClient();

export interface RequestActor extends AuthenticatedActor {
  isMockActor?: boolean;
}

declare module 'fastify' {
  interface FastifyRequest {
    actor?: RequestActor;
  }
}

export async function requestActorMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  // 1. Extração do Bearer Token no formato Standard Authorization: Bearer <token>
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });

      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

      if (!error && authUser) {
        // Buscar usuário interno correspondente pelo UUID authUserId ou por e-mail no primeiro login
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { authUserId: authUser.id },
              { email: authUser.email },
            ],
            status: 'ativo',
            archivedAt: null,
            deletedAt: null,
          },
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (user) {
          // Atualizar o authUserId se foi associado pelo e-mail
          if (!user.authUserId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { authUserId: authUser.id },
            });
          }

          // Buscar dados organizacionais associados ao usuário
          const org = await prisma.organization.findFirst({ where: { status: 'ativo' } });
          const company = await prisma.company.findFirst({ where: { status: 'ativo' } });
          const unit = await prisma.unit.findFirst({ where: { status: 'ativo' } });
          const farm = await prisma.farm.findFirst({ where: { status: 'ativo' } });

          const defaultPermissions: EffectivePermission[] = [
            { module: 'all', action: 'all', allowed: true },
          ];

          request.actor = {
            authUserId: authUser.id,
            userId: user.id,
            organizationId: org?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            companyIds: company ? [company.id] : ['b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'],
            unitIds: unit ? [unit.id] : ['c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'],
            farmIds: farm ? [farm.id] : ['d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'],
            workshopIds: [],
            warehouseIds: [],
            roleIds: user.userRoles.map((ur) => ur.roleId),
            permissions: defaultPermissions,
            isMockActor: false,
          };
          return;
        }
      }
    } catch (e) {
      request.log.error(e, 'Erro ao verificar token do Supabase Auth');
    }
  }

  // 2. Fallback somente para testes locais se MOCK_ACTOR_ENABLED estiver explicitamente ativado
  const mockEnabled = process.env.MOCK_ACTOR_ENABLED === 'true' && env.NODE_ENV !== 'production';

  if (mockEnabled) {
    const defaultPermissions: EffectivePermission[] = [
      { module: 'all', action: 'all', allowed: true },
    ];

    request.actor = {
      authUserId: 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380bb1',
      userId: process.env.MOCK_ACTOR_USER_ID || 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380bb1',
      organizationId: process.env.MOCK_ACTOR_ORGANIZATION_ID || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      companyIds: ['b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'],
      unitIds: ['c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'],
      farmIds: ['d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'],
      workshopIds: [],
      warehouseIds: [],
      roleIds: ['c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'],
      permissions: defaultPermissions,
      isMockActor: true,
    };
  }
}
