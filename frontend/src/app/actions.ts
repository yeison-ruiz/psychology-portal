"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function createAppointment(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const serviceType = formData.get("serviceType") as string; // Capturamos el tipo

  const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

  // Intentamos insertar con los campos que esperamos.
  const { error } = await supabase.from("appointments").insert({
    guest_name: fullName,
    guest_email: email,
    scheduled_at: scheduledAt,
    type: serviceType || "individual", // Guardamos el tipo real
    status: "pending",
  });

  if (error) {
    console.error("SUPABASE ERROR:", error); 
    // Si el error es por falta de columna, esto ayudará a debuggear (en consola servidor)
    return { error: "No se pudo agendar la cita. Error: " + error.message }; 
  }

  redirect("/agendar/exito");
}
