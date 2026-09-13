-- Adiciona coluna JSONB para os campos extras da ficha de ferramenta
-- (categoria, controlType, quantidades, localização, aquisição, calibração etc.)
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
