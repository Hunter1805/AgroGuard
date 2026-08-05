import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import type { ApiErrorResponse } from '../http/ApiResponse';

export function errorHandler(error: FastifyError | AppError | Error, request: FastifyRequest, reply: FastifyReply) {
  const requestId = (request.headers['x-request-id'] as string) || request.id;

  if (error instanceof AppError) {
    const responsePayload: ApiErrorResponse = {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId,
      },
    };
    return reply.status(error.statusCode).send(responsePayload);
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    error.errors.forEach((e) => {
      const field = e.path.join('.');
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(e.message);
    });

    const responsePayload: ApiErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados de entrada inválidos na requisição.',
        fieldErrors,
        requestId,
      },
    };
    return reply.status(400).send(responsePayload);
  }

  request.log.error(error);

  const responsePayload: ApiErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno não esperado no servidor.',
      requestId,
    },
  };
  return reply.status(500).send(responsePayload);
}
