import React from 'react'
import Link from 'next/link'
import { Video, BookOpen, HelpCircle, Layers, Lock, Timer } from 'lucide-react'

interface LessonLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string; lessonId: string }>
}

export default async function LessonLayout({ children, params }: LessonLayoutProps) {
  const { slug, lessonId, step } = await params

  const steps = [
    { id: 'video', label: 'UI/UX Introduction', icon: Video },
    { id: 'ringkasan', label: 'Ringkasan Materi', icon: BookOpen },
    { id: 'kuis', label: 'Kuis', icon: HelpCircle },
    { id: 'flashcard', label: 'Flashcard', icon: Layers },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="w-full space-y-6">
      {/* Atas: Kondisional Progress Header untuk Kuis */}
      {step === 'kuis' && (
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-indigo-600 mb-2 tracking-wider">
              <span>PERTANYAAN 1 DARI 5</span>
              <span className="text-zinc-500">20% Selesai</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[20%]" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-2xl shadow-sm self-end md:self-auto">
            <Timer size={16} className="text-indigo-600 animate-pulse" />
            <span className="text-sm font-bold text-zinc-700">02:34</span>
          </div>
        </div>
      )}

      {/* Grid Layout Konten Belajar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT AREA: Konten Dinamis dari [step]/page.tsx */}
        <div className="lg:col-span-2">
          {children}
        </div>

        {/* RIGHT SIDEBAR: Menu Step yang di-lock/unlock sesuai gambar */}
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm sticky top-6">
          <h2 className="text-base font-extrabold text-zinc-800 mb-4 tracking-tight">Lesson 1</h2>
          
          <div className="space-y-3">
            {steps.map((s, idx) => {
              const StepIcon = s.icon
              const isCurrent = s.id === step
              const isLocked = idx > currentStepIndex

              return isLocked ? (
                <div 
                  key={s.id}
                  className="w-full flex items-center justify-between p-3.5 bg-zinc-100 text-zinc-400 rounded-2xl cursor-not-allowed opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-400">
                      <StepIcon size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-semibold">{s.label}</span>
                  </div>
                  <Lock size={14} className="text-zinc-400" />
                </div>
              ) : (
                <Link
                  key={s.id}
                  href={`/pembelajaran/${slug}/${lessonId}/${s.id}`}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isCurrent 
                      ? 'bg-[#5b6bb9] text-white shadow-md shadow-indigo-100 font-bold' 
                      : 'bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-white/20 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                      <StepIcon size={16} />
                    </div>
                    <span className="text-xs md:text-sm">{s.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}