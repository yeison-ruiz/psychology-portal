import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF8] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-12 rounded-[2rem] shadow-2xl border border-gray-100">
        <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
          🌿
        </div>

        <h1 className="font-serif text-3xl text-[#2C2C2A] mb-4">
          ¡Cita Solicitada!
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Gracias por dar este paso. He recibido tu solicitud y te contactaré
          pronto vía WhatsApp/Email para confirmar los detalles.
        </p>

        <Link
          href="/"
          className="inline-block bg-[#2C2C2A] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C0A062] transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
