"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Settings, 
  Menu, 
  X,
  Flame,      
  HelpCircle,
  BookOpen,
  Users,
  User
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  // Data Mock untuk Streak (Bisa diganti dengan data dinamis dari API)
  const currentStreak = 12; 
  const nextMilestone = 20;
  const streakMilestones = [5, 10, 20, 50, 100, 250];

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Pembelajaran", href: "/pembelajaran", icon: BookOpen },
    { name: "Team Proyek", href: "/tim-proyek", icon: Users },
    { name: "Profil", href: "/profile", icon: User },
  ];

  // Fungsi untuk menentukan milestone mana yang sedang aktif berdasarkan streak saat ini
  const getActiveMilestone = (streak: number) => {
    // Mencari milestone tertinggi yang sudah dilewati/dicapai
    const achieved = [...streakMilestones].reverse().find(m => streak >= m);
    return achieved || null;
  };

  const activeMilestone = getActiveMilestone(currentStreak);

  return (
    <>
      {/* Tombol Pemicu Mobile */}
      <button
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-amber-500 p-3 text-amber-950 shadow-lg md:hidden hover:bg-amber-600 transition"
      >
        {isOpenMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop Mobile */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-100 bg-white text-slate-600 transition-all duration-300
          md:static md:z-0
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "w-64"}
        `}
      >
        {/* Header / Logo */}
        <div className="flex h-20 items-center px-6 border-b border-slate-50 justify-between">
          <span className={`font-bold text-slate-900 tracking-tight transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
            LearningTogether
          </span>
          {isCollapsed && <span className="hidden md:block font-black text-amber-500 text-xl mx-auto">LT</span>}
          <button onClick={() => setIsOpenMobile(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Menu Navigasi Utama */}
        <nav className="flex-1 space-y-1.5 p-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 font-medium transition-all duration-200 group
                  ${isSelected 
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md shadow-amber-400/20" 
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }
                `}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors
                  ${isSelected ? "text-amber-950" : "text-slate-400 group-hover:text-slate-600"}`} 
                />
                <span className={`transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Menu Bagian Bawah */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          {/* Tombol Cek Streak */}
          <button 
            onClick={() => setIsStreakModalOpen(true)}
            className={`
              flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold transition-all duration-200 shadow-sm
              ${isCollapsed ? "h-11 w-11 rounded-full mx-auto p-0" : "w-full py-3 px-4 rounded-full gap-2"}
            `}
          >
            <Flame className="h-5 w-5 fill-current shrink-0" />
            <span className={`transition-opacity duration-200 whitespace-nowrap ${isCollapsed ? "md:hidden" : "block"}`}>
              Cek Streak
            </span>
          </button>

          <div className="mt-2 flex flex-col gap-1">
            <Link 
              href="/help" 
              className={`flex items-center gap-4 px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <HelpCircle className="h-5 w-5 text-slate-400 shrink-0" />
              <span className={`transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                Bantuan
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* MODAL STREAK */}
      {isStreakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsStreakModalOpen(false)}
          />
          
          {/* Konten Modal */}
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Tombol Close */}
            <button 
              onClick={() => setIsStreakModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Gambar Api dengan BG Cream/Kulit */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 border border-orange-100 shadow-inner mt-2">
              <Flame className="h-12 w-12 text-orange-500 fill-orange-500 " />
            </div>

            {/* Judul & Deskripsi */}
            <h3 className="mt-5 text-2xl font-bold text-slate-900">
              {currentStreak} Hari Streak!
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed px-2">
              Belajar konsisten setiap hari untuk menjaga streak kamu.{" "}
              <span className="font-semibold text-orange-600">{nextMilestone - currentStreak}</span> hari lagi menuju level streak selanjutnya ({nextMilestone} hari).
            </p>

            {/* Grid Levels Streak */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Pencapaian Level</p>
              <div className="grid grid-cols-3 gap-3">
                {streakMilestones.map((level) => {
                  const isHighlighted = activeMilestone === level;
                  const isPassed = currentStreak >= level;

                  return (
                    <div 
                      key={level}
                      className={`
                        relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300
                        ${isHighlighted 
                          ? "bg-orange-50 border-orange-400 shadow-md shadow-orange-200 scale-105 z-10" 
                          : isPassed 
                            ? "bg-slate-50 border-slate-200 opacity-80" 
                            : "bg-white border-slate-100 opacity-50"
                        }
                      `}
                    >
                      <div className={`p-1.5 rounded-full mb-1 ${isHighlighted ? "bg-orange-200/50" : "bg-transparent"}`}>
                        <Flame className={`h-4 w-4 ${isPassed ? "text-orange-500 fill-orange-500" : "text-slate-300"}`} />
                      </div>
                      <span className={`text-xs font-bold ${isHighlighted ? "text-orange-950 text-sm" : "text-slate-600"}`}>
                        {level} Hari
                      </span>
                      {isHighlighted && (
                        <span className="absolute -top-2 bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tight">
                          Aktif
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Mengerti */}
            <button
              onClick={() => setIsStreakModalOpen(false)}
              className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition"
            >
              Mantap, Lanjutkan!
            </button>
          </div>
        </div>
      )}
    </>
  );
}