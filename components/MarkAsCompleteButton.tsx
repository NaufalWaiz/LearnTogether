'use client';

import { useState, useTransition } from 'react';
import { markLessonComplete } from '@/app/actions/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarkAsCompleteButton({ 
  courseSlug, 
  lessonId, 
  isCompleted 
}: { 
  courseSlug: string;
  lessonId: string;
  isCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticComplete, setOptimisticComplete] = useState(isCompleted);
  const router = useRouter();

  const handleComplete = () => {
    if (optimisticComplete) return; // Already completed
    
    startTransition(async () => {
      setOptimisticComplete(true);
      const res = await markLessonComplete(courseSlug, lessonId);
      if (!res.success) {
        setOptimisticComplete(false); // revert on error
        console.error(res.error);
      } else {
        router.refresh(); // Ensure layout updates
      }
    });
  };

  return (
    <button 
      onClick={handleComplete}
      disabled={isPending || optimisticComplete}
      className={`px-5 py-2.5 flex items-center gap-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
        optimisticComplete
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
          : 'bg-[#facc15] hover:bg-amber-400 text-zinc-900 border border-[#facc15]'
      }`}
    >
      {optimisticComplete ? (
        <>
          <CheckCircle2 size={16} /> Selesai
        </>
      ) : (
        <>
          <Circle size={16} /> Tandai Selesai
        </>
      )}
    </button>
  );
}
