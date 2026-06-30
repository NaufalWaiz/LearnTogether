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
  BookOpen
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  // Mengambil pathname URL saat ini (misal: "/dashboard" atau "/pembelajaran")
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Sesuaikan href dengan nama folder rute Anda
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Pembelajaran", href: "/pembelajaran", icon: BookOpen },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-indigo-600 p-3 text-white shadow-lg md:hidden hover:bg-indigo-700 transition"
      >
        {isOpenMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}
      
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-100 bg-white text-slate-600 transition-all duration-300
          md:static md:z-0
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "w-64"}
        `}
      >
        {/* === LOGO BRAND (PALING ATAS) === */}
        <div className="flex h-20 items-center px-6 border-b border-slate-50 justify-between">
          <span className={`font-bold text-slate-900 tracking-tight transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
            LearningTogether
          </span>
          {isCollapsed && <span className="hidden md:block font-black text-indigo-600 text-xl mx-auto">LT</span>}
          <button onClick={() => setIsOpenMobile(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 p-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            // Memeriksa apakah URL saat ini sama dengan href menu item
            const isSelected = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpenMobile(false)} // Menutup sidebar mobile saat berpindah halaman
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 font-medium transition-all duration-200 group
                  ${isSelected 
                    ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-md shadow-purple-500/20" 
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }
                `}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors
                  ${isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} 
                />
                <span className={`transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* === BAGIAN BAWAH SIDEBAR (STREAK & UTILITY) === */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <button 
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
              href="/settings" 
              className={`flex items-center gap-4 px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Settings className="h-5 w-5 text-slate-400 shrink-0" />
              <span className={`transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                Pengaturan
              </span>
            </Link>
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
    </>
  );
}