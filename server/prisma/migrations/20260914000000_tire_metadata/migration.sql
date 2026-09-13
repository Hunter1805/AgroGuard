-- Adiciona coluna JSONB para os campos extras da ficha do pneu
-- (medidas, pressões, sulco, instalação, recapagens etc.)
ALTER TABLE "tires" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
