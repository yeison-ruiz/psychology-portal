"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote:
      "Llegué con mucha incertidumbre y encontré en la Dra. Johana un puerto seguro. Su profesionalismo y calidez han transformado mi manera de ver la vida.",
    author: "Sofía Martínez",
    role: "Paciente de Ansiedad",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "La terapia online fue una revelación. Pude conectarme desde mi oficina y sentir la misma cercanía que en persona. Altamente recomendada.",
    author: "Carlos Velasco",
    role: "Consultoría Ejecutiva",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Gracias a sus sesiones de pareja logramos salvar nuestro matrimonio. Nos dio herramientas reales para comunicarnos sin hacernos daño.",
    author: "Ana y David",
    role: "Terapia de Pareja",
    rating: 5,
  },
];

export function TestimonioCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 segundos por slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#2C2C2A] rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden shadow-2xl">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="relative z-10 min-h-[300px] flex flex-col justify-center items-center">
        <span className="text-6xl text-[#C0A062] font-serif block mb-8 animate-pulse">
          “
        </span>

        {/* Contenido Slide Fading */}
        <div className="transition-all duration-700 ease-in-out">
          <h3 className="font-serif text-2xl md:text-3xl leading-relaxed mb-10 italic">
            "{testimonials[current].quote}"
          </h3>

          <div className="flex flex-col items-center gap-2">
            <div className="flex text-[#C0A062] mb-2 text-lg">
              {"★".repeat(testimonials[current].rating)}
            </div>
            <p className="font-bold text-white tracking-widest uppercase text-sm">
              {testimonials[current].author}
            </p>
            <p className="text-xs opacity-50">{testimonials[current].role}</p>
          </div>
        </div>

        {/* Dots Controls */}
        <div className="flex gap-2 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === current ? "bg-[#C0A062] w-6" : "bg-white/20 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
