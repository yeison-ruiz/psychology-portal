"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Services provided by the psychologist
const SERVICE_TYPES = [
  "Terapia Individual (50 min)",
  "Terapia de Pareja (60 min)",
  "Orientación Online",
] as const;

// Schema basics
const appointmentSchema = z.object({
  serviceType: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: "Selecciona un servicio válido" }),
  }),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  type: z.enum(["online", "presencial"], {
    errorMap: () => ({ message: "Selecciona una modalidad" }),
  }),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

const AVAILABLE_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function AgendarPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: "online",
      serviceType: undefined,
    },
  });

  const watchDate = watch("date");
  const watchTime = watch("time");
  const watchType = watch("type");
  const watchService = watch("serviceType");

  // Effect: Auto-set modality based on service
  useEffect(() => {
    if (watchService === "Orientación Online") {
      setValue("type", "online");
    }
  }, [watchService, setValue]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  const onSubmit = async (data: AppointmentForm) => {
    if (!user) {
      alert("Debes iniciar sesión para agendar.");
      return;
    }
    setLoading(true);

    try {
      const scheduledAt = new Date(`${data.date}T${data.time}:00`);

      // Combine Service Type into notes or specific column if exists.
      // Since 'type' in DB is text, we can store the formatted type there or keep 'online/presencial' in type and put service in notes.
      // User requested "the psychologist works with these three themes". I'll put the SERVICE NAME as the main type for display,
      // but we need to track online/presencial.
      // Actually, 'type' column is just text. Let's store the Service Name there, as it's more descriptive.
      // But we lose the 'online' vs 'presencial' bit if we just overwrite.
      // Let's store: type = "Service Name (Modalidad)"

      const fullTypeString = `${data.serviceType} - ${data.type === "online" ? "Virtual" : "Presencial"}`;

      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        type: data.serviceType, // Storing the service name directly as requested
        status: "pending",
        notes: `Modalidad: ${data.type}. ${data.notes || ""}`, // Append modality to notes
        guest_name: user.user_metadata?.full_name,
        guest_email: user.email,
      });

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      router.push("/portal?success=true");
    } catch (error: any) {
      console.error("Error agendando:", error);
      alert(
        `Hubo un error al agendar la cita: ${error.message || "Inténtalo de nuevo"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <Link
          href="/portal"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al panel
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Agendar Nueva Sesión
        </h1>
        <p className="text-gray-500 mt-2">
          Selecciona el tipo de servicio, fecha y hora.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8"
      >
        {/* 1. Tipo de Servicio */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
            1. Tipo de Sesión
          </label>
          <div className="relative">
            <select
              {...register("serviceType")}
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="" disabled hidden>
                Selecciona el servicio...
              </option>
              {SERVICE_TYPES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.serviceType && (
            <span className="text-red-500 text-sm">
              {errors.serviceType.message}
            </span>
          )}
        </div>

        {/* 2. Fecha */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
            2. Selecciona una Fecha
          </label>
          <div className="relative">
            <input
              type="date"
              {...register("date")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-4 pl-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium uppercase"
            />
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date.message}</span>
          )}
        </div>

        {/* 3. Hora */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
            3. Horario Disponible
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {AVAILABLE_HOURS.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => setValue("time", hour)}
                className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                  watchTime === hour
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
          {/* Hidden Input for validation */}
          <input type="hidden" {...register("time")} />
          {errors.time && (
            <span className="text-red-500 text-sm">{errors.time.message}</span>
          )}
        </div>

        {/* 4. Modalidad */}
        {/* Only show modality choice if it's NOT explicitly Online Orientation (although user can choose) */}
        <div
          className={`space-y-3 ${watchService === "Orientación Online" ? "opacity-50 pointer-events-none" : ""}`}
        >
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
            4. Modalidad
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`cursor-pointer border p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                watchType === "online"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                value="online"
                {...register("type")}
                className="hidden"
              />
              <span className="font-bold">Virtual</span>
            </label>
            <label
              className={`cursor-pointer border p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                watchType === "presencial"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                value="presencial"
                {...register("type")}
                className="hidden"
              />
              <span className="font-bold">Presencial</span>
            </label>
          </div>
        </div>

        {/* 5. Notas */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            placeholder="¿Hay algo específico de lo que quieras hablar?"
          ></textarea>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base shadow-xl shadow-blue-100"
        >
          {loading ? "Confirmando Cita..." : "Confirmar Reserva"}
        </Button>
      </form>
    </div>
  );
}
