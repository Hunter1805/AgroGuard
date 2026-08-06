import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env';
import { errorHandler } from './shared/middleware/errorHandler';
import { requestActorMiddleware } from './shared/http/RequestActor';
import { healthRoutes } from './modules/health/health.routes';
import { organizationRoutes } from './modules/organizations/organization.routes';
import { onboardingRoutes } from './modules/organizations/onboarding.routes';
import { masterDataRoutes } from './modules/master-data/master-data.routes';
import { userRoutes } from './modules/users/user.routes';
import { invitationRoutes } from './modules/users/invitation.routes';
import { equipmentRoutes } from './modules/equipment/equipment.routes';
import { workOrderRoutes } from './modules/work-orders/work-order.routes';
import { stockRoutes } from './modules/stock/stock.routes';
import { fileRoutes } from './modules/files/file.routes';
import { importRoutes } from './modules/imports/import.routes';
import { jobRoutes } from './modules/jobs/job.routes';
import type { ApiErrorResponse } from './shared/http/ApiResponse';

import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      redact: ['headers.authorization', 'body.password', 'body.token', 'body.serviceRoleKey'],
    },
    requestIdHeader: 'x-request-id',
  });

  // Security Headers e Helmet
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Rate Limiting Global (100 requisições por minuto por IP)
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Limite de requisições excedido. Tente novamente em ${context.after}.`,
        requestId: (request.headers['x-request-id'] as string) || request.id,
      },
    }),
  });

  // Middlewares e Plugins Globais
  app.addHook('onRequest', requestActorMiddleware);

  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20 MB max por arquivo
    },
  });

  // CORS Restritivo
  await app.register(cors, {
    origin: env.CORS_ORIGIN || true,
    credentials: true,
  });

  // Swagger Documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'AgroGuard API',
        description: 'Documentação OpenAPI da API REST do AgroGuard - Frotas e Gestão Agrícola',
        version: '1.0.0',
      },
      servers: [
        {
          url: env.API_BASE_URL,
          description: 'Ambiente Local',
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Handler Global de Erros
  app.setErrorHandler(errorHandler);

  // Error 404 Padronizado
  app.setNotFoundHandler((request, reply) => {
    const requestId = (request.headers['x-request-id'] as string) || request.id;
    const responsePayload: ApiErrorResponse = {
      error: {
        code: 'NOT_FOUND',
        message: `Rota '${request.method} ${request.url}' não foi encontrada no servidor.`,
        requestId,
      },
    };
    reply.status(404).send(responsePayload);
  });

  // Registro de Rotas da API v1
  await app.register(healthRoutes);
  await app.register(organizationRoutes);
  await app.register(onboardingRoutes);
  await app.register(masterDataRoutes);
  await app.register(userRoutes);
  await app.register(invitationRoutes);
  await app.register(equipmentRoutes);
  await app.register(workOrderRoutes);
  await app.register(stockRoutes);
  await app.register(fileRoutes);
  await app.register(importRoutes);
  await app.register(jobRoutes);

  return app;
}
