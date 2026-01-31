"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 1. Esquema de Validación con Zod para Login
const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 2. Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Manejo del Submit
  async function onSubmit(data: LoginFormValues) {
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message === "Invalid failured credentials") {
        setServerError("Correo o contraseña incorrectos");
      } else {
        setServerError(error.message);
      }
      return;
    }

    // Login exitoso
    // Verificar si es la doctora
    if (data.email === "hola@dravillabon.com") {
      router.push("/admin");
    } else {
      router.push("/portal");
    }

    // Forzar refresh para actualizar estado de sesión (middleware/cookies)
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 relative overflow-hidden">
        {/* Decoración sutil superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C0A062] to-[#2C2C2A]" />

        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-[#2C2C2A] mb-2">
            Bienvenido
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Ingresa a tu portal privado
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {serverError}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="tu@email.com"
              className={`w-full border p-3 rounded-lg focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
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

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Contraseña
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••"
              className={`w-full border p-3 rounded-lg focus:ring-[#C0A062] focus:border-[#C0A062] transition-colors ${
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

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-[#2C2C2A] hover:bg-black text-white h-12 rounded-lg"
            isLoading={isSubmitting}
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-[#C0A062] font-bold hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
