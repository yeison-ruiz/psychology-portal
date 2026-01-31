"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// Helper to format currency
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const id = params.id;

  useEffect(() => {
    async function fetchAppointment() {
      if (!id) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setAppointment(data);
      }
      setLoading(false);
    }
    fetchAppointment();
  }, [id, supabase]);

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setAppointment({ ...appointment, status: newStatus });
      router.refresh();
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Cargando detalles...</div>
    );
  if (!appointment)
    return (
      <div className="p-10 text-center text-gray-500">Cita no encontrada</div>
    );

  const dateObj = new Date(appointment.scheduled_at);

  return (
    <div className="p-10 max-w-7xl mx-auto font-sans">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <div className="text-xs text-gray-400 mb-2 font-medium">
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => router.push("/admin")}
          >
            Inicio
          </span>{" "}
          /{" "}
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => router.push("/admin")}
          >
            Solicitudes
          </span>{" "}
          /{" "}
          <span className="text-gray-600 font-bold">
            Detalle de Cita #{appointment.id.slice(0, 4)}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-3">
              Cita #{appointment.id.slice(0, 4)}
              <span
                className={`text-xs px-2.5 py-1 rounded-full border border-opacity-20 uppercase tracking-wider font-bold ${
                  appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                    : appointment.status === "confirmed"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "bg-red-100 text-red-700 border-red-500"
                }`}
              >
                {appointment.status === "pending"
                  ? "Pendiente"
                  : appointment.status === "confirmed"
                    ? "Confirmada"
                    : "Cancelada"}
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              Solicitud de consulta - {appointment.type || "Psicología Clínica"}
            </p>
          </div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">
            RECIBIDO EL {new Date(appointment.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3 Key Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <CalendarDaysIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Fecha
                </div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  {dateObj.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Hora
                </div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  {dateObj.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <VideoCameraIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Modalidad
                </div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  Virtual
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">
                Información del Paciente
              </h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Ver Historial Completo
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Nombre Completo
                  </p>
                  <p className="font-bold text-gray-900 text-lg">
                    {appointment.guest_name || "Desconocido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Correo Electrónico
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">
                      {appointment.guest_email || "No disponible"}
                    </p>
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Teléfono
                  </p>
                  <p className="font-bold text-gray-900">+57 ...</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Tipo de Sesión
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 w-fit px-3 py-1 rounded-md text-sm">
                    <VideoCameraIcon className="w-4 h-4" />
                    Virtual (Google Meet)
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Motivo de Consulta / Notas
                </p>
                <p className="text-sm text-gray-600 italic">
                  "{appointment.notes || "Sin notas adicionales."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Meta */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-3">
              {appointment.status === "pending" ? (
                <>
                  <button
                    onClick={() => updateStatus("confirmed")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Confirmar Cita
                  </button>
                  <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <ArrowPathIcon className="w-5 h-5 text-gray-400" />
                    Reprogramar
                  </button>
                  <button
                    onClick={() => updateStatus("cancelled")}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Cancelar Solicitud
                  </button>
                </>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    Esta cita ya está{" "}
                    {appointment.status === "confirmed"
                      ? "Confirmada"
                      : "Cancelada"}
                    .
                  </p>
                  <button
                    onClick={() => updateStatus("pending")}
                    className="text-blue-600 text-xs font-bold mt-2 hover:underline"
                  >
                    Revertir a Pendiente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Integration Card */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-black text-white p-1 rounded">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-blue-900 text-sm">
                Google Calendar Integration
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-3 mb-4">
              <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                <ArrowPathIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Listo para sincronizar
                </p>
                <p className="text-[10px] text-gray-500">
                  Se añadirá al calendario de Dra. Villabón
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-uppercase text-blue-400 mb-1 tracking-wider uppercase">
                Google Meet Link
              </p>
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-2 text-xs text-gray-400 italic">
                {appointment.status === "confirmed"
                  ? "meet.google.com/xyz-abcd-123"
                  : "Se generará al confirmar..."}
              </div>
            </div>
          </div>

          {/* Therapist Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Terapeuta Asignado
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                {/* Avatar */}
                <div className="w-full h-full bg-blue-100 flex justify-center items-center text-blue-800 font-bold">
                  DV
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Dra. Johana Villabón</p>
                <p className="text-xs text-gray-500">
                  Psicóloga Clínica - Adultos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
