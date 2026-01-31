"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { createAppointment } from "@/app/actions";

export function AppointmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Efecto: Cuando cambia la fecha, buscar disponibilidad
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setAvailableSlots([]);
      try {
        const res = await fetch(`/api/availability?date=${selectedDate}`);
        const data = await res.json();
        if (data.slots) {
          setAvailableSlots(data.slots);
        }
      } catch (e) {
        console.error("Error fetching slots", e);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedDate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await createAppointment(formData);

    if (response?.error) {
      alert(response.error);
      setIsLoading(false);
    }
  }

  const labelClass =
    "block text-xs uppercase tracking-[0.2em] text-[#C0A062] font-bold mb-2 font-sans";
  const inputClass =
    "w-full border-0 border-b border-[#E5E0D6] bg-transparent py-3 text-[#2C2C2A] placeholder:text-[#2C2C2A]/30 focus:border-[#C0A062] focus:ring-0 font-serif text-lg transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFFCF8] p-10 md:p-12 rounded-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative border border-[#F2EFE9]"
    >
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl text-[#2C2C2A] mb-2 italic">
          Reserva tu espacio
        </h3>
        <p className="text-xs text-gray-400 font-sans tracking-wide">
          Hablemos de lo que te importa.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            ¿Cómo te llamas?
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            className={inputClass}
            placeholder="Escribe tu nombre aquí..."
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            ¿Cuál es tu correo?
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className={inputClass}
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label htmlFor="serviceType" className={labelClass}>
            Tipo de Sesión
          </label>
          <select
            name="serviceType"
            id="serviceType"
            required
            className={`${inputClass} text-base`}
          >
            <option value="" disabled selected>
              Selecciona el servicio...
            </option>
            <option value="individual">Terapia Individual (50 min)</option>
            <option value="couple">Terapia de Pareja (60 min)</option>
            <option value="online">Orientación Online</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label htmlFor="date" className={labelClass}>
              Fecha Ideal
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className={`${inputClass} text-base`}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>
              Hora
            </label>
            <select
              name="time"
              id="time"
              required
              className={`${inputClass} text-base`}
              disabled={!selectedDate || loadingSlots}
            >
              <option value="" disabled selected>
                {loadingSlots
                  ? "Buscando..."
                  : selectedDate
                    ? "Selecciona..."
                    : "Elige fecha primero"}
              </option>

              {availableSlots.length > 0
                ? availableSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                : !loadingSlots &&
                  selectedDate && <option disabled>No hay cupos</option>}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-6 flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          required
          className="mt-1 w-4 h-4 text-[#C0A062] border-gray-300 rounded focus:ring-[#C0A062]"
        />
        <label
          htmlFor="privacy"
          className="text-[10px] text-gray-500 leading-tight"
        >
          Acepto la{" "}
          <a href="/privacidad" className="underline hover:text-[#C0A062]">
            Política de Privacidad
          </a>{" "}
          y el tratamiento de mis datos.
        </label>
      </div>

      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-full bg-[#2C2C2A] hover:bg-[#C0A062] text-white font-sans text-xs uppercase tracking-[0.25em] py-5 rounded-full transition-all duration-500 shadow-xl hover:shadow-[#C0A062]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          isLoading={isLoading}
          disabled={availableSlots.length === 0}
        >
          {availableSlots.length === 0 && selectedDate
            ? "Sin Cupos"
            : "Agendar Cita"}
        </Button>
      </div>
    </form>
  );
}
