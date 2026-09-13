-- Coluna archivedAt para arquivamento (soft delete) de pneus
ALTER TABLE "tires" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMPTZ(3);
