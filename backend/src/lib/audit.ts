import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

/** Append-only audit trail (who / what / when). Failures never block the request. */
export async function audit(req: Request | null, action: string, entity: string, entityId?: string, metadata?: Prisma.InputJsonValue, userId?: string) {
  try {
    await prisma.auditLog.create({
      data: { userId: userId ?? req?.user?.id, action, entity, entityId, metadata, ip: req?.ip },
    });
  } catch (e) {
    console.error('audit log failed', e);
  }
}
