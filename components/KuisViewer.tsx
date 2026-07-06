'use client';

import { useState, useEffect } from 'react';
import { generateKuis } from '@/app/actions/learningAi';
import { Sparkles, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuizData {
  question: string;
  options: { key: string; text: string }[];
  answer: string;
  explanation: string;
}

export default function KuisViewer({ lessonTitle }: { lessonTitle: string }) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await generateKuis(lessonTitle);
      if (res.success && res.data) {
        setQuiz(res.data);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [lessonTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-sm font-medium animate-pulse">AI sedang meracik kuis yang menantang...</p>
      </div>
    );
  }

  if (!quiz) {
    return <div className="text-red-500 text-sm p-4">Gagal memuat kuis. Silakan coba lagi.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-zinc-800 leading-snug">
          {quiz.question}
        </h2>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
          <Sparkles size={12} /> AI Gen
        </div>
      </div>

      <div className="space-y-3.5 mb-8">
        {quiz.options.map((ans) => {
          const isCorrectAnswer = isSubmitted && ans.key === quiz.answer;
          const isWrongSelected = isSubmitted && selectedKey === ans.key && selectedKey !== quiz.answer;
          
          let btnClass = "border-zinc-200 bg-white hover:border-amber-300 group hover:shadow-sm";
          let iconClass = "bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-600";

          if (isSubmitted) {
            if (isCorrectAnswer) {
              btnClass = "border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500/20";
              iconClass = "bg-emerald-500 text-white";
            } else if (isWrongSelected) {
              btnClass = "border-red-400 bg-red-50 opacity-80";
              iconClass = "bg-red-500 text-white";
            } else {
              btnClass = "border-zinc-100 bg-zinc-50 opacity-50 cursor-not-allowed";
              iconClass = "bg-zinc-200 text-zinc-400";
            }
          } else if (selectedKey === ans.key) {
            btnClass = "border-amber-500 bg-amber-50 shadow-sm ring-1 ring-amber-500/20";
            iconClass = "bg-amber-500 text-white";
          }

          return (
            <label 
              key={ans.key} 
              className={`flex items-center gap-4 p-4 border rounded-2xl transition-all cursor-pointer ${btnClass}`}
              onClick={() => {
                if (!isSubmitted) setSelectedKey(ans.key);
              }}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${iconClass}`}>
                {ans.key}
              </div>
              <span className={`text-xs md:text-sm font-medium ${isSubmitted && (isCorrectAnswer || isWrongSelected) ? 'text-zinc-900' : 'text-zinc-600'}`}>
                {ans.text}
              </span>
            </label>
          );
        })}
      </div>

      {isSubmitted && (
        <div className={`p-4 rounded-xl mb-8 text-sm ${selectedKey === quiz.answer ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <div className="font-bold mb-1">{selectedKey === quiz.answer ? 'Jawaban Benar! 🎉' : 'Jawaban Salah! 😢'}</div>
          <div>{quiz.explanation}</div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
        <button 
          onClick={() => window.history.back()}
          className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={14} /> Sebelumnya
        </button>
        
        {!isSubmitted ? (
          <button 
            disabled={!selectedKey}
            onClick={() => setIsSubmitted(true)}
            className="px-6 py-2.5 bg-[#5b6bb9] disabled:opacity-50 hover:bg-[#4a5899] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Cek Jawaban
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setSelectedKey(null);
              setLoading(true);
              // Trigger reload of quiz
              const fetchQuiz = async () => {
                const res = await generateKuis(lessonTitle);
                if (res.success && res.data) setQuiz(res.data);
                setLoading(false);
              };
              fetchQuiz();
            }}
            className="px-6 py-2.5 bg-[#facc15] hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            Coba Kuis Lain <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
