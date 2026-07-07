'use client';

import { useState, useEffect } from 'react';
import { generateRingkasan } from '@/app/actions/learningAi';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
        <p className="text-sm font-medium animate-pulse">Sistem AI sedang menyusun ringkasan khusus untukmu...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-6 text-orange-600 bg-orange-50 inline-flex px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200">
        <Sparkles size={14} /> Dibuat oleh AI
      </div>
      
      <div className="prose prose-slate prose-orange max-w-none 
        prose-headings:font-bold prose-headings:text-slate-800 prose-headings:mt-6 prose-headings:mb-4
        prose-h2:text-xl prose-h3:text-lg
        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:text-slate-600 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
        prose-ol:text-slate-600 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-5
        prose-li:my-1 prose-li:leading-relaxed
        prose-strong:text-slate-800 prose-strong:font-bold
        prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-500
        prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
