"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper para crear cliente con contexto de usuario (cookies)
async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server actions can't set cookies directly usually, handled by middleware, but good to have signature
          }
        },
        remove(name: string, options: CookieOptions) {
            try {
                cookieStore.set({ name, value: '', ...options });
            } catch (error) {}
        },
      },
    }
  );
}

// --- Configuración Semanal ---
export async function updateWeeklySettings(settings: any[]) {
  const supabase = await getSupabase();
  
  for (const setting of settings) {
      const { error } = await supabase
        .from("calendar_settings")
        .upsert({ 
            day_of_week: setting.day_of_week,
            is_work_day: setting.is_work_day,
            start_time: setting.start_time,
            end_time: setting.end_time
        }, { onConflict: 'day_of_week' });
      
      if (error) throw new Error("Error saving settings: " + error.message);
  }

  revalidatePath("/admin/configuracion");
}

// --- Días Bloqueados (Vacaciones) ---
export async function blockDate(date: string, reason: string) {
  const supabase = await getSupabase();

  // Verificar sesión explícita (Opcional, RLS ya lo hace, pero buen debug)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("blocked_dates")
    .insert({ date, reason });

  if (error) throw new Error("Error blocking date: " + error.message);
  revalidatePath("/admin/configuracion");
}

export async function unblockDate(id: number) {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id);
    
  if (error) throw new Error("Error unblocking date: " + error.message);
  revalidatePath("/admin/configuracion");
}
