"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "./actions";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchAppointments() {
      // 1. Obtener sesión actual (Middleware ya protege)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // 2. Obtener datos
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (data) {
        setAppointments(data);
      }
      setIsLoading(false);
    }
    fetchAppointments();
  }, [supabase, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login"); // Ir a login al salir
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8 font-sans">
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2A]">
            Hola, Dra. Villabón
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gestión integral de tu consultorio
          </p>
        </div>
        <div className="flex gap-4">
          {/* Nuevo Botón Calendario Visual */}
          <button
            onClick={() => router.push("/admin/calendario")}
            className="bg-white border border-gray-200 text-[#2C2C2A] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-2"
          >
            📅 Ver Calendario Mes
          </button>

          <button
            onClick={() => router.push("/admin/configuracion")}
            className="bg-[#2C2C2A] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black"
          >
            Configurar
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Citas Totales
          </div>
          <div className="text-3xl font-serif text-[#2C2C2A]">
            {appointments.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Pendientes
          </div>
          <div className="text-3xl font-serif text-[#C0A062]">
            {appointments.filter((a) => a.status === "pending").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Confirmadas
          </div>
          <div className="text-3xl font-serif text-[#566452]">
            {appointments.filter((a) => a.status === "confirmed").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Ingresos Mes
          </div>
          <div className="text-3xl font-serif text-[#2C2C2A]">
            $
            {appointments.filter((a) => a.status === "confirmed").length *
              150000}
          </div>
        </div>
      </div>

      {/* Tabla de Citas Interactiva */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-[#2C2C2A]">Agenda de Citas</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span>{" "}
            <span className="text-xs text-gray-400">Pendiente</span>
            <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span>{" "}
            <span className="text-xs text-gray-400">Confirmada</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400">
            Cargando agenda...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <div className="text-4xl mb-4">📅</div>
            <p>No hay citas agendadas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-8 py-4 font-bold">Paciente</th>
                  <th className="px-8 py-4 font-bold">Fecha</th>
                  <th className="px-8 py-4 font-bold">Hora</th>
                  <th className="px-8 py-4 font-bold">Tipo</th>
                  <th className="px-8 py-4 font-bold">Estado</th>
                  <th className="px-8 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => {
                  const dateObj = new Date(apt.scheduled_at);
                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-4 font-medium text-[#2C2C2A]">
                        {apt.guest_name}
                        <div className="text-xs text-gray-400 font-normal">
                          {apt.guest_email}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        {dateObj.toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4">
                        {dateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-8 py-4 capitalize">
                        <span className="px-2 py-1 rounded bg-gray-100 text-xs">
                          {apt.type || "Online"}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : apt.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {apt.status === "pending"
                            ? "Pendiente"
                            : apt.status === "confirmed"
                              ? "Confirmada"
                              : apt.status === "cancelled"
                                ? "Cancelada"
                                : apt.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right flex justify-end gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={async () => {
                                if (!confirm("¿Confirmar esta cita?")) return;
                                await updateAppointmentStatus(
                                  apt.id,
                                  "confirmed",
                                );
                                window.location.reload();
                              }}
                              className="bg-green-50 text-green-600 px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-green-100 transition-colors border border-green-200"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm("¿Cancelar esta cita?")) return;
                                await updateAppointmentStatus(
                                  apt.id,
                                  "cancelled",
                                );
                                window.location.reload();
                              }}
                              className="bg-red-50 text-red-600 px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-red-100 transition-colors border border-red-200"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {apt.status !== "pending" && (
                          <span className="text-gray-300 text-xs italic">
                            {apt.status === "confirmed"
                              ? "Cita Agendada"
                              : "Cita Cancelada"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
