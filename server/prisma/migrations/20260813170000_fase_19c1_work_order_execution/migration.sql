-- Fase 19C.1: modelagem persistente da execução e histórico de OS.
-- Migration aditiva: não remove nem altera estruturas existentes.

CREATE TYPE "WorkOrderLaborEntryType" AS ENUM ('SERVICE', 'PAUSE');
CREATE TYPE "WorkOrderLaborEntryStatus" AS ENUM ('OPEN', 'COMPLETED', 'CANCELLED');
CREATE TYPE "WorkOrderTimelineEventType" AS ENUM (
    'CREATED', 'UPDATED', 'STATUS_CHANGED', 'STARTED', 'PAUSED', 'RESUMED',
    'MATERIAL_ADDED', 'MATERIAL_REMOVED', 'TOOL_ADDED', 'TOOL_REMOVED',
    'NOTE_ADDED', 'COMPLETED', 'CANCELLED'
);

CREATE TABLE "work_order_executions" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workOrderId" UUID NOT NULL,
    "executionStartedAt" TIMESTAMPTZ(3),
    "executionEndedAt" TIMESTAMPTZ(3),
    "technicalDiagnosis" TEXT,
    "foundCause" TEXT,
    "rootCause" TEXT,
    "failureConfirmed" BOOLEAN,
    "recurrentFailure" BOOLEAN,
    "futureRecommendation" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "work_order_executions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_order_executions_workOrderId_key" UNIQUE ("workOrderId"),
    CONSTRAINT "work_order_executions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_executions_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "work_order_executions_organizationId_executionStartedAt_idx" ON "work_order_executions"("organizationId", "executionStartedAt");

CREATE TABLE "work_order_labor_entries" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workOrderId" UUID NOT NULL,
    "executorUserId" UUID,
    "entryType" "WorkOrderLaborEntryType" NOT NULL DEFAULT 'SERVICE',
    "status" "WorkOrderLaborEntryStatus" NOT NULL DEFAULT 'OPEN',
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3),
    "durationMinutes" INTEGER,
    "observation" TEXT,
    "hourlyCost" DECIMAL(14,2),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "work_order_labor_entries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_order_labor_entries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_labor_entries_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_order_labor_entries_executorUserId_fkey" FOREIGN KEY ("executorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "work_order_labor_entries_organizationId_workOrderId_startedAt_idx" ON "work_order_labor_entries"("organizationId", "workOrderId", "startedAt");
CREATE INDEX "work_order_labor_entries_organizationId_executorUserId_startedAt_idx" ON "work_order_labor_entries"("organizationId", "executorUserId", "startedAt");

CREATE TABLE "work_order_material_usages" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workOrderId" UUID NOT NULL,
    "stockItemId" UUID NOT NULL,
    "responsibleUserId" UUID,
    "quantity" DECIMAL(16,3) NOT NULL,
    "unitCost" DECIMAL(14,2) NOT NULL,
    "totalCost" DECIMAL(14,2),
    "consumedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchOrReference" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_order_material_usages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_order_material_usages_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_material_usages_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_order_material_usages_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "stock_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_material_usages_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "work_order_material_usages_organizationId_workOrderId_consumedAt_idx" ON "work_order_material_usages"("organizationId", "workOrderId", "consumedAt");
CREATE INDEX "work_order_material_usages_organizationId_stockItemId_idx" ON "work_order_material_usages"("organizationId", "stockItemId");

CREATE TABLE "work_order_tool_usages" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workOrderId" UUID NOT NULL,
    "toolId" UUID NOT NULL,
    "responsibleUserId" UUID,
    "quantity" DECIMAL(16,3) NOT NULL DEFAULT 1,
    "withdrawnAt" TIMESTAMPTZ(3),
    "returnedAt" TIMESTAMPTZ(3),
    "stateBefore" TEXT,
    "stateAfter" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_order_tool_usages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_order_tool_usages_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_tool_usages_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_order_tool_usages_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_tool_usages_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "work_order_tool_usages_organizationId_workOrderId_withdrawnAt_idx" ON "work_order_tool_usages"("organizationId", "workOrderId", "withdrawnAt");
CREATE INDEX "work_order_tool_usages_organizationId_toolId_idx" ON "work_order_tool_usages"("organizationId", "toolId");

CREATE TABLE "work_order_timeline" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workOrderId" UUID NOT NULL,
    "actorUserId" UUID,
    "eventType" "WorkOrderTimelineEventType" NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,
    "metadata" JSONB,
    CONSTRAINT "work_order_timeline_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_order_timeline_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_order_timeline_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_order_timeline_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "work_order_timeline_organizationId_workOrderId_timestamp_idx" ON "work_order_timeline"("organizationId", "workOrderId", "timestamp");
CREATE INDEX "work_order_timeline_organizationId_timestamp_idx" ON "work_order_timeline"("organizationId", "timestamp");
CREATE INDEX "work_order_timeline_organizationId_actorUserId_timestamp_idx" ON "work_order_timeline"("organizationId", "actorUserId", "timestamp");
