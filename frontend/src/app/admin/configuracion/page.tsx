"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { updateWeeklySettings, blockDate, unblockDate } from "./actions";

const DAYS_MAP = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface DaySetting {
  day_of_week: number;
  is_work_day: boolean;
  start_time: string;
  end_time: string;
}

interface BlockedDate {
  id: number;
  date: string; // YYYY-MM-DD format
  reason: string;
}

export default function ConfigPage() {
  const [weeklySettings, setWeeklySettings] = useState<DaySetting[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase
        .from("calendar_settings")
        .select("*")
        .order("day_of_week");

      const fullWeek: DaySetting[] = [];
      for (let i = 0; i < 7; i++) {
        const existing = settings?.find((s) => s.day_of_week === i);
        if (existing) {
          fullWeek.push(existing);
        } else {
          fullWeek.push({
            day_of_week: i,
            is_work_day: i !== 0 && i !== 6,
            start_time: "09:00",
            end_time: "17:00",
          });
        }
      }
      const sorted = [...fullWeek].sort((a, b) => {
        const da = a.day_of_week === 0 ? 7 : a.day_of_week;
        const db = b.day_of_week === 0 ? 7 : b.day_of_week;
        return da - db;
      });
      setWeeklySettings(sorted);

      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("*")
        .order("date");
      if (blocked) setBlockedDates(blocked);

      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleDayChange = (
    index: number,
    field: keyof DaySetting,
    value: any,
  ) => {
    const newSettings = [...weeklySettings];
    newSettings[index] = { ...newSettings[index], [field]: value };
    setWeeklySettings(newSettings);
  };

  const saveSettings = async () => {
    if (!confirm("¿Guardar configuración de horarios?")) return;
    try {
      await updateWeeklySettings(weeklySettings);
      alert("Horarios guardados correctamente.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;
    try {
      await blockDate(newBlockDate, newBlockReason || "No disponible");
      setNewBlockDate("");
      setNewBlockReason("");
      const { data } = await supabase
        .from("blocked_dates")
        .select("*")
        .order("date");
      if (data) setBlockedDates(data);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm("¿Desbloquear esta fecha?")) return;
    try {
      await unblockDate(id);
      const { data } = await supabase
        .from("blocked_dates")
        .select("*")
        .order("date");
      if (data) setBlockedDates(data);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8 font-sans">
      <header className="flex items-center gap-4 mb-10">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-[#2C2C2A]"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-[#2C2C2A]">
          Gestión de Calendario
        </h1>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#2C2C2A]">
              🕐 Horario Semanal
            </h3>
            <button
              onClick={saveSettings}
              className="bg-[#2C2C2A] text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-black"
            >
              Guardar Cambios
            </button>
          </div>

          <div className="space-y-3">
            {weeklySettings.map((day, idx) => (
              <div
                key={day.day_of_week}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${day.is_work_day ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-60"}`}
              >
                <div className="flex items-center gap-4 w-32">
                  <input
                    type="checkbox"
                    checked={day.is_work_day}
                    onChange={(e) =>
                      handleDayChange(idx, "is_work_day", e.target.checked)
                    }
                    className="w-5 h-5 text-[#C0A062] rounded focus:ring-[#C0A062]"
                  />
                  <span className="font-bold text-sm">
                    {DAYS_MAP[day.day_of_week]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start_time}
                    onChange={(e) =>
                      handleDayChange(idx, "start_time", e.target.value)
                    }
                    disabled={!day.is_work_day}
                    className="border border-gray-200 rounded text-sm py-1 px-2 disabled:bg-transparent"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={day.end_time}
                    onChange={(e) =>
                      handleDayChange(idx, "end_time", e.target.value)
                    }
                    disabled={!day.is_work_day}
                    className="border border-gray-200 rounded text-sm py-1 px-2 disabled:bg-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-[#2C2C2A] mb-6">
              🚫 Bloquear Fecha Específica
            </h3>
            <form onSubmit={handleAddBlock} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  className="w-full border-gray-200 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Motivo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Congreso"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="w-full border-gray-200 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-red-50 text-red-500 px-4 py-3 rounded-lg font-bold hover:bg-red-100"
              >
                Bloquear
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-[#2C2C2A] mb-4">
              Fechas Bloqueadas
            </h3>
            {blockedDates.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay fechas bloqueadas.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {blockedDates.map((b) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100"
                  >
                    <div>
                      {/* FIX: Parseo manual de fecha para evitar desfase de zona horaria */}
                      <div className="font-bold text-sm text-[#2C2C2A]">
                        {b.date.split("-")[2]}/{b.date.split("-")[1]}/
                        {b.date.split("-")[0]}
                      </div>
                      <div className="text-xs text-gray-400">{b.reason}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(b.id)}
                      className="text-xs text-red-400 font-bold hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
