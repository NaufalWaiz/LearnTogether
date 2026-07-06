'use client';

import { useState, useEffect } from 'react';
import { generateRingkasan } from '@/app/actions/learningAi';
import { Sparkles, Loader2 } from 'lucide-react';

export default function RingkasanViewer({ lessonTitle, courseTitle }: { lessonTitle: string, courseTitle: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const res = await generateRingkasan(lessonTitle, courseTitle);
      if (res.success && res.text) {
        setContent(res.text);
      } else {
        setContent("Gagal memuat ringkasan. Silakan coba lagi.");
      }
      setLoading(false);
    };
    fetchContent();
  }, [lessonTitle, courseTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-sm font-medium animate-pulse">Sistem AI sedang menyusun ringkasan khusus untukmu...</p>
      </div>
    );
  }

  return (
    <div className="prose prose-zinc max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-zinc-800">
      <div className="flex items-center gap-2 mb-6 text-amber-600 bg-amber-50 inline-flex px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200">
        <Sparkles size={14} /> Dibuat oleh AI
      </div>
      <div className="text-sm text-zinc-600 space-y-4">
        {content?.split('\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          // Simple bold formatting replacement for basic markdown
          const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: formatted }} />
          );
        })}
      </div>
    </div>
  );
}
