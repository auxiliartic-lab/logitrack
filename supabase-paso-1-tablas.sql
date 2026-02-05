-- ============================================================
-- PASO 1: Crear solo las tablas
-- Supabase Dashboard → SQL Editor → New query → Pegar y Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  "licensePlate" TEXT NOT NULL,
  operation TEXT NOT NULL,
  "currentStage" TEXT NOT NULL,
  history JSONB NOT NULL DEFAULT '[]',
  "entryTime" BIGINT NOT NULL,
  "exitTime" BIGINT,
  status TEXT NOT NULL DEFAULT 'active',
  "maneuverType" TEXT,
  "productName" TEXT,
  "entityName" TEXT,
  "targetQuantity" NUMERIC,
  "shippedWeight" NUMERIC,
  "netWeight" NUMERIC
);

CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  "standardTimes" JSONB NOT NULL DEFAULT '{}',
  "stageFlows" JSONB NOT NULL DEFAULT '{}',
  "workspaceId" TEXT NOT NULL DEFAULT 'OPERACION_GLOBAL'
);
