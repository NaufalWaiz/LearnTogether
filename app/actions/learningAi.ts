'use server';

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function generateRingkasan(lessonTitle: string, courseTitle: string) {
  try {
    const prompt = `Buatkan ringkasan materi yang detail, terstruktur, dan mudah dipahami dalam bahasa Indonesia untuk materi pembelajaran berjudul "${lessonTitle}" yang merupakan bagian dari kursus "${courseTitle}".
Format menggunakan Markdown. Jangan terlalu panjang, sekitar 3-4 paragraf yang sangat informatif, dan berikan poin-poin penting (bullet points).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return { success: true, text: response.text };
  } catch (error) {
    console.error("AI Error:", error);
    return { success: false, text: "Maaf, sistem AI sedang mengalami gangguan. Silakan coba lagi nanti." };
  }
}

export async function generateKuis(lessonTitle: string) {
  try {
    const prompt = `Buatkan 1 soal kuis pilihan ganda yang menguji pemahaman tentang materi "${lessonTitle}".
Sertakan 4 pilihan jawaban (A, B, C, D) dan berikan kunci jawabannya di bawah.
Kembalikan dalam format JSON murni TANPA markdown block (tidak boleh ada backtick \`\`\`json) seperti ini:
{
  "question": "pertanyaan",
  "options": [
    {"key": "A", "text": "opsi 1"},
    {"key": "B", "text": "opsi 2"},
    {"key": "C", "text": "opsi 3"},
    {"key": "D", "text": "opsi 4"}
  ],
  "answer": "A",
  "explanation": "Penjelasan kenapa jawaban A benar"
}`;

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
    console.error("AI Error:", error);
    return { success: false, error: "Gagal membuat kuis" };
  }
}

export async function generateFlashcard(lessonTitle: string) {
  try {
    const prompt = `Buatkan 1 flashcard untuk materi "${lessonTitle}" dalam bahasa Indonesia.
Flashcard berisi 1 istilah penting atau konsep kunci di sisi depan, dan penjelasannya di sisi belakang.
Kembalikan dalam format JSON murni TANPA markdown block seperti ini:
{
  "front": "Istilah atau pertanyaan singkat",
  "back": "Penjelasan singkat, padat dan jelas"
}`;

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
    console.error("AI Error:", error);
    return { success: false, error: "Gagal membuat flashcard" };
  }
}
