import { FastifyInstance } from 'fastify';
import { getFileStorageProvider } from '../../shared/storage/storage.factory';
import { ALLOWED_MIME_TYPES } from './file.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const storage = getFileStorageProvider();

export async function fileRoutes(app: FastifyInstance) {
  app.post('/api/v1/files', {
    schema: {
      description: 'Upload de arquivo (fotos, PDFs, planilhas) via Multipart',
      tags: ['Arquivos'],
    },
  }, async (request, reply) => {
    const data = await request.file();
    if (!data) {
      throw new AppError('Nenhum arquivo enviado no corpo da requisição.', 400, 'VALIDATION_ERROR');
    }

    if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
      throw new AppError(`Tipo de arquivo '${data.mimetype}' não permitido.`, 422, 'VALIDATION_ERROR');
    }

    const orgId = request.actor?.organizationId || 'default-org';
    const buffer = await data.toBuffer();
    const stored = await storage.upload({
      filename: data.filename,
      mimeType: data.mimetype,
      buffer,
      folder: `${orgId}/attachments`,
    });

    const fileMeta = {
      id: `file-${Date.now()}`,
      originalName: data.filename,
      mimeType: data.mimetype,
      size: buffer.length,
      storageKey: stored.storageKey,
      status: 'available',
      uploadedAt: new Date().toISOString(),
    };

    const response: ApiResponse<typeof fileMeta> = { data: fileMeta };
    return reply.status(201).send(response);
  });

  app.get('/api/v1/files/:key/download', {
    schema: {
      description: 'Gerar URL de download / streaming seguro do arquivo',
      tags: ['Arquivos'],
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    const url = await storage.getDownloadUrl(key, 3600);

    const response: ApiResponse<{ downloadUrl: string }> = { data: { downloadUrl: url } };
    return reply.send(response);
  });
}
