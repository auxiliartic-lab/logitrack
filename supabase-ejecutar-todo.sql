-- ============================================================
-- LOGITRACK PRO - Tablas en snake_case (compatible con schema cache)
-- Supabase → SQL Editor → New query → Pegar TODO → Run
-- ============================================================
-- Si ya creaste tablas antes con columnas "licensePlate", etc., bórralas primero:
-- DROP TABLE IF EXISTS public.settings;
-- DROP TABLE IF EXISTS public.vehicles;
-- Luego ejecuta todo lo de abajo.

CREATE TABLE IF NOT EXISTS public.vehicles (
  id text PRIMARY KEY,
  license_plate text NOT NULL,
  operation text NOT NULL,
  current_stage text NOT NULL,
  history jsonb NOT NULL DEFAULT '[]',
  entry_time bigint NOT NULL,
  exit_time bigint,
  status text NOT NULL DEFAULT 'active',
  maneuver_type text,
  product_name text,
  entity_name text,
  target_quantity numeric,
  shipped_weight numeric,
  net_weight numeric
);

CREATE TABLE IF NOT EXISTS public.settings (
  id text PRIMARY KEY,
  standard_times jsonb NOT NULL DEFAULT '{}',
  stage_flows jsonb NOT NULL DEFAULT '{}',
  workspace_id text NOT NULL DEFAULT 'OPERACION_GLOBAL'
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_vehicles_all" ON public.vehicles;
CREATE POLICY "anon_vehicles_all" ON public.vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_settings_all" ON public.settings;
CREATE POLICY "anon_settings_all" ON public.settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- Habilitar Realtime (si falla, se ignora)
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.settings; EXCEPTION WHEN OTHERS THEN NULL; END $$;

NOTIFY pgrst, 'reload schema';
