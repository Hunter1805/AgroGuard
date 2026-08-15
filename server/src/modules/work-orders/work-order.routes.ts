import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { WorkOrderRepository } from './work-order.repository';
import { WorkOrderService } from './work-order.service';
import { createWorkOrderSchema, updateStatusSchema } from './work-order.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { AuditService } from '../../shared/services/audit.service';

const prisma = new PrismaClient();
const repo = new WorkOrderRepository(prisma);
const service = new WorkOrderService(repo, new AuditService(prisma));

export async function workOrderRoutes(app: FastifyInstance) {
  app.get('/api/v1/work-orders', {
    schema: {
      description: 'Listar Ordens de Serviço',
      tags: ['Ordens de Serviço'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { page, pageSize, search } = request.query as { page?: number; pageSize?: number; search?: string };
    const result = await service.listWorkOrders(request.actor, page, pageSize, search);
    const response: ApiResponse<typeof result.data> = { data: result.data, meta: result.meta };
    return reply.send(response);
  });

  app.get('/api/v1/work-orders/:id', {
    schema: {
      description: 'Detalhes de uma Ordem de Serviço',
      tags: ['Ordens de Serviço'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const data = await service.getWorkOrderDetail(id, request.actor);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  app.post('/api/v1/work-orders', {
    schema: {
      description: 'Abrir nova Ordem de Serviço',
      tags: ['Ordens de Serviço'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createWorkOrderSchema.parse(request.body);
    const data = await service.createWorkOrder(request.actor, body);
    const response: ApiResponse<typeof data> = { data };
    return reply.status(201).send(response);
  });

  app.patch('/api/v1/work-orders/:id/status', {
    schema: {
      description: 'Transição de status na Máquina de Estados da OS',
      tags: ['Ordens de Serviço'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const body = updateStatusSchema.parse(request.body);
    const data = await service.transitionStatus(request.actor, id, body.status);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });
}
