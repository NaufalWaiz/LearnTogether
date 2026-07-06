import React from 'react'
import Link from 'next/link'
import { curriculum } from '@/lib/curriculum'
import { currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { CheckCircle2 } from 'lucide-react'
import { cookies } from 'next/headers'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const course = curriculum[slug];

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <h1 className="text-xl font-bold mb-2 text-zinc-900">Materi Belum Tersedia</h1>
          <p className="text-sm text-zinc-500 mb-6">
            Maaf, materi untuk kategori <code className="px-1.5 py-0.5 bg-zinc-100 rounded text-xs font-mono text-amber-600">{slug}</code> saat ini sedang dalam proses penyusunan.
          </p>
          <Link 
            href="/pembelajaran" 
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors"
          >
            ← Kembali Pilih Kelas
          </Link>
        </div>
      </div>
    )
  }

  // Get user progress
  let completedLessons: string[] = [];
  try {
    const cookieStore = await cookies();
    const cookieProgressStr = cookieStore.get(`progress_${slug}`)?.value;
    if (cookieProgressStr) {
      completedLessons = JSON.parse(cookieProgressStr);
    }

    const clerkUser = await currentUser();
    if (clerkUser) {
      const supabase = getSupabaseAdmin();
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUser.id)
        .single();
        
      if (user) {
        const { data: progress } = await supabase
          .from('user_course_progress')
          .select('completed_lessons')
          .eq('user_id', user.id)
          .eq('course_slug', slug)
          .single();
          
        if (progress && progress.completed_lessons) {
          // Merge cookie and DB progress
          completedLessons = Array.from(new Set([...completedLessons, ...progress.completed_lessons]));
        }
      }
    }
  } catch (error) {
    console.error("Progress check failed (DB offline?):", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 text-zinc-800">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <Link 
            href="/pembelajaran" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 mb-4 transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-sm text-xs">
              ⟨
            </span>
            Kembali ke Dashboard
          </Link>
          
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2 flex items-center gap-2">
            {course.title}
          </h1>
          <p className="text-zinc-500 max-w-3xl text-sm md:text-base leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Grid Cards Modul */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.lessons.map((module) => {
            const isCompleted = completedLessons.includes(module.id);
            
            return (
              <div 
                key={module.id} 
                className={`bg-white border ${isCompleted ? 'border-emerald-200 shadow-emerald-50' : 'border-zinc-100 shadow-sm'} rounded-[2rem] p-4 hover:shadow-md transition-shadow flex flex-col justify-between relative`}
              >
                {isCompleted && (
                  <div className="absolute top-8 right-8 z-20 bg-white rounded-full text-emerald-500 shadow-sm p-0.5">
                    <CheckCircle2 size={24} fill="currentColor" className="text-white" />
                  </div>
                )}
                <div>
                  <Link 
                    href={`/pembelajaran/${slug}/${module.id}/video`}
                    className={`relative w-full aspect-[4/3] bg-gradient-to-br ${module.bgClass} rounded-2xl mb-4 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden group ${isCompleted ? 'opacity-90' : ''}`}
                  >
                    <div className="absolute top-3 left-4 text-[10px] font-bold opacity-70 tracking-wider">LEARN_TOGETHER</div>
                    <div className="absolute top-3 right-4 text-[10px] font-mono font-bold opacity-70">YT</div>
                    
                    <h4 className="text-xl font-black max-w-[80%] uppercase tracking-wide leading-tight drop-shadow-sm">
                      {module.tag}
                    </h4>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white ml-1">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  <div className="px-2">
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 leading-snug">
                      {module.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
                      <span className="flex items-center gap-1">
                        🕒 {module.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-2 pb-2">
                  <div className="text-[11px] font-medium text-zinc-400 mb-3 flex justify-between">
                    <span>Status</span>
                    {isCompleted ? (
                      <span className="text-emerald-600 font-bold">Selesai 100%</span>
                    ) : (
                      <span>Belum Mulai</span>
                    )}
                  </div>
                  
                  <Link
                    href={`/pembelajaran/${slug}/${module.id}/video`}
                    className={`w-full font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-xs tracking-wide shadow-sm ${
                      isCompleted 
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                    }`}
                  >
                    {isCompleted ? '✓ Pelajari Ulang' : '🚀 Mulai Belajar'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}