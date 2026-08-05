import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../errors/AppError';

export function requireAuthentication() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.actor) {
      throw new AppError('Autenticação necessária para acessar este recurso.', 401, 'ACCESS_DENIED');
    }
  };
}

export function requirePermission(module: string, action: string) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.actor) {
      throw new AppError('Autenticação necessária.', 401, 'ACCESS_DENIED');
    }

    const { permissions } = request.actor;
    const hasAll = permissions.some((p) => p.module === 'all' && p.allowed);

    if (hasAll) return;

    const explicitDenial = permissions.some(
      (p) => (p.module === module || p.module === 'all') && (p.action === action || p.action === 'all') && !p.allowed
    );

    if (explicitDenial) {
      throw new AppError(`Acesso negado para a ação '${action}' no módulo '${module}'.`, 403, 'PERMISSION_DENIED');
    }

    const explicitPermission = permissions.some(
      (p) => (p.module === module || p.module === 'all') && (p.action === action || p.action === 'all') && p.allowed
    );

    if (!explicitPermission) {
      throw new AppError(`Permissão insuficiente para '${action}' em '${module}'.`, 403, 'PERMISSION_DENIED');
    }
  };
}

export function requireOrganizationScope() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.actor || !request.actor.organizationId) {
      throw new AppError('Escopo organizacional não informado ou inválido.', 403, 'ORGANIZATION_SCOPE_REQUIRED');
    }
  };
}

export function requireResourceAccess(resourceOrgIdExtractor?: (req: FastifyRequest) => string) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.actor) {
      throw new AppError('Autenticação necessária.', 401, 'ACCESS_DENIED');
    }

    if (resourceOrgIdExtractor) {
      const resourceOrgId = resourceOrgIdExtractor(request);
      if (resourceOrgId && resourceOrgId !== request.actor.organizationId) {
        throw new AppError('Acesso negado a recursos de outra organização (Cross-Tenant Block).', 403, 'CROSS_TENANT_FORBIDDEN');
      }
    }
  };
}
