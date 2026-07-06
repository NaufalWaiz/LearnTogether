/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Menu, User, ChevronLeft, ChevronRight } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export default function Navbar({ toggleSidebar, isCollapsed }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Kiri: Tombol Toggle + Logo / Nama App */}
      <div className="flex items-center gap-4">
        {/* Tombol Buka/Tutup Sidebar (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:block rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title={isCollapsed ? "Buka Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Kanan: Profil / Menu Tambahan */}
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition">
          <User className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}