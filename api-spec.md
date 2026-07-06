# API Specification — LearnTogether AI

Dokumen ini menjelaskan seluruh backend API yang tersedia pada project LearnTogether AI.
Backend diimplementasikan sebagai Next.js Route Handler (`app/api/**`) dengan
authentication menggunakan Clerk dan database Supabase (PostgreSQL).

## Konvensi Umum

| Aspek | Keterangan |
|---|---|
| Base URL | `http://localhost:3000/api` (dev) / domain produksi |
| Format request & response | `application/json` |
| Authentication | Clerk session cookie (`__clerk_db_jwt` / `__session`). Setiap endpoint memanggil `currentUser()` dari `@clerk/nextjs/server`. |
| Authorization | Berbasis role (`student`, `mentor`, `admin`) dan kepemilikan resource (`created_by`, `team_members`). |
| Validasi body | Menggunakan Zod. Jika gagal, response 400 dengan field `details`. |
| Sinkronisasi user | Setiap request yang membutuhkan user aktif memanggil `syncClerkUserToSupabase()` untuk memastikan row `users` di Supabase sinkron dengan Clerk. |
| AI provider | Google Gemini (`@google/genai`). Jika `GEMINI_API_KEY` kosong atau timeout (6,5 detik), endpoint AI memakai fallback lokal. |
| Environment variables | `GEMINI_API_KEY`, `GEMINI_MODEL` (default `gemini-2.5-flash`), `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CLERK_*`. |

### Struktur Error Response

```json
{
  "error": "Pesan error dalam bahasa Indonesia.",
  "details": {}
}
```

Kode status umum yang digunakan:

| Status | Arti |
|---|---|
| 200 | Sukses (GET / POST / PUT / PATCH). |
| 201 | Tidak eksplisit; NextResponse default 200 untuk POST sukses. |
| 400 | Validasi body/parameter gagal. |
| 401 | User belum login (Clerk session tidak ditemukan). |
| 403 | User terautentikasi tapi tidak punya akses ke resource. |
| 409 | Konflik state (misal sudah menjadi member). |
| 500 | Kegagalan Supabase atau error tak terduga. |

---

## 1. Authentication

### 1.1 GET `/api/auth/me`

Mengambil data user aplikasi (row `users` di Supabase) yang sedang login.
Jika belum ada row, otomatis di-sync dari Clerk.

**Auth:** Wajib login Clerk.

**Response 200:**

```json
{
  "user": {
    "id": "uuid",
    "clerk_id": "user_xxx",
    "email": "naufal@example.com",
    "role": "student",
    "full_name": "Muhammad Naufal Waiz",
    "bio": null,
    "avatar_url": null,
    "preferred_role": null,
    "availability": null,
    "learning_goal": null,
    "skill_interests": [],
    "created_at": "2026-06-22T10:00:00Z",
    "updated_at": "2026-06-22T10:00:00Z"
  }
}
```

**Response 401:**

```json
{ "user": null }
```

**Response 500:**

```json
{ "error": "Gagal mengambil user dari Supabase." }
```

### 1.2 POST `/api/auth/sync`

Sinkronisasi manual data Clerk ke tabel `users` di Supabase. Bisa dipanggil
saat pertama kali user login untuk membuat row baru.

**Auth:** Wajib login Clerk.

**Request body (opsional):**

```json
{
  "role": "student"
}
```

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `role` | enum | tidak | `"student" | "mentor" | "admin"` |

**Response 200:** sama dengan `GET /api/auth/me` (`{ "user": {...} }`).

**Response 400:** `{ "error": "Role tidak valid. Gunakan student, mentor, atau admin." }`

**Response 401:** `{ "error": "User belum login." }`

**Response 500:** `{ "error": "Gagal sinkronisasi user ke Supabase. Pastikan schema database sudah dijalankan." }`

---

## 2. Profile

### 2.1 GET `/api/profile`

Mengambil profil user yang sedang login (row `users` di Supabase).

**Auth:** Wajib login.

**Response 200:**

```json
{
  "profile": {
    "id": "uuid",
    "full_name": "Muhammad Naufal Waiz",
    "bio": "Saya sedang belajar web development",
    "preferred_role": "Frontend Developer",
    "availability": "Malam dan weekend",
    "learning_goal": "Belajar web development melalui project nyata",
    "skill_interests": ["React", "Next.js", "Tailwind"],
    "updated_at": "2026-06-22T10:00:00Z"
  }
}
```

**Error:** 401 / 500 (`"Gagal mengambil profil dari Supabase."`).

### 2.2 PUT `/api/profile`

Memperbarui profil user yang sedang login. Hanya field yang dikirim yang akan di-update.

**Auth:** Wajib login.

**Request body (semua field opsional):**

```json
{
  "full_name": "Muhammad Naufal Waiz",
  "bio": "Saya sedang belajar web development",
  "learning_goal": "Belajar web development melalui project nyata",
  "preferred_role": "Frontend Developer",
  "availability": "Malam dan weekend",
  "skill_interests": ["React", "Next.js", "Tailwind"]
}
```

| Field | Tipe | Validasi |
|---|---|---|
| `full_name` | string | 2–120 karakter |
| `bio` | string \| null | maks 500 karakter |
| `learning_goal` | string \| null | maks 240 karakter |
| `preferred_role` | string \| null | maks 120 karakter |
| `availability` | string \| null | maks 160 karakter |
| `skill_interests` | string[] | 1–60 char per item, maks 20 item |

**Response 200:** `{ "profile": {...} }` (row hasil update).

**Response 400:**

```json
{
  "error": "Data profil tidak valid.",
  "details": { "formErrors": [], "fieldErrors": { "full_name": ["..."] } }
}
```

**Error lain:** 401 / 500 (`"Gagal memperbarui profil di Supabase."`).

---

## 3. Onboarding

### 3.1 POST `/api/onboarding`

Menyimpan data onboarding awal user: expertise, level, availability, skill,
learning goal, dan preferensi tim. Meng-update row `users`, upsert ke tabel
`skills`, dan upsert `user_skills` dengan score berbasis level.

**Auth:** Wajib login.

**Request body:**

```json
{
  "expertise_field": "Web Development",
  "skill_level": "Beginner",
  "availability": "Weekend dan malam hari",
  "skills": ["HTML", "CSS", "JavaScript", "React"],
  "learning_goal": "Belajar web development melalui project nyata",
  "team_preference": "join"
}
```

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `expertise_field` | string | ya | 2–80 karakter |
| `skill_level` | enum | ya | `"Beginner" | "Intermediate" | "Advanced"` |
| `availability` | string | ya | 2–160 karakter |
| `skills` | string[] | ya | 1–20 item, masing-masing 1–80 karakter |
| `learning_goal` | string | tidak | maks 240 karakter (default `""`) |
| `team_preference` | enum | ya | `"join" | "create"` |

Pemetaan skill level → score:

| skill_level | score |
|---|---|
| Beginner | 45 |
| Intermediate | 70 |
| Advanced | 90 |

**Response 200:**

```json
{
  "saved": true,
  "next": "/teams"
}
```

`next` bernilai `/teams/new` jika `team_preference === "create"`, selain itu `/teams`.

**Response 400:** `{ "error": "Data onboarding tidak valid.", "details": {...} }`

**Response 500:** `{ "error": "Gagal menyimpan onboarding. Pastikan schema Supabase terbaru sudah dijalankan." }`

---

## 4. Teams

### 4.1 GET `/api/teams`

Mengambil daftar tim dengan status `forming` (terbuka untuk join), beserta
member, jumlah member, dan status join request user yang sedang login.

**Auth:** Wajib login.

**Response 200:**

```json
{
  "teams": [
    {
      "id": "uuid",
      "name": "Team Orion",
      "description": "Tim belajar web development",
      "project_goal": "Membangun dashboard e-learning",
      "needed_roles": ["Frontend Developer", "Backend Developer"],
      "status": "forming",
      "invite_code": "ORION-AB12",
      "created_at": "2026-06-22T10:00:00Z",
      "team_members": [
        {
          "role_in_team": "Frontend Developer",
          "users": {
            "full_name": "Naufal",
            "avatar_url": null
          }
        }
      ],
      "member_count": 1,
      "my_request_status": null
    }
  ]
}
```

`my_request_status` bernilai `"pending" | "approved" | "rejected" | null`.

**Error:** 401 / 500 (`"Gagal mengambil daftar team. ..."`).

### 4.2 POST `/api/teams`

Membuat tim baru. Pembuat otomatis menjadi member aktif dengan `owner_role`,
serta dapat mengirim undangan via email ke `team_invites`.

**Auth:** Wajib login.

**Request body:**

```json
{
  "name": "Team Orion",
  "description": "Tim belajar web development untuk pemula",
  "project_goal": "Membangun dashboard e-learning sederhana",
  "owner_role": "Frontend Developer",
  "needed_roles": ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
  "invite_emails": ["raka@example.com", "salsa@example.com"]
}
```

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `name` | string | ya | 3–100 karakter |
| `description` | string | ya | 8–500 karakter |
| `project_goal` | string | ya | 8–260 karakter |
| `owner_role` | string | ya | 2–80 karakter |
| `needed_roles` | string[] | ya | 1–12 item, masing-masing 2–80 karakter |
| `invite_emails` | string[] | tidak | maks 10 email valid (default `[]`) |

Side effect:

1. Insert row ke `teams` (`created_by` = user, `matching_reason` default).
2. Insert row ke `team_members` (`member_status = "active"`, role = `owner_role`).
3. Upsert `team_invites` untuk setiap email unik.

**Response 200:**

```json
{
  "team": {
    "id": "uuid",
    "name": "Team Orion",
    "invite_code": "ORION-AB12"
  },
  "invite_count": 2
}
```

**Response 400:** `{ "error": "Data team tidak valid.", "details": {...} }`

**Error lain:** 401 / 500 (`"Gagal membuat team. ..."`).

### 4.3 GET `/api/teams/:teamId`

Mengambil detail lengkap sebuah tim: member, join requests, projects, dan tasks.
Akses dibatasi: owner, member aktif, atau tim yang masih `forming`.

**Auth:** Wajib login. Jika bukan owner/member dan tim bukan `forming`, response 403.

**Path parameter:**

| Nama | Tipe | Validasi |
|---|---|---|
| `teamId` | UUID | wajib valid UUID |

**Response 200:**

```json
{
  "team": {
    "id": "uuid",
    "created_by": "uuid",
    "name": "Team Orion",
    "description": "Tim belajar web development",
    "project_goal": "Membangun dashboard e-learning",
    "needed_roles": ["Frontend Developer", "Backend Developer"],
    "status": "forming",
    "invite_code": "ORION-AB12",
    "matching_reason": "Team dibuat dari onboarding...",
    "team_members": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "role_in_team": "Frontend Developer",
        "member_status": "active",
        "joined_at": "2026-06-22T10:00:00Z",
        "users": { "full_name": "Naufal", "email": "...", "avatar_url": null }
      }
    ],
    "team_join_requests": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "requested_role": "Backend Developer",
        "message": "Saya kuat di API",
        "status": "pending",
        "created_at": "2026-06-22T11:00:00Z",
        "users": { "full_name": "Raka", "email": "...", "avatar_url": null }
      }
    ],
    "projects": [
      {
        "id": "uuid",
        "title": "Mini E-Learning Dashboard",
        "description": "...",
        "level": null,
        "status": "planning",
        "ai_generated": true,
        "created_at": "2026-06-22T12:00:00Z",
        "tasks": [
          {
            "id": "uuid",
            "assignee_id": "uuid",
            "title": "Susun scope project",
            "description": "...",
            "status": "todo",
            "priority": "high",
            "deadline": null,
            "evidence_url": null,
            "ai_feedback": "Task dibuat otomatis...",
            "users": { "full_name": "Naufal", "avatar_url": null }
          }
        ]
      }
    ]
  },
  "access": {
    "is_owner": true,
    "is_member": true,
    "user_id": "uuid"
  }
}
```

**Response 400:** `{ "error": "Team id tidak valid." }`

**Response 403:** `{ "error": "Kamu belum menjadi member team ini." }`

**Error lain:** 401 / 500 (`"Gagal mengambil detail team. ..."`).

---

## 5. Team Join Requests

### 5.1 POST `/api/teams/:teamId/requests`

Mengirim request bergabung ke tim. Tidak boleh dipanggil jika sudah jadi member.

**Auth:** Wajib login.

**Path parameter:** `teamId` (UUID valid).

**Request body:**

```json
{
  "requested_role": "Backend Developer",
  "message": "Saya kuat di API dan database"
}
```

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `requested_role` | string | ya | 2–80 karakter |
| `message` | string | tidak | maks 400 karakter (default `""`) |

Upsert ke `team_join_requests` dengan `onConflict: "team_id,user_id"` (mengirim
ulang request akan menimpa entry sebelumnya).

**Response 200:**

```json
{
  "request": {
    "id": "uuid",
    "status": "pending"
  }
}
```

**Response 400:** `{ "error": "Team id tidak valid." }` atau `{ "error": "Data request tidak valid.", "details": {...} }`

**Response 409:** `{ "error": "Kamu sudah menjadi member team ini." }`

**Error lain:** 401 / 500 (`"Gagal mengirim request join. ..."`).

### 5.2 PATCH `/api/teams/:teamId/requests/:requestId`

Owner tim menyetujui atau menolak join request. Saat approve, user ditambahkan
ke `team_members` sebagai member aktif dengan `requested_role` (atau `"Contributor"`).

**Auth:** Wajib login sebagai owner tim (`teams.created_by === user.id`).

**Path parameter:** `teamId` dan `requestId` (keduanya UUID valid).

**Request body:**

```json
{ "action": "approve" }
```

| Field | Tipe | Validasi |
|---|---|---|
| `action` | enum | `"approve" | "reject"` |

**Response 200:**

```json
{
  "request": {
    "id": "uuid",
    "status": "approved"
  }
}
```

`status` bernilai `"approved"` atau `"rejected"`.

**Response 400:** `{ "error": "Id request tidak valid." }` atau `{ "error": "Data approval tidak valid.", "details": {...} }`

**Response 403:** `{ "error": "Hanya owner team yang bisa memproses request join." }`

**Error lain:** 401 / 500 (`"Gagal memproses request join. ..."`).

---

## 6. AI Task Generation

### 6.1 POST `/api/teams/:teamId/tasks/generate`

Generate task AI untuk project tim berdasarkan `project_goal`, deskripsi, dan
komposisi role. Jika tim belum punya project, sebuah project baru akan dibuat
dengan status `planning` dan `ai_generated = true`.

**Auth:** Wajib login sebagai owner atau member aktif tim.

**Path parameter:** `teamId` (UUID valid).

**Request body:** tidak diperlukan (request body diabaikan).

Alur:

1. Ambil data tim + members aktif + projects.
2. Jika belum ada project, insert project baru.
3. Generate task via Gemini dengan timeout 6,5 detik; jika gagal/timeout pakai `fallbackTasks()`.
4. Assign task ke member aktif yang role-nya cocok; jika tidak ada, round-robin.
5. Insert task ke tabel `tasks` dengan status `todo`.

Prompt Gemini menghasilkan JSON:

```json
{
  "tasks": [
    {
      "title": "...",
      "description": "...",
      "role": "...",
      "priority": "high|medium|low"
    }
  ]
}
```

Maksimal 6–8 task. Setiap task disimpan dengan:

- `title` (max 160 char)
- `description` ditambah baris `Role target: <role>` (max 500 char)
- `priority` (validasi: `low|medium|high`, default `medium`)
- `status = "todo"`
- `ai_feedback = "Task dibuat otomatis dari project goal dan komposisi role team."`

**Response 200:**

```json
{
  "project_id": "uuid",
  "tasks": [
    {
      "id": "uuid",
      "title": "Susun scope dan acceptance criteria project",
      "description": "Ubah goal ... menjadi checklist fitur.\n\nRole target: Project Management",
      "status": "todo",
      "priority": "high",
      "assignee_id": "uuid"
    }
  ],
  "source": "ai-or-timeout-fallback"
}
```

`source` bernilai `"ai-or-timeout-fallback"` jika `GEMINI_API_KEY` tersedia, atau
`"fallback"` jika tidak ada API key.

**Response 400:** `{ "error": "Team id tidak valid." }`

**Response 403:** `{ "error": "Hanya member team yang bisa generate task." }`

**Error lain:** 401 / 500 (`"Gagal generate task. ..."`).

---

## 7. AI Feedback

### 7.1 POST `/api/ai/feedback`

Mengirim progress update harian dan meminta feedback mentor dari Gemini.
Endpoint ini sekaligus:

1. Menyimpan progress update ke tabel `progress_updates`.
2. Memanggil Gemini (atau fallback lokal) untuk menghasilkan feedback.
3. Menyimpan feedback ke tabel `ai_feedbacks` dengan `feedback_type = "learning"`.

Jika persistensi Supabase gagal, feedback tetap dikembalikan ke client dengan
warning, sehingga siswa tidak kehilangan respons AI.

**Auth:** Wajib login.

**Request body:**

```json
{
  "team_id": "uuid",
  "project_id": "uuid",
  "task_id": "uuid",
  "progress": "Saya sudah menyelesaikan halaman login.",
  "blocker": "Masih bingung validasi form.",
  "nextPlan": "Besok mengerjakan dashboard."
}
```

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `team_id` | UUID | tidak | UUID valid |
| `project_id` | UUID | tidak | UUID valid |
| `task_id` | UUID | tidak | UUID valid |
| `progress` | string | ya | 8–2000 karakter |
| `blocker` | string | tidak | maks 1000 karakter (default `""`) |
| `nextPlan` | string | tidak | maks 1000 karakter (default `""`) |

Prompt Gemini: feedback satu paragraf, 2–3 kalimat, maks 80 kata, bahasa
Indonesia, tanpa pujian generik, dengan satu arahan praktis dan satu evidence
yang perlu dikumpulkan.

**Response 200 (sukses AI):**

```json
{
  "feedback": "Laporanmu sudah menunjukkan halaman login selesai. Validasi form...",
  "model": "gemini-2.5-flash",
  "source": "gemini",
  "progress_update_id": "uuid",
  "saved": true,
  "warning": null
}
```

**Response 200 (fallback karena timeout):**

```json
{
  "feedback": "...",
  "model": "gemini-2.5-flash",
  "source": "fallback",
  "progress_update_id": "uuid",
  "saved": true,
  "warning": "Gemini terlalu lama merespons, memakai review lokal agar siswa tidak menunggu."
}
```

**Response 200 (tanpa API key):**

```json
{
  "feedback": "...",
  "model": "local-fallback",
  "source": "fallback",
  "progress_update_id": "uuid",
  "saved": true,
  "warning": null
}
```

**Response 200 (Supabase gagal persist):**

```json
{
  "feedback": "...",
  "model": "local-fallback",
  "source": "fallback",
  "progress_update_id": null,
  "saved": false,
  "warning": "Progress belum tersimpan ke Supabase. Pastikan schema database sudah dijalankan."
}
```

**Response 400:** `{ "error": "Data progress tidak valid.", "details": {...} }`

**Response 401:** `{ "error": "User belum login." }`

---

## 8. Portfolio

### 8.1 POST `/api/teams/:teamId/portfolio`

Membuat draft portfolio individu otomatis berdasarkan kontribusi task user pada
project pertama tim. Hanya member aktif atau owner yang dapat memanggil.

**Auth:** Wajib login sebagai member aktif atau owner.

**Path parameter:** `teamId` (UUID valid).

**Request body:** tidak diperlukan.

Alur:

1. Ambil data tim + `team_members` + `projects` + `tasks`.
2. Validasi caller adalah member aktif atau owner.
3. Ambil project pertama (`team.projects[0]`). Jika belum ada → 400.
4. Filter task milik user (`assignee_id === user.id`). Preferensi task dengan
   status `done`; jika belum ada, pakai semua task user.
5. Bangun `contribution_summary` dari role + daftar judul task.
6. `skills_proven` = union dari `role_in_team` + kata-kata judul task yang
   panjangnya > 4 (maks 5 kata).
7. Insert row ke `portfolios`.

**Response 200:**

```json
{
  "portfolio": {
    "id": "uuid",
    "title": "Mini E-Learning Dashboard - Frontend Developer Portfolio",
    "description": "Portfolio kontribusi project LearnTogether.",
    "contribution_summary": "Berperan sebagai Frontend Developer di Team Orion. Kontribusi utama: Susun scope project, Kerjakan deliverable utama...",
    "skills_proven": ["Frontend Developer", "scope", "project", "deliverable", "utama"],
    "demo_url": null,
    "repository_url": null,
    "created_at": "2026-06-22T13:00:00Z"
  },
  "task_count": 3,
  "done_task_count": 2
}
```

**Response 400:**

- `{ "error": "Team id tidak valid." }`
- `{ "error": "Team ini belum punya project. Generate task dulu." }`

**Response 403:** `{ "error": "Kamu belum menjadi member team ini." }`

**Error lain:** 401 / 500 (`"Gagal membuat portfolio draft. ..."`).

---

## 9. Ringkasan Endpoint

| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/auth/me` | Ambil user aktif | login |
| POST | `/api/auth/sync` | Sinkronisasi Clerk → Supabase | login |
| GET | `/api/profile` | Ambil profil user | login |
| PUT | `/api/profile` | Update profil user | login |
| POST | `/api/onboarding` | Simpan onboarding awal + skills | login |
| GET | `/api/teams` | Daftar tim status `forming` | login |
| POST | `/api/teams` | Buat tim baru | login |
| GET | `/api/teams/:teamId` | Detail tim + projects + tasks | login (owner/member/forming) |
| POST | `/api/teams/:teamId/requests` | Kirim join request | login |
| PATCH | `/api/teams/:teamId/requests/:requestId` | Approve/reject join request | owner |
| POST | `/api/teams/:teamId/tasks/generate` | Generate task AI | owner/member aktif |
| POST | `/api/ai/feedback` | Progress update + AI feedback | login |
| POST | `/api/teams/:teamId/portfolio` | Generate draft portfolio | member/owner |

---

## 10. Catatan Implementasi

1. **Tidak ada endpoint `DELETE`** saat ini; penghapusan task/portfolio belum
   diimplementasikan di backend.
2. **Tidak ada endpoint AI team matching terpisah**; rekomendasi tim saat ini
   menggunakan daftar tim terbuka + manual join request (lihat `GET /api/teams`
   dan `POST /api/teams/:teamId/requests`).
3. **Project generator** tidak berdiri sendiri; project dibuat otomatis saat
   `POST /api/teams/:teamId/tasks/generate` jika belum ada project.
4. **Peer review, notification, mentor dashboard, admin endpoints** belum
   tersedia pada MVP saat ini — lihat `sdd.md` bagian 17 untuk rancangan
   endpoint berikutnya yang direncanakan.
5. Semua endpoint yang mengandung `:teamId` memvalidasi format UUID dan
   mengembalikan 400 jika tidak valid sebelum menyentuh database.
6. `syncClerkUserToSupabase()` dipanggil di setiap endpoint yang membutuhkan
   `appUser.id`, sehingga row `users` di Supabase selalu tersedia sebelum
   operasi database lain dijalankan.
