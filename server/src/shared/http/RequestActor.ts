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

      if (error) {
        request.log.error(error, `[Auth] Erro retornado pelo Supabase.auth.getUser para o token fornecido.`);
      }

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

          let companyIds: string[] = [];
          let unitIds: string[] = [];
          let farmIds: string[] = [];
          let organizationId = '';
          let permissions: EffectivePermission[] = [];

          // Buscar o vínculo organizacional ativo do usuário
          const membership = await prisma.organizationMembership.findFirst({
            where: {
              userId: user.id,
              status: 'ativo',
            },
            include: {
              scope: true,
            },
          });

          if (membership) {
            organizationId = membership.organizationId;
            const scope = membership.scope;

            if (scope) {
              // 1. Resolver empresas da organização
              if (scope.allCompanies) {
                const companies = await prisma.company.findMany({
                  where: { organizationId, status: 'ativo' },
                  select: { id: true },
                });
                companyIds = companies.map((c) => c.id);
              } else if (scope.companyIds && Array.isArray(scope.companyIds)) {
                companyIds = scope.companyIds as string[];
              }

              // 2. Resolver unidades das empresas permitidas
              if (scope.allUnits) {
                const units = await prisma.unit.findMany({
                  where: { organizationId, companyId: { in: companyIds }, status: 'ativo' },
                  select: { id: true },
                });
                unitIds = units.map((u) => u.id);
              } else if (scope.unitIds && Array.isArray(scope.unitIds)) {
                unitIds = scope.unitIds as string[];
              }

              // 3. Resolver fazendas das unidades permitidas
              if (scope.allFarms) {
                const farms = await prisma.farm.findMany({
                  where: { organizationId, unitId: { in: unitIds }, status: 'ativo' },
                  select: { id: true },
                });
                farmIds = farms.map((f) => f.id);
              } else if (scope.farmIds && Array.isArray(scope.farmIds)) {
                farmIds = scope.farmIds as string[];
              }
            }

            // O proprietário ou administradores têm acesso completo
            const isAdmin =
              membership.role === 'proprietario' ||
              membership.role === 'administrador' ||
              user.userRoles.some((ur) => ur.role.code === 'admin');

            if (isAdmin) {
              permissions = [{ module: 'all', action: 'all', allowed: true }];
            } else {
              // Permissões padrão para outros papéis (ex: técnico)
              permissions = [
                { module: 'equipments', action: 'read', allowed: true },
                { module: 'work-orders', action: 'read', allowed: true },
                { module: 'work-orders', action: 'create', allowed: true },
                { module: 'work-orders', action: 'update', allowed: true },
                { module: 'checklists', action: 'all', allowed: true },
              ];
            }
          }

          request.actor = {
            authUserId: authUser.id,
            userId: user.id,
            organizationId,
            companyIds,
            unitIds,
            farmIds,
            workshopIds: [],
            warehouseIds: [],
            roleIds: user.userRoles.map((ur) => ur.roleId),
            permissions,
            isMockActor: false,
          };
          return;
        } else {
          // Usuário existe no Supabase Auth mas ainda não foi provisionado no banco interno do AgroGuard
          request.actor = {
            authUserId: authUser.id,
            userId: '',
            organizationId: '',
            companyIds: [],
            unitIds: [],
            farmIds: [],
            workshopIds: [],
            warehouseIds: [],
            roleIds: [],
            permissions: [],
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
