-- ============================================================
-- PASO 2: Activar RLS y políticas (ejecutar DESPUÉS del paso 1)
-- ============================================================

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo en vehicles para anon" ON public.vehicles;
CREATE POLICY "Permitir todo en vehicles para anon"
  ON public.vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en settings para anon" ON public.settings;
CREATE POLICY "Permitir todo en settings para anon"
  ON public.settings FOR ALL TO anon USING (true) WITH CHECK (true);
