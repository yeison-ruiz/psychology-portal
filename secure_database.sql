-- 1. Habilitar RLS (Seguridad)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Política para INSERT (Público, formulario de registro)
-- Cualquiera puede agendar una cita (crear)
DROP POLICY IF EXISTS "Public can insert appointments" ON public.appointments;
CREATE POLICY "Public can insert appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 3. Política para SELECT (Privado, solo usuarios logueados)
-- SOLO usuarios autenticados (Admin o Pacientes) pueden ver citas
-- (En Fase 2 restringiremos para que el paciente solo vea LAS SUYAS, pero por ahora cerramos el acceso público)
DROP POLICY IF EXISTS "Authenticated can view appointments" ON public.appointments;
CREATE POLICY "Authenticated can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (true);

-- Eliminar política pública de lectura anterior si existía
DROP POLICY IF EXISTS "Permitir ver a todos" ON public.appointments;
