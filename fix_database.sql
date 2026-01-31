-- 1. Agregar columnas que podrían faltar
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'individual';

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- 2. Habilitar inserción pública (para que el formulario funcione sin login)
-- Primero habilitamos RLS si no está
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Creamos política para permitir INSERT a cualquiera (anon)
DROP POLICY IF EXISTS "Permitir insertar a publico" ON public.appointments;
CREATE POLICY "Permitir insertar a publico" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Creamos política para permitir SELECT solo a Admin (opcional por ahora, abierto para debug)
DROP POLICY IF EXISTS "Permitir ver a todos" ON public.appointments;
CREATE POLICY "Permitir ver a todos" 
ON public.appointments 
FOR SELECT 
USING (true);
