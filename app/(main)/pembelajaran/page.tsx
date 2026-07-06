import React from 'react'
import Link from 'next/link'
import { 
  Paintbrush, 
  Terminal, 
  TrendingUp, 
  Smartphone, 
  Code2, 
  Shield, 
  ArrowRight 
} from 'lucide-react'
import { curriculum } from '@/lib/curriculum'
import { currentUser } from '@clerk/nextjs/server'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Map icons to course slugs
const iconMap: Record<string, any> = {
  'ui-ux-design': { small: Paintbrush, bg: 'bg-[#ec62a9]' },
  'frontend-dev': { small: Terminal, bg: 'bg-[#fcd45c]' },
  'data-science': { small: TrendingUp, bg: 'bg-[#a37cf7]' },
  'mobile-dev': { small: Smartphone, large: Terminal, bg: 'bg-[#6da6f2]' },
  'backend-dev': { small: Terminal, large: Code2, bg: 'bg-[#7cd16d]' },
  'cyber-security': { small: Shield, bg: 'bg-[#ff7e67]' }
};

export default async function PembelajaranPage() {
  const progressMap: Record<string, number> = {};

  try {
    const cookieStore = await cookies();
    const coursesList = Object.values(curriculum);
    
    // First load from cookies
    coursesList.forEach(course => {
      const cookieProgressStr = cookieStore.get(`progress_${course.slug}`)?.value;
      if (cookieProgressStr) {
        const completedLessons = JSON.parse(cookieProgressStr);
        if (course.lessons.length > 0) {
          progressMap[course.slug] = Math.round((completedLessons.length / course.lessons.length) * 100);
        }
      }
    });

    const clerkUser = await currentUser();
    if (clerkUser) {
      const supabase = getSupabaseAdmin();
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUser.id)
        .single();
        
      if (user) {
        const { data: progresses } = await supabase
          .from('user_course_progress')
          .select('course_slug, completed_lessons')
          .eq('user_id', user.id);
          
        if (progresses) {
          progresses.forEach(p => {
            const course = curriculum[p.course_slug];
            if (course && course.lessons.length > 0) {
              const completedCount = p.completed_lessons ? p.completed_lessons.length : 0;
              // Take the max of DB and cookie just in case
              const existingProgress = progressMap[p.course_slug] || 0;
              const dbProgress = Math.round((completedCount / course.lessons.length) * 100);
              progressMap[p.course_slug] = Math.max(existingProgress, dbProgress);
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("Progress check failed (DB offline?):", error);
  }

  const coursesList = Object.values(curriculum);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-2">
            Pembelajaran
          </h1>
          <p className="text-zinc-600 max-w-2xl text-sm md:text-base">
            Pilih bidang yang ingin kamu pelajari dan bangun skill kamu menggunakan kurikulum dari video pilihan terbaik.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesList.map((course, i) => {
            const mapping = iconMap[course.slug] || iconMap['ui-ux-design'];
            const SmallIcon = mapping.small;
            const LargeIcon = mapping.large || mapping.small;
            const progress = progressMap[course.slug] || 0;

            return (
              <div
                key={course.slug}
                className={`relative overflow-hidden rounded-[36px] p-6 text-white ${mapping.bg} flex flex-col justify-between min-h-[290px]`}
              >
                <div className="absolute -top-4 -right-4 text-white/10 pointer-events-none">
                  <LargeIcon size={140} strokeWidth={1.5} className="transform rotate-12" />
                </div>

                <div className="relative z-10">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl mb-5">
                    <SmallIcon size={18} className="text-white fill-white/20" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                  <p className="text-xs text-white/80 font-medium mb-6 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-xs text-white/90 font-bold mb-6">
                    {course.lessons.length} Materi Video Terpilih
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="mb-5">
                    <div className="flex justify-between text-[11px] font-semibold mb-1.5 opacity-90">
                      <span>Progress Belajar</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/pembelajaran/${course.slug}`}
                    className="w-full bg-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors text-sm"
                    style={{ color: '#5b45f3' }}
                  >
                    Lihat Materi 
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  )
}