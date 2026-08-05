import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { StockRepository } from './stock.repository';
import { StockService } from './stock.service';
import { stockMovementSchema } from './stock.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();
const repo = new StockRepository(prisma);
const service = new StockService(repo);

export async function stockRoutes(app: FastifyInstance) {
  app.get('/api/v1/stock/items', {
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

  app.post('/api/v1/stock/movements', {
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
