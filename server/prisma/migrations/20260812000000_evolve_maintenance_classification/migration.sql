-- 1. ADICIONAR NOVAS COLUNAS TEMPORARIAMENTE ACEITANDO NULL
ALTER TABLE "work_orders" ADD COLUMN "nature" TEXT;
ALTER TABLE "work_orders" ADD COLUMN "maintenanceType" TEXT;
ALTER TABLE "work_orders" ADD COLUMN "correctiveMode" TEXT;
ALTER TABLE "work_orders" ADD COLUMN "trigger" TEXT;

-- 2. VALIDAR OS VALORES LEGADOS EXISTENTES (DO BLOCK)
-- Se houver algum tipo ou prioridade nao prevista, aborta a migration
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM work_orders
    WHERE type IS NOT NULL
      AND lower(type) NOT IN (
        'preventiva',
        'corretiva',
        'corretiva_planejada',
        'corretiva_nao_planejada',
        'emergencial',
        'preditiva',
        'inspecao',
        'melhoria'
      )
  ) THEN
    RAISE EXCEPTION 'Existem tipos de OS legados nao mapeados';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM work_orders
    WHERE priority IS NOT NULL
      AND lower(priority) NOT IN (
        'baixa',
        'media',
        'alta',
        'urgente',
        'critica',
        'low',
        'normal',
        'high',
        'urgent',
        'critical'
      )
  ) THEN
    RAISE EXCEPTION 'Existem prioridades de OS legadas nao mapeadas';
  END IF;
END $$;

-- 3. COPIAR/MAPEAR DADOS ANTIGOS (NATURE, MAINTENANCE TYPE, CORRECTIVE MODE, TRIGGER)
UPDATE "work_orders"
SET
  "nature" = CASE 
    WHEN lower("type") = 'inspecao' THEN 'INSPECTION'
    WHEN lower("type") = 'melhoria' THEN 'IMPROVEMENT'
    ELSE 'MAINTENANCE'
  END,
  "maintenanceType" = CASE 
    WHEN lower("type") = 'preventiva' THEN 'PREVENTIVE'
    WHEN lower("type") = 'preditiva' THEN 'PREDICTIVE'
    WHEN lower("type") IN ('corretiva', 'corretiva_planejada', 'corretiva_nao_planejada', 'emergencial') THEN 'CORRECTIVE'
    ELSE NULL
  END,
  "correctiveMode" = CASE 
    WHEN lower("type") IN ('corretiva', 'corretiva_planejada') THEN 'PLANNED'
    WHEN lower("type") = 'emergencial' THEN 'EMERGENCY'
    ELSE NULL -- corretiva_nao_planejada permanece NULL
  END,
  "trigger" = CASE 
    WHEN lower("type") = 'preventiva' THEN 'SCHEDULE'
    ELSE 'MANUAL'
  END;

-- 4. CONVERTER E NORMALIZAR PRIORIDADES
UPDATE "work_orders" SET "priority" = 'LOW' WHERE lower("priority") = 'baixa';
UPDATE "work_orders" SET "priority" = 'NORMAL' WHERE lower("priority") = 'media';
UPDATE "work_orders" SET "priority" = 'HIGH' WHERE lower("priority") = 'alta';
UPDATE "work_orders" SET "priority" = 'URGENT' WHERE lower("priority") = 'urgente';
UPDATE "work_orders" SET "priority" = 'CRITICAL' WHERE lower("priority") = 'critica';

-- Garantir que as prioridades ja em ingles sejam mantidas em caixa alta
UPDATE "work_orders" SET "priority" = 'LOW' WHERE lower("priority") = 'low';
UPDATE "work_orders" SET "priority" = 'NORMAL' WHERE lower("priority") = 'normal';
UPDATE "work_orders" SET "priority" = 'HIGH' WHERE lower("priority") = 'high';
UPDATE "work_orders" SET "priority" = 'URGENT' WHERE lower("priority") = 'urgent';
UPDATE "work_orders" SET "priority" = 'CRITICAL' WHERE lower("priority") = 'critical';

-- 5. VERIFICAR SE EXISTEM REGISTROS INCONSISTENTES E APLICAR DEFAULTS SEGUROS
UPDATE "work_orders" SET "nature" = 'MAINTENANCE' WHERE "nature" IS NULL;
UPDATE "work_orders" SET "trigger" = 'MANUAL' WHERE "trigger" IS NULL;
UPDATE "work_orders" SET "priority" = 'NORMAL' WHERE "priority" IS NULL OR "priority" NOT IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL');

-- 6. APLICAR NOT NULL E DEFAULTS NO BANCO
ALTER TABLE "work_orders" ALTER COLUMN "nature" SET NOT NULL;
ALTER TABLE "work_orders" ALTER COLUMN "nature" SET DEFAULT 'MAINTENANCE';
ALTER TABLE "work_orders" ALTER COLUMN "trigger" SET NOT NULL;
ALTER TABLE "work_orders" ALTER COLUMN "trigger" SET DEFAULT 'MANUAL';
ALTER TABLE "work_orders" ALTER COLUMN "priority" SET NOT NULL;
ALTER TABLE "work_orders" ALTER COLUMN "priority" SET DEFAULT 'NORMAL';

-- 7. REMOVER A COLUNA ANTIGA type
ALTER TABLE "work_orders" DROP COLUMN "type";
