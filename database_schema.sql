-- Crear tabla Appointments (Citas)
create table
  public.appointments (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    
    -- Datos del paciente invitado (sin registro)
    guest_name text null,
    guest_email text null,
    guest_phone text null,
    
    -- Detalles de la cita
    scheduled_at timestamp with time zone not null,
    status text not null default 'pending', -- pending, confirmed, cancelled
    type text not null, -- online, presencial
    notes text null,
    
    constraint appointments_pkey primary key (id)
  ) tablespace pg_default;

-- Habilitar Row Level Security (RLS)
alter table public.appointments enable row level security;

-- Política 1: Permitir INSERTAR citas a cualquier persona (público)
create policy "Cualquiera puede agendar cita"
on public.appointments
for insert
to public
with check (true);

-- Política 2: Solo el admin puede LEER todas las citas (aquí simplificamos y permitimos leer las propias si tuviéramos auth, pero para MVP admin)
-- Por ahora, abriremos lectura pública SOLO para desarrollo, luego cerraremos.
create policy "Lectura publica desarrollo"
on public.appointments
for select
to public
using (true);
