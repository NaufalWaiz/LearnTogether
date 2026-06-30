import React from 'react'
import Link from 'next/link'

// Data materi pembelajaran sesuai dengan gambar
const courses = [
  {
    id: 1,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    materi: 45,
    kuis: 18,
    progress: 65,
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Frontend Dev',
    slug: 'frontend-dev',
    materi: 62,
    kuis: 25,
    progress: 80,
    icon: '💻',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    title: 'Data Science',
    slug: 'data-science',
    materi: 38,
    kuis: 15,
    progress: 35,
    icon: '📊',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    id: 4,
    title: 'UI/UX Design',
    slug: 'ui-ux-design-advanced',
    materi: 45,
    kuis: 18,
    progress: 65,
    icon: '🎨',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    title: 'Frontend Dev',
    slug: 'frontend-dev-advanced',
    materi: 62,
    kuis: 25,
    progress: 80,
    icon: '💻',
    gradient: 'from-red-600 to-purple-600',
  },
  {
    id: 6,
    title: 'Data Science',
    slug: 'data-science-advanced',
    materi: 38,
    kuis: 15,
    progress: 35,
    icon: '📊',
    gradient: 'from-teal-500 to-blue-600',
  },
]

export default function PembelajaranPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3 uppercase tracking-wider">
            ✨ Personalized Learning Path
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 flex items-center gap-2 mb-2">
            📚 Pembelajaran
          </h1>
          <p className="text-zinc-600 max-w-2xl text-sm md:text-base">
            Pilih bidang yang ingin kamu pelajari dan mulai bangun skill melalui materi interaktif, kuis, dan proyek nyata.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${course.gradient} shadow-lg flex flex-col justify-between min-h-[280px]`}
            >
              {/* Top Row: Icon */}
              <div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl mb-4">
                  {course.icon}
                </div>
                
                {/* Title and Info */}
                <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                <p className="text-sm text-white/80 font-medium mb-6">
                  {course.materi} Materi • {course.kuis} Kuis
                </p>
              </div>

              {/* Bottom Row: Progress & Button */}
              <div>
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  {/* Progress Bar Background */}
                  <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
                    {/* Progress Fill */}
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Link Dynamic Route ke Halaman Course */}
                <Link
                  href={`/pembelajaran/${course.slug}`}
                  className="w-full bg-white text-zinc-950 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors text-sm"
                >
                  Lihat Materi 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}