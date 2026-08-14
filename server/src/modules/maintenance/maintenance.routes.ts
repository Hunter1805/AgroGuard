import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { MaintenanceRepository } from './maintenance.repository';
import { MaintenanceService } from './maintenance.service';
import { AuditService } from '../../shared/services/audit.service';
import { requirePermission, requireAuthentication, requireOrganizationScope } from '../../shared/middleware/authGuard';
import { AppError } from '../../shared/errors/AppError';
import { createPlanSchema, updatePlanSchema, createIntervalSchema, linkEquipmentSchema, createScheduleSchema, updateScheduleSchema, updateScheduleStatusSchema, listSchedulesQuerySchema } from './maintenance.schema';

const prisma = new PrismaClient();
const service = new MaintenanceService(new MaintenanceRepository(prisma), new AuditService(prisma));
const guard = (action: string) => ({ preHandler: [requireAuthentication(), requireOrganizationScope(), requirePermission('maintenance', action)] });
const actor = (request: any) => { if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED'); return request.actor; };

export async function maintenanceRoutes(app: FastifyInstance) {
  app.get('/api/v1/maintenance/plans', guard('read'), async (request) => ({ data: await service.listPlans(actor(request)) }));
  app.get('/api/v1/maintenance/plans/:id', guard('read'), async (request) => ({ data: await service.getPlan(actor(request), (request.params as any).id) }));
  app.post('/api/v1/maintenance/plans', guard('create'), async (request, reply) => reply.status(201).send({ data: await service.createPlan(actor(request), createPlanSchema.parse(request.body)) }));
  app.patch('/api/v1/maintenance/plans/:id', guard('update'), async (request) => ({ data: await service.updatePlan(actor(request), (request.params as any).id, updatePlanSchema.parse(request.body)) }));
  app.delete('/api/v1/maintenance/plans/:id', guard('delete'), async (request) => ({ data: await service.archivePlan(actor(request), (request.params as any).id) }));

  app.post('/api/v1/maintenance/plans/:id/intervals', guard('update'), async (request, reply) => reply.status(201).send({ data: await service.addInterval(actor(request), (request.params as any).id, createIntervalSchema.parse(request.body)) }));
  app.patch('/api/v1/maintenance/intervals/:id', guard('update'), async (request) => ({ data: await service.updateInterval(actor(request), (request.params as any).id, createIntervalSchema.parse(request.body)) }));
  app.get('/api/v1/maintenance/plans/:id/equipments', guard('read'), async (request) => ({ data: await service.listLinks(actor(request), (request.params as any).id) }));
  app.post('/api/v1/maintenance/plans/:id/equipments', guard('update'), async (request, reply) => reply.status(201).send({ data: await service.linkEquipment(actor(request), (request.params as any).id, linkEquipmentSchema.parse(request.body)) }));
  app.delete('/api/v1/maintenance/plan-equipments/:id', guard('delete'), async (request) => ({ data: await service.unlinkEquipment(actor(request), (request.params as any).id) }));

  app.get('/api/v1/maintenance/schedules', guard('read'), async (request) => ({ data: await service.listSchedules(actor(request), listSchedulesQuerySchema.parse(request.query)) }));
  app.get('/api/v1/maintenance/schedules/:id', guard('read'), async (request) => ({ data: await service.getSchedule(actor(request), (request.params as any).id) }));
  app.post('/api/v1/maintenance/schedules', guard('schedule'), async (request, reply) => reply.status(201).send({ data: await service.createSchedule(actor(request), createScheduleSchema.parse(request.body)) }));
  app.patch('/api/v1/maintenance/schedules/:id', guard('update'), async (request) => ({ data: await service.updateSchedule(actor(request), (request.params as any).id, updateScheduleSchema.parse(request.body)) }));
  app.patch('/api/v1/maintenance/schedules/:id/status', guard('schedule'), async (request) => ({ data: await service.updateStatus(actor(request), (request.params as any).id, updateScheduleStatusSchema.parse(request.body)) }));
}
