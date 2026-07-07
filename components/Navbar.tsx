/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Menu, ChevronLeft, Bell, Search, Sparkles } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export default function Navbar({ toggleSidebar, isCollapsed }: NavbarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pembelajaran?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Helper to determine the title based on the route
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/pembelajaran")) return "Pembelajaran";
    if (pathname.includes("/teams")) return "Kolaborasi Tim";
    if (pathname.includes("/tim-proyek")) return "Ruang Kerja Tim";
    if (pathname.includes("/profile")) return "Profil Saya";
    if (pathname.includes("/help")) return "Pusat Bantuan";
    return "LearnTogether";
  };

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-6 shadow-sm sticky top-0 z-30 transition-all">
      {/* Kiri: Tombol Toggle + Page Title */}
      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-xl text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100"
          title={isCollapsed ? "Buka Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden sm:block">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {user ? `Halo, ${user.firstName}!` : "Selamat Datang!"}
          </p>
        </div>
      </div>

      {/* Tengah: Global Search (Optional) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, tim, atau modul..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none transition-all text-slate-700 placeholder:text-slate-400"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm hover:text-orange-600 hover:border-orange-200 transition-colors cursor-pointer">
            ↵ Enter
          </button>
        </form>
      </div>

      {/* Kanan: Notifikasi & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Fitur AI / Upgrade Indicator */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-full text-orange-600 hover:shadow-md hover:shadow-orange-500/10 transition-all">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold">Pro</span>
        </button>

        {/* Notifikasi */}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Profile dari Clerk */}
        <div className="hover:scale-105 transition-transform origin-center">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 border-2 border-slate-100 shadow-sm"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}