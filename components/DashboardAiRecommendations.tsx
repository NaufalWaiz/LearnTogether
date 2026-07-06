/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { generateDashboardRecommendations } from '@/app/actions/dashboardAi';
import { Sparkles, Loader2 } from 'lucide-react';

interface Recommendation {
  type: string;
  title: string;
  match: string;
  reason: string;
}

export default function DashboardAiRecommendations({ xp, topCourse }: { xp: number, topCourse: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      const res = await generateDashboardRecommendations(xp, topCourse);
      if (res.success && res.data) {
        setRecommendations(res.data);
      }
      setLoading(false);
    };
    fetchRecs();
  }, [xp, topCourse]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[100px] items-center justify-center">
        <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 text-emerald-100">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-xs font-medium animate-pulse">AI sedang menganalisis profilmu...</span>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-emerald-100 text-xs p-4">
        Belum ada rekomendasi. Terus tingkatkan belajarmu!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((rec, i) => (
        <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/15">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-[9px] font-extrabold uppercase tracking-wider ${i === 0 ? 'text-amber-300' : 'text-teal-300'}`}>
              {rec.type}
            </span>
            <span className={`${i === 0 ? 'bg-amber-400' : 'bg-teal-400'} text-zinc-950 text-[9px] px-1.5 py-0.5 rounded-md font-black`}>
              {rec.match}
            </span>
          </div>
          <h4 className="text-xs font-bold mb-1">{rec.title}</h4>
          <p className="text-[10px] text-emerald-50 leading-normal">{rec.reason}</p>
        </div>
      ))}
    </div>
  );
}
