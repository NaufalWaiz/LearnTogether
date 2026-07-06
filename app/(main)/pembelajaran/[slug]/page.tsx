import React from 'react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

const uiUxModules = [
  {
    id: 1,
    title: 'Introduction to UI/UX',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-blue-400 to-sky-500',
    tag: 'WHAT IS UI UX?'
  },
  {
    id: 2,
    title: 'What is Figma',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-teal-600 to-emerald-500',
    tag: 'What Is User Research?'
  },
  {
    id: 3,
    title: 'How to Create Your First Wireframe',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-cyan-600 to-blue-500',
    tag: 'What Is User Research?'
  },
  {
    id: 4,
    title: 'How to Create Mockup in Figma',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-purple-700 to-indigo-800',
    tag: 'WHAT IS A WIREFRAME?'
  },
  {
    id: 5,
    title: 'Top 10 Figma Tips And Tricks For 2026',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-blue-500 to-indigo-600',
    tag: 'WHAT IS UI UX?'
  },
  {
    id: 6,
    title: 'What i UX Design?',
    students: 420,
    duration: '25h',
    rating: '5.0',
    bgClass: 'from-sky-500 to-indigo-500',
    tag: 'WHAT IS UI UX?'
  }
]

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params

  const isUiUx = slug === 'ui-ux-design' || slug === 'ui-ux-design-advanced'

  if (!isUiUx) {
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
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            ← Kembali Pilih Kelas
          </Link>
        </div>
      </div>
    )
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
            UI/UX Design
          </h1>
          <p className="text-zinc-500 max-w-3xl text-sm md:text-base leading-relaxed">
            Bangun keterampilan UI/UX mulai dari riset pengguna, wireframe, hingga desain prototipe yang siap digunakan.
          </p>
        </div>

        {/* Grid Cards Modul */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uiUxModules.map((module) => (
            <div 
              key={module.id} 
              className="bg-white border border-zinc-100 rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* 1. SEKARANG MENGGUNAKAN LINK INTERNAL, BUKAN TAG <a> KE YOUTUBE */}
                <Link 
                  href={`/pembelajaran/${slug}/${module.id}/video`}
                  className={`relative w-full aspect-[4/3] bg-gradient-to-br ${module.bgClass} rounded-2xl mb-4 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden group`}
                >
                  <div className="absolute top-3 left-4 text-[10px] font-bold opacity-70 tracking-wider">simplilearn</div>
                  <div className="absolute top-3 right-4 text-[10px] font-mono font-bold opacity-70">NN/g</div>
                  
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
                      👥 {module.students}
                    </span>
                    <span className="flex items-center gap-1">
                      🕒 {module.duration}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      ★ {module.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="text-[11px] font-medium text-zinc-400 mb-3 flex justify-between">
                  <span>Progres Belajar</span>
                  <span>0% Belum Mulai</span>
                </div>
                
                {/* 2. TOMBOL UTAMA JUGA MENGARAH KE LINK TAHAP BELAJAR INTERNAL */}
                <Link
                  href={`/pembelajaran/${slug}/${module.id}/video`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-xs tracking-wide shadow-sm shadow-indigo-200"
                >
                  🚀 Mulai Belajar
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}