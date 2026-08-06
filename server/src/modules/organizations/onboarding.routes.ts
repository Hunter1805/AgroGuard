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
        required: ['ownerName', 'organizationName', 'acceptedTermsVersion', 'acceptedPrivacyVersion'],
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
    const body = request.body as ProvisionPayload;

    // 1. Garantir idempotência: verificar se o usuário já possui uma membership
    // Buscar se já existe um usuário interno com esse authUserId
    let user = await prisma.user.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          where: { status: 'ativo' },
          include: { organization: true },
        },
      },
    });

    if (user && user.memberships.length > 0) {
      // Já está provisionado, retornar resposta de sucesso idempotente
      const activeMembership = user.memberships[0];
      const response: ApiResponse<{ message: string; organizationId: string }> = {
        data: {
          message: 'Ambiente já criado. Continuando seu acesso...',
          organizationId: activeMembership.organizationId,
        },
      };
      return reply.status(200).send(response);
    }

    // Se o usuário interno ainda não foi vinculado ao authUserId, podemos procurar pelo e-mail
    // para evitar cadastros duplicados de usuários
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new AppError('Serviço de autenticação não configurado no servidor.', 500, 'AUTH_CONFIG_ERROR');
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(authUserId);

    if (authError || !authUser) {
      throw new AppError('Usuário de autenticação não encontrado no provedor.', 400, 'AUTH_USER_NOT_FOUND');
    }

    const email = authUser.email!;

    if (!user) {
      // Buscar por e-mail para ver se o usuário já existe no banco interno de alguma forma
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          memberships: {
            where: { status: 'ativo' },
            include: { organization: true },
          },
        },
      });

      if (user && user.memberships.length > 0) {
        // Vincula o authUserId se não estava vinculado e retorna a resposta de idempotência
        if (!user.authUserId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { authUserId },
          });
        }
        const activeMembership = user.memberships[0];
        const response: ApiResponse<{ message: string; organizationId: string }> = {
          data: {
            message: 'Ambiente já criado. Continuando seu acesso...',
            organizationId: activeMembership.organizationId,
          },
        };
        return reply.status(200).send(response);
      }
    }

    // 2. Executar a transação Prisma para provisionamento completo e idempotente
    const result = await prisma.$transaction(async (tx) => {
      // Criar o usuário interno se ele ainda não existe
      let internalUser: any = user;
      if (!internalUser) {
        internalUser = await tx.user.create({
          data: {
            authUserId,
            name: body.ownerName,
            email,
            status: 'ativo',
            type: 'interno',
          },
        });
      } else if (!internalUser.authUserId) {
        // Atualizar vínculo se já existia
        internalUser = await tx.user.update({
          where: { id: internalUser.id },
          data: { authUserId },
        });
      }

      // Gerar um código legível único para a organização
      const baseSlug = body.organizationName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 15);
      
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const orgCode = `${baseSlug}-${randomSuffix}`;

      // Criar a organização
      const organization = await tx.organization.create({
        data: {
          name: body.organizationName,
          code: orgCode,
          status: 'ativo',
        },
      });

      // Criar a empresa principal (Company)
      const company = await tx.company.create({
        data: {
          organizationId: organization.id,
          code: 'COMP-01',
          name: body.workspaceName || body.organizationName,
          status: 'ativo',
        },
      });

      // Criar a unidade matriz padrão
      const unit = await tx.unit.create({
        data: {
          organizationId: organization.id,
          companyId: company.id,
          code: 'UN-01',
          name: `Matriz ${body.workspaceName || body.organizationName}`,
          type: 'matriz',
          status: 'ativo',
        },
      });

      // Criar a membership ligando o usuário à organização como proprietário
      const membership = await tx.organizationMembership.create({
        data: {
          organizationId: organization.id,
          userId: internalUser.id,
          role: 'proprietario',
          status: 'ativo',
        },
      });

      // Garantir a role 'admin' e atribuir ao usuário
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

      // Criar associação UserRole se não existir
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

      // Criar o escopo total da organização para o proprietário
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

      // Criar as preferências do usuário com os valores padrões
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

      // Criar configurações da organização
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

      // Criar o estado inicial de onboarding (0 de 4 etapas concluídas)
      await tx.onboardingState.create({
        data: {
          organizationId: organization.id,
          currentStep: 0,
          stepsCompleted: {
            step1: false, // Complete os dados da empresa
            step2: false, // Cadastre seu primeiro equipamento
            step3: false, // Convide sua equipe
            step4: false, // Configure sua primeira rotina
          },
          completed: false,
        },
      });

      // Criar sequências numéricas iniciais para a organização
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

      // Criar log de auditoria do onboarding
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
            acceptedTermsVersion: body.acceptedTermsVersion,
            acceptedPrivacyVersion: body.acceptedPrivacyVersion,
            segment: body.segment,
            estimatedEquipmentCount: body.estimatedEquipmentCount,
          },
        },
      });

      return {
        organizationId: organization.id,
      };
    });

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
