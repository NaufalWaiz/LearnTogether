# LearnTogether AI

Prototype web app untuk platform e-learning kolaboratif berbasis AI sesuai `sdd.md`.

## Fitur MVP yang Dibuat

- Landing page dengan style visual mengikuti `design.png`.
- Dashboard student dengan ringkasan skill, matching, progress, dan feedback.
- Skill assessment interaktif memakai slider.
- AI team matching berbasis data mock.
- Team room dan project brief.
- Task board interaktif dengan status To Do, In Progress, Review, Done.
- Authentication memakai Clerk.
- Sinkronisasi user Clerk ke tabel `users` di Supabase.
- Progress update tersimpan ke Supabase dan mendapat AI feedback via Gemini.
- Portfolio otomatis berbasis kontribusi task.

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Integrasi Production

File `.env.example` sudah menyiapkan variabel untuk Clerk, Supabase, dan Gemini.

1. Isi `.env.local` dengan key Clerk, Supabase, dan Gemini.
2. Jalankan isi `supabase/schema.sql` di Supabase SQL Editor.
3. Login lewat tombol Clerk di aplikasi.
4. Setelah login, aplikasi memanggil `/api/auth/sync` untuk membuat atau memperbarui row `users` berdasarkan `clerk_id`.

API yang sudah tersedia:

- `GET /api/auth/me`
- `POST /api/auth/sync`
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/ai/feedback`

## Gemini AI

Untuk memakai Gemini, buat `.env.local` dan isi:

```bash
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Jika API key belum diisi atau kuota habis, aplikasi tetap berjalan dengan fallback feedback lokal.
Endpoint AI tetap membutuhkan session Clerk dan akan mencoba menyimpan `progress_updates` serta `ai_feedbacks` ke Supabase.
