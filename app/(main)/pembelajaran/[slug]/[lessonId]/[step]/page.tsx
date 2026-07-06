import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface LessonPageProps {
  params: Promise<{
    step: string
    lessonId: string
  }>
}

export default async function LessonStepPage({ params }: LessonPageProps) {
  const { step } = await params

  return (
    <div className="space-y-6">
      {/* 1. KONTEN TAHAP VIDEO */}
      {step === 'video' && (
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-1">UI/UX Introduction</h1>
          <p className="text-xs text-zinc-400 mb-5">Lesson 1 - UI/UX Introduction</p>
          
          {/* Video Player Area */}
          <div className="w-full aspect-[16/10] bg-zinc-200 rounded-[2rem] mb-6 flex items-center justify-center text-zinc-400 font-medium border border-zinc-300/50">
            [ Video Player Area ]
          </div>

          {/* Teks Penjelasan/Overview di Bawah Video */}
          <h3 className="text-lg font-bold text-zinc-800 mb-3">Overview</h3>
          <div className="text-zinc-500 text-sm leading-relaxed space-y-4 max-w-none">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      )}

      {/* 2. KONTEN TAHAP RINGKASAN */}
      {step === 'ringkasan' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Ringkasan Materi</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Di sini tempat rangkuman materi esensial dari video penjelasannya. User bisa membaca poin-poin penting sebelum maju ke tahap kuis ujian.
          </p>
        </div>
      )}

      {/* 3. KONTEN TAHAP KUIS */}
      {step === 'kuis' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-800 mb-6 leading-snug">
            Manakah di bawah ini yang merupakan komponen utama dalam prinsip keterbacaan (readability) pada desain UI?
          </h2>

          <div className="space-y-3.5 mb-8">
            {[
              { key: 'A', text: 'Penggunaan gradien warna yang mencolok di seluruh elemen' },
              { key: 'B', text: 'Hierarki tipografi yang jelas dan spasi antar baris yang cukup' },
              { key: 'C', text: 'Menambahkan animasi transisi di setiap perpindahan halaman' },
              { key: 'D', text: 'Penggunaan gambar beresolusi sangat tinggi tanpa kompresi' },
            ].map((ans) => (
              <label key={ans.key} className="flex items-center gap-4 p-4 border border-zinc-200 bg-white hover:border-indigo-300 rounded-2xl cursor-pointer transition-all group">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold text-indigo-600 transition-colors">
                  {ans.key}
                </div>
                <span className="text-xs md:text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{ans.text}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
            <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <ArrowLeft size={14} /> Sebelumnya
            </button>
            <button className="px-6 py-2.5 bg-[#facc15] hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors">
              Selanjutnya <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 4. KONTEN TAHAP FLASHCARD */}
      {step === 'flashcard' && (
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Review Flashcard</h1>
          <div className="w-72 h-44 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 cursor-pointer">
            Klik untuk Membalik
          </div>
        </div>
      )}
    </div>
  )
}