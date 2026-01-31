import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Nota: Usamos Service Role o Auth Client dependiendo de la seguridad.
// Para lectura pública de disponibilidad, usamos Anon Key (ya que las políticas permiten SELECT a blocked_dates/settings).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const targetDate = new Date(dateStr + 'T00:00:00'); // Asegurar UTC/Local consistencia simplificada
  const dayOfWeek = targetDate.getDay(); // 0-6

  // 1. Chequear Bloqueos Específicos
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("date")
    .eq("date", dateStr)
    .single();

  if (blocked) {
    return NextResponse.json({ slots: [], reason: "Día bloqueado por el especialista" });
  }

  // 2. Chequear Configuración Semanal
  // (Si no existe config, asumimos L-V 9-17)
  const { data: settings } = await supabase
    .from("calendar_settings")
    .select("*")
    .eq("day_of_week", dayOfWeek)
    .single();
  
  // Default config si no hay DB settings
  let isWorkDay = true;
  let startHour = 9;
  let endHour = 17;

  if (settings) {
     isWorkDay = settings.is_work_day;
     if (!isWorkDay) return NextResponse.json({ slots: [], reason: "Día no laboral" });
     startHour = parseInt(settings.start_time.split(':')[0]);
     endHour = parseInt(settings.end_time.split(':')[0]);
  } else {
     // Default hardcoded logic: Sáb/Dom cerrado
     if (dayOfWeek === 0 || dayOfWeek === 6) return NextResponse.json({ slots: [], reason: "Fin de semana" });
  }

  // 3. Generar Slots Posibles
  const possibleSlots = [];
  for (let h = startHour; h < endHour; h++) {
     possibleSlots.push(`${h.toString().padStart(2, '0')}:00`);
  }

  // 4. Chequear Citas Existentes (Ocupadas)
  // Buscamos citas que empiecen en ese día
  // Nota: "scheduled_at" es timestampz. Necesitamos filtrar rango del día.
  const startOfDay = new Date(dateStr + 'T00:00:00').toISOString();
  const endOfDay = new Date(dateStr + 'T23:59:59').toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("scheduled_at")
    .gte("scheduled_at", startOfDay)
    .lte("scheduled_at", endOfDay)
    .neq("status", "cancelled"); // Ignorar canceladas

  // Filtrar
  let availableSlots = possibleSlots;
  
  if (appointments && appointments.length > 0) {
      const takenTimes = appointments.map(a => {
          const d = new Date(a.scheduled_at);
          return d.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}); // HH:MM 24h
      });
      
      availableSlots = possibleSlots.filter(slot => !takenTimes.includes(slot));
  }

  return NextResponse.json({ slots: availableSlots });
}
