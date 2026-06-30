import React from 'react'
import { Zap, CheckCircle, Circle, Award, Users, HelpCircle, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner Selamat Datang */}
        <div className="bg-gradient-to-r from-[#7B61FF] to-[#CD61FF] rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Halo, Rakha! 👋
            </h1>
            <p className="text-sm text-purple-100 max-w-md leading-relaxed">
              Hari ini kamu sudah menyelesaikan 80% roadmap Frontend Developer. Selesaikan 2 sesi lagi untuk naik ke Level 13!
            </p>
          </div>
          <div className="flex gap-3 mt-4 relative z-10">
            <button className="bg-white text-[#7B61FF] hover:bg-purple-50 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
              Lanjutkan Belajar <ArrowRight size={14} />
            </button>
            <button className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
              Lihat Target
            </button>
          </div>
          {/* <div className="absolute right-6 top-6 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider rotate-[-12deg]">Frontend</div>
          <div className="absolute right-12 bottom-6 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider rotate-[15deg]">React</div>
          <div className="absolute right-24 top-12 bg-yellow-400 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg animate-bounce">+50 XP</div> */}
        </div>

        {/* Baris Utama: Roadmap & XP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-base">Frontend Developer Roadmap</h3>
                  <p className="text-xs text-zinc-400">Capaian Kurikulum Utama</p>
                </div>
                <span className="font-bold text-lg text-[#7B61FF]">80%</span>
              </div>
              <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-[#7B61FF] to-[#CD61FF] h-full w-[80%] rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-2xl flex items-center gap-2.5 border border-purple-100/50">
                  <CheckCircle size={18} className="text-emerald-500 fill-emerald-500/10 shrink-0" />
                  <span className="text-xs font-semibold">HTML Dasar</span>
                </div>
                <div className="bg-white p-3 rounded-2xl flex items-center gap-2.5 border border-purple-100/50">
                  <CheckCircle size={18} className="text-emerald-500 fill-emerald-500/10 shrink-0" />
                  <span className="text-xs font-semibold leading-tight">CSS Layouting</span>
                </div>
                <div className="bg-white p-3 rounded-2xl flex items-center gap-2.5 border border-purple-100/50">
                  <CheckCircle size={18} className="text-emerald-500 fill-emerald-500/10 shrink-0" />
                  <span className="text-xs font-semibold">Modern JS</span>
                </div>
                <div className="bg-zinc-100 p-3 rounded-2xl flex items-center gap-2.5 border border-zinc-200/60">
                  <Circle size={18} className="text-zinc-400 shrink-0" />
                  <span className="text-xs font-semibold text-zinc-600">React Hooks</span>
                </div>
                <div className="bg-zinc-100 opacity-50 p-3 rounded-2xl flex items-center gap-2.5 border border-zinc-200/40">
                  <Circle size={18} className="text-zinc-300 shrink-0" />
                  <span className="text-xs font-semibold text-zinc-400">Next.js SSR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#18181c] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[180px]">
            <div className="flex justify-between items-start">
              <div className="bg-amber-400/10 p-2.5 rounded-2xl text-amber-400">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2.5 py-1 rounded-full font-medium">
                Level 12
              </span>
            </div>
            <div className="mt-4">
              <p className="text-zinc-400 text-xs font-medium">Total XP Kamu</p>
              <h2 className="text-4xl font-black tracking-tight mt-1">1.250</h2>
              <p className="text-amber-400 text-xs font-semibold mt-2 flex items-center gap-1">
                <span>⚡</span> +240 XP Minggu Ini
              </p>
            </div>
          </div>
        </div>

        {/* Baris Kedua: Rekomendasi AI & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#5c44ff] text-white rounded-3xl p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase opacity-90">
              <span>✨</span> Rekomendasi AI
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-wider">Tim Proyek</span>
                  <span className="bg-amber-400 text-zinc-950 text-[9px] px-1.5 py-0.5 rounded-md font-black">85% Match</span>
                </div>
                <h4 className="text-xs font-bold mb-1">Frontend Team: Pariwisata</h4>
                <p className="text-[10px] text-purple-100 leading-normal">Sesuai dengan skill React yang baru kamu pelajari.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-extrabold text-sky-300 uppercase tracking-wider">Kursus</span>
                  <span className="bg-sky-400 text-zinc-950 text-[9px] px-1.5 py-0.5 rounded-md font-black">Lanjut</span>
                </div>
                <h4 className="text-xs font-bold mb-1">React Fundamental Deep Dive</h4>
                <p className="text-[10px] text-purple-100 leading-normal">Pelajari lebih dalam tentang context API.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base">Achievements</h3>
              <button className="text-xs font-bold text-zinc-500 hover:text-zinc-800">Lihat Semua</button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm mb-2 rotate-45 transform"><Zap size={18} className="-rotate-45 fill-amber-500/10" /></div>
                <span className="text-[10px] font-bold leading-tight mt-1">Fast Learner</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm mb-2 rotate-45 transform"><HelpCircle size={18} className="-rotate-45" /></div>
                <span className="text-[10px] font-bold leading-tight mt-1">Quiz Master</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 shadow-sm mb-2 rotate-45 transform"><Users size={18} className="-rotate-45" /></div>
                <span className="text-[10px] font-bold leading-tight mt-1">Team Player</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 bg-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400 shadow-sm mb-2 rotate-45 transform"><Award size={18} className="-rotate-45" /></div>
                <span className="text-[10px] font-bold leading-tight mt-1 text-zinc-400">Top 10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris Ketiga: Tim Proyek Aktif & Sesi Mendatang / Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100 space-y-4">
            <h3 className="font-bold text-base mb-2">Tim Proyek Aktif</h3>
            
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">🌐</div>
                <div>
                  <h4 className="text-xs font-bold">Website Pariwisata</h4>
                  <p className="text-[10px] text-zinc-400">Peran: Frontend Developer</p>
                </div>
              </div>
              <div className="w-1/3 px-4">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                  <span>Progress</span><span>80%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[80%]" />
                </div>
              </div>
              <button className="text-xs font-bold text-zinc-700 hover:underline">Detail</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold">🕒</div>
                <div>
                  <h4 className="text-xs font-bold">Sistem Absensi</h4>
                  <p className="text-[10px] text-zinc-400">Peran: UI Designer</p>
                </div>
              </div>
              <div className="w-1/3 px-4">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                  <span>Progress</span><span>60%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#CD61FF] h-full w-[60%]" />
                </div>
              </div>
              <button className="text-xs font-bold text-zinc-700 hover:underline">Detail</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">🛒</div>
                <div>
                  <h4 className="text-xs font-bold">E-Commerce UMKM</h4>
                  <p className="text-[10px] text-zinc-400">Peran: Team Lead</p>
                </div>
              </div>
              <div className="w-1/3 px-4">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                  <span>Progress</span><span>45%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[45%]" />
                </div>
              </div>
              <button className="text-xs font-bold text-zinc-700 hover:underline">Detail</button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Leaderboard */}
            <div className="bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">Leaderboard</h3>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-zinc-500 font-medium border border-zinc-100">Mingguan</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs bg-amber-50/50 p-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500 w-4">1</span>
                    <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden" />
                    <span className="font-semibold">Ketang Waiz</span>
                  </div>
                  <span className="font-bold text-zinc-500">2.450 XP</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-400 w-4">2</span>
                    <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden" />
                    <span className="font-semibold">Revario</span>
                  </div>
                  <span className="font-bold text-zinc-500">2.100 XP</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-700 w-4">3</span>
                    <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden" />
                    <span className="font-semibold">Vani</span>
                  </div>
                  <span className="font-bold text-zinc-500">1.890 XP</span>
                </div>
                <hr className="border-zinc-200" />
                <div className="flex items-center justify-between text-xs bg-purple-50 p-2 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600 w-4">12</span>
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">V</div>
                    <span className="font-bold text-purple-600">Rakha (Kamu)</span>
                  </div>
                  <span className="font-bold text-purple-600">1.250 XP</span>
                </div>
              </div>
            </div>

            {/* Sesi Mendatang */}
            <div className="bg-[#f3efff] rounded-3xl p-5 border border-purple-100 flex flex-col justify-between gap-4 flex-1">
              <div>
                <span className="text-[9px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">Sesi Mendatang</span>
                <h4 className="text-base font-black text-purple-950">React Dasar</h4>
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  🕒 Hari ini, 19:00 WIB
                </p>
              </div>
              <button className="w-full bg-[#7B61FF] hover:bg-[#664be8] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1">
                Gabung Sesi 📺
              </button>
            </div>
          </div>
        </div>

        {/* Aktivitas Terkini */}
        <div className="bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100">
          <h3 className="font-bold text-base mb-4">Aktivitas Terkini</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Menyelesaikan Video: Advanced Hooks</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Modul React Dasar • 2 jam yang lalu</p>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-[11px]">+20 XP</span>
            </div>
            <div className="flex justify-between items-start text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Lulus Quiz: Flexbox & CSS Grid</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Skor: 95/100 • 5 jam yang lalu</p>
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-[11px]">+50 XP</span>
            </div>
            <div className="flex justify-between items-start text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Update Tugas: UI Landing Page</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Tim Website Pariwisata • Kemarin</p>
                </div>
              </div>
              <span className="text-purple-500 font-semibold text-[10px] bg-purple-50 px-2 py-0.5 rounded">In Review</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}