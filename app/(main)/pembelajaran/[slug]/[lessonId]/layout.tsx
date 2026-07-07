/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Link from 'next/link'
import { Video, BookOpen, HelpCircle, Layers, Lock, Timer, CheckCircle2 } from 'lucide-react'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { curriculum } from '@/lib/curriculum'

interface LessonLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string; lessonId: string; step?: string }>
}

export default async function LessonLayout({ children, params }: LessonLayoutProps) {
  const { slug, lessonId, step } = await params
  
  const course = curriculum[slug]
  const lesson = course?.lessons.find(l => l.id === lessonId)

  // Check completion status
  let isCompleted = false;
  try {
    const cookieStore = await cookies();
    const cookieProgressStr = cookieStore.get(`progress_${slug}`)?.value;
    if (cookieProgressStr) {
      const cookieProgress = JSON.parse(cookieProgressStr);
      if (cookieProgress.includes(lessonId)) isCompleted = true;
    }
    
    if (!isCompleted) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const supabase = getSupabaseAdmin();
        const { data: user } = await supabase.from('users').select('id').eq('clerk_id', clerkUser.id).single();
        if (user) {
          const { data: progress } = await supabase.from('user_course_progress').select('completed_lessons').eq('user_id', user.id).eq('course_slug', slug).single();
          if (progress?.completed_lessons?.includes(lessonId)) {
            isCompleted = true;
          }
        }
      }
    }
  } catch (error) {
    // ignore
  }

  const steps = [
    { id: 'video', label: lesson?.title || 'Video Materi', icon: Video },
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
            <div className="flex justify-between text-xs font-semibold text-amber-600 mb-2 tracking-wider">
              <span>PERTANYAAN 1 DARI 5</span>
              <span className="text-zinc-500">20% Selesai</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full w-[20%]" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-2xl shadow-sm self-end md:self-auto">
            <Timer size={16} className="text-amber-600 animate-pulse" />
            <span className="text-sm font-bold text-zinc-700">02:34</span>
          </div>
        </div>
      )}

      {/* Grid Layout Konten Belajar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT AREA: Konten Dinamis */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm p-2">
            {children}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Menu Step yang di-lock/unlock sesuai gambar */}
        <div className="w-full lg:w-[320px] shrink-0 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm sticky top-24">
          <h2 className="text-base font-extrabold text-slate-800 mb-5 tracking-tight flex items-center gap-2">
            <Layers className="text-orange-500 h-5 w-5" />
            Lesson {lessonId}
          </h2>
          
          <div className="space-y-3 relative">
            {/* Decorative timeline line */}
            <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
            
            {steps.map((s, idx) => {
              const StepIcon = s.icon
              const isCurrent = s.id === step
              // If completed, unlock everything! Else, unlock up to current step.
              const isLocked = !isCompleted && idx > currentStepIndex

              return isLocked ? (
                <div 
                  key={s.id}
                  className="relative z-10 w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl cursor-not-allowed opacity-80 transition-all hover:bg-slate-100/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                      <StepIcon size={16} />
                    </div>
                    <span className="text-sm font-semibold">{s.label}</span>
                  </div>
                  <Lock size={14} className="text-slate-300" />
                </div>
              ) : (
                <Link
                  key={s.id}
                  href={`/pembelajaran/${slug}/${lessonId}/${s.id}`}
                  className={`relative z-10 w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border ${
                    isCurrent 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600/20 shadow-md shadow-orange-500/20 font-bold transform hover:scale-[1.02]' 
                      : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 text-slate-700 font-semibold group'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isCurrent 
                        ? 'bg-white/20 text-white shadow-sm' 
                        : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                    }`}>
                      <StepIcon size={16} />
                    </div>
                    <span className="text-sm">{s.label}</span>
                  </div>
                  {isCompleted && !isLocked && !isCurrent && (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}