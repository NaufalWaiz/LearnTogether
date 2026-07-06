import React from 'react'
import { Zap, CheckCircle, Circle, Award, Users, HelpCircle, ArrowRight } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { curriculum } from '@/lib/curriculum'
import DashboardAiRecommendations from '@/components/DashboardAiRecommendations'
import Link from 'next/link'

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  let firstName = clerkUser?.firstName || 'Siswa';
  
  // Calculate dynamic XP and top course from cookies/DB
  let totalXp = 0;
  let topCourse = 'Frontend Developer'; // Default fallback
  let topCourseProgress = 0;
  let activeTeams: any[] = [];
  
  const progressMap: Record<string, string[]> = {};

  try {
    const cookieStore = await cookies();
    const coursesList = Object.values(curriculum);
    
    // Load from cookies first
    coursesList.forEach(course => {
      const cookieProgressStr = cookieStore.get(`progress_${course.slug}`)?.value;
      if (cookieProgressStr) {
        progressMap[course.slug] = JSON.parse(cookieProgressStr);
      }
    });

    if (clerkUser) {
      const supabase = getSupabaseAdmin();
      const { data: user } = await supabase.from('users').select('*').eq('clerk_id', clerkUser.id).single();
        
      if (user) {
        if (!clerkUser.firstName && user.full_name) {
          firstName = user.full_name.split(' ')[0];
        }
        
        // Load progress from DB and merge
        const { data: progresses } = await supabase.from('user_course_progress').select('course_slug, completed_lessons').eq('user_id', user.id);
        if (progresses) {
          progresses.forEach(p => {
            const existing = progressMap[p.course_slug] || [];
            progressMap[p.course_slug] = Array.from(new Set([...existing, ...p.completed_lessons]));
          });
        }
        
        // Fetch teams
        const { data: userTeams } = await supabase.from('team_members').select(`role_in_team, team:teams(id, name, status, project_goal)`).eq('user_id', user.id).eq('member_status', 'active');
        if (userTeams) {
          activeTeams = userTeams.map((ut: any) => ({ ...ut.team, role_in_team: ut.role_in_team }));
        }
      }
    }
  } catch (e) {
    console.error("Dashboard fetch failed (DB offline?):", e);
  }

  // Calculate XP (50 XP per lesson) and find top course
  let maxCompletedCount = 0;
  Object.keys(progressMap).forEach(slug => {
    const completedCount = progressMap[slug].length;
    totalXp += completedCount * 50;
    
    if (completedCount > maxCompletedCount) {
      maxCompletedCount = completedCount;
      const course = curriculum[slug];
      if (course) {
        topCourse = course.title;
        topCourseProgress = Math.round((completedCount / course.lessons.length) * 100);
      }
    }
  });

  const level = Math.floor(totalXp / 200) + 1;
  const xpForNextLevel = level * 200;
  const topCourseSlug = Object.keys(curriculum).find(k => curriculum[k].title === topCourse) || 'frontend-dev';

  // Fallback to dummy teams if DB returns nothing
  if (activeTeams.length === 0) {
    activeTeams = [
      { id: 1, name: "Website Pariwisata", role_in_team: "Frontend Developer", progress: 80, icon: "🌐", color: "orange" },
      { id: 2, name: "Sistem Absensi", role_in_team: "UI Designer", progress: 60, icon: "🕒", color: "pink" },
    ];
  } else {
    activeTeams = activeTeams.map((team, idx) => ({
      ...team,
      progress: Math.floor(Math.random() * 50) + 30,
      icon: ["🌐", "🕒", "🛒", "💻"][idx % 4],
      color: ["orange", "pink", "amber", "emerald"][idx % 4]
    }));
  }

  const allLeaderboardUsers = [
    { name: 'Ketang Waiz', xp: 2450, isMe: false, initial: 'K' },
    { name: 'Revario', xp: 2100, isMe: false, initial: 'R' },
    { name: 'Vani', xp: 1890, isMe: false, initial: 'V' },
    { name: 'Budi', xp: 850, isMe: false, initial: 'B' },
    { name: 'Siti', xp: 400, isMe: false, initial: 'S' },
    { name: `${firstName} (Kamu)`, xp: totalXp, isMe: true, initial: firstName[0]?.toUpperCase() || 'U' }
  ];

  allLeaderboardUsers.sort((a, b) => b.xp - a.xp);
  const topUsers = allLeaderboardUsers.slice(0, 5);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner Selamat Datang */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Halo, {firstName}! 👋
            </h1>
            <p className="text-sm text-orange-50 max-w-md leading-relaxed">
              Kamu telah mencapai Level {level}! Dapatkan {xpForNextLevel - totalXp} XP lagi dari materi {topCourse} untuk naik tingkat!
            </p>
          </div>
          <div className="flex gap-3 mt-4 relative z-10">
            <Link href={`/pembelajaran/${topCourseSlug}`} className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
              Lanjutkan {topCourse} <ArrowRight size={14} />
            </Link>
            <Link href="/pembelajaran" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
              Jelajahi Kursus Lain
            </Link>
          </div>
        </div>

        {/* Baris Utama: Roadmap & XP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-base">{topCourse} Roadmap</h3>
                  <p className="text-xs text-zinc-400">Capaian Kurikulum Utama</p>
                </div>
                <span className="font-bold text-lg text-orange-600">{topCourseProgress}%</span>
              </div>
              <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${topCourseProgress}%` }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {curriculum[topCourseSlug]?.lessons.map((lesson, idx) => {
                  const isDone = (progressMap[topCourseSlug] || []).includes(lesson.id);
                  return (
                    <div key={lesson.id} className={`p-3 rounded-2xl flex items-center gap-2.5 border ${isDone ? 'bg-white border-orange-100/50' : 'bg-zinc-100 border-zinc-200/60 opacity-60'}`}>
                      {isDone ? (
                        <CheckCircle size={18} className="text-emerald-500 fill-emerald-500/10 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-zinc-400 shrink-0" />
                      )}
                      <span className={`text-xs font-semibold leading-tight line-clamp-1 ${isDone ? 'text-zinc-800' : 'text-zinc-500'}`}>{lesson.tag}</span>
                    </div>
                  )
                }).slice(0, 5)}
              </div>
            </div>
          </div>

          <div className="bg-[#18181c] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[180px]">
            <div className="flex justify-between items-start">
              <div className="bg-amber-400/10 p-2.5 rounded-2xl text-amber-400">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2.5 py-1 rounded-full font-medium">
                Level {level}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-zinc-400 text-xs font-medium">Total XP Kamu</p>
              <h2 className="text-4xl font-black tracking-tight mt-1">{totalXp.toLocaleString('id-ID')}</h2>
              <p className="text-amber-400 text-xs font-semibold mt-2 flex items-center gap-1">
                <span>⚡</span> Terus kumpulkan XP!
              </p>
            </div>
          </div>
        </div>

        {/* Baris Kedua: Rekomendasi AI & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-emerald-600 text-white rounded-3xl p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase opacity-90">
              <span>✨</span> Rekomendasi AI
            </div>
            <DashboardAiRecommendations xp={totalXp} topCourse={topCourse} />
          </div>

          <div className="bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base">Achievements</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Level 2 Achievement */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 rotate-45 transform transition-all duration-500 ${level >= 2 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-110 group-hover:rotate-90' : 'bg-zinc-200 text-zinc-400 opacity-50 grayscale'}`}>
                  <Zap size={20} className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500" fill={level >= 2 ? "currentColor" : "none"} />
                </div>
                <span className={`text-[10px] font-extrabold leading-tight uppercase tracking-wider ${level >= 2 ? 'text-amber-600' : 'text-zinc-500'}`}>Level 2</span>
              </div>
              
              {/* 500 XP Achievement */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 rotate-45 transform transition-all duration-500 ${totalXp >= 500 ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:scale-110 group-hover:rotate-90' : 'bg-zinc-200 text-zinc-400 opacity-50 grayscale'}`}>
                  <Award size={20} className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
                </div>
                <span className={`text-[10px] font-extrabold leading-tight uppercase tracking-wider ${totalXp >= 500 ? 'text-teal-600' : 'text-zinc-500'}`}>500 XP</span>
              </div>
              
              {/* 50% Course Achievement */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 rotate-45 transform transition-all duration-500 ${topCourseProgress >= 50 ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] group-hover:scale-110 group-hover:rotate-90' : 'bg-zinc-200 text-zinc-400 opacity-50 grayscale'}`}>
                  <HelpCircle size={20} className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
                </div>
                <span className={`text-[10px] font-extrabold leading-tight uppercase tracking-wider ${topCourseProgress >= 50 ? 'text-pink-600' : 'text-zinc-500'}`}>50% Course</span>
              </div>
              
              {/* 1 Course Achievement */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 rotate-45 transform transition-all duration-500 ${topCourseProgress >= 100 ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] group-hover:scale-110 group-hover:rotate-90 animate-pulse' : 'bg-zinc-200 text-zinc-400 opacity-50 grayscale'}`}>
                  <CheckCircle size={20} className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
                </div>
                <span className={`text-[10px] font-extrabold leading-tight uppercase tracking-wider ${topCourseProgress >= 100 ? 'text-blue-600' : 'text-zinc-500'}`}>1 Course</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris Ketiga: Tim Proyek Aktif & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100 space-y-4">
            <h3 className="font-bold text-base mb-2">Tim Proyek Aktif</h3>
            
            {activeTeams.map((team: any, i: number) => (
              <div key={team.id || i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-3 w-1/3">
                  <div className={`w-10 h-10 bg-${team.color}-100 text-${team.color}-600 rounded-xl flex items-center justify-center font-bold`}>{team.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold">{team.name}</h4>
                    <p className="text-[10px] text-zinc-400">Peran: {team.role_in_team}</p>
                  </div>
                </div>
                <div className="w-1/3 px-4">
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                    <span>Progress</span><span>{team.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`bg-${team.color}-500 h-full`} style={{ width: `${team.progress}%` }} />
                  </div>
                </div>
                <button className="text-xs font-bold text-zinc-700 hover:underline">Detail</button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-zinc-50 rounded-3xl p-6 shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">Leaderboard</h3>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-zinc-500 font-medium border border-zinc-100">Mingguan</span>
              </div>
              <div className="space-y-3">
                {topUsers.map((u, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const rankColor = rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-zinc-400' : rank === 3 ? 'text-amber-700' : 'text-zinc-400';
                  
                  return (
                    <div key={u.name} className={`flex items-center justify-between text-xs p-2 rounded-xl ${u.isMe ? 'bg-orange-50 border border-orange-100' : isTop3 && rank === 1 ? 'bg-amber-50/50 border border-amber-100/50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${rankColor} w-4 text-center`}>{rank}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] ${u.isMe ? 'bg-orange-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                          {u.initial}
                        </div>
                        <span className={`font-semibold ${u.isMe ? 'text-orange-600' : 'text-zinc-600'}`}>{u.name}</span>
                      </div>
                      <span className={`font-bold ${u.isMe ? 'text-orange-600' : 'text-zinc-500'}`}>{u.xp.toLocaleString('id-ID')} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}