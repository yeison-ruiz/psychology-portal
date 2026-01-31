"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 1. Esquema de Validación con Zod
const registerSchema = z
  .object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 2. Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // 3. Manejo del Submit
  async function onSubmit(data: RegisterFormValues) {
    setServerError(null);

    // Crear usuario en Supabase Auth
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName, // Guardamos el nombre en metadata
        },
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // Éxito
    setIsSuccess(true);
    // Opcional: Redirigir después de unos segundos o mostrar mensaje para verificar email
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-6 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        {/* Decoración sutil */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C0A062] to-[#2C2C2A]" />

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#2C2C2A] mb-2">
            Crear Cuenta
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Comienza tu proceso de bienestar
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-[#F0FDF4] text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2C2C2A] mb-2">
              ¡Cuenta creada!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Te hemos enviado un correo de confirmación. Por favor revisa tu
              bandeja de entrada.
            </p>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {serverError}
              </div>
            )}

            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Nombre Completo
              </label>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Ej. María Pérez"
                className={`w-full border rounded-lg p-3 text-sm focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
                  errors.fullName
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200"
                }`}
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Correo Electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className={`w-full border rounded-lg p-3 text-sm focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
                  errors.email
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••"
                className={`w-full border rounded-lg p-3 text-sm focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
                  errors.password
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200"
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Confirmar Contraseña
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••"
                className={`w-full border rounded-lg p-3 text-sm focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-[#2C2C2A] hover:bg-black text-white h-12 rounded-lg mt-4"
              isLoading={isSubmitting}
            >
              Crear Cuenta
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-[#C0A062] font-bold hover:underline transition-colors"
          >
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
