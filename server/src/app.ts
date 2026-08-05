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
import { masterDataRoutes } from './modules/master-data/master-data.routes';
import { userRoutes } from './modules/users/user.routes';
import { equipmentRoutes } from './modules/equipment/equipment.routes';
import { workOrderRoutes } from './modules/work-orders/work-order.routes';
import { stockRoutes } from './modules/stock/stock.routes';
import { fileRoutes } from './modules/files/file.routes';
import { importRoutes } from './modules/imports/import.routes';
import type { ApiErrorResponse } from './shared/http/ApiResponse';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
    requestIdHeader: 'x-request-id',
  });

  // Middlewares e Plugins Globais
  app.addHook('onRequest', requestActorMiddleware);

  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20 MB max por arquivo
    },
  });

  // CORS
  await app.register(cors, {
    origin: true,
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
  await app.register(masterDataRoutes);
  await app.register(userRoutes);
  await app.register(equipmentRoutes);
  await app.register(workOrderRoutes);
  await app.register(stockRoutes);
  await app.register(fileRoutes);
  await app.register(importRoutes);

  return app;
}
