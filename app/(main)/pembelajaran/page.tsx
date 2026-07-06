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

const courses = [
  {
    id: 1,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    materi: 45,
    kuis: 18,
    progress: 65,
    Icon: Paintbrush,
    bgColor: 'bg-[#ec62a9]',
  },
  {
    id: 2,
    title: 'Frontend Dev',
    slug: 'frontend-dev',
    materi: 62,
    kuis: 25,
    progress: 80,
    Icon: Terminal,
    bgColor: 'bg-[#fcd45c]',
  },
  {
    id: 3,
    title: 'Data Science',
    slug: 'data-science',
    materi: 38,
    kuis: 15,
    progress: 35,
    Icon: TrendingUp,
    bgColor: 'bg-[#a37cf7]',
  },
  {
    id: 4,
    title: 'Mobile Dev',
    slug: 'mobile-dev',
    materi: 45,
    kuis: 18,
    progress: 65,
    Icon: Smartphone, 
    LargeBgIcon: Terminal, 
    bgColor: 'bg-[#6da6f2]',
  },
  {
    id: 5,
    title: 'Backend Dev',
    slug: 'backend-dev',
    materi: 62,
    kuis: 25,
    progress: 80,
    Icon: Terminal, 
    LargeBgIcon: Code2,
    bgColor: 'bg-[#7cd16d]', 
  },
  {
    id: 6,
    title: 'Cyber Security',
    slug: 'cyber-security',
    materi: 38,
    kuis: 15,
    progress: 35,
    Icon: Shield, 
    bgColor: 'bg-[#ff7e67]', 
  },
]

export default function PembelajaranPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-2">
            Pembelajaran
          </h1>
          <p className="text-zinc-600 max-w-2xl text-sm md:text-base">
            Pilih bidang yang ingin kamu pelajari dan mulai bangun skill melalui materi interaktif, kuis, dan proyek nyata.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const SmallIcon = course.Icon;
            const LargeIcon = course.LargeBgIcon || course.Icon;

            return (
              <div
                key={course.id}
                className={`relative overflow-hidden rounded-[36px] p-6 text-white ${course.bgColor} flex flex-col justify-between min-h-[290px]`}
              >
                <div className="absolute -top-4 -right-4 text-white/10 pointer-events-none">
                  <LargeIcon size={140} strokeWidth={1.5} className="transform rotate-12" />
                </div>

                <div className="relative z-10">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl mb-5">
                    <SmallIcon size={18} className="text-white fill-white/20" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                  <p className="text-xs text-white/80 font-medium mb-6">
                    {course.materi} Materi • {course.kuis} Kuis
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="mb-5">
                    <div className="flex justify-between text-[11px] font-semibold mb-1.5 opacity-90">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
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