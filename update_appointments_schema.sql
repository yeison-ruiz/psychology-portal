-- Add user_id to appointments table link to auth.users
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies to allow users to see their own appointments
DROP POLICY IF EXISTS "Lectura publica desarrollo" ON public.appointments;

CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
