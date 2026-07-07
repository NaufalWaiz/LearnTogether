# 🏗️ Arsitektur & Teknologi LearnTogether

LearnTogether dibangun menggunakan teknologi modern yang berfokus pada kecepatan, keamanan, dan skalabilitas (React Server Components). Berikut adalah daftar teknologi yang kita gunakan:

## 1. 🚀 Tech Stack Utama

*   **Framework Utama**: **Next.js 14+ (App Router)**
    *   Menggunakan arsitektur *React Server Components* (RSC) agar load halaman super cepat dan ramah SEO.
    *   **Server Actions**: Menggantikan REST API tradisional. Manipulasi data (seperti menambah Task atau merubah status) dilakukan langsung dari komponen UI ke server secara *seamless* tanpa perlu membuat folder `/api/`.
*   **Database & Backend**: **Supabase (PostgreSQL)**
    *   Digunakan untuk menyimpan seluruh data permanen: pengguna, profil, progres belajar, tim proyek, dan kanban board.
    *   Menggunakan *Supabase Service Role Key* di sisi server untuk keamanan penuh.
*   **Authentication (Keamanan)**: **Clerk**
    *   Menangani login, register, dan manajemen sesi pengguna. Clerk sangat terintegrasi dengan Next.js dan memberikan UI login yang modern (*Social Login*, *Magic Link*).
*   **Styling & UI**: **Tailwind CSS**
    *   Framework CSS *Utility-first* untuk mendesain antarmuka yang cantik, responsif, dan dinamis dengan sangat cepat.
*   **Kecerdasan Buatan (AI)**: **Google Gemini 2.5**
    *   Menjadi otak pintar di balik fitur "AI Tutor" dan "Ringkasan Materi". Menggunakan *package* resmi `@google/genai` dipadukan dengan `react-markdown` untuk merender balasan berbasis Markdown.

---

## 2. 🔄 User Flow: Fitur "Join & Approval" Tim Proyek

Agar proyek kolaborasi tetap privat dan aman, inilah alur pengguna (*User Flow*) dari proses pendaftaran ke tim hingga disetujui, yang sedang kita bangun:

### **Fase 1: Request (Oleh Calon Anggota)**
1.  **Mencari Tim**: Pengguna menavigasi ke halaman `Team Proyek`.
2.  **Input Kode**: Pengguna menekan tombol **Join Project** dan memasukkan *Project ID* (atau kode undangan unik).
3.  **Proses Antrean**: Next.js Server Action (`handleJoinProject`) memvalidasi ID tersebut. Jika valid, sistem memasukkan nama pengguna ke dalam tabel database `team_members` dengan status **`pending`** (menunggu persetujuan).
4.  **Feedback Visual**: Pengguna mendapat notifikasi *"Menunggu persetujuan Admin"* dan belum memiliki akses membaca/menulis *Kanban Board* tim tersebut.

### **Fase 2: Approval (Oleh Pemilik Tim / Lead)**
1.  **Buka Dashboard**: Sang pembuat tim (*Lead*) membuka proyeknya.
2.  **Panel Notifikasi/Members**: Lead melihat ada *badge* notifikasi pada tab **Anggota (Members)** yang menandakan ada pengguna baru yang ingin bergabung.
3.  **Tinjau & Aksi**: Lead akan melihat daftar antrean pengguna berstatus `pending`.
    *   Jika klik **Terima (Approve)**: Server Action (`approveMember`) mengubah status pengguna di database menjadi **`active`**.
    *   Jika klik **Tolak (Reject)**: Server Action menghapus nama pengguna dari daftar tabel.
4.  **Akses Terbuka**: Setelah disetujui, pengguna otomatis langsung mendapatkan akses penuh ke *Kanban Board* untuk membuat *task* atau berdiskusi!

---

> [!TIP]
> **Keunggulan Flow ini:**  
> Mencegah orang asing sembarangan masuk ke ruang kerja proyek dan merusak daftar tugas (Kanban Board), sambil tetap mempertahankan kemudahan kolaborasi tim!
