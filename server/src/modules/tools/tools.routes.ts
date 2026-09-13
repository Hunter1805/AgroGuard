import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { createToolSchema, updateToolSchema } from './tools.schemas';

const prisma = new PrismaClient();

export async function toolRoutes(app: FastifyInstance) {
  // Lista ferramentas da organização
  app.get('/api/v1/tools', {
    schema: { description: 'Listar ferramentas', tags: ['Ferramentas'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { search } = request.query as { search?: string };

    const tools = await prisma.tool.findMany({
      where: {
        organizationId: request.actor.organizationId,
        ...(search
          ? { OR: [
              { code: { contains: search, mode: 'insensitive' as const } },
              { name: { contains: search, mode: 'insensitive' as const } },
            ] }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const response: ApiResponse<typeof tools> = { data: tools };
    return reply.send(response);
  });

  // Detalhe da ferramenta
  app.get('/api/v1/tools/:id', {
    schema: { description: 'Detalhe da ferramenta', tags: ['Ferramentas'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };

    const tool = await prisma.tool.findFirst({
      where: { id, organizationId: request.actor.organizationId },
    });
    if (!tool) throw new AppError('Ferramenta não encontrada.', 404, 'NOT_FOUND');

    const response: ApiResponse<typeof tool> = { data: tool };
    return reply.send(response);
  });

  // Cadastro
  app.post('/api/v1/tools', {
    schema: { description: 'Cadastrar ferramenta', tags: ['Ferramentas'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createToolSchema.parse(request.body);

    // Código único por organização (gera automaticamente se não informado)
    let code = body.code?.trim();
    if (!code) {
      const count = await prisma.tool.count({ where: { organizationId: request.actor.organizationId } });
      code = `FER-${String(count + 1).padStart(3, '0')}`;
    }

    const duplicate = await prisma.tool.findFirst({
      where: { organizationId: request.actor.organizationId, code },
    });
    if (duplicate) {
      throw new AppError(`Já existe uma ferramenta com o código ${code}.`, 409, 'BUSINESS_RULE_VIOLATION');
    }

    const tool = await prisma.tool.create({
      data: {
        organizationId: request.actor.organizationId,
        code,
        name: body.name,
        serialNumber: body.serialNumber || null,
        status: body.status || 'disponivel',
        metadata: (body.metadata ?? {}) as any,
      },
    });

    const response: ApiResponse<typeof tool> = { data: tool };
    return reply.status(201).send(response);
  });

  // Edição
  app.patch('/api/v1/tools/:id', {
    schema: { description: 'Atualizar ferramenta', tags: ['Ferramentas'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const body = updateToolSchema.parse(request.body);

    const existing = await prisma.tool.findFirst({
      where: { id, organizationId: request.actor.organizationId },
    });
    if (!existing) throw new AppError('Ferramenta não encontrada.', 404, 'NOT_FOUND');

    const tool = await prisma.tool.update({
      where: { id: existing.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.code !== undefined ? { code: body.code } : {}),
        ...(body.serialNumber !== undefined ? { serialNumber: body.serialNumber || null } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.metadata !== undefined
          ? { metadata: { ...((existing.metadata as object) ?? {}), ...(body.metadata as object) } as any }
          : {}),
      },
    });

    const response: ApiResponse<typeof tool> = { data: tool };
    return reply.send(response);
  });
}
