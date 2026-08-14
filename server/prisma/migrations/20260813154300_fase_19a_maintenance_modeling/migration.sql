-- CreateEnum
CREATE TYPE "MaintenanceScheduleStatus" AS ENUM ('SCHEDULED', 'DUE', 'OVERDUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'CONDITION_BASED', 'ROUTINE_INSPECTION');

-- CreateEnum
CREATE TYPE "MaintenanceTrigger" AS ENUM ('SCHEDULE', 'CALENDAR', 'HOUR_METER', 'ODOMETER', 'CYCLE', 'CHECKLIST', 'INSPECTION', 'FAILURE', 'SENSOR', 'ALERT', 'OPERATOR_REPORT', 'MANUAL');

-- CreateTable
CREATE TABLE "maintenance_plans" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "maintenance_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_plan_intervals" (
    "id" UUID NOT NULL,
    "maintenancePlanId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerType" "MaintenanceTrigger" NOT NULL,
    "rule" TEXT,
    "meterType" TEXT,
    "readingInterval" DECIMAL(16,3),
    "timeInterval" INTEGER,
    "timeUnit" TEXT,
    "alertReadingBefore" DECIMAL(16,3),
    "alertDaysBefore" INTEGER,
    "allowedReadingDelay" DECIMAL(16,3),
    "allowedDaysDelay" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "estimatedDurationMinutes" INTEGER,
    "requiresEquipmentStop" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "tasks" JSONB,

    CONSTRAINT "maintenance_plan_intervals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_plan_equipments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "maintenancePlanId" UUID NOT NULL,
    "startDate" TIMESTAMPTZ(3) NOT NULL,
    "baseReading" DECIMAL(16,3),
    "baseDate" TIMESTAMPTZ(3),
    "lastKnownMaintenanceDate" TIMESTAMPTZ(3),
    "lastKnownMaintenanceReading" DECIMAL(16,3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceResponsibleId" UUID,
    "workshopId" UUID,
    "observations" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "maintenance_plan_equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_schedules" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "maintenancePlanId" UUID,
    "maintenancePlanIntervalId" UUID,
    "scheduledDate" TIMESTAMPTZ(3) NOT NULL,
    "dueReading" DECIMAL(16,3),
    "meterType" TEXT,
    "currentReading" DECIMAL(16,3),
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" "MaintenanceScheduleStatus" NOT NULL,
    "responsibleId" UUID,
    "teamId" UUID,
    "workshopId" UUID,
    "estimatedDurationMinutes" INTEGER NOT NULL DEFAULT 0,
    "requiresEquipmentStop" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "rescheduleReason" TEXT,
    "canceledReason" TEXT,
    "workOrderId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "completedAt" TIMESTAMPTZ(3),
    "triggerType" "MaintenanceTrigger",
    "maintenanceType" "MaintenanceType",
    "tasks" JSONB,
    "parts" JSONB,
    "supplies" JSONB,
    "tools" JSONB,

    CONSTRAINT "maintenance_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "maintenance_plans_organizationId_idx" ON "maintenance_plans"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_plans_organizationId_code_key" ON "maintenance_plans"("organizationId", "code");

-- CreateIndex
CREATE INDEX "maintenance_plan_intervals_maintenancePlanId_idx" ON "maintenance_plan_intervals"("maintenancePlanId");

-- CreateIndex
CREATE INDEX "maintenance_plan_equipments_organizationId_idx" ON "maintenance_plan_equipments"("organizationId");

-- CreateIndex
CREATE INDEX "maintenance_plan_equipments_equipmentId_idx" ON "maintenance_plan_equipments"("equipmentId");

-- CreateIndex
CREATE INDEX "maintenance_plan_equipments_maintenancePlanId_idx" ON "maintenance_plan_equipments"("maintenancePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_plan_equipments_equipmentId_maintenancePlanId_key" ON "maintenance_plan_equipments"("equipmentId", "maintenancePlanId");

-- CreateIndex
CREATE INDEX "maintenance_schedules_organizationId_idx" ON "maintenance_schedules"("organizationId");

-- CreateIndex
CREATE INDEX "maintenance_schedules_equipmentId_idx" ON "maintenance_schedules"("equipmentId");

-- CreateIndex
CREATE INDEX "maintenance_schedules_scheduledDate_idx" ON "maintenance_schedules"("scheduledDate");

-- CreateIndex
CREATE INDEX "maintenance_schedules_status_idx" ON "maintenance_schedules"("status");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_schedules_organizationId_code_key" ON "maintenance_schedules"("organizationId", "code");

-- AddForeignKey
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_intervals" ADD CONSTRAINT "maintenance_plan_intervals_maintenancePlanId_fkey" FOREIGN KEY ("maintenancePlanId") REFERENCES "maintenance_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_equipments" ADD CONSTRAINT "maintenance_plan_equipments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_equipments" ADD CONSTRAINT "maintenance_plan_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_equipments" ADD CONSTRAINT "maintenance_plan_equipments_maintenancePlanId_fkey" FOREIGN KEY ("maintenancePlanId") REFERENCES "maintenance_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_equipments" ADD CONSTRAINT "maintenance_plan_equipments_maintenanceResponsibleId_fkey" FOREIGN KEY ("maintenanceResponsibleId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_equipments" ADD CONSTRAINT "maintenance_plan_equipments_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_maintenancePlanId_fkey" FOREIGN KEY ("maintenancePlanId") REFERENCES "maintenance_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_maintenancePlanIntervalId_fkey" FOREIGN KEY ("maintenancePlanIntervalId") REFERENCES "maintenance_plan_intervals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
