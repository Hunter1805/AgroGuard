import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env';
import { errorHandler } from './shared/middleware/errorHandler';
import { healthRoutes } from './modules/health/health.routes';
import type { ApiErrorResponse } from './shared/http/ApiResponse';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
    requestIdHeader: 'x-request-id',
  });

  // CORS
  await app.register(cors, {
    origin: true, // Permitir requisições da SPA frontend
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

  // Registro de Rotas Iniciais
  await app.register(healthRoutes);

  return app;
}
