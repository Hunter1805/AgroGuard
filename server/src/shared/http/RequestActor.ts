import { FastifyRequest, FastifyReply } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';
import { prisma } from '../db/prisma';
import type { AuthenticatedActor, EffectivePermission } from './AuthenticatedActor';

export interface RequestActor extends AuthenticatedActor {
  isMockActor?: boolean;
  profile?: { id: string; authUserId: string | null; name: string; email: string; phone: string | null; status: string };
  membership?: { organizationId: string; role: string; status: string };
}

const isUserMe = (request: FastifyRequest) => request.url.split('?')[0] === '/api/v1/users/me';
const perf = (request: FastifyRequest, mark: string, start: number, extra: Record<string, unknown> = {}) => {
  if (isUserMe(request)) {
    request.log.info({ durationMs: Number((performance.now() - start).toFixed(2)), url: request.url, ...extra }, `[USER_ME_PERF] ${mark}`);
  }
};

// Reutilizado pelo processo do backend; não criar um cliente Supabase por request.
const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

declare module 'fastify' {
  interface FastifyRequest {
    actor?: RequestActor;
  }
}

export async function requestActorMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const actorStart = performance.now();
  perf(request, 'request_received', actorStart);
  perf(request, 'request_actor_start', actorStart);
  // 1. Extração do Bearer Token no formato Standard Authorization: Bearer <token>
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const authActorStart = performance.now();
    try {
      const supabaseStart = performance.now();
      perf(request, 'supabase_auth_start', supabaseStart);

      // Cria um timer para abortar caso o Supabase demore mais que 8 segundos
      const getUserPromise = supabase!.auth.getUser(token);
      let timeoutId: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Timeout na validação da sessão do Supabase Auth (8s)'));
        }, 8000);
      });

      let authUser = null;
      let error = null;

      try {
        const result = await Promise.race([getUserPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        authUser = result.data.user;
        error = result.error;
      } catch (err: any) {
        clearTimeout(timeoutId);
        request.log.error({ err: err.message, url: request.url }, '[Auth] Falha ou Timeout ao validar token no Supabase');
        throw err;
      }

      const supabaseMs = performance.now() - supabaseStart;
      perf(request, 'supabase_auth_end', supabaseStart);

      if (supabaseMs > 3000) {
        request.log.warn({ supabaseMs, url: request.url }, '[PERF] requestActor: supabase.auth.getUser lento');
      } else {
        request.log.info({ supabaseMs, url: request.url }, '[PERF] requestActor: supabase.auth.getUser concluído');
      }

      if (error) {
        request.log.error(error, `[Auth] Erro retornado pelo Supabase.auth.getUser para o token fornecido.`);
      }

      if (!error && authUser) {
        // Buscar usuário interno correspondente pelo UUID authUserId ou por e-mail no primeiro login
        const dbStart = performance.now();
        perf(request, 'prisma_user_start', dbStart);
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ authUserId: authUser.id }, { email: authUser.email }],
            status: 'ativo', archivedAt: null, deletedAt: null,
          },
          select: {
            id: true,
            authUserId: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            userRoles: {
              select: {
                roleId: true,
                role: { select: { code: true } },
              },
            },
          },
        });
        perf(request, 'prisma_user_end', dbStart);
        const userRoles = user?.userRoles ?? [];
        if (user) {
          // Atualizar o authUserId se foi associado pelo e-mail ou se o UUID de autenticação mudou (ex: recriação de conta)
          if (user.authUserId !== authUser.id) {
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
          const membershipStart = performance.now();
          perf(request, 'membership_start', membershipStart);
          const membership = await prisma.organizationMembership.findFirst({
            where: { userId: user.id, status: 'ativo' },
            select: { organizationId: true, role: true, status: true, scope: true },
          });
          perf(request, 'membership_end', membershipStart);

          if (membership) {
            organizationId = membership.organizationId;
            const scope = membership.scope;

            if (scope) {
              // /users/me não precisa resolver o escopo operacional completo.
              // Esses IDs são necessários para módulos operacionais, não para o perfil.
              if (isUserMe(request)) {
                // Mantém os arrays vazios sem consultar companies, units ou farms.
              } else if (scope.allCompanies) {
                // 1. Resolver empresas da organização
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
              userRoles.some((ur) => ur.role.code === 'admin');

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

          const actorMs = performance.now() - authActorStart;
          const requestActorReport = {
            actorMs: Number(actorMs.toFixed(2)),
            dbMs: Number((performance.now() - dbStart).toFixed(2)),
            supabaseMs: Number(supabaseMs.toFixed(2)),
            scopeResolutionSkipped: isUserMe(request),
            requestActor: true,
            url: request.url,
          };
          request.log.info(requestActorReport, '[AUTH_PERF] request actor report');
          if (actorMs > 2000) {
            request.log.warn(requestActorReport, '[PERF] requestActor: middleware lento');
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
            roleIds: userRoles.map((ur) => ur.roleId),
            permissions,
            isMockActor: false,
            profile: { id: user.id, authUserId: user.authUserId, name: user.name, email: user.email, phone: user.phone, status: user.status },
            membership: membership ? { organizationId: membership.organizationId, role: membership.role, status: membership.status } : undefined,
          };
          perf(request, 'request_actor_end', actorStart);
          return;
        } else {
          // Usuário existe no Supabase Auth mas ainda não foi provisionado no banco interno do AgroGuard
          request.log.info({ authUserId: authUser.id, url: request.url }, '[Auth] Usuário não provisionado localmente');
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
          perf(request, 'request_actor_end', actorStart);
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

  perf(request, 'request_actor_end', actorStart);
}
