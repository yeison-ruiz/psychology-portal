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
  VideoCameraSlashIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, [supabase]);

  // Mock Data
  const nextSession = {
    type: "Terapia Individual",
    date: "Martes, 30 de Enero", // Hoy
    time: "10:00 AM",
    doctor: "Dra. Ana Martínez", // Usando nombre ejemplo imagen aunque sea Villabon
    status: "CONFIRMADA",
    meetLink: "#",
  };

  const activities = [
    {
      id: 1,
      month: "NOV",
      day: "02",
      title: "Terapia Cognitivo-Conductual",
      sub: "15:00 PM • Videollamada",
      status: "Agendada",
      statusColor: "bg-blue-100 text-blue-600",
      icon: <VideoCameraIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      id: 2,
      month: "OCT",
      day: "10",
      title: "Terapia Individual",
      sub: "10:00 AM • Presencial",
      status: "Completada",
      statusColor: "bg-gray-100 text-gray-600",
      icon: <CheckCircleIcon className="w-5 h-5 text-gray-400" />,
    },
  ];

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
              <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
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
            Hola, {user?.user_metadata?.full_name?.split(" ")[0] || "..."}
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
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Image Area */}
          <div className="h-56 lg:h-auto lg:w-[35%] bg-gradient-to-b from-blue-300 to-blue-600 rounded-2xl relative overflow-hidden flex items-end p-6">
            {/* Simulate Wavy Background with gradients */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mixed-blend-overlay"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl opacity-20"></div>

            <div className="relative z-10 bg-white/90 backdrop-blur-sm text-blue-900 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-md shadow-lg">
              Próxima Sesión
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 py-4 pr-4 flex flex-col justify-between gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-1">
                  {nextSession.type}
                </h3>
                <p className="text-gray-500 font-medium text-sm">
                  {nextSession.date} - {nextSession.time}
                </p>
              </div>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {nextSession.status}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 overflow-hidden relative border-2 border-white shadow-sm shrink-0">
                {/* Doctor Avatar */}
                <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold">
                  DM
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {nextSession.doctor}
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

      {/* 4. Quick Actions */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-5">
          Acciones Rápidas
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Action 1 */}
          <button className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PlusIcon className="w-6 h-6 stroke-[3px]" />
            </div>
            <h4 className="font-bold text-gray-900">Agendar Nueva Sesión</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Busca un espacio en la agenda
            </p>
          </button>

          {/* Action 2 */}
          <button className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChatBubbleLeftRightIcon className="w-6 h-6 stroke-[2px]" />
            </div>
            <h4 className="font-bold text-gray-900">Contactar Especialista</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Envía un mensaje directo
            </p>
          </button>

          {/* Action 3 */}
          <button className="bg-white py-8 px-6 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpenIcon className="w-6 h-6 stroke-[2px]" />
            </div>
            <h4 className="font-bold text-gray-900">Ver Recursos</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Lecturas y ejercicios
            </p>
          </button>
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
          {activities.map((item) => (
            <div
              key={item.id}
              className="group p-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-6 cursor-pointer"
            >
              {/* Date Box */}
              <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {item.month}
                </span>
                <span className="text-xl font-bold text-gray-900 leading-none mt-0.5">
                  {item.day}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2 font-medium">
                  {item.sub}
                </p>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <span
                  className={`hidden md:inline-block px-3 py-1.5 rounded-md text-xs font-bold ${item.statusColor}`}
                >
                  {item.status}
                </span>
                <button className="text-gray-300 hover:text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
