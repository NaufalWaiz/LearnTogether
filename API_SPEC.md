# LearnTogether API Specification

Dokumen ini mendeskripsikan spesifikasi API terbaru untuk platform LearnTogether. Platform ini menggunakan kombinasi **Next.js API Routes (REST)** dan **Next.js Server Actions** untuk menangani komunikasi antara klien dan server.

---

## 1. REST API Routes (`/api/*`)

API Routes digunakan untuk fungsionalitas publik, *webhooks*, sinkronisasi, dan fitur-fitur tradisional yang memerlukan endpoint HTTP standar.

### Auth & Sync
- **`GET /api/auth/me`**
  - **Fungsi:** Mengambil profil pengguna yang sedang login berdasarkan token Clerk.
  - **Response:** Data JSON dari tabel `users` (Supabase).
- **`GET /api/auth/sync`**
  - **Fungsi:** Menyelaraskan (sinkronisasi) data pengguna dari Clerk (Provider Auth) ke dalam database Supabase. Sering dipanggil saat pengguna pertama kali masuk.

### Onboarding & Profile
- **`POST /api/onboarding`**
  - **Fungsi:** Menyimpan preferensi onboarding pengguna baru.
  - **Body (JSON):** `expertise_field`, `skill_level`, `availability`, `skills` (array), `learning_goal`, `team_preference`.
  - **Response:** `200 OK` (Berhasil).
- **`GET /api/profile`** / **`POST /api/profile`**
  - **Fungsi:** Mengambil dan memperbarui informasi detail profil (bio, sosial media).

### Teams & Collaboration
- **`GET /api/teams`**
  - **Fungsi:** Mengambil daftar semua tim proyek (publik) untuk halaman *Team Discovery*.
- **`POST /api/teams`**
  - **Fungsi:** Membuat entitas tim proyek baru.
- **`GET /api/teams/[teamId]`**
  - **Fungsi:** Mengambil detail tim beserta daftar anggota (members) dan peran (roles) yang tersedia.
- **`POST /api/teams/[teamId]/requests`**
  - **Fungsi:** Mengajukan permintaan bergabung ke dalam tim dengan peran tertentu.
  - **Body (JSON):** `role`, `message`.
- **`POST /api/teams/[teamId]/requests/[requestId]`**
  - **Fungsi:** Memperbarui status permintaan bergabung (Approve / Reject) oleh pemilik tim.
- **`GET /api/teams/[teamId]/portfolio`**
  - **Fungsi:** Mengekspor rangkuman otomatis atau portofolio dari sebuah tim proyek setelah proyek selesai.
- **`POST /api/teams/[teamId]/tasks/generate`**
  - **Fungsi:** Memanggil AI (Gemini) untuk men-generate rekomendasi *Task Board* atau *Roadmap* untuk tim berdasarkan deskripsi proyek.

### AI Integration
- **`POST /api/ai/feedback`**
  - **Fungsi:** Memberikan *AI-generated feedback* atau analisis untuk pengguna.

---

## 2. Server Actions (`app/actions/*`)

Server Actions digunakan untuk operasi asinkron yang terintegrasi secara *seamless* dengan komponen React Server Components, memberikan kecepatan eksekusi yang optimal untuk form dan interaksi komponen.

### `app/actions/progress.ts`
Menangani pelacakan kemajuan belajar (Progress) siswa dalam kurikulum.
- **`markLessonComplete(courseSlug: string, lessonId: string)`**
  - **Fungsi:** Menandai materi/pelajaran tertentu sebagai "Selesai".
  - **Mekanisme:** Mendukung *fallback* menggunakan *Cookies* untuk pengguna yang belum login (guest), dan menyimpan ke database Supabase `user_course_progress` untuk *authenticated users*.
  - **Return:** `{ success: boolean, error?: string }`

### `app/actions/projects.ts`
Manajemen manajemen tugas (Task/Kanban) dan deskripsi proyek pada ruang kerja tim.
- **`getProjectDetail(teamId: string)`**
  - **Fungsi:** Mengambil detail rinci proyek/tim (judul, deskripsi).
- **`updateProjectDescription(teamId: string, description: string)`**
  - **Fungsi:** Memperbarui deskripsi (visi/misi/goals) dari tim proyek. Update ini juga me-revalidate *cache* komponen UI.
- **`getTasks(projectId: string)`**
  - **Fungsi:** Memuat semua tugas dalam Kanban board (`todo`, `in_progress`, `done`).
- **`addTask(projectId: string, task: TaskInput)`**
  - **Fungsi:** Menambahkan tugas baru ke dalam board.
- **`updateTaskStatus(taskId: string, newStatus: string)`**
  - **Fungsi:** Memindahkan tugas (Drag & Drop) antar kolom status (contoh: `todo` -> `in_progress`).
- **`deleteTask(taskId: string)`**
  - **Fungsi:** Menghapus tugas.

### `app/actions/learningAi.ts`
Integrasi AI di halaman pembelajaran individu.
- **`generateFlashcard(lessonTitle: string)`**
  - **Fungsi:** Menghasilkan rangkuman singkat dalam bentuk kartu *Flashcard* bolak-balik menggunakan model Gemini 2.5.
- **`getChatbotResponse(userMessage: string, context?: any)`**
  - **Fungsi:** Berkomunikasi dengan *tutor AI* dalam materi pembelajaran tertentu untuk menjawab pertanyaan spesifik dari siswa.

### `app/actions/dashboardAi.ts`
Integrasi AI untuk analisis makro pengguna di *Dashboard*.
- **`generateStudentRecommendations(userId: string)`**
  - **Fungsi:** Memberikan rekomendasi kelas selanjutnya atau proyek tim yang cocok berdasarkan *skills* dan riwayat *progress* belajar siswa saat ini.
