import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { requireAuthentication } from '../../shared/middleware/authGuard';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();

interface ProvisionPayload {
  ownerName: string;
  organizationName: string;
  workspaceName?: string;
  segment?: string;
  estimatedEquipmentCount?: string;
  phone?: string | null;
  acceptedTermsVersion: string;
  acceptedPrivacyVersion: string;
}

export async function onboardingRoutes(app: FastifyInstance) {
  app.post('/api/v1/onboarding/provision', {
    schema: {
      description: 'Provisionar nova organização e ambiente para autoatendimento',
      tags: ['Onboarding'],
      body: {
        type: 'object',
        properties: {
          ownerName: { type: 'string' },
          organizationName: { type: 'string' },
          workspaceName: { type: 'string' },
          segment: { type: 'string' },
          estimatedEquipmentCount: { type: 'string' },
          phone: { type: ['string', 'null'] },
          acceptedTermsVersion: { type: 'string' },
          acceptedPrivacyVersion: { type: 'string' },
        },
      },
    },
    preHandler: [requireAuthentication()],
  }, async (request, reply) => {
    if (!request.actor || !request.actor.authUserId) {
      throw new AppError('Usuário não autenticado.', 401, 'ACCESS_DENIED');
    }

    const { authUserId } = request.actor;
    const body = (request.body as ProvisionPayload) || {};

    const startTime = Date.now();
    request.log.info({ authUserId }, '[ONBOARDING_PROVISION] 1. Início do fluxo de provisionamento');

    // 1. Garantir idempotência: verificar se o usuário já possui uma membership
    const userLookupStart = Date.now();
    let user = await prisma.user.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          where: { status: 'ativo' },
          include: { organization: true },
        },
      },
    });
    const userLookupMs = Date.now() - userLookupStart;
    request.log.info({ authUserId, userLookupMs }, '[ONBOARDING_PROVISION] Busca inicial do usuário por UUID resolvida');

    if (user && user.memberships.length > 0) {
      const activeMembership = user.memberships[0];
      request.log.info({ authUserId, organizationId: activeMembership.organizationId, durationMs: Date.now() - startTime }, '[ONBOARDING_PROVISION] 2. Idempotência: Membership ativa já existe fora da transação');
      const response: ApiResponse<{ message: string; organizationId: string }> = {
        data: {
          message: 'Ambiente já criado. Continuando seu acesso...',
          organizationId: activeMembership.organizationId,
        },
      };
      return reply.status(200).send(response);
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    request.log.info({ authUserId }, '[ONBOARDING_PROVISION] 3. Buscando dados do usuário no Supabase Auth');
    const supabaseStart = Date.now();
    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(authUserId);
    const supabaseMs = Date.now() - supabaseStart;
    request.log.info({ authUserId, supabaseMs }, '[ONBOARDING_PROVISION] Busca no Supabase Auth concluída');

    if (authError || !authUser) {
      request.log.error({ authUserId, error: authError }, '[ONBOARDING_PROVISION] Erro ao buscar usuário no Supabase Auth');
      throw new AppError('Usuário de autenticação não encontrado no provedor.', 400, 'AUTH_USER_NOT_FOUND');
    }

    request.log.info({ authUserId, email: authUser.email }, '[ONBOARDING_PROVISION] Usuário localizado no Supabase Auth');

    const email = authUser.email!;

    // 2. Extrair metadados do Supabase como fallback para dados da empresa
    const metadata = authUser.user_metadata || {};
    const ownerName = body.ownerName || metadata.name || authUser.email?.split('@')[0] || 'Proprietário';
    const organizationName = body.organizationName || metadata.organizationName;
    const workspaceName = body.workspaceName || metadata.workspaceName || organizationName;
    const segment = body.segment || metadata.segment || 'AGRICULTURE';
    const estimatedEquipmentCount = body.estimatedEquipmentCount || metadata.estimatedEquipmentCount || '11_50';
    const phone = body.phone !== undefined ? body.phone : (metadata.phone || null);
    const acceptedTermsVersion = body.acceptedTermsVersion || metadata.acceptedTermsVersion || '2026-08';
    const acceptedPrivacyVersion = body.acceptedPrivacyVersion || metadata.acceptedPrivacyVersion || '2026-08';

    if (!organizationName) {
      throw new AppError('Dados da empresa não localizados. Por favor, configure sua empresa.', 400, 'ONBOARDING_DATA_MISSING');
    }

    // Se o usuário interno ainda não foi vinculado ao authUserId, podemos procurar pelo e-mail
    if (!user) {
      const emailLookupStart = Date.now();
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          memberships: {
            where: { status: 'ativo' },
            include: { organization: true },
          },
        },
      });
      const emailLookupMs = Date.now() - emailLookupStart;
      request.log.info({ authUserId, email, emailLookupMs }, '[ONBOARDING_PROVISION] Busca de usuário por e-mail resolvida');

      if (user && user.memberships.length > 0) {
        // CORREÇÃO: Atualiza o authUserId se for nulo OU se for diferente do UUID atual (ex: conta recriada)
        if (user.authUserId !== authUserId) {
          request.log.info({ authUserId, oldAuthUserId: user.authUserId }, '[ONBOARDING_PROVISION] Vinculando novo UUID de autenticação ao usuário local por e-mail');
          await prisma.user.update({
            where: { id: user.id },
            data: { authUserId },
          });
        }
        const activeMembership = user.memberships[0];
        request.log.info({ authUserId, organizationId: activeMembership.organizationId, durationMs: Date.now() - startTime }, '[ONBOARDING_PROVISION] 2b. Idempotência por e-mail: Membership ativa já existe fora da transação');
        const response: ApiResponse<{ message: string; organizationId: string }> = {
          data: {
            message: 'Ambiente já criado. Continuando seu acesso...',
            organizationId: activeMembership.organizationId,
          },
        };
        return reply.status(200).send(response);
      }
    }

    request.log.info({ authUserId }, '[ONBOARDING_PROVISION] 4. Iniciando transação Prisma');
    const txStart = Date.now();

    // 3. Executar a transação Prisma para provisionamento completo e idempotente
    const result = await prisma.$transaction(async (tx) => {
      // Serializa o provisionamento por usuário dentro da transação. O lookup
      // fora dela não é suficiente quando duas requisições chegam juntas.
      const lockStart = Date.now();
      request.log.info({ authUserId }, '[ONBOARDING_PROVISION] 4.1. Adquirindo pg_advisory_xact_lock');
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${authUserId}))`;
      const lockMs = Date.now() - lockStart;
      request.log.info({ authUserId, lockMs }, '[ONBOARDING_PROVISION] 4.2. Lock adquirido');

      let internalUser: any = await tx.user.findUnique({ where: { authUserId } });
      if (!internalUser) {
        internalUser = user || await tx.user.findUnique({ where: { email } });
      }
      
      if (!internalUser) {
        request.log.info({ authUserId, email }, '[ONBOARDING_PROVISION] 4.3. Criando usuário interno');
        internalUser = await tx.user.create({
          data: {
            authUserId,
            name: ownerName,
            email,
            status: 'ativo',
            type: 'interno',
          },
        });
      } else if (internalUser.authUserId !== authUserId) {
        // CORREÇÃO: Atualiza o authUserId se for diferente do UUID atual (ex: conta recriada)
        request.log.info({ authUserId, oldAuthUserId: internalUser.authUserId }, '[ONBOARDING_PROVISION] Vinculando novo UUID de autenticação ao usuário local dentro da transação');
        internalUser = await tx.user.update({
          where: { id: internalUser.id },
          data: { authUserId },
        });
      }

      const membershipLookupStart = Date.now();
      const existingMembership = await tx.organizationMembership.findFirst({
        where: { userId: internalUser.id, status: 'ativo' },
        select: { organizationId: true },
      });
      const membershipLookupMs = Date.now() - membershipLookupStart;
      request.log.info({ authUserId, membershipLookupMs }, '[ONBOARDING_PROVISION] Busca de membership ativa dentro da transação resolvida');

      if (existingMembership) {
        request.log.info({ authUserId, organizationId: existingMembership.organizationId, txMs: Date.now() - txStart }, '[ONBOARDING_PROVISION] 4.4. Idempotência: Membership ativa localizada dentro da transação');
        return { organizationId: existingMembership.organizationId };
      }

      const createStart = Date.now();
      request.log.info({ authUserId }, '[ONBOARDING_PROVISION] 4.5. Criando nova Organização, Empresa, Unidade e Membership');

      const baseSlug = organizationName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 15);

      const orgCode = `${baseSlug}-${authUserId.slice(0, 8)}`;
      
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          code: orgCode,
          status: 'ativo',
        },
      });

      const company = await tx.company.create({
        data: {
          organizationId: organization.id,
          code: 'COMP-01',
          name: workspaceName || organizationName,
          status: 'ativo',
        },
      });

      const unit = await tx.unit.create({
        data: {
          organizationId: organization.id,
          companyId: company.id,
          code: 'UN-01',
          name: `Matriz ${workspaceName || organizationName}`,
          type: 'matriz',
          status: 'ativo',
        },
      });

      const membership = await tx.organizationMembership.create({
        data: {
          organizationId: organization.id,
          userId: internalUser.id,
          role: 'proprietario',
          status: 'ativo',
        },
      });

      let adminRole = await tx.role.findUnique({
        where: { code: 'admin' },
      });

      if (!adminRole) {
        adminRole = await tx.role.create({
          data: {
            code: 'admin',
            name: 'Administrador',
            description: 'Acesso total ao sistema',
            systemRole: true,
            active: true,
          },
        });
      }

      const existingUserRole = await tx.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: internalUser.id,
            roleId: adminRole.id,
          },
        },
      });

      if (!existingUserRole) {
        await tx.userRole.create({
          data: {
            userId: internalUser.id,
            roleId: adminRole.id,
          },
        });
      }

      await tx.organizationScope.create({
        data: {
          membershipId: membership.id,
          allCompanies: true,
          allUnits: true,
          allFarms: true,
          companyIds: [],
          unitIds: [],
          farmIds: [],
        },
      });

      await tx.userPreference.create({
        data: {
          userId: internalUser.id,
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

      await tx.organizationSetting.create({
        data: {
          organizationId: organization.id,
          timezone: 'America/Sao_Paulo',
          language: 'pt-BR',
          currency: 'BRL',
          features: {
            storage: true,
            audit: true,
          },
        },
      });

      await tx.onboardingState.create({
        data: {
          organizationId: organization.id,
          currentStep: 0,
          stepsCompleted: {
            step1: false,
            step2: false,
            step3: false,
            step4: false,
          },
          completed: false,
        },
      });

      await tx.numberSequence.upsert({
        where: { entityType: `OS-${organization.id}` },
        create: {
          entityType: `OS-${organization.id}`,
          prefix: 'OS',
          nextValue: 1,
          digitsCount: 5,
        },
        update: {},
      });

      await tx.numberSequence.upsert({
        where: { entityType: `EQ-${organization.id}` },
        create: {
          entityType: `EQ-${organization.id}`,
          prefix: 'EQ',
          nextValue: 1,
          digitsCount: 5,
        },
        update: {},
      });

      await tx.auditLog.create({
        data: {
          organizationId: organization.id,
          actorUserId: internalUser.id,
          actorName: internalUser.name,
          module: 'onboarding',
          entityType: 'organization',
          entityId: organization.id,
          action: 'provision',
          newData: {
            acceptedTermsVersion,
            acceptedPrivacyVersion,
            segment,
            estimatedEquipmentCount,
          },
        },
      });

      const createMs = Date.now() - createStart;
      request.log.info({ authUserId, organizationId: organization.id, createMs }, '[ONBOARDING_PROVISION] 4.6. Transação concluída com sucesso. Realizando commit');
      return {
        organizationId: organization.id,
      };
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    });

    const durationMs = Date.now() - startTime;
    request.log.info({ authUserId, organizationId: result.organizationId, durationMs }, '[ONBOARDING_PROVISION] 5. Fluxo de provisionamento finalizado com commit no banco');

    const response: ApiResponse<{ message: string; organizationId: string }> = {
      data: {
        message: 'Ambiente criado com sucesso!',
        organizationId: result.organizationId,
      },
    };
    return reply.status(201).send(response);
  });

  app.patch('/api/v1/onboarding/step', {
    schema: {
      description: 'Atualizar o progresso do onboarding da organização',
      tags: ['Onboarding'],
      body: {
        type: 'object',
        required: ['step'],
        properties: {
          step: { type: 'integer', minimum: 1, maximum: 4 },
        },
      },
    },
    preHandler: [requireAuthentication()],
  }, async (request, reply) => {
    const { organizationId } = request.actor!;
    const { step } = request.body as { step: number };

    const onboarding = await prisma.onboardingState.findUnique({
      where: { organizationId },
    });

    if (!onboarding) {
      throw new AppError('Estado de onboarding não encontrado para esta organização.', 404, 'NOT_FOUND');
    }

    const stepsCompleted = onboarding.stepsCompleted as any;
    stepsCompleted[`step${step}`] = true;

    // Se completou o passo 4 ou todos os 4, marca onboarding como concluído
    const completed = step === 4 || (stepsCompleted.step1 && stepsCompleted.step2 && stepsCompleted.step3 && stepsCompleted.step4);

    const updated = await prisma.onboardingState.update({
      where: { organizationId },
      data: {
        currentStep: step,
        stepsCompleted,
        completed,
      },
    });

    const response: ApiResponse<typeof updated> = { data: updated };
    return reply.send(response);
  });
}
