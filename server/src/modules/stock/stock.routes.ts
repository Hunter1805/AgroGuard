import type { FastifyInstance } from 'fastify';
import { StockRepository } from './stock.repository';
import { StockService } from './stock.service';
import { stockMovementSchema, createStockItemSchema } from './stock.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { requireAuthentication, requireOrganizationScope } from '../../shared/middleware/authGuard';
import { prisma } from '../../shared/db/prisma';
const repo = new StockRepository(prisma);
const service = new StockService(repo);

// Guarda de escopo organizacional (evita query com organizationId vazio -> 500).
const guard = { preHandler: [requireAuthentication(), requireOrganizationScope()] };

export async function stockRoutes(app: FastifyInstance) {
  app.get('/api/v1/stock/items', {
    ...guard,
    schema: {
      description: 'Listar itens de estoque e saldos por almoxarifado',
      tags: ['Estoque'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { page, pageSize, search } = request.query as { page?: number; pageSize?: number; search?: string };
    const result = await service.listStockItems(request.actor, page, pageSize, search);
    const response: ApiResponse<typeof result.data> = { data: result.data, meta: result.meta };
    return reply.send(response);
  });

  app.post('/api/v1/stock/items', {
    ...guard,
    schema: {
      description: 'Cadastrar item de estoque',
      tags: ['Estoque'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createStockItemSchema.parse(request.body);
    const data = await service.createStockItem(request.actor, body);
    const response: ApiResponse<typeof data> = { data };
    return reply.status(201).send(response);
  });

  app.post('/api/v1/stock/movements', {
    ...guard,
    schema: {
      description: 'Registrar entrada, saída ou ajuste de estoque com transação transacional',
      tags: ['Estoque'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = stockMovementSchema.parse(request.body);
    const data = await service.processMovement(
      request.actor,
      body.warehouseId,
      body.stockItemId,
      body.type,
      body.quantity,
      body.unitCost,
      body.workOrderId
    );
    const response: ApiResponse<typeof data> = { data };
    return reply.status(201).send(response);
  });
}
