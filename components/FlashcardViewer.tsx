'use client';

import { useState, useEffect } from 'react';
import { generateFlashcard } from '@/app/actions/learningAi';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface FlashcardData {
  front: string;
  back: string;
}

export default function FlashcardViewer({ lessonTitle }: { lessonTitle: string }) {
  const [card, setCard] = useState<FlashcardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchFlashcard();
  }, [lessonTitle]);

  const fetchFlashcard = async () => {
    setLoading(true);
    setIsFlipped(false);
    const res = await generateFlashcard(lessonTitle);
    if (res.success && res.data) {
      setCard(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-white border border-zinc-200 rounded-[2rem] shadow-sm">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-sm font-medium animate-pulse">Sistem AI sedang menyiapkan Flashcard...</p>
      </div>
    );
  }

  if (!card) {
    return <div className="text-red-500 text-sm p-4">Gagal memuat Flashcard.</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-bold text-zinc-800">Review Flashcard</h2>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
          <Sparkles size={12} /> AI Gen
        </div>
      </div>

      <div 
        className="w-full aspect-[3/2] relative perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full transition-transform duration-700 preserve-3d relative rounded-3xl shadow-lg border border-zinc-200 ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Face */}
          <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white">
            <span className="absolute top-4 right-5 opacity-40 text-xs font-bold tracking-widest uppercase">Klik untuk membalik</span>
            <h3 className="text-2xl font-extrabold mb-2 drop-shadow-md">{card.front}</h3>
          </div>

          {/* Back Face */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-inner">
            <span className="absolute top-4 right-5 text-zinc-400 text-xs font-bold tracking-widest uppercase">Penjelasan</span>
            <p className="text-lg text-zinc-700 font-medium leading-relaxed">
              {card.back}
            </p>
          </div>

        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={fetchFlashcard}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          <RefreshCw size={16} /> Buat Flashcard Baru
        </button>
      </div>
    </div>
  );
}
