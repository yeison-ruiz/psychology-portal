import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dra. Johana Villabón | Psicóloga Clínica",
  description:
    "Terapias psicológicas profesionales para recuperar tu bienestar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${lato.variable} ${playfair.variable} font-sans antialiased text-stone-800 bg-[#FDFBF7]`}
      >
        {children}
      </body>
    </html>
  );
}
