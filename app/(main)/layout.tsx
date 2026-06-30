"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State isCollapsed dipindah ke sini agar bisa diakses Sidebar dan Navbar
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Kirim state isCollapsed ke Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Kirim fungsi toggle ke Navbar */}
        <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}   