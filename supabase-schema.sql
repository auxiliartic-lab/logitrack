-- ============================================================
-- LOGITRACK PRO - Crear tablas en Supabase
-- Copia y pega TODO en: Supabase → SQL Editor → New query → Run
-- Proyecto: https://xrpsvleodzlydlcdxpdq.supabase.co
-- ============================================================

-- 1. Tabla de vehículos
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

-- 2. Tabla de configuración
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  "standardTimes" JSONB NOT NULL DEFAULT '{}',
  "stageFlows" JSONB NOT NULL DEFAULT '{}',
  "workspaceId" TEXT NOT NULL DEFAULT 'OPERACION_GLOBAL'
);

-- 3. RLS: permitir que la app lea y escriba
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo en vehicles para anon" ON public.vehicles;
CREATE POLICY "Permitir todo en vehicles para anon"
  ON public.vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en settings para anon" ON public.settings;
CREATE POLICY "Permitir todo en settings para anon"
  ON public.settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. Realtime (opcional): si falla, activa en Dashboard → Database → Replication)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
