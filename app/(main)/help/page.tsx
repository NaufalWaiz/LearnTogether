import React from 'react';
import { HelpCircle, Search, Mail, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      q: "Bagaimana cara bergabung dengan sebuah tim proyek?",
      a: "Anda bisa bergabung dengan sebuah tim dengan pergi ke halaman 'Teams', pilih tim yang memiliki status 'Mencari Anggota', lalu klik tombol 'Join Team'. Pemilik tim akan mereview profil dan *request* Anda."
    },
    {
      q: "Apakah saya bisa mengubah profil atau role saya setelah onboarding?",
      a: "Ya! Anda dapat mengubah preferensi, peran, dan ketersediaan waktu Anda kapan saja melalui halaman Profil Anda."
    },
    {
      q: "Bagaimana AI di LearnTogether membantu saya?",
      a: "LearnTogether AI memonitor progres belajar Anda secara otomatis, merekomendasikan course selanjutnya, menganalisis kontribusi Anda pada proyek tim, dan bahkan membuatkan portofolio otomatis dari hasil kerja Anda."
    },
    {
      q: "Apakah platform ini gratis?",
      a: "Ya, LearnTogether sepenuhnya gratis untuk digunakan bagi siapa saja yang ingin belajar secara kolaboratif."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-100/50 via-rose-50/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-50/40 via-blue-50/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 px-6 py-8 md:px-10 lg:px-12 bg-white/60 backdrop-blur-md border-b border-slate-200/60 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pusat Bantuan
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Punya pertanyaan atau mengalami masalah? Cari tahu jawabannya di sini atau hubungi tim *support* kami.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 pb-24">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Cari topik bantuan atau pertanyaan umum..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Link href="/onboarding" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Panduan Memulai</h3>
                <p className="text-sm text-slate-500 line-clamp-2">Pelajari cara menggunakan LearnTogether dari awal hingga mendapatkan tim.</p>
              </div>
            </Link>

            <button className="text-left group p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Live Chat</h3>
                <p className="text-sm text-slate-500 line-clamp-2">Tanya langsung ke asisten AI atau agen *Customer Service* kami.</p>
              </div>
            </button>

            <a href="mailto:support@learntogether.ai" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-sm text-slate-500 line-clamp-2">Kirim email untuk keluhan, laporan bug, atau pertanyaan bisnis.</p>
              </div>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-5 font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors rounded-2xl focus:outline-none">
                    {faq.q}
                    <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mx-5 mt-2">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
