-- ¡IMPORTANTE! 
-- El error es porque habilitamos Seguridad (RLS) pero olvidamos permitir editar (UPDATE).
-- Ejecuta este script para arreglarlo.

-- Permitir UPDATE a usuarios autenticados (Admin)
DROP POLICY IF EXISTS "Authenticated can update appointments" ON public.appointments;

CREATE POLICY "Authenticated can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir DELETE también, por si quieres cancelar borrando (opcional)
DROP POLICY IF EXISTS "Authenticated can delete appointments" ON public.appointments;

CREATE POLICY "Authenticated can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (true);
