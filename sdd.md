# Software Design Document (SDD)
# LearnTogether AI

## 1. Informasi Dokumen

| Informasi | Detail |
|---|---|
| Nama Produk | LearnTogether AI |
| Jenis Produk | Platform E-Learning Kolaboratif Berbasis AI |
| Platform | Website dan Mobile App |
| Teknologi Utama | Next.js, Flutter, Supabase Database, Clerk, AI API |
| Versi Dokumen | 1.0 |
| Status | Draft Awal |

---

## 2. Ringkasan Produk

**LearnTogether AI** adalah platform e-learning berbasis website dan mobile app yang membantu pengguna belajar secara berkelompok dengan dukungan kecerdasan buatan. Platform ini tidak hanya menyediakan materi pembelajaran, tetapi juga membantu pengguna menemukan teman belajar yang cocok berdasarkan kekuatan, kelemahan, minat, tujuan belajar, dan gaya belajar.

Berbeda dengan platform e-learning biasa yang umumnya berfokus pada video, modul, kuis, dan sertifikat, LearnTogether AI berfokus pada pembelajaran kolaboratif berbasis project. Sistem akan membantu membentuk tim belajar yang seimbang, memberikan project yang sesuai, membagi tugas berdasarkan role, memantau progres, memberi feedback melalui AI, dan menghasilkan portfolio dari kontribusi nyata setiap pengguna.

Konsep utama dari LearnTogether AI adalah:

> Belajar online tidak lagi dilakukan sendirian. AI membantu pengguna menemukan teman belajar yang saling melengkapi, mengerjakan project nyata, dan membangun portfolio berdasarkan kontribusi masing-masing.

---

## 3. Latar Belakang Masalah

Banyak platform e-learning saat ini hanya menyediakan materi pembelajaran dalam bentuk video, artikel, atau kuis. Meskipun model tersebut bermanfaat, banyak pengguna tetap mengalami beberapa masalah, seperti:

1. Belajar sendirian terasa membosankan.
2. Pengguna kehilangan motivasi di tengah proses belajar.
3. Pengguna tidak tahu harus mulai dari mana.
4. Pengguna tidak memiliki teman diskusi.
5. Pengguna sulit mengetahui kelemahan dan kekuatan dirinya.
6. Pengguna hanya menonton materi tanpa praktik nyata.
7. Pengguna tidak memiliki portfolio setelah menyelesaikan pembelajaran.
8. Dalam pembelajaran kelompok, sering terjadi pembagian tugas yang tidak adil.
9. Sulit membuktikan kontribusi masing-masing anggota dalam project kelompok.

LearnTogether AI hadir untuk menyelesaikan masalah tersebut dengan menggabungkan e-learning, AI matching, project-based learning, progress tracking, peer review, dan portfolio otomatis.

---

## 4. Tujuan Sistem

Tujuan utama dari LearnTogether AI adalah membangun platform pembelajaran digital yang mampu:

1. Membantu pengguna belajar secara kolaboratif dalam kelompok kecil.
2. Mencocokkan pengguna ke dalam tim berdasarkan kekuatan dan kelemahan skill.
3. Memberikan project pembelajaran yang sesuai dengan level tim.
4. Membantu membagi tugas secara adil berdasarkan role dan kemampuan anggota.
5. Memantau progres belajar setiap individu dan tim.
6. Memberikan feedback otomatis melalui AI.
7. Menyediakan ruang belajar dan kerja kolaboratif.
8. Menghasilkan portfolio otomatis berdasarkan kontribusi nyata pengguna.
9. Membantu mentor atau pengajar memantau perkembangan peserta.
10. Meningkatkan motivasi belajar melalui sistem tim, gamification, dan project nyata.

---

## 5. Ruang Lingkup Sistem

### 5.1 Termasuk dalam Ruang Lingkup

Sistem LearnTogether AI mencakup beberapa fitur utama berikut:

1. Registrasi dan login pengguna.
2. Manajemen profil pengguna.
3. Skill assessment awal.
4. Pembuatan profil skill pengguna.
5. AI team matching.
6. Pembuatan team room.
7. AI project generator.
8. Pembagian role dan task otomatis.
9. Task board untuk project tim.
10. Progress update individu.
11. AI feedback terhadap progres.
12. Peer review antar anggota tim.
13. Portfolio individu dan tim.
14. Dashboard admin atau mentor.
15. Notifikasi task dan progres.
16. Integrasi website dan mobile app.

### 5.2 Tidak Termasuk dalam MVP Awal

Beberapa fitur berikut tidak menjadi prioritas pada MVP awal:

1. Video conference internal.
2. Sistem pembayaran kompleks.
3. Sertifikat blockchain.
4. Integrasi langsung dengan GitHub secara penuh.
5. Real-time code editor.
6. Marketplace mentor.
7. Sistem live streaming kelas.
8. Forum publik berskala besar.
9. Sistem anti-plagiarism tingkat lanjut.

Fitur tersebut dapat dikembangkan pada versi lanjutan setelah MVP berjalan.

---

## 6. Target Pengguna

### 6.1 Student / Learner

Pengguna utama yang ingin belajar skill tertentu melalui materi, project, dan kerja tim.

Contoh:

- Siswa SMK.
- Mahasiswa.
- Peserta bootcamp.
- Freelancer pemula.
- Orang yang sedang belajar skill digital.

### 6.2 Mentor / Teacher

Pengguna yang bertugas membuat materi, memberikan project, memantau progres tim, dan mengevaluasi hasil pembelajaran.

Contoh:

- Guru.
- Dosen.
- Mentor bootcamp.
- Instruktur kursus.

### 6.3 Admin

Pengguna yang mengelola keseluruhan sistem, data pengguna, kelas, kategori skill, dan konfigurasi platform.

---

## 7. User Role dan Hak Akses

| Role | Hak Akses |
|---|---|
| Guest | Melihat landing page, informasi produk, dan daftar kelas publik |
| Student | Mengikuti assessment, masuk tim, mengerjakan project, update progres, menerima feedback AI, membuat portfolio |
| Mentor | Membuat kelas, melihat tim, memantau progres, memberi feedback manual, mengelola project |
| Admin | Mengelola user, skill, kelas, project, laporan, dan konfigurasi sistem |

---

## 8. Konsep Utama Sistem

### 8.1 Skill-Based Matching

Sistem akan mengumpulkan data kemampuan pengguna melalui assessment dan self-assessment. Data tersebut kemudian digunakan untuk mencocokkan pengguna ke dalam tim yang saling melengkapi.

Contoh:

| User | Kekuatan | Kelemahan | Role Cocok |
|---|---|---|---|
| User A | Frontend | Backend | Frontend Developer |
| User B | Backend | UI/UX | Backend Developer |
| User C | UI/UX | Frontend | UI/UX Designer |
| User D | Dokumentasi | Coding | Project Manager |

Sistem akan membentuk tim yang seimbang, bukan tim yang semua anggotanya memiliki kemampuan yang sama.

### 8.2 Project-Based Learning

Setelah tim terbentuk, sistem akan memberikan project yang sesuai dengan level dan tujuan belajar tim. Project menjadi pusat pembelajaran, sehingga pengguna tidak hanya belajar teori, tetapi juga menghasilkan karya nyata.

### 8.3 AI as Learning Facilitator

AI tidak hanya berfungsi sebagai chatbot, tetapi sebagai fasilitator pembelajaran. AI dapat membantu:

1. Menganalisis profil skill.
2. Memberikan rekomendasi tim.
3. Membuat project.
4. Membagi task.
5. Memberikan feedback progress.
6. Membuat ringkasan perkembangan tim.
7. Memberikan saran belajar personal.

### 8.4 Portfolio-Based Output

Setelah project selesai, sistem akan membuat portfolio otomatis untuk tim dan masing-masing individu berdasarkan kontribusi nyata yang tercatat di platform.

---

## 9. Alur Pengguna Utama

### 9.1 Alur Student

1. Student membuka website atau mobile app.
2. Student membuat akun atau login.
3. Student melengkapi profil.
4. Student memilih bidang belajar.
5. Student mengisi skill assessment.
6. Sistem membuat skill profile.
7. AI mencocokkan student dengan tim belajar.
8. Student masuk ke team room.
9. AI memberikan project dan membagi tugas.
10. Student mengerjakan task sesuai role.
11. Student melakukan update progress.
12. AI memberikan feedback.
13. Anggota tim saling melakukan peer review.
14. Project selesai.
15. Sistem membuat portfolio tim dan portfolio individu.

### 9.2 Alur Mentor

1. Mentor login ke dashboard.
2. Mentor membuat kelas atau program belajar.
3. Mentor menentukan bidang skill dan level pembelajaran.
4. Mentor melihat daftar student.
5. Sistem membentuk tim secara otomatis.
6. Mentor memantau team room.
7. Mentor melihat progress report.
8. Mentor memberi feedback manual jika diperlukan.
9. Mentor menyetujui project akhir.
10. Mentor melihat laporan hasil belajar.

### 9.3 Alur Admin

1. Admin login ke dashboard.
2. Admin mengelola data user.
3. Admin mengelola kategori skill.
4. Admin mengelola kelas dan project template.
5. Admin memantau aktivitas platform.
6. Admin melihat laporan penggunaan sistem.

---

## 10. Fitur Sistem

## 10.1 Authentication

Fitur authentication digunakan untuk mengelola akses pengguna ke dalam sistem.

### Kebutuhan Fitur

1. User dapat register.
2. User dapat login.
3. User dapat logout.
4. User dapat mengelola profil.
5. Sistem mendukung role student, mentor, dan admin.

### Data yang Dibutuhkan

- Nama lengkap.
- Email.
- Password atau provider authentication.
- Role.
- Foto profil.
- Bio singkat.

### Rekomendasi Implementasi

Authentication menggunakan **Clerk** sebagai penyedia autentikasi utama. Clerk menangani proses register, login, logout, session, OAuth provider, dan proteksi route. Data user utama seperti email dan identity disimpan di Clerk, sedangkan data aplikasi seperti role, skill, team, project, dan progress disimpan di Supabase Database.

Saat user berhasil register atau login pertama kali, sistem membuat atau menyinkronkan data user ke tabel `users` di Supabase menggunakan `clerk_id` sebagai penghubung antara Clerk dan database aplikasi.

---

## 10.2 User Profile

User profile digunakan untuk menyimpan informasi dasar pengguna.

### Field Utama

- Full name.
- Username.
- Email.
- Avatar.
- Bio.
- Learning goal.
- Preferred role.
- Availability.
- Skill interests.

### Contoh Data

```json
{
  "full_name": "Muhammad Naufal Waiz",
  "username": "naufalwaiz",
  "learning_goal": "Belajar web development melalui project nyata",
  "preferred_role": "Frontend Developer",
  "availability": "Weekend dan malam hari"
}
```

---

## 10.3 Skill Assessment

Skill assessment digunakan untuk mengetahui kemampuan awal pengguna.

### Bentuk Assessment

1. Self-assessment.
2. Kuis pilihan ganda.
3. Mini task.
4. Studi kasus.
5. Upload project sebelumnya.

### Contoh Skill Web Development

- HTML.
- CSS.
- JavaScript.
- React.
- Next.js.
- Backend API.
- Database.
- Git.
- UI/UX.
- Communication.
- Teamwork.

### Output Assessment

Sistem menghasilkan skill profile seperti:

```json
{
  "frontend": 75,
  "backend": 35,
  "ui_ux": 50,
  "database": 30,
  "communication": 80,
  "teamwork": 70
}
```

---

## 10.4 AI Team Matching

AI Team Matching adalah fitur utama yang mencocokkan pengguna ke dalam kelompok belajar.

### Tujuan

Membentuk tim belajar yang seimbang berdasarkan:

1. Kekuatan skill.
2. Kelemahan skill.
3. Tujuan belajar.
4. Minat project.
5. Ketersediaan waktu.
6. Role yang dibutuhkan.
7. Level kemampuan.

### Aturan Matching

Tim ideal minimal memiliki:

1. Satu anggota yang kuat di area utama project.
2. Satu anggota yang mampu membantu area teknis.
3. Satu anggota yang cukup baik dalam komunikasi.
4. Kombinasi skill yang saling melengkapi.
5. Jadwal belajar yang tidak terlalu berbeda.

### Contoh Output Matching

```json
{
  "team_name": "Team Orion",
  "members": [
    {
      "name": "Naufal",
      "role": "Frontend Developer",
      "reason": "Kuat di React dan Tailwind CSS"
    },
    {
      "name": "Raka",
      "role": "Backend Developer",
      "reason": "Kuat di API dan database"
    },
    {
      "name": "Salsa",
      "role": "UI/UX Designer",
      "reason": "Kuat di desain interface"
    }
  ],
  "matching_reason": "Tim ini seimbang karena memiliki kemampuan frontend, backend, dan UI/UX yang saling melengkapi."
}
```

---

## 10.5 Team Room

Team room adalah ruang kerja digital untuk setiap tim.

### Fitur Team Room

1. Informasi anggota tim.
2. Role masing-masing anggota.
3. Deskripsi project.
4. Task board.
5. Progress update.
6. Diskusi tim.
7. File sharing.
8. Link external tools.
9. AI assistant khusus tim.
10. Laporan progres tim.

---

## 10.6 AI Project Generator

AI Project Generator digunakan untuk membuat project pembelajaran berdasarkan level dan skill tim.

### Input

- Bidang belajar.
- Level tim.
- Jumlah anggota.
- Role anggota.
- Durasi project.
- Tujuan belajar.

### Output

- Nama project.
- Deskripsi project.
- Fitur utama.
- Deliverables.
- Timeline.
- Task breakdown.
- Kriteria penilaian.

### Contoh Project

```text
Project: Mini E-Learning Dashboard

Deskripsi:
Tim diminta membuat dashboard sederhana untuk platform e-learning yang memiliki fitur login, daftar kelas, detail kelas, dan tracking progress belajar.

Fitur utama:
1. Login dan register.
2. Dashboard siswa.
3. Halaman daftar kelas.
4. Halaman detail kelas.
5. Progress belajar.
6. Tampilan responsif.
```

---

## 10.7 AI Task Breakdown

AI membantu memecah project menjadi task kecil berdasarkan role.

### Contoh Pembagian Task

| Role | Task |
|---|---|
| Frontend Developer | Membuat landing page, dashboard, integrasi API |
| Backend Developer | Membuat API auth, API kelas, database schema |
| UI/UX Designer | Membuat wireframe, design system, prototype |
| Project Manager | Membuat timeline, dokumentasi, progress report |

### Output Task

Setiap task memiliki:

- Judul task.
- Deskripsi task.
- Assigned user.
- Deadline.
- Status.
- Priority.
- Evidence atau bukti pengerjaan.

---

## 10.8 Task Board

Task board digunakan untuk mengatur pekerjaan project.

### Status Task

1. To Do.
2. In Progress.
3. Review.
4. Done.

### Field Task

- Title.
- Description.
- Assignee.
- Status.
- Priority.
- Deadline.
- Attachment.
- AI feedback.

---

## 10.9 Progress Update

Setiap anggota tim dapat mengirim update progress.

### Format Update

1. Apa yang sudah dikerjakan.
2. Kendala yang dihadapi.
3. Rencana berikutnya.
4. Bukti pengerjaan.

### Contoh Progress Update

```text
Hari ini saya menyelesaikan halaman login dan register. Kendala saya ada pada validasi form. Besok saya akan mengerjakan dashboard siswa.
```

---

## 10.10 AI Feedback

AI memberikan feedback berdasarkan progress update dan hasil pengerjaan user.

### Jenis Feedback

1. Feedback teknis.
2. Feedback manajemen waktu.
3. Feedback pembelajaran.
4. Feedback kerja tim.
5. Rekomendasi materi lanjutan.

### Contoh Feedback

```text
Progress kamu sudah baik. Namun validasi form sebaiknya dipisahkan ke file schema agar kode lebih rapi dan mudah dikelola. Kamu bisa menggunakan Zod untuk validasi form pada Next.js.
```

---

## 10.11 Peer Review

Peer review digunakan agar anggota tim bisa saling menilai kontribusi.

### Aspek Penilaian

1. Kontribusi.
2. Komunikasi.
3. Ketepatan waktu.
4. Kualitas pekerjaan.
5. Kemampuan membantu anggota lain.
6. Tanggung jawab.

### Skala Penilaian

1 sampai 5.

### Tujuan Peer Review

1. Menghindari anggota yang hanya menumpang nama.
2. Memberikan gambaran kontribusi nyata.
3. Mendorong tanggung jawab individu.
4. Membantu mentor mengevaluasi anggota tim.

---

## 10.12 Portfolio Otomatis

Portfolio otomatis dibuat setelah project selesai.

### Portfolio Tim

Berisi:

1. Nama project.
2. Deskripsi project.
3. Anggota tim.
4. Tech stack.
5. Fitur yang dibuat.
6. Screenshot atau video demo.
7. Link demo.
8. Link repository.
9. Dokumentasi.

### Portfolio Individu

Berisi:

1. Nama pengguna.
2. Role dalam project.
3. Task yang dikerjakan.
4. Kontribusi utama.
5. Skill yang terbukti.
6. Feedback AI.
7. Feedback peer.
8. Link project.

---

## 10.13 Notification System

Sistem notifikasi digunakan untuk mengingatkan pengguna terkait aktivitas penting.

### Jenis Notifikasi

1. Undangan masuk tim.
2. Task baru.
3. Deadline task.
4. Feedback AI tersedia.
5. Peer review perlu diisi.
6. Project mendekati deadline.
7. Progress tim mingguan.

### Channel Notifikasi

1. In-app notification.
2. Push notification mobile.
3. Email notification.

---

## 10.14 Dashboard Mentor

Dashboard mentor digunakan untuk memantau kelas dan tim.

### Fitur Dashboard Mentor

1. Melihat daftar kelas.
2. Melihat daftar tim.
3. Melihat progress setiap tim.
4. Melihat progress individu.
5. Melihat AI report.
6. Memberikan feedback manual.
7. Menyetujui project akhir.
8. Mengekspor laporan pembelajaran.

---

## 11. Kebutuhan Fungsional

| ID | Kebutuhan Fungsional |
|---|---|
| FR-001 | Sistem harus memungkinkan user melakukan registrasi dan login |
| FR-002 | Sistem harus memungkinkan user melengkapi profil belajar |
| FR-003 | Sistem harus menyediakan skill assessment |
| FR-004 | Sistem harus menghasilkan skill profile pengguna |
| FR-005 | Sistem harus mencocokkan user ke dalam tim berdasarkan skill profile |
| FR-006 | Sistem harus membuat team room untuk setiap tim |
| FR-007 | Sistem harus menghasilkan rekomendasi project berdasarkan level tim |
| FR-008 | Sistem harus membagi task berdasarkan role anggota tim |
| FR-009 | Sistem harus menyediakan task board |
| FR-010 | Sistem harus memungkinkan user mengirim progress update |
| FR-011 | Sistem harus memberikan feedback AI terhadap progress update |
| FR-012 | Sistem harus menyediakan fitur peer review |
| FR-013 | Sistem harus membuat portfolio tim setelah project selesai |
| FR-014 | Sistem harus membuat portfolio individu berdasarkan kontribusi |
| FR-015 | Sistem harus menyediakan dashboard mentor |
| FR-016 | Sistem harus menyediakan notifikasi task dan deadline |
| FR-017 | Sistem harus memungkinkan admin mengelola user, skill, kelas, dan project |

---

## 12. Kebutuhan Non-Fungsional

| ID | Kebutuhan Non-Fungsional |
|---|---|
| NFR-001 | Sistem harus memiliki UI yang responsif di desktop dan mobile |
| NFR-002 | Mobile app harus mudah digunakan untuk update progress harian |
| NFR-003 | Sistem harus menjaga keamanan data pengguna |
| NFR-004 | Sistem harus menggunakan authentication yang aman |
| NFR-005 | Sistem harus dapat menangani banyak team room secara bersamaan |
| NFR-006 | Response AI sebaiknya dikembalikan dalam waktu yang wajar |
| NFR-007 | Sistem harus menyimpan log aktivitas penting |
| NFR-008 | Sistem harus mendukung skalabilitas database |
| NFR-009 | Sistem harus memiliki validasi input di frontend dan backend |
| NFR-010 | Sistem harus memiliki error handling yang jelas |

---

## 13. Arsitektur Sistem

### 13.1 Gambaran Umum

Arsitektur sistem LearnTogether AI terdiri dari beberapa komponen utama:

1. Website frontend menggunakan Next.js.
2. Mobile app menggunakan Flutter.
3. Backend API menggunakan Next.js API Route atau backend service terpisah.
4. Database menggunakan Supabase Database (PostgreSQL).
5. Authentication menggunakan Clerk.
6. AI service menggunakan OpenAI API atau Gemini API.
7. Storage menggunakan Supabase Storage.
8. Push notification menggunakan Firebase Cloud Messaging.

### 13.2 Diagram Arsitektur Sederhana

```text
+------------------+        +------------------+
|  Next.js Website |        |   Flutter App    |
+--------+---------+        +--------+---------+
         |                           |
         +-------------+-------------+
                       |
               +-------v-------+
               |   Backend API |
               +-------+-------+
                       |
        +--------------+--------------+
        |              |              |
+-------v-----+ +------v------+ +-----v------+
|  Supabase   | | AI Service  | |  Storage   |
|  Database   | | OpenAI/API  | | Supabase   |
+-------------+ +-------------+ +------------+
                       |
                +------v------+
                | Notification|
                |    FCM      |
                +-------------+
```

---

## 14. Rekomendasi Tech Stack

### 14.1 Website

| Kebutuhan | Teknologi |
|---|---|
| Frontend Web | Next.js |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| UI Component | shadcn/ui |
| Form Validation | Zod |
| State Management | Zustand atau React Query |
| Deployment | Vercel |

### 14.2 Mobile App

| Kebutuhan | Teknologi |
|---|---|
| Mobile Framework | Flutter |
| Bahasa | Dart |
| State Management | Riverpod atau Bloc |
| HTTP Client | Dio |
| Local Storage | Hive atau Shared Preferences |
| Push Notification | Firebase Cloud Messaging |

### 14.3 Backend

| Kebutuhan | Teknologi |
|---|---|
| API | Next.js Route Handler atau NestJS |
| Database | Supabase Database (PostgreSQL) |
| Database Client / ORM | Supabase JS Client atau Prisma |
| Authentication | Clerk |
| User Sync | Clerk Webhook / Backend Sync ke Supabase |
| File Storage | Supabase Storage |
| AI Integration | OpenAI API atau Gemini API |

### 14.4 Rekomendasi untuk MVP

Untuk MVP, disarankan menggunakan:

```text
Next.js + TypeScript + Tailwind CSS + shadcn/ui
Flutter
Supabase Database
Supabase JS Client atau Prisma
Clerk
OpenAI API atau Gemini API
Supabase Storage
Firebase Cloud Messaging
```

Alasan:

1. Next.js cocok untuk dashboard web dan backend sederhana.
2. Flutter cocok untuk mobile app lintas platform.
3. Supabase Database cocok karena tetap berbasis PostgreSQL dan mendukung data relasional seperti user, team, project, task, dan review.
4. Supabase memudahkan pengelolaan database, storage, dan dashboard data dalam satu ekosistem.
5. Supabase JS Client atau Prisma dapat digunakan untuk akses database dari backend.
6. Clerk mempercepat proses authentication dan manajemen user.
7. Supabase Storage mudah digunakan untuk upload file, screenshot, dokumen, dan bukti project.
7. AI API dapat digunakan untuk matching, feedback, dan project generation.

---

## 14.5 Integrasi Supabase dan Clerk

Pada proyek LearnTogether AI, Supabase dan Clerk memiliki tanggung jawab yang berbeda agar sistem lebih rapi dan mudah dikembangkan.

| Komponen | Fungsi |
|---|---|
| Clerk | Mengelola register, login, logout, session, OAuth, dan identitas user |
| Supabase Database | Menyimpan data aplikasi seperti profile, skill, team, project, task, progress, dan review |
| Supabase Storage | Menyimpan file upload seperti avatar, screenshot project, dokumen, dan evidence progress |
| Backend API | Menghubungkan data dari Clerk ke Supabase dan menjalankan logic utama aplikasi |

Alur sinkronisasi user:

1. User melakukan register atau login melalui Clerk.
2. Clerk membuat `clerk_user_id`.
3. Backend menerima data user dari Clerk melalui session atau webhook.
4. Backend mengecek apakah `clerk_id` sudah ada di tabel `users` Supabase.
5. Jika belum ada, backend membuat data user baru di Supabase.
6. Setelah data user tersedia, sistem dapat menyimpan profile, skill, team, project, dan progress berdasarkan `user_id` internal.

Dengan pendekatan ini, Clerk tetap fokus pada authentication, sedangkan Supabase tetap fokus pada data aplikasi.

---

## 15. Desain Database

Database utama menggunakan **Supabase Database** yang berbasis PostgreSQL. Seluruh data aplikasi disimpan di Supabase, sedangkan authentication dikelola oleh Clerk. Field `clerk_id` pada tabel `users` digunakan sebagai penghubung antara akun Clerk dan data aplikasi di Supabase.

### 15.1 Daftar Entitas

1. users
2. profiles
3. skills
4. user_skills
5. learning_goals
6. classes
7. teams
8. team_members
9. projects
10. tasks
11. progress_updates
12. ai_feedbacks
13. peer_reviews
14. portfolios
15. notifications

---

## 15.2 Struktur Tabel

### users

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| clerk_id | String | ID dari Clerk |
| email | String | Email user |
| role | Enum | student, mentor, admin |
| created_at | DateTime | Tanggal dibuat |
| updated_at | DateTime | Tanggal diperbarui |

### profiles

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| full_name | String | Nama lengkap |
| username | String | Username |
| bio | Text | Bio singkat |
| avatar_url | String | Foto profil |
| preferred_role | String | Role belajar yang diminati |
| availability | String | Waktu belajar |
| created_at | DateTime | Tanggal dibuat |
| updated_at | DateTime | Tanggal diperbarui |

### skills

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| name | String | Nama skill |
| category | String | Kategori skill |
| description | Text | Deskripsi skill |

### user_skills

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| skill_id | String | Relasi ke skills |
| score | Integer | Nilai kemampuan 0-100 |
| source | String | assessment, self_assessment, project |
| updated_at | DateTime | Tanggal diperbarui |

### learning_goals

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| title | String | Tujuan belajar |
| description | Text | Detail tujuan belajar |
| target_date | DateTime | Target selesai |

### classes

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| mentor_id | String | Relasi ke users |
| title | String | Judul kelas |
| description | Text | Deskripsi kelas |
| category | String | Kategori kelas |
| level | String | beginner, intermediate, advanced |
| created_at | DateTime | Tanggal dibuat |

### teams

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| class_id | String | Relasi ke classes |
| name | String | Nama tim |
| description | Text | Deskripsi tim |
| status | String | forming, active, completed |
| matching_reason | Text | Alasan matching dari AI |
| created_at | DateTime | Tanggal dibuat |

### team_members

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| team_id | String | Relasi ke teams |
| user_id | String | Relasi ke users |
| role_in_team | String | Role user dalam tim |
| joined_at | DateTime | Tanggal bergabung |

### projects

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| team_id | String | Relasi ke teams |
| title | String | Judul project |
| description | Text | Deskripsi project |
| level | String | Level project |
| deadline | DateTime | Deadline project |
| status | String | planning, active, review, completed |
| ai_generated | Boolean | Apakah dibuat AI |
| created_at | DateTime | Tanggal dibuat |

### tasks

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| project_id | String | Relasi ke projects |
| assignee_id | String | User yang mengerjakan |
| title | String | Judul task |
| description | Text | Deskripsi task |
| status | String | todo, in_progress, review, done |
| priority | String | low, medium, high |
| deadline | DateTime | Deadline task |
| evidence_url | String | Bukti pengerjaan |
| created_at | DateTime | Tanggal dibuat |
| updated_at | DateTime | Tanggal diperbarui |

### progress_updates

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| team_id | String | Relasi ke teams |
| project_id | String | Relasi ke projects |
| task_id | String | Relasi ke tasks |
| content | Text | Isi progress update |
| blocker | Text | Kendala |
| next_plan | Text | Rencana berikutnya |
| attachment_url | String | Bukti tambahan |
| created_at | DateTime | Tanggal dibuat |

### ai_feedbacks

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| team_id | String | Relasi ke teams |
| project_id | String | Relasi ke projects |
| progress_update_id | String | Relasi ke progress_updates |
| feedback_type | String | technical, teamwork, learning, timeline |
| content | Text | Isi feedback AI |
| created_at | DateTime | Tanggal dibuat |

### peer_reviews

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| reviewer_id | String | User yang memberi review |
| reviewee_id | String | User yang dinilai |
| team_id | String | Relasi ke teams |
| contribution_score | Integer | Nilai kontribusi |
| communication_score | Integer | Nilai komunikasi |
| responsibility_score | Integer | Nilai tanggung jawab |
| comment | Text | Komentar |
| created_at | DateTime | Tanggal dibuat |

### portfolios

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| project_id | String | Relasi ke projects |
| title | String | Judul portfolio |
| description | Text | Deskripsi portfolio |
| contribution_summary | Text | Ringkasan kontribusi |
| skills_proven | JSON | Daftar skill yang terbukti |
| demo_url | String | Link demo |
| repository_url | String | Link repository |
| created_at | DateTime | Tanggal dibuat |

### notifications

| Field | Type | Description |
|---|---|---|
| id | UUID / String | Primary key |
| user_id | String | Relasi ke users |
| title | String | Judul notifikasi |
| message | Text | Isi notifikasi |
| type | String | task, feedback, deadline, team |
| is_read | Boolean | Status dibaca |
| created_at | DateTime | Tanggal dibuat |

---

## 16. Relasi Database

Relasi utama dalam sistem:

1. User memiliki satu Profile.
2. User memiliki banyak UserSkill.
3. Skill dapat dimiliki banyak User melalui UserSkill.
4. Mentor memiliki banyak Class.
5. Class memiliki banyak Team.
6. Team memiliki banyak TeamMember.
7. User dapat menjadi anggota banyak Team.
8. Team memiliki satu atau banyak Project.
9. Project memiliki banyak Task.
10. Task dapat dimiliki oleh satu User sebagai assignee.
11. User dapat membuat banyak ProgressUpdate.
12. ProgressUpdate dapat memiliki AIFeedback.
13. User dapat memberi dan menerima PeerReview.
14. User memiliki banyak Portfolio.
15. User memiliki banyak Notification.

---

## 17. API Design

## 17.1 Authentication API

### GET /api/auth/me

Mengambil data user yang sedang login.

### POST /api/auth/sync

Sinkronisasi data dari Clerk ke database internal.

---

## 17.2 Profile API

### GET /api/profile

Mengambil profil user.

### PUT /api/profile

Memperbarui profil user.

Request body:

```json
{
  "full_name": "Muhammad Naufal Waiz",
  "bio": "Saya sedang belajar web development",
  "preferred_role": "Frontend Developer",
  "availability": "Malam dan weekend"
}
```

---

## 17.3 Skill API

### GET /api/skills

Mengambil daftar skill.

### POST /api/skills/assessment

Mengirim hasil assessment user.

Request body:

```json
{
  "skills": [
    {
      "skill_id": "frontend",
      "score": 75
    },
    {
      "skill_id": "backend",
      "score": 35
    }
  ]
}
```

### GET /api/users/:id/skills

Mengambil skill profile user tertentu.

---

## 17.4 Team Matching API

### POST /api/teams/match

Membuat rekomendasi tim berdasarkan data user dan skill.

Request body:

```json
{
  "class_id": "class_001",
  "team_size": 4,
  "learning_goal": "Web Development"
}
```

Response:

```json
{
  "teams": [
    {
      "name": "Team Orion",
      "members": [
        {
          "user_id": "user_001",
          "role": "Frontend Developer"
        },
        {
          "user_id": "user_002",
          "role": "Backend Developer"
        }
      ],
      "matching_reason": "Tim memiliki kombinasi frontend dan backend yang seimbang."
    }
  ]
}
```

### GET /api/teams/:id

Mengambil detail tim.

### POST /api/teams/:id/join

User bergabung ke tim.

---

## 17.5 Project API

### POST /api/projects/generate

Membuat project berdasarkan data tim.

Request body:

```json
{
  "team_id": "team_001",
  "level": "beginner",
  "duration_days": 14
}
```

### GET /api/projects/:id

Mengambil detail project.

### PUT /api/projects/:id

Memperbarui project.

---

## 17.6 Task API

### GET /api/projects/:id/tasks

Mengambil daftar task dalam project.

### POST /api/tasks

Membuat task baru.

### PUT /api/tasks/:id

Memperbarui task.

### DELETE /api/tasks/:id

Menghapus task.

---

## 17.7 Progress API

### POST /api/progress

Mengirim progress update.

Request body:

```json
{
  "team_id": "team_001",
  "project_id": "project_001",
  "task_id": "task_001",
  "content": "Saya sudah menyelesaikan halaman login.",
  "blocker": "Masih bingung validasi form.",
  "next_plan": "Besok mengerjakan dashboard."
}
```

### GET /api/teams/:id/progress

Mengambil progress tim.

---

## 17.8 AI Feedback API

### POST /api/ai/feedback

Meminta feedback AI berdasarkan progress update.

Request body:

```json
{
  "progress_update_id": "progress_001"
}
```

Response:

```json
{
  "feedback": "Progress kamu sudah baik. Validasi form sebaiknya dipisahkan menggunakan schema agar lebih rapi."
}
```

---

## 17.9 Peer Review API

### POST /api/peer-reviews

Mengirim peer review.

### GET /api/teams/:id/peer-reviews

Mengambil hasil peer review dalam tim.

---

## 17.10 Portfolio API

### POST /api/portfolios/generate

Membuat portfolio otomatis berdasarkan project.

### GET /api/users/:id/portfolios

Mengambil portfolio user.

### GET /api/portfolios/:id

Mengambil detail portfolio.

---

## 18. AI Design

## 18.1 Fungsi AI dalam Sistem

AI digunakan untuk beberapa fitur utama:

1. Skill profile analysis.
2. Team matching recommendation.
3. Project generation.
4. Task breakdown.
5. Progress feedback.
6. Team performance summary.
7. Portfolio summary generation.

---

## 18.2 AI Team Matching Logic

### Input AI

AI menerima data:

1. Daftar user.
2. Skill score masing-masing user.
3. Preferred role.
4. Learning goal.
5. Availability.
6. Project interest.

### Output AI

AI menghasilkan:

1. Komposisi tim.
2. Role setiap anggota.
3. Alasan matching.
4. Potensi risiko tim.
5. Rekomendasi project awal.

### Prompt Contoh

```text
Anda adalah AI learning team matcher. Tugas Anda adalah membentuk tim belajar yang seimbang berdasarkan skill, kelemahan, minat, dan waktu belajar user. Jangan membentuk tim yang semua anggotanya memiliki skill yang sama. Buat tim yang saling melengkapi.

Data user:
{{users}}

Buat rekomendasi tim dengan format JSON berisi team_name, members, role, matching_reason, dan risk_note.
```

---

## 18.3 AI Project Generator Logic

### Prompt Contoh

```text
Anda adalah AI project mentor untuk platform e-learning. Buatkan project pembelajaran yang sesuai untuk tim berikut:

Data tim:
{{team_data}}

Level: {{level}}
Durasi: {{duration}}
Bidang belajar: {{category}}

Output harus berisi:
1. Judul project
2. Deskripsi project
3. Fitur utama
4. Task berdasarkan role
5. Timeline pengerjaan
6. Kriteria keberhasilan
```

---

## 18.4 AI Feedback Logic

### Prompt Contoh

```text
Anda adalah mentor pembelajaran. Berikan feedback yang membantu, jelas, dan tidak menjatuhkan user.

Data progress user:
{{progress_update}}

Data task:
{{task_data}}

Berikan feedback berisi:
1. Apresiasi progress
2. Masalah yang perlu diperbaiki
3. Saran teknis
4. Rencana langkah berikutnya
```

---

## 19. UI/UX Design

## 19.1 Halaman Website

### Public Pages

1. Landing page.
2. About page.
3. Pricing page.
4. Login page.
5. Register page.

### Student Pages

1. Dashboard student.
2. Profile page.
3. Skill assessment page.
4. Team matching page.
5. Team room page.
6. Project detail page.
7. Task board page.
8. Progress update page.
9. Portfolio page.

### Mentor Pages

1. Mentor dashboard.
2. Class management page.
3. Team monitoring page.
4. Project monitoring page.
5. Student report page.

### Admin Pages

1. Admin dashboard.
2. User management page.
3. Skill management page.
4. Class management page.
5. System report page.

---

## 19.2 Mobile App Screens

1. Splash screen.
2. Login screen.
3. Register screen.
4. Home screen.
5. Skill assessment screen.
6. Team room screen.
7. Task list screen.
8. Progress update screen.
9. Notification screen.
10. Portfolio screen.
11. Profile screen.

---

## 19.3 Prinsip Desain

1. Clean dan modern.
2. Mudah dipahami pemula.
3. Fokus pada progress belajar.
4. Navigasi sederhana.
5. Mobile-first untuk aktivitas harian.
6. Dashboard web lebih lengkap untuk monitoring.
7. Warna visual yang membedakan status task.
8. Komponen UI konsisten antara web dan mobile.

---

## 20. Pembagian Fungsi Website dan Mobile App

| Fitur | Website Next.js | Flutter App |
|---|---|---|
| Landing page | Ya | Tidak |
| Dashboard lengkap | Ya | Ringkas |
| Skill assessment | Ya | Ya |
| Team room | Ya | Ya |
| Task board | Ya | Ya |
| Progress update | Ya | Ya |
| Chat/diskusi | Ya | Ya |
| Notifikasi | Terbatas | Ya |
| Mentor dashboard | Ya | Tidak wajib |
| Admin dashboard | Ya | Tidak |
| Portfolio publik | Ya | Ya |

Website digunakan sebagai platform utama dan dashboard lengkap. Mobile app digunakan untuk aktivitas harian seperti melihat task, update progress, diskusi, dan menerima notifikasi.

---

## 21. MVP Development Plan

### 21.1 MVP Scope

Fitur yang perlu dibuat pada MVP:

1. Authentication.
2. User profile.
3. Skill assessment sederhana.
4. Skill profile.
5. Team matching sederhana.
6. Team room.
7. Project generator sederhana.
8. Task board.
9. Progress update.
10. AI feedback.
11. Portfolio sederhana.

---

## 21.2 Tahapan Pengembangan

### Phase 1: Foundation

1. Setup Next.js project.
2. Setup Flutter project.
3. Setup Supabase project dan database schema.
4. Setup Supabase Storage bucket.
5. Setup Clerk authentication dan sinkronisasi user ke Supabase.
6. Setup basic API.

### Phase 2: Core User Flow

1. Membuat user profile.
2. Membuat skill assessment.
3. Menyimpan user skill.
4. Membuat dashboard student.

### Phase 3: Team Matching

1. Membuat logic matching sederhana.
2. Membuat team room.
3. Menampilkan anggota tim.
4. Menampilkan alasan matching.

### Phase 4: Project and Task

1. Membuat project generator.
2. Membuat task board.
3. Membuat assignment task.
4. Membuat progress update.

### Phase 5: AI Integration

1. Integrasi AI feedback.
2. Integrasi AI project generation.
3. Integrasi AI summary.

### Phase 6: Portfolio and Finalization

1. Membuat portfolio individu.
2. Membuat portfolio tim.
3. Testing end-to-end.
4. Deployment web.
5. Build mobile app.

---

## 22. Algoritma Matching Sederhana untuk MVP

Untuk MVP, matching tidak harus langsung menggunakan AI penuh. Sistem dapat menggunakan scoring sederhana terlebih dahulu.

### Data Input

Setiap user memiliki score:

```text
Frontend: 0-100
Backend: 0-100
UI/UX: 0-100
Database: 0-100
Communication: 0-100
Teamwork: 0-100
```

### Aturan Dasar

1. Tim ideal terdiri dari 3 sampai 5 orang.
2. Minimal ada satu user dengan frontend score tinggi.
3. Minimal ada satu user dengan backend score tinggi.
4. Minimal ada satu user dengan UI/UX atau communication score cukup tinggi.
5. User dengan jadwal belajar mirip lebih diprioritaskan.
6. User dengan minat project yang sama lebih diprioritaskan.

### Contoh Pseudocode

```text
ambil daftar user yang belum punya tim
kelompokkan user berdasarkan learning goal
urutkan user berdasarkan skill dominan
buat tim kosong
masukkan user frontend terkuat
masukkan user backend terkuat
masukkan user UI/UX atau communication terkuat
cek keseimbangan skill tim
jika tim kurang seimbang, cari user tambahan yang menutupi kelemahan tim
simpan tim ke database
minta AI membuat alasan matching
```

---

## 23. Security Design

### 23.1 Authentication Security

1. Gunakan Clerk untuk manajemen login.
2. Gunakan role-based access control.
3. Pastikan API hanya dapat diakses user terautentikasi.
4. Validasi role untuk endpoint mentor dan admin.

### 23.2 Data Validation

1. Validasi input menggunakan Zod.
2. Sanitasi input text dari user.
3. Batasi ukuran file upload.
4. Validasi tipe file upload.

### 23.3 Authorization

1. Student hanya dapat mengakses team miliknya.
2. Mentor hanya dapat mengakses kelas yang dibuat atau dikelolanya.
3. Admin dapat mengakses seluruh data.
4. User tidak boleh mengubah progress milik user lain.
5. User tidak boleh menghapus task milik tim tanpa permission.

### 23.4 AI Safety

1. Jangan mengirim data sensitif yang tidak diperlukan ke AI provider.
2. Batasi prompt agar AI hanya memberi feedback pembelajaran.
3. Simpan hasil AI untuk audit.
4. Berikan fallback jika AI gagal merespons.

---

## 24. Error Handling

Contoh error handling yang perlu disediakan:

| Kondisi | Respons Sistem |
|---|---|
| User belum login | Redirect ke login |
| Role tidak sesuai | Tampilkan forbidden access |
| Skill assessment belum lengkap | Minta user menyelesaikan assessment |
| Team belum tersedia | Tampilkan status menunggu matching |
| AI gagal merespons | Tampilkan pesan fallback |
| Upload gagal | Tampilkan alasan kegagalan |
| Task tidak ditemukan | Tampilkan halaman not found |

---

## 25. Testing Plan

### 25.1 Unit Testing

Digunakan untuk menguji:

1. Matching logic.
2. Skill score calculation.
3. Task status update.
4. Role validation.
5. API utility function.

### 25.2 Integration Testing

Digunakan untuk menguji:

1. Register sampai profile lengkap.
2. Assessment sampai skill profile dibuat.
3. Matching sampai team room dibuat.
4. Project generator sampai task dibuat.
5. Progress update sampai AI feedback muncul.

### 25.3 End-to-End Testing

Skenario utama:

1. Student register.
2. Student mengisi profile.
3. Student mengisi assessment.
4. Student masuk tim.
5. Student menerima project.
6. Student mengerjakan task.
7. Student update progress.
8. AI memberi feedback.
9. Project selesai.
10. Portfolio dibuat.

---

## 26. Deployment Plan

### 26.1 Website

Website Next.js dapat dideploy ke Vercel.

### 26.2 Database

Database menggunakan Supabase Database (PostgreSQL). Supabase dipilih sebagai database utama karena sudah menyediakan dashboard database, SQL editor, table editor, storage, dan integrasi yang mudah dengan Next.js.

Konfigurasi utama:

1. Supabase Database sebagai penyimpanan data utama.
2. Supabase Storage sebagai penyimpanan file project, screenshot, avatar, dan dokumen.
3. Clerk sebagai authentication provider.
4. Tabel `users` di Supabase menyimpan metadata user dan mengacu pada `clerk_id` dari Clerk.

### 26.3 Storage

Storage menggunakan Supabase Storage untuk menyimpan file yang diunggah user, seperti avatar, screenshot progress, file dokumentasi, dan bukti hasil project.

### 26.4 Mobile App

Flutter app dapat dibuild untuk:

1. Android.
2. iOS.

Untuk MVP, prioritas awal adalah Android.

---

## 27. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Matching tim kurang akurat | User tidak cocok dengan tim | Gunakan kombinasi scoring manual dan AI reasoning |
| Anggota tim tidak aktif | Project terhambat | Tambahkan reminder dan AI inactivity detection |
| AI feedback kurang relevan | User bingung | Buat prompt yang spesifik dan sediakan feedback mentor |
| Scope fitur terlalu besar | MVP tidak selesai | Fokus pada core flow terlebih dahulu |
| Data progress tidak konsisten | Portfolio tidak akurat | Wajibkan evidence pada task penting |
| Biaya AI membesar | Operasional mahal | Batasi penggunaan AI dan cache hasil feedback |

---

## 28. Pengembangan Lanjutan

Fitur yang dapat ditambahkan setelah MVP:

1. Chat real-time.
2. Video meeting integration.
3. GitHub integration.
4. Figma integration.
5. AI code review.
6. AI design review.
7. Sertifikat otomatis.
8. Public project showcase.
9. Marketplace mentor.
10. Leaderboard antar tim.
11. Mode offline di mobile app.
12. Learning analytics advanced.
13. Export laporan ke PDF.
14. Integrasi payment gateway.

---

## 29. Contoh Pitch Produk

LearnTogether AI adalah platform e-learning kolaboratif berbasis AI yang mencocokkan pengguna ke dalam kelompok belajar berdasarkan kekuatan dan kelemahan skill. Setelah tim terbentuk, AI memberikan project yang sesuai, membagi tugas berdasarkan role, memantau progress, dan membantu setiap anggota membangun portfolio dari kontribusi nyata mereka. Platform ini bertujuan mengubah e-learning dari sekadar menonton materi menjadi pengalaman belajar bersama yang praktis, terarah, dan menghasilkan karya.

---

## 30. Kesimpulan

LearnTogether AI merupakan platform e-learning yang menggabungkan pembelajaran kolaboratif, AI matching, project-based learning, progress tracking, peer review, dan portfolio otomatis. Ide ini memiliki pembeda yang kuat dibandingkan LMS biasa karena tidak hanya fokus pada penyampaian materi, tetapi juga pada proses belajar bersama dan pembuktian kemampuan melalui project nyata.

Dengan menggunakan Next.js untuk website, Flutter untuk mobile app, Supabase sebagai database dan storage, Clerk untuk authentication, serta AI API untuk matching dan feedback, LearnTogether AI dapat dikembangkan sebagai MVP yang realistis namun tetap memiliki nilai inovasi yang kuat.

Prioritas awal pengembangan sebaiknya difokuskan pada alur utama:

1. User register.
2. User mengisi skill assessment.
3. AI atau sistem mencocokkan user ke tim.
4. Tim mendapatkan project.
5. Anggota mengerjakan task.
6. User update progress.
7. AI memberi feedback.
8. Project menjadi portfolio.

Jika alur tersebut berhasil dibuat, LearnTogether AI sudah memiliki fondasi yang kuat sebagai platform e-learning generasi baru yang lebih kolaboratif, praktis, dan relevan dengan kebutuhan belajar modern.
