import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { curriculum } from '@/lib/curriculum'
import Link from 'next/link'
import MarkAsCompleteButton from '@/components/MarkAsCompleteButton'
import { currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { CheckCircle2 } from 'lucide-react'

import RingkasanViewer from '@/components/RingkasanViewer'
import KuisViewer from '@/components/KuisViewer'
import FlashcardViewer from '@/components/FlashcardViewer'

interface LessonPageProps {
  params: Promise<{
    step: string
    lessonId: string
    slug: string
  }>
}

export default async function LessonStepPage({ params }: LessonPageProps) {
  const { step, lessonId, slug } = await params
  
  const course = curriculum[slug];
  if (!course) return <div>Course not found</div>;
  
  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) return <div>Lesson not found</div>;

  // Check completion status safely
  let isCompleted = false;
  try {
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
          isCompleted = progress.completed_lessons.includes(lessonId);
        }
      }
    }
  } catch (error) {
    console.error("Progress check failed (DB offline?):", error);
  }

  // Find index to get previous/next lessons
  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = course.lessons[lessonIndex + 1];

  return (
    <div className="space-y-6">
      {/* 1. KONTEN TAHAP VIDEO */}
      {step === 'video' && (
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-1">{lesson.title}</h1>
          <p className="text-xs text-zinc-400 mb-5">Lesson {lessonIndex + 1} - {course.title}</p>
          
          {/* Video Player Area */}
          <div className="w-full aspect-[16/9] bg-black rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center text-zinc-400 font-medium shadow-lg">
            <iframe 
              src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`} 
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-800">Overview</h3>
            <MarkAsCompleteButton courseSlug={slug} lessonId={lessonId} isCompleted={isCompleted} />
          </div>
          
          <div className="text-zinc-500 text-sm leading-relaxed space-y-4 max-w-none">
            <p>Materi ini adalah bagian dari kursus {course.title}. Simak video pembelajaran di atas dengan saksama. Setelah selesai, jangan lupa untuk menandai bahwa kamu telah menyelesaikan materi ini agar progres kamu tercatat di sistem.</p>
            <p><strong>Durasi:</strong> {lesson.duration} &bull; <strong>Topik:</strong> {lesson.tag}</p>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-zinc-100 mt-6">
            {nextLesson ? (
              <Link 
                href={`/pembelajaran/${slug}/${nextLesson.id}/video`}
                className="px-6 py-2.5 bg-[#facc15] hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                Materi Selanjutnya <ArrowRight size={14} />
              </Link>
            ) : (
              <Link 
                href={`/pembelajaran/${slug}`}
                className="px-6 py-2.5 bg-[#facc15] hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                Selesai Kelas <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. KONTEN TAHAP RINGKASAN */}
      {step === 'ringkasan' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Ringkasan Materi</h1>
          <RingkasanViewer lessonTitle={lesson.title} courseTitle={course.title} />
          
          <div className="flex justify-between items-center pt-6 border-t border-zinc-100 mt-8">
            <Link href={`/pembelajaran/${slug}/${lesson.id}/video`} className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <ArrowLeft size={14} /> Kembali ke Video
            </Link>
            <Link href={`/pembelajaran/${slug}/${lesson.id}/kuis`} className="px-5 py-2.5 bg-[#facc15] hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
              Lanjut ke Kuis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* 3. KONTEN TAHAP KUIS */}
      {step === 'kuis' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
          <KuisViewer lessonTitle={lesson.title} />
        </div>
      )}

      {/* 4. KONTEN TAHAP FLASHCARD */}
      {step === 'flashcard' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm text-center">
          <FlashcardViewer lessonTitle={lesson.title} />
          
          <div className="flex justify-between items-center pt-8 border-t border-zinc-100 mt-8">
            <Link href={`/pembelajaran/${slug}/${lesson.id}/kuis`} className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <ArrowLeft size={14} /> Kembali ke Kuis
            </Link>
            {nextLesson ? (
              <Link href={`/pembelajaran/${slug}/${nextLesson.id}/video`} className="px-5 py-2.5 bg-[#5b6bb9] hover:bg-[#4a5899] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
                Lanjut Materi Berikutnya <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href={`/pembelajaran/${slug}`} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
                Selesaikan Kursus <CheckCircle2 size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}