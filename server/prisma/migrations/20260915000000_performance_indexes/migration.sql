-- Índices de performance para as listagens que os clientes mais usam.
-- Consultas afetadas: equipamentos, ordens de serviço, usuários, ferramentas,
-- leituras de medidor e vínculos de organização.
-- Sem estes índices o Postgres faz seq scan em cada requisição de listagem.

-- CreateIndex
CREATE INDEX "users_status_archivedAt_idx" ON "users"("status", "archivedAt");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "equipments_organizationId_archivedAt_code_idx" ON "equipments"("organizationId", "archivedAt", "code");

-- CreateIndex
CREATE INDEX "equipments_organizationId_status_idx" ON "equipments"("organizationId", "status");

-- CreateIndex
CREATE INDEX "equipments_farmId_idx" ON "equipments"("farmId");

-- CreateIndex
CREATE INDEX "equipments_equipmentTypeId_idx" ON "equipments"("equipmentTypeId");

-- CreateIndex
CREATE INDEX "equipment_meters_equipmentId_idx" ON "equipment_meters"("equipmentId");

-- CreateIndex
CREATE INDEX "meter_readings_equipmentId_readingDate_idx" ON "meter_readings"("equipmentId", "readingDate");

-- CreateIndex
CREATE INDEX "meter_readings_meterId_readingDate_idx" ON "meter_readings"("meterId", "readingDate");

-- CreateIndex
CREATE INDEX "work_orders_organizationId_openedAt_idx" ON "work_orders"("organizationId", "openedAt");

-- CreateIndex
CREATE INDEX "work_orders_organizationId_status_idx" ON "work_orders"("organizationId", "status");

-- CreateIndex
CREATE INDEX "work_orders_organizationId_equipmentId_idx" ON "work_orders"("organizationId", "equipmentId");

-- CreateIndex
CREATE INDEX "work_orders_organizationId_priority_idx" ON "work_orders"("organizationId", "priority");

-- CreateIndex
CREATE INDEX "work_orders_workshopId_idx" ON "work_orders"("workshopId");

-- CreateIndex
CREATE INDEX "tools_organizationId_name_idx" ON "tools"("organizationId", "name");

-- CreateIndex
CREATE INDEX "tools_organizationId_status_idx" ON "tools"("organizationId", "status");

-- CreateIndex
CREATE INDEX "organization_memberships_userId_idx" ON "organization_memberships"("userId");

-- CreateIndex
CREATE INDEX "organization_memberships_organizationId_status_idx" ON "organization_memberships"("organizationId", "status");
