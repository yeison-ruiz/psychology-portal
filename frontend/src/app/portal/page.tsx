"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BellIcon,
  VideoCameraIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function getData() {
      try {
        // 1. Get User
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);

          // 2. Fetch Next Appointment (Future, Confirmed)
          const { data: nextAppt } = await supabase
            .from("appointments")
            .select("*")
            .eq("user_id", user.id)
            .gte("scheduled_at", new Date().toISOString())
            .eq("status", "confirmed")
            .order("scheduled_at", { ascending: true })
            .limit(1)
            .single();

          setNextAppointment(nextAppt);

          // 3. Fetch Recent Activity (Last 5 appointments)
          const { data: activity } = await supabase
            .from("appointments")
            .select("*")
            .eq("user_id", user.id)
            .order("scheduled_at", { ascending: false })
            .limit(5);

          setRecentActivity(activity || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [supabase]);

  // Helper formats
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMonthAndDay = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date
        .toLocaleDateString("es-CO", { month: "short" })
        .toUpperCase()
        .replace(".", ""),
      day: date.getDate(),
    };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* 1. Header Superior */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm md:bg-transparent md:shadow-none md:p-0">
        <h2 className="text-xl font-bold text-gray-900 hidden md:block">
          Panel del Paciente
        </h2>
        <div className="flex items-center gap-6 ml-auto">
          <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              {/* Avatar Placeholder */}
              <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                {user?.user_metadata?.full_name?.[0] || "U"}
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {user?.user_metadata?.full_name || "Usuario"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Welcome & Date */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Hola,{" "}
            {(() => {
              const name = user?.user_metadata?.full_name;
              if (!name) return "Paciente";
              const parts = name.split(" ");
              // If first part is a title (Dr, Dra, etc), take the second part to avoid "Hola, Dra."
              if (
                parts.length > 1 &&
                /^(dr|dra|lic|ing|profa?)\.?$/i.test(parts[0])
              ) {
                return parts[1]; // Returns "Johana" from "Dra. Johana Villabón"
              }
              return parts[0]; // Returns "Juan" from "Juan Perez"
            })()}
          </h1>
          <p className="text-gray-500 font-medium">
            Bienvenido a tu espacio de bienestar personal.
          </p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-full text-sm text-gray-600 font-bold shadow-sm border border-gray-100">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      {/* 3. Next Session Card */}
      {nextAppointment ? (
        <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Image Area or User Placeholder */}
            <div className="h-56 lg:h-auto lg:w-[35%] bg-gray-100 rounded-2xl relative overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1605656816944-971cd5c1407f?q=80&w=2670&auto=format&fit=crop"
                alt="Sesión Virtual"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-blue-900 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                Próxima Sesión
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 py-4 pr-4 flex flex-col justify-between gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-1 capitalize">
                    {nextAppointment.type}
                  </h3>
                  {/* Show modality if stored in notes, naive check for now */}
                  <p className="text-gray-500 font-medium text-sm">
                    {formatDate(nextAppointment.scheduled_at)} -{" "}
                    {formatTime(nextAppointment.scheduled_at)}
                  </p>
                </div>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  CONFIRMADA
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 overflow-hidden relative border-2 border-white shadow-sm shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold">
                    DM
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Dra. Villabón
                  </p>
                  <p className="text-xs text-gray-500">Psicóloga Clínica</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 w-fit">
                  <VideoCameraIcon className="w-5 h-5" />
                  Unirse a Google Meet
                </button>
                <p className="text-xs text-gray-400 mt-3 font-medium">
                  El enlace se activará 5 minutos antes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes sesiones próximas
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Parece que estás al día con tus sesiones. ¿Te gustaría agendar una
            nueva cita para continuar tu proceso?
          </p>
          <Link
            href="/portal/agendar"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Agendar Nueva Cita
          </Link>
        </div>
      )}

      {/* 4. Quick Actions */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-5">
          Acciones Rápidas
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/portal/agendar"
            className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PlusIcon className="w-6 h-6 stroke-[3px]" />
            </div>
            <h4 className="font-bold text-gray-900">Agendar Nueva Sesión</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Busca un espacio en la agenda
            </p>
          </Link>

          <a
            href="mailto:hola@dravillabon.com"
            className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChatBubbleLeftRightIcon className="w-6 h-6 stroke-[2px]" />
            </div>
            <h4 className="font-bold text-gray-900">Contactar Especialista</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Envía un mensaje directo
            </p>
          </a>

          <Link
            href="/portal/recursos"
            className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpenIcon className="w-6 h-6 stroke-[2px]" />
            </div>
            <h4 className="font-bold text-gray-900">Ver Recursos</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Lecturas y ejercicios
            </p>
          </Link>
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900">
            Actividad Reciente
          </h3>
          <button className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Ver todo
          </button>
        </div>

        <div className="space-y-1">
          {recentActivity.length > 0 ? (
            recentActivity.map((item) => {
              const { month, day } = getMonthAndDay(item.scheduled_at);
              return (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-6 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {month}
                    </span>
                    <span className="text-xl font-bold text-gray-900 leading-none mt-0.5">
                      {day}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base capitalize">
                      {item.type}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2 font-medium">
                      {formatTime(item.scheduled_at)} • Virtual
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`hidden md:inline-block px-3 py-1.5 rounded-md text-xs font-bold ${
                        item.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "confirmed" ? "Agendada" : item.status}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      {item.status === "confirmed" ? (
                        <VideoCameraIcon className="w-4 h-4" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No hay actividad reciente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
