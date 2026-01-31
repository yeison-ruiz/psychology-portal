"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  CalendarIcon,
  UsersIcon,
  InboxIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const MENU_ITEMS = [
  { name: "Tablero", href: "/admin", icon: Squares2X2Icon },
  { name: "Calendario", href: "/admin/calendario", icon: CalendarIcon },
  { name: "Pacientes", href: "/admin/pacientes", icon: UsersIcon },
  { name: "Solicitudes", href: "/admin/solicitudes", icon: InboxIcon }, // Keeping this active in the image context
  { name: "Configuración", href: "/admin/configuracion", icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            PsicoAdmin
          </span>
        </div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            // Special case for "Solicitudes" to match the user request context if inside a detail view
            // e.g. /admin/solicitudes/123

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.name === "Solicitudes" && (
                  // Mock badge for visual fidelity to image
                  <span className="ml-auto bg-blue-600 text-white text-[10px] mobile-badge w-5 h-5 flex items-center justify-center rounded-full">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {/* Placeholder for now if no real avatar available immediately */}
            <div className="w-full h-full bg-blue-100 flex justify-center items-center text-blue-800 font-bold">
              D
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Dra. Villabón</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
