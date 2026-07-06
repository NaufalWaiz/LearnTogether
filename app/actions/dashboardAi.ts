'use server';

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function generateDashboardRecommendations(xp: number, topCourse: string) {
  try {
    const prompt = `Sebagai AI Mentor dari platform e-learning "LearnTogether", berikan 2 rekomendasi untuk user ini.
Data user: XP saat ini adalah ${xp}, dan minat utamanya saat ini ada pada bidang "${topCourse || 'Umum'}".
Rekomendasi pertama (type: "Tim Proyek") harus merekomendasikan sebuah ide tim kolaboratif yang cocok dengan minatnya.
Rekomendasi kedua (type: "Kursus") harus merekomendasikan langkah belajar selanjutnya.

Kembalikan dalam format JSON murni TANPA markdown block seperti ini:
[
  {
    "type": "Tim Proyek",
    "title": "Ide Nama Tim",
    "match": "95% Match",
    "reason": "Alasan singkat (maks 2 kalimat) kenapa tim ini cocok untuknya."
  },
  {
    "type": "Kursus",
    "title": "Nama Kursus Lanjutan",
    "match": "Lanjut",
    "reason": "Alasan singkat (maks 2 kalimat) kenapa kursus ini penting baginya."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || '';
    if (text.startsWith('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (error) {
    console.error("Dashboard AI Error:", error);
    return { success: false, error: "Gagal membuat rekomendasi" };
  }
}
