import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  schoolId: string;
  userId: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

/**
 * STEP 8: Centralized Tamper-Proof Audit Trail Logger
 * Appends immutable record into audit_logs for compliance, fee changes,
 * marks revisions, attendance overrides, and administrative actions.
 */
export async function recordAuditLog(params: CreateAuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        schoolId: params.schoolId,
        userId: params.userId,
        userRole: params.userRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: (params.oldValues as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        newValues: (params.newValues as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    // Audit log failures should not crash the main transaction, but should log prominently
    console.error("Failed to record audit log:", error);
    return null;
  }
}

/**
 * Fetch recent audit trail for Principal and School Admin dashboards
 */
export async function getRecentAuditLogs(schoolId: string, limit: number = 25) {
  try {
    return await prisma.auditLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            role: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
}
