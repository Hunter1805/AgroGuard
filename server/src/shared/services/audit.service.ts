import { PrismaClient } from '@prisma/client';
import type { RequestActor } from '../http/RequestActor';

export interface LogAuditInput {
  organizationId?: string;
  actor?: RequestActor;
  module: string;
  entityType: string;
  entityId: string;
  action: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  reason?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  constructor(private prisma: PrismaClient) {}

  async log(input: LogAuditInput, tx?: any) {
    const db = tx || this.prisma;
    const organizationId = input.organizationId || input.actor?.organizationId;
    const actorUserId = input.actor?.userId;

    return db.auditLog.create({
      data: {
        organizationId: organizationId || null,
        actorUserId: actorUserId || null,
        actorName: input.actor ? 'Usuário Provisório' : 'Sistema',
        module: input.module,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        previousData: input.previousData ? (input.previousData as any) : undefined,
        newData: input.newData ? (input.newData as any) : undefined,
        reason: input.reason || null,
        requestId: input.requestId || null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });
  }
}
