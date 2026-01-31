import { AppointmentForm } from "@/components/AppointmentForm";

export const metadata = {
  title: "Agendar Cita | Dra. Villabón",
  description: "Reserva tu sesión de terapia online o presencial.",
};

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Reserva tu Cita
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Da el primer paso hacia tu bienestar. Selecciona el horario que
            mejor se adapte a ti.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-neutral-100 sm:rounded-2xl sm:px-10 border border-neutral-100">
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
}
