"use client";

import { useRef } from "react";
import Image from "next/image";
import { AppointmentForm } from "@/components/AppointmentForm";
import { TestimonioCarousel } from "@/components/TestimonioCarousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animaciones de "Aparición Suave" (Fade In Up)
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: "top 85%", // Dispara cuando el top de la sección está al 85% del viewport
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-white text-[#4A4A4A] font-sans selection:bg-[#C0A062] selection:text-white"
    >
      {/* 1. Navbar Flotante "Glass Premium" */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/5  px-8 py-4 flex items-center gap-10 transition-all hover:bg-white/95 w-full mx-auto flex justify-between max-w-7xl align-middle">
          {/* Logo */}
          <a
            href="#"
            className="font-serif text-2xl font-bold text-[#2C2C2A] tracking-tight hover:text-[#C0A062] transition-colors"
          >
            <span className="text-sm">Dra.</span> JOHANA VILLABON
          </a>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-gray-600">
            <a
              href="#quien-soy"
              className="hover:text-[#2C2C2A] transition-colors relative group"
            >
              Quién Soy
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C0A062] transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#servicios"
              className="hover:text-[#2C2C2A] transition-colors relative group"
            >
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C0A062] transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#testimonios"
              className="hover:text-[#2C2C2A] transition-colors relative group"
            >
              Testimonios
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C0A062] transition-all group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Login Link */}
            <a
              href="/login"
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2C2C2A] hover:text-[#C0A062] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Ingresar</span>
            </a>

            {/* CTA Button */}
            <a
              href="#contacto"
              className="bg-[#2C2C2A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C0A062] transition-colors shadow-md"
            >
              Agendar
            </a>
          </div>
        </div>
      </nav>

      {/* 2. NUEVO HERO (Imagen de fondo + Formulario destacado) */}
      <section className="relative min-h-[110vh] lg:min-h-screen pt-32 pb-20 px-6 flex items-center justify-center overflow-hidden">
        {/* Fondo Imagen Real con Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/service-online.png"
            alt="Fondo Terapia"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Velo gradiente: Texto legible a la izq, Imagen visible a la der */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/30"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Texto Hero */}
          <div className="order-2 lg:order-1 reveal-section">
            <span className="inline-block py-1 px-3 border border-[#C0A062] text-[#C0A062] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 bg-white">
              Psicología Clínica Online
            </span>
            <h1 className="font-serif text-5xl lg:text-7xl text-[#2C2C2A] leading-[1.05] mb-8">
              Vuelve a conectar <br /> con tu{" "}
              <span className="italic text-[#566452]">esencia.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
              Un espacio terapéutico diseñado para sanar, crecer y encontrar el
              equilibrio emocional que mereces, desde la comodidad de tu hogar.
            </p>

            <div className="flex items-center gap-4 text-sm font-semibold text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden"></div>
                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white overflow-hidden"></div>
              </div>
              <p>Pacientes felices hoy</p>
            </div>
          </div>

          {/* Formulario Hero (El que te gustó) */}
          <div className="order-1 lg:order-2 reveal-section flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN QUIÉNES SOMOS (Diseño Editorial) */}
      <section id="quien-soy" className="py-24 px-6 bg-white reveal-section">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            {/* Composición de Imagen Creativa */}
            <div className="relative h-[600px] w-full rounded-t-full rounded-b-[200px] overflow-hidden shadow-2xl">
              <Image
                src="/portrait.png"
                alt="Dra. Johana Villabón"
                fill
                className="object-cover"
              />
            </div>
            {/* Sello Flotante */}
            <div className="absolute bottom-10 -right-5 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg animate-spin-slow p-2">
              <div className="w-full h-full border border-dashed border-[#C0A062] rounded-full flex items-center justify-center text-center text-[10px] uppercase font-bold text-[#C0A062] tracking-widest">
                10 Años <br /> Exp.
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#2C2C2A] mb-8">
              Más que una psicóloga, <br /> tu aliada.
            </h2>
            <div className="prose prose-lg text-gray-500 leading-loose">
              <p className="mb-6">
                Hola, soy <strong>Johana Villabón</strong>. Mi pasión es ayudar
                a las personas a navegar los momentos difíciles de la vida con
                herramientas prácticas y calidez humana.
              </p>
              <p className="mb-6">
                Creo que la terapia no tiene por qué ser fría o distante. Mi
                enfoque combina la rigurosidad científica de la{" "}
                <strong>Psicología Clínica</strong> con un trato cercano y
                empático.
              </p>
              <ul className="space-y-4 mt-8">
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-[#566452] rounded-full"></span>{" "}
                  Especialista en Ansiedad y Manejo del Estrés
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-[#566452] rounded-full"></span>{" "}
                  Terapia Cognitivo-Conductual Avanzada
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-[#566452] rounded-full"></span>{" "}
                  Enfoque Humano y Sin Juicios
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN SERVICIOS (Layout Rico Visualmente) */}
      <section
        id="servicios"
        className="py-24 px-6 bg-[#F9F7F2] reveal-section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#C0A062] font-bold tracking-[0.2em] text-xs uppercase">
              Tratamientos
            </span>
            <h2 className="font-serif text-4xl mt-4 text-[#2C2C2A]">
              ¿Cómo te puedo ayudar?
            </h2>
          </div>

          <div className="space-y-24">
            {/* Servicio 1: Individual */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="h-[400px] w-full relative rounded-3xl overflow-hidden shadow-lg order-1 md:order-1">
                <Image
                  src="/service-individual.png"
                  alt="Terapia Individual"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="order-2 md:order-2 px-6">
                <h3 className="font-serif text-3xl mb-4 text-[#2C2C2A]">
                  Terapia Individual
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Un espacio 100% tuyo. Trabajamos en profundidad tus emociones,
                  patrones de pensamiento y conductas que te impiden avanzar.
                  Ideal para ansiedad, depresión o búsqueda de propósito.
                </p>
                <a
                  href="#contacto"
                  className="inline-block text-[#566452] font-bold text-sm tracking-widest border-b border-[#566452] pb-1 hover:text-[#C0A062] hover:border-[#C0A062] transition-colors"
                >
                  AGENDAR SESIÓN →
                </a>
              </div>
            </div>

            {/* Servicio 2: Pareja (Invertido) */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="order-2 md:order-1 px-6">
                <h3 className="font-serif text-3xl mb-4 text-[#2C2C2A]">
                  Terapia de Pareja
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  El amor también se construye. Aprendan a comunicarse sin
                  herirse, a resolver conflictos y a reconectar desde la
                  vulnerabilidad y el respeto mutuo.
                </p>
                <a
                  href="#contacto"
                  className="inline-block text-[#566452] font-bold text-sm tracking-widest border-b border-[#566452] pb-1 hover:text-[#C0A062] hover:border-[#C0A062] transition-colors"
                >
                  AGENDAR SESIÓN →
                </a>
              </div>
              <div className="h-[400px] w-full relative rounded-3xl overflow-hidden shadow-lg order-1 md:order-2">
                <Image
                  src="/service-couple.png"
                  alt="Terapia Pareja"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Servicio 3: Online */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="h-[400px] w-full relative rounded-3xl overflow-hidden shadow-lg order-1 md:order-1">
                <Image
                  src="/service-online.png"
                  alt="Terapia Online"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="order-2 md:order-2 px-6">
                <h3 className="font-serif text-3xl mb-4 text-[#2C2C2A]">
                  Consulta Online Global
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  La distancia física no es una barrera. Accede a terapia de
                  calidad desde cualquier ciudad o país, en tu idioma y con
                  total flexibilidad horaria.
                </p>
                <a
                  href="#contacto"
                  className="inline-block text-[#566452] font-bold text-sm tracking-widest border-b border-[#566452] pb-1 hover:text-[#C0A062] hover:border-[#C0A062] transition-colors"
                >
                  AGENDAR SESIÓN →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS (Carrusel) */}
      <section id="testimonios" className="py-24 px-6 reveal-section">
        <TestimonioCarousel />
      </section>

      {/* 6. CONTACTO (Pie de Página) */}
      <footer
        id="contacto"
        className="bg-white pt-20 pb-10 border-t border-gray-100 reveal-section"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <h4 className="font-serif text-2xl text-[#2C2C2A] mb-6">
              Dra. Villabón
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Acompañamiento psicológico ético y profesional. Tu salud mental es
              la prioridad.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">
              Contacto
            </h5>
            <ul className="space-y-4 text-gray-600">
              <li className="hover:text-[#C0A062] transition-colors cursor-pointer">
                hola@dravillabon.com
              </li>
              <li className="hover:text-[#C0A062] transition-colors cursor-pointer">
                +57 300 123 4567
              </li>
              <li className="hover:text-[#C0A062] transition-colors cursor-pointer">
                Bogotá, Colombia (Online)
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">
              Legal
            </h5>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="hover:text-[#C0A062] transition-colors cursor-pointer">
                Política de Privacidad
              </li>
              <li className="hover:text-[#C0A062] transition-colors cursor-pointer">
                Términos y Condiciones
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-300 uppercase tracking-widest">
          © 2026 Dra. Johana Villabón. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
