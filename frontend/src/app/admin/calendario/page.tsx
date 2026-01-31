"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Utilidad simple de fechas
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Cargar citas
  useEffect(() => {
    async function fetch() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("appointments").select("*");
      if (data) setAppointments(data);
      setIsLoading(false);
    }
    fetch();
  }, [supabase, router]);

  // Lógica del Calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayIndex = firstDay.getDay(); // 0 = Domingo

  // Generar array de días para renderizar
  const calendarDays = [];
  // Relleno previo
  for (let i = 0; i < startDayIndex; i++) {
    calendarDays.push(null);
  }
  // Días reales
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // Navegación
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // Filtrar citas del día
  const getDailyAppointments = (date: Date | null) => {
    if (!date) return [];
    return appointments.filter((a) => {
      const d = new Date(a.scheduled_at);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear() &&
        a.status !== "cancelled"
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8 font-sans">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-[#2C2C2A]"
          >
            ← Salir
          </button>
          <h1 className="text-2xl font-bold text-[#2C2C2A]">
            Calendario de Citas
          </h1>
        </div>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 items-center p-1">
          <button
            onClick={prevMonth}
            className="px-3 py-1 hover:bg-gray-100 rounded text-gray-500"
          >
            ◀
          </button>
          <span className="px-4 font-bold text-[#2C2C2A] w-32 text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="px-3 py-1 hover:bg-gray-100 rounded text-gray-500"
          >
            ▶
          </button>
          <button
            onClick={goToday}
            className="ml-2 text-xs font-bold uppercase text-[#C0A062] px-2 hover:underline"
          >
            Hoy
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cabecera Días */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid Calendario */}
        <div className="grid grid-cols-7 auto-rows-[140px] divide-x divide-gray-100 lg:divide-x-0 lg:gap-[1px] bg-gray-100 border-b border-gray-100">
          {calendarDays.map((date, idx) => {
            if (!date) return <div key={idx} className="bg-white/50"></div>;

            const dayApts = getDailyAppointments(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={idx}
                className={`bg-white p-3 relative group transition-colors hover:bg-gray-50 ${isToday ? "bg-[#FFFBF2]" : ""}`}
              >
                <span
                  className={`text-sm font-bold ${isToday ? "text-[#C0A062]" : "text-gray-700"}`}
                >
                  {date.getDate()}
                </span>

                <div className="mt-2 space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                  {dayApts.map((apt) => {
                    const time = new Date(apt.scheduled_at).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    );
                    return (
                      <div
                        key={apt.id}
                        className={`text-[10px] px-2 py-1 rounded border truncate cursor-pointer ${
                          apt.type === "couple"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : apt.type === "online"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-green-50 text-green-700 border-green-100"
                        }`}
                      >
                        <span className="font-bold mr-1">{time}</span>
                        {apt.guest_name.split(" ")[0]}
                      </div>
                    );
                  })}
                </div>

                {/* Botón Flotante para + (Gestión Futura) */}
                <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-[#C0A062] transition-opacity">
                  +
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-50 border border-green-100 rounded"></div>{" "}
          Individual
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-50 border border-purple-100 rounded"></div>{" "}
          Pareja
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded"></div>{" "}
          Online
        </div>
      </div>
    </div>
  );
}
