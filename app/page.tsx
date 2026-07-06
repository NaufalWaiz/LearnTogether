"use client";

import {
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  KanbanSquare,
  LayoutDashboard,
  Linkedin,
  Mic,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload,
  UsersRound,
  Play,
  User,
  BookOpen,
  Handshake,
  Rocket,
  Medal,
  Star,
  Flame,
  Lock,
  Terminal,
  Laptop,
  Lightbulb,
  PieChart,
  Code2,
  Palette,
  Database,
  Smartphone,
  Shield
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from 'next/image';

type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";

type Task = {
  id: number;
  title: string;
  assignee: string;
  role: string;
  priority: "High" | "Medium" | "Low";
  status: TaskStatus;
};

const lessonChips = ["frontend", "backend", "ui/ux", "AI", "teamwork"];
const skills = ["Frontend", "Backend", "UI/UX", "Database", "Communication", "Teamwork"];
const statuses: TaskStatus[] = ["To Do", "In Progress", "Review", "Done"];

const memberData = [
  {
    name: "Naufal",
    role: "Frontend Developer",
    reason: "Kuat di React dan Tailwind CSS",
    score: 92
  },
  {
    name: "Raka",
    role: "Backend Developer",
    reason: "Menutup kebutuhan API dan database",
    score: 87
  },
  {
    name: "Salsa",
    role: "UI/UX Designer",
    reason: "Kuat di alur pengguna dan prototyping",
    score: 84
  },
  {
    name: "Dimas",
    role: "Project Manager",
    reason: "Komunikasi dan dokumentasi stabil",
    score: 80
  }
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Buat landing page dan dashboard siswa",
    assignee: "Naufal",
    role: "Frontend",
    priority: "High",
    status: "In Progress"
  },
  {
    id: 2,
    title: "Rancang database user, team, project, task",
    assignee: "Raka",
    role: "Backend",
    priority: "High",
    status: "Review"
  },
  {
    id: 3,
    title: "Buat wireframe team room dan task board",
    assignee: "Salsa",
    role: "UI/UX",
    priority: "Medium",
    status: "Done"
  },
  {
    id: 4,
    title: "Susun timeline sprint dan laporan progres",
    assignee: "Dimas",
    role: "PM",
    priority: "Medium",
    status: "To Do"
  },
  {
    id: 5,
    title: "Validasi form progress update dengan Zod",
    assignee: "Naufal",
    role: "Frontend",
    priority: "Low",
    status: "To Do"
  }
];

const steps = [
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      title: "Lengkapi Profil",
      description: "Isi role, skill, level, dan tujuan belajar untuk pengalaman yang relevan.",
      badge: "Personalized Learning",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      iconBg: "bg-amber-100",
      title: "Pelajari Materi",
      description: "Pelajari video interaktif, baca ringkasan, dan kerjakan kuis harian.",
      hasProgress: true,
    },
    {
      icon: <Handshake className="w-6 h-6 text-teal-600" />,
      iconBg: "bg-teal-100",
      title: "Temukan Tim",
      description: "Sistem AI akan merekomendasikan tim berdasarkan kecocokan skill.",
      badge: "⭐ AI Match 95%",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      icon: <Rocket className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "Bangun Proyek",
      description: "Kolaborasi bersama mentor dan anggota untuk portofolio nyata.",
      badge: "🏆 Portfolio Ready",
      badgeColor: "bg-slate-900 text-white border-transparent"
    }
  ];

  const categories = [
    {
      id: 'uiux',
      title: 'UI/UX Design',
      icon: Palette,
      contentTitle: 'Jelajahi Dunia UI/UX Design',
      description: 'UI/UX Design adalah proses merancang tampilan dan pengalaman pengguna agar sebuah aplikasi atau website menjadi lebih menarik, mudah digunakan, dan memberikan pengalaman terbaik. Di LearningTogether, kamu akan belajar mulai dari konsep dasar hingga praktik melalui materi yang disusun secara bertahap',
      image: '/images/ui-icon.png'
    },
    {
      id: 'frontend',
      title: 'Frontend Dev',
      icon: Code2,
      contentTitle: 'Jelajahi Dunia Frontend Dev',
      description: 'Frontend Dev berfokus pada apa yang dilihat pengguna di layar. Kamu akan belajar mengubah desain UI menjadi aplikasi web interaktif yang responsif menggunakan HTML, CSS, JavaScript, hingga framework modern seperti React dan Next.js.',
      image: '/images/no-icon.png'
    },
    {
      id: 'backend',
      title: 'Backend Dev',
      icon: Database,
      contentTitle: 'Jelajahi Dunia Backend Dev',
      description: 'Backend Dev mengelola logika di balik layar, database, dan server aplikasi. Kamu akan belajar membangun API yang aman, arsitektur database, dan memastikan performa sistem berjalan lancar dan optimal.',
      image: '/images/no-icon.png'
    },
    {
      id: 'mobile',
      title: 'Mobile Developer',
      icon: Smartphone,
      contentTitle: 'Jelajahi Dunia Mobile Dev',
      description: 'Mobile Dev berfokus pada pengembangan aplikasi untuk perangkat smartphone (Android & iOS). Pelajari bahasa dan framework populer untuk menciptakan aplikasi mobile yang cepat dan fungsional.',
      image: '/images/no-icon.png'
    },
    {
      id: 'datascience',
      title: 'Data Science',
      icon: PieChart,
      contentTitle: 'Jelajahi Dunia Data Science',
      description: 'Data Science adalah ilmu mengolah data mentah menjadi wawasan berharga menggunakan statistik dan machine learning. Pelajari cara menganalisis data besar untuk membantu pengambilan keputusan strategis.',
      image: '/images/no-icon.png'
    },
    {
      id: 'cybersecurity',
      title: 'Cyber Security',
      icon: Shield,
      contentTitle: 'Jelajahi Dunia Cyber Security',
      description: 'Cyber Security berfokus pada perlindungan sistem, jaringan, dan data dari serangan digital. Pelajari teknik pengamanan data, analisis celah keamanan, dan mitigasi risiko ancaman siber.',
      image: '/images/no-icon.png'
    }
  ];

  const faqData = [
    {
      question: "Apa itu LearningTogether?",
      answer: "LearningTogether adalah platform pembelajaran teknologi yang menyediakan materi interaktif di bidang UI/UX Design, Frontend Development, Backend Development, Cyber Security, AI, dan berbagai topik teknologi lainnya. Kamu bisa belajar sesuai minat melalui materi yang terstruktur dan project nyata."
    },
    {
      question: "Apakah saya harus memiliki pengalaman sebelumnya?",
      answer: "Tidak perlu! Semua materi kami dirancang dari tingkat dasar (beginner-friendly) hingga tingkat lanjut, sehingga siapa pun bisa memulainya dari nol."
    },
    {
      question: "Bidang apa saja yang bisa dipelajari?",
      answer: "Kamu bisa mempelajari berbagai bidang teknologi populer saat ini seperti UI/UX Design, Frontend Web Development, Backend Development, Cyber Security, Artificial Intelligence (AI), dan masih banyak lagi."
    },
    {
      question: "Apakah saya bisa belajar kapan saja?",
      answer: "Ya, sistem pembelajaran kami sepenuhnya fleksibel dan online. Kamu dapat mengakses seluruh modul materi dan project kapan saja dan di mana saja sesuai dengan waktu luangmu."
    }
  ];

  const testimonialsData = [
    {
      name: "Kevin Wijaya",
      role: "Mahasiswa Informatika",
      image: "/path-to-kevin-image.jpg", // Ganti dengan path gambar asli
      imageBg: "bg-sky-200", // Background khusus untuk foto Kevin kiri jika memakai transparan
      text: "Platform ini sangat membantu saya untuk terus belajar dan mengembangkan kemampuan. Materinya lengkap, mudah diikuti, dan bisa dipelajari sesuai dengan waktu luang.",
      isFeatured: false
    },
    {
      name: "Alea Zahra",
      role: "Mahasiswa Informatika",
      image: "/path-to-alea-image.jpg", // Ganti dengan path gambar asli
      imageBg: "bg-transparent",
      text: "Materinya mudah dipahami dan disusun secara bertahap. Saya jadi lebih percaya diri mempelajari UI/UX dan pengembangan web meskipun sebelumnya masih pemula.",
      isFeatured: true // Kartu tengah dibuat lebih menonjol
    },
    {
      name: "Kevin Wijaya", // Sesuai pada gambar image_38a4e8.png (sisi kanan)
      role: "Mahasiswa Informatika",
      image: "/path-to-kevin2-image.jpg", // Ganti dengan path gambar asli
      imageBg: "bg-zinc-200",
      text: "Platform ini sangat membantu saya untuk terus belajar dan mengembangkan kemampuan. Materinya lengkap, mudah diikuti, dan bisa dipelajari sesuai dengan waktu luang.",
      isFeatured: false
    }
  ];

const initialScores = {
  Frontend: 78,
  Backend: 42,
  "UI/UX": 66,
  Database: 48,
  Communication: 86,
  Teamwork: 82
};

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [syncStatus, setSyncStatus] = useState(
    "Login dengan Clerk untuk menyimpan profil ke Supabase."
  );
  const [progress, setProgress] = useState(
    "Saya menyelesaikan layout dashboard dan mulai menghubungkan task board dengan state lokal."
  );
  const [blocker, setBlocker] = useState(
    "Butuh validasi agar task tidak bisa pindah ke Done tanpa evidence."
  );
  const [nextPlan, setNextPlan] = useState(
    "Besok membuat form evidence dan preview portfolio otomatis."
  );
  const [aiFeedback, setAiFeedback] = useState(
    "Isi laporan harian, lalu generate feedback untuk mendapatkan catatan mentor yang spesifik."
  );
  const [feedbackMeta, setFeedbackMeta] = useState("Review mentor AI");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // 2. State untuk melacak tab aktif
  const [activeTab, setActiveTab] = useState('uiux');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Menemukan konten tab yang sedang aktif
  const currentCategory = categories.find(cat => cat.id === activeTab) || categories[0];

  const averageScore = useMemo(() => {
    const values = Object.values(scores);
    return Math.round(values.reduce((total, score) => total + score, 0) / values.length);
  }, [scores]);

  const dominantSkill = useMemo(() => {
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Teamwork";
  }, [scores]);

  const doneCount = tasks.filter((task) => task.status === "Done").length;
  const progressPercent = Math.round((doneCount / tasks.length) * 100);
  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "Learner";

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setSyncStatus("Login dengan Clerk untuk menyimpan profil ke Supabase.");
      return;
    }

    let cancelled = false;
    setSyncStatus("Menyinkronkan akun Clerk ke Supabase...");

    fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "student" })
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Gagal sinkronisasi akun.");
        }

        if (!cancelled) {
          setSyncStatus(`Login sebagai ${data.user.full_name}. Profil tersimpan di Supabase.`);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSyncStatus(
            error instanceof Error
              ? error.message
              : "Gagal sinkronisasi akun ke Supabase."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user?.id]);

  function updateScore(skill: string, value: number) {
    setScores((current) => ({
      ...current,
      [skill]: value
    }));
  }

  function moveTask(taskId: number, direction: 1 | -1) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const index = statuses.indexOf(task.status);
        const nextIndex = Math.min(Math.max(index + direction, 0), statuses.length - 1);
        return { ...task, status: statuses[nextIndex] };
      })
    );
  }

  async function generateFeedback() {
    if (!isSignedIn) {
      setAiFeedback("Login dengan Clerk dulu agar progress bisa tersimpan dan dikirim ke Gemini.");
      setFeedbackMeta("Login diperlukan");
      return;
    }

    setIsFeedbackLoading(true);

    try {
      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ progress, blocker, nextPlan })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal meminta feedback AI.");
      }

      setAiFeedback(data.feedback);
      setFeedbackMeta(
        data.source === "gemini"
          ? data.saved
            ? "Review mentor AI tersimpan"
            : "Review mentor AI"
          : data.saved
            ? "Review lokal tersimpan"
            : "Review lokal"
      );

      if (data.warning) {
        setSyncStatus(data.warning);
      }
    } catch (error) {
      setAiFeedback(
        error instanceof Error
          ? error.message
          : "Gagal meminta feedback AI. Coba ulang beberapa saat lagi."
      );
      setFeedbackMeta("Request gagal");
    } finally {
      setIsFeedbackLoading(false);
    }
  }

  return (
    <main>
      <section className="relative min-h-screen w-full bg-[#FCF8FA]" id="home">
        <Header displayName={displayName} isSignedIn={Boolean(isSignedIn)} />

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-start text-left md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Saatnya mulai <br/>
              <span className="relative inline-block whitespace-nowrap">
                Perjalanan Belajarmu
                <span className="absolute -bottom-4 left-0 w-full h-[20px] border-t-[3px] md:border-t-[4px] border-amber-400 rounded-[50%] rotate-[-2deg]"></span>
              </span>
            </h1>

            <p className="max-w-md text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Pelajari UI/UX, Web Development, Cyber Security, AI, dan berbagai bidang teknologi lainnya melalui materi terstruktur  bersama LearningTogether
            </p>

            <div className="flex flex-wrap items-center pt-2">
              <a 
                className="group inline-flex items-center gap-4 transition" 
                href="/onboarding"
              >
                <div className="inline-flex items-center justify-center rounded-full bg-[#5562AD] p-3 text-white shadow-md transition group-hover:bg-slate-800">
                  <ArrowRight size={24} />
                </div>
                <span className="text-lg font-bold text-[#5562AD] transition group-hover:text-slate-800">
                  Baca Selengkapnya
                </span>
              </a>
            </div>  
          </div>

          <div className="relative flex justify-center md:w-1/2 w-full">
            <div className="relative w-full max-w-md md:max-w-lg">
              <img 
                src="/images/orang-homepage.png" 
                alt="Learning Illustration" 
                className="h-auto w-full object-cover"
              />
              
              <div className="star star-one absolute top-4 left-4 text-xl font-bold text-slate-400">+</div>
              <div className="star star-two absolute bottom-4 right-4 text-xl font-bold text-slate-400">+</div>
            </div>
          </div>

        </div>
      </section>

      <section className="w-screen bg-[#FCF8FA] pt-16 md:pt-10 relative overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" id="dashboard">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] text-slate-900 z-0">
          <Rocket className="absolute top-10 left-8 w-20 h-20" />
          <Terminal className="absolute bottom-16 left-1/4 w-16 h-16" />
          <Laptop className="absolute top-12 right-1/4 w-24 h-24" />
          <GraduationCap className="absolute bottom-10 right-8 w-28 h-28" />
          <Lightbulb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full" id="bidang">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 items-center text-left mb-16">
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="w-64 h-64 md:w-full max-w-[240px] aspect-square flex items-center justify-center rounded-2xl relative">
                <Image 
                  src="/images/logo.png"
                  alt="Logo LearningTogether" 
                  fill
                  sizes="(max-w-768px) 192px, 240px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-black">
                Apa itu <span className="text-[#141586]">Learning</span><span className="text-[#EEC200]">Together?</span>
              </h2>

              <div className="text-slate-600 text-base md:text-lg leading-relaxed font-normal space-y-4 max-w-3xl">
                <p>
                  LearningTogether merupakan platform belajar teknologi yang menyediakan materi interaktif dan learning path terstructured. Kami membantu kamu mempelajari berbagai bidang teknologi secara bertahap agar proses belajar menjadi lebih mudah, terarah, dan menyenangkan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-6xl px-6 md:px-12">
            <div className="w-full flex flex-wrap md:flex-nowrap justify-between items-center">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeTab === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex flex-col items-center justify-center flex-1 min-w-[100px] md:min-w-0 text-center font-semibold tracking-wide transition-all duration-300 ease-in-out
                      ${
                        isActive 
                          ? 'bg-[#EEC200] text-white rounded-2xl py-6 px-4 -translate-y-4 scale-105 z-10 shadow-2xl' 
                          : 'bg-[#6E7CCE] text-white hover:bg-[#5b6bb3] py-4 px-3 rounded-xl'
                      }`}
                  >
                    <IconComponent className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-white'}`} />
                    <span className="text-xs md:text-sm">
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#5562AD] pt-24 pb-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
              
              <div className="bg-white rounded-3xl p-8 md:p-12 w-full shadow-xl transition-all duration-500 transform">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  <div className="md:col-span-7 space-y-4 text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                      {currentCategory.contentTitle}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {currentCategory.description}
                    </p>
                  </div>

                  <div className="md:col-span-5 flex justify-center relative w-full h-48 md:h-64">
                    <Image 
                      src="/images/ui-icon.png"
                      alt={currentCategory.title}
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>

                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>

      <section className="w-full bg-white pb-20 relative overflow-hidden" id="cara">
        <div className="relative w-full pointer-events-none select-none z-10">
          <Image 
            src="/images/cloud.png" 
            alt="Cloud decoration" 
            width={1920}
            height={400}
            className="w-full h-auto object-cover object-top"
            priority
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-20 px-6 -mt-6 sm:-mt-10 md:-mt-16 lg:-mt-20">
          <div className="w-full relative h-24 mb-6 overflow-hidden flex items-center z-30">
            <div className="absolute animate-[marquee_18s_linear_infinite] whitespace-nowrap">
              <Image 
                src="/images/plane.png" 
                alt="Flying plane" 
                width={350}
                height={120}
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* Judul dan Deskripsi */}
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Cara Memulai Perjalanan Belajarmu
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-16">
            Mulai belajar hanya dalam beberapa langkah sederhana. Pilih bidang yang kamu minati, 
            ikuti materi, kerjakan project, dan tingkatkan skill teknologi secara bertahap.
          </p>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 items-start">
            <div className="hidden lg:block absolute top-[3.5rem] left-14 right-14 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 z-0" />
            <div className="flex flex-col items-center relative group">
              <div className="relative mb-5 z-10">
                <span className="absolute -top-2 -left-2 w-7 h-7 bg-[#EAB308] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
                  1
                </span>
                <div className="w-28 h-28 bg-[#6B7CE6] rounded-3xl flex items-center justify-center p-5 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/dokumen.png" 
                    alt="Pilih Bidang" 
                    width={70} 
                    height={70} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Pilih Bidang</h3>
              <p className="text-xs text-slate-500 max-w-[210px] leading-relaxed">
                Pilih bidang teknologi yang ingin kamu pelajari sesuai minat, mulai dari UI/UX Design, Frontend, Backend, hingga Cyber Security.
              </p>
            </div>

            <div className="flex flex-col items-center relative group">
              <div className="relative mb-5 z-10">
                <span className="absolute -top-2 -left-2 w-7 h-7 bg-[#EAB308] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
                  2
                </span>
                <div className="w-28 h-28 bg-[#6B7CE6] rounded-3xl flex items-center justify-center p-5 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/book.png" 
                    alt="Pelajari Materi" 
                    width={70} 
                    height={70} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Pelajari Materi</h3>
              <p className="text-xs text-slate-500 max-w-[210px] leading-relaxed">
                Akses materi pembelajaran yang telah disusun secara bertahap agar proses belajar lebih mudah dipahami.
              </p>
            </div>

            <div className="flex flex-col items-center relative group">
              <div className="relative mb-5 z-10">
                <span className="absolute -top-2 -left-2 w-7 h-7 bg-[#EAB308] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
                  3
                </span>
                <div className="w-28 h-28 bg-[#6B7CE6] rounded-3xl flex items-center justify-center p-5 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/quiz.png" 
                    alt="Kerjakan Quiz" 
                    width={70} 
                    height={70} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Kerjakan Quiz</h3>
              <p className="text-xs text-slate-500 max-w-[210px] leading-relaxed">
                Uji pemahamanmu melalui quiz interaktif untuk mengukur perkembangan belajar.
              </p>
            </div>

            <div className="flex flex-col items-center relative group">
              <div className="relative mb-5 z-10">
                <span className="absolute -top-2 -left-2 w-7 h-7 bg-[#EAB308] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
                  4
                </span>
                <div className="w-28 h-28 bg-[#6B7CE6] rounded-3xl flex items-center justify-center p-5 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/scroll.png" 
                    alt="Selesai Belajar" 
                    width={70} 
                    height={70} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Selesai Belajar</h3>
              <p className="text-xs text-slate-500 max-w-[210px] leading-relaxed">
                Selesaikan seluruh materi sesuai learning path dan lanjutkan ke topik berikutnya untuk terus meningkatkan kemampuanmu.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="w-full bg-white" id="faq">
        <div className="w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[80px] md:h-[140px]"
          >
            <path
              d="M0,84 C38.3,88 76.6,92 114.9,97 C153.2,101 191.5,104 229.8,107 C268.1,110 306.4,112 344.7,114 C383,116 421.3,117 459.6,117 C497.9,116 536.2,115 574.5,112 C612.8,109 651.1,105 689.4,99 C727.7,91 766,82 804.3,72 C842.6,62 880.9,53 919.1,45 C957.4,39 995.7,33 1034,30 C1072.3,27 1110.6,25 1148.9,25 C1161.7,25 1178.7,25 1200,25 L1200,120 L0,120 Z"
              fill="#232F8E"
            />
          </svg>
        </div>

        <div className="w-full bg-gradient-to-b from-[#232F8E] from-0% via-[#5562AD] via-[35%] to-[#5562AD] to-100% pb-32 pt-16 px-4 md:px-24 -mt-1">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-sans">
              Frequently Asked Question
            </h2>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between text-left p-6 text-white font-medium text-sm md:text-base focus:outline-none select-none hover:bg-white/5 transition-colors"
                  >
                    <span className="opacity-95">{faq.question}</span>
                    <span className="text-xl font-light ml-4 w-6 text-right">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[500px] border-t border-white/10' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-white/80 text-xs md:text-sm font-normal leading-relaxed bg-white/5">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

        <footer className="w-full bg-[#05012C] text-slate-400 text-sm font-normal pt-16 pb-8 px-6 md:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16">
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5D5FEF] flex items-center justify-center text-white text-lg">
                  🎓
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">LearningTogether</h3>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-bold">Grow Your Skills</span>
                </div>
              </div>
              
              <p className="leading-relaxed text-slate-400/80 mt-2">
                201 S. Grand Ave., 1st Floor<br />
                New York City, NY 28020
              </p>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-white font-bold text-base">+123 88 9900 456</span>
                <span className="text-slate-400/80">info@gmail.com</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-2 relative">Useful Links</h4>
              <div className="w-6 h-[2px] bg-[#5D5FEF] mb-6" />
              <ul className="flex flex-col gap-3.5 text-slate-400/80">
                <li><a href="#" className="hover:text-white transition-colors">Our values</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our advisory board</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a partner</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Work at Future Learn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quizlet Plus</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-2 relative">Our Company</h4>
              <div className="w-6 h-[2px] bg-[#5D5FEF] mb-6" />
              <ul className="flex flex-col gap-3.5 text-slate-400/80">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become Teacher</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instructor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-2 relative">Newsletter SignUp!</h4>
              <div className="w-6 h-[2px] bg-[#5D5FEF] mb-6" />
              <p className="text-slate-400/80 mb-5 leading-relaxed">
                Get the latest UniCamp news delivered to you inbox
              </p>
              
              <div className="flex w-full rounded-xl overflow-hidden bg-[#161240] p-1 border border-slate-800/50 mb-6 focus-within:border-[#5D5FEF]/50 transition-colors">
                <input 
                  type="email" 
                  placeholder="Type your E-mail" 
                  className="bg-transparent px-4 py-2 w-full text-white placeholder-slate-500 focus:outline-none text-sm"
                />
                <button className="bg-[#FFC633] hover:bg-[#e6b22e] text-slate-950 font-bold text-sm px-5 py-2 rounded-lg transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-slate-400">Follow Us:</span>
                <div className="flex items-center gap-4 text-white">
                  <a href="#" className="hover:text-[#5D5FEF] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3l.5-3H13V6c0-.5.5-1 1-1h2V2h-3a4 4 0 00-4 4v2z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#5D5FEF] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.6a10 10 0 01-2.9.7 5 5 0 002.2-2.7c-1 .6-2 1-3.1 1.2a5 5 0 00-8.4 4.5A14 14 0 011.6 3.2 5 5 0 003.2 10a5 5 0 01-2.3-.6v.1a5 5 0 004 4.9c-.4.1-.9.1-1.3.1l-1.1-.1a5 5 0 004.7 3.5A10 10 0 010 19.5a14 14 0 007.6 2.2c9.1 0 14-7.6 14-14v-.6A10 10 0 0024 4.6z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#5D5FEF] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.06 11.13a10.87 10.87 0 0010.5 11.23h.12a11 11 0 009.6-5.5 10.2 10.2 0 001.2-5c0-4.4-3-8.2-7.2-9a11 11 0 00-11 5.4A11 11 0 000 11c0 .04.02.09.06.13zm2.18-3.41a8.7 8.7 0 0115.15-2.2 8.5 8.5 0 01-1.4 11 8.8 8.8 0 01-11.8.4 8.7 8.7 0 01-2-9.2z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#5D5FEF] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.05 1.8.25 2.2.4a4 4 0 012.3 2.3c.15.4.35 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.05 1.2-.25 1.8-.4 2.2a4 4 0 01-2.3 2.3c-.4.15-1 .35-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.05-1.8-.25-2.2-.4a4 4 0 01-2.3-2.3c-.15-.4-.35-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.05-1.2.25-1.8.4-2.2a4 4 0 012.3-2.3c.4-.15 1-.35 2.2-.4 1.3-.1 1.7-.1 4.9-.1M12 0C8.7 0 8.3 0 7 .1 5.8.17 4.9.36 4.2.64a6.2 6.2 0 00-4 4C0 5.4.05 6.2.05 7.5c0 3.3 0 3.7.1 5a8.4 8.4 0 00.5 3.3 6.2 6.2 0 004 4c.7.28 1.6.47 2.8.52 1.3.05 1.7.05 5 .05s3.7 0 5-.1c1.2-.05 2.1-.24 2.8-.52a6.2 6.2 0 004-4c.28-.7.47-1.6.52-2.8.05-1.3.05-1.7.05-5s0-3.7-.1-5a8.4 8.4 0 00-.5-3.3 6.2 6.2 0 00-4-4c-.7-.28-1.6-.47-2.8-.52C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#5D5FEF] transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-12s0-3.9-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="w-full h-[1px] bg-slate-800/40 mb-6" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>&copy; 2025 learningtogether.com. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Term of Use</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
    </main>
  );
}

function OnboardingEntry({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="onboarding-entry" aria-label="New user onboarding">
      <div>
        <span>New User Flow</span>
        <h2>Pilih bidang, lalu tentukan mau join team atau buat team sendiri.</h2>
        <p>
          Alur ini menyimpan profil skill ke Supabase, membuka daftar team yang
          sedang forming, atau membawa kamu ke form create team.
        </p>
      </div>
      <div className="onboarding-actions">
        <a className="primary-action" href="/onboarding">
          <GraduationCap size={17} />
          {isSignedIn ? "Mulai Onboarding" : "Login & Onboarding"}
        </a>
        <a className="secondary-action" href="/teams">
          <UsersRound size={17} />
          Join Team
        </a>
        <a className="secondary-action" href="/teams/new">
          <Plus size={17} />
          Create Team
        </a>
      </div>
    </section>
  );
}

function Header({
  displayName,
  isSignedIn
}: {
  displayName: string;
  isSignedIn: boolean;
}) {
  const [activeNav, setActiveNav] = useState("Home");

  const navItems = [
    { name: "Beranda", href: "#home" },
    { name: "Bidang", href: "#bidang" },
    { name: "Cara Kerja", href: "#cara" },
    { name: "FAQ", href: "#faq" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="w-full h-16 bg-[#FCF8FA] border-b border-gray-100 target-navbar">
      <div className="mx-auto max-w-[1180px] w-full h-full flex items-center justify-between px-6">
        <a className="flex items-center" href="#home">
          <Image 
            src="/images/learntogether.png"
            alt="LearnTogether Logo" 
            width={200} 
            height={40} 
            loading="eager"
          />
        </a>

        <nav className="hidden md:flex items-center gap-10 text-md font-medium text-gray-600 h-full">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveNav(item.name)} // Set menu aktif saat diklik
                className={`flex items-center h-8 transition-colors duration-200 hover:text-black relative ${
                  isActive 
                    ? "text-[#5562AD] border-b-2 border-[#5562AD] font-semibold" 
                    : "text-gray-600 border-b-2 border-transparent"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <UserButton />
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline">{displayName}</span>
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-all whitespace-nowrap">
                Masuk
              </button>
            </SignInButton>
          )}
        </div>

      </div>
    </header>
  );
}

function LeftRail() {
  return (
    <aside className="left-rail">
      <div className="asterisk">*</div>
      <div className="rail-kicker">
        <span>Live Cohort</span>
        <strong>Project-based learning</strong>
      </div>
      <div className="rail-stats" aria-label="Learning cohort stats">
        <div>
          <strong>1.2k</strong>
          <span>Mentors</span>
        </div>
        <div>
          <strong>5</strong>
          <span>Tracks</span>
        </div>
      </div>
      <div className="learner-count">
        <span className="profile-dot" />
        <strong>/01</strong>
      </div>
      <div className="rail-controls">
        <button aria-label="Previous learner">
          <ChevronLeft size={22} />
        </button>
        <button aria-label="Next learner">
          <ChevronRight size={22} />
        </button>
      </div>
    </aside>
  );
}

function RightRail() {
  return (
    <aside className="right-rail" aria-label="Social links">
      <GraduationCap size={20} />
      <Linkedin size={18} />
      <strong>Be</strong>
      <span className="social-box">IG</span>
    </aside>
  );
}

function HeroMosaic() {
  return (
    <div className="hero-mosaic" aria-label="Collaborative learning visual">
      <div className="mosaic-cell soft top-left">
        <Sparkles size={42} />
      </div>
      <div className="mosaic-cell portrait portrait-top" />
      <div className="mosaic-cell soft top-right">
        <GraduationCap size={44} />
      </div>
      <div className="mosaic-cell soft middle-left">
        <p>Your Journey to Excellence Begins Here.</p>
        <span>*</span>
      </div>
      <div className="mosaic-cell portrait portrait-main" />
      <div className="mosaic-cell soft middle-right">
        <p>Education Beyond Boundaries</p>
        <SignInButton mode="modal">
          <button>Login</button>
        </SignInButton>
      </div>
      <div className="mosaic-cell portrait portrait-bottom" />
    </div>
  );
}

function DashboardSummary({
  averageScore,
  dominantSkill,
  progressPercent
}: {
  averageScore: number;
  dominantSkill: string;
  progressPercent: number;
}) {
  const cards = [
    {
      label: "Skill readiness",
      value: `${averageScore}%`,
      note: `${dominantSkill} menjadi kekuatan utama`,
      icon: BarChart3
    },
    {
      label: "Team match",
      value: "92%",
      note: "Komposisi role saling melengkapi",
      icon: UsersRound
    },
    {
      label: "Project progress",
      value: `${progressPercent}%`,
      note: "Mini E-Learning Dashboard",
      icon: CheckCircle2
    },
    {
      label: "AI feedback",
      value: "4",
      note: "Rekomendasi siap ditindaklanjuti",
      icon: Sparkles
    }
  ];

  return (
    <section className="summary-grid" aria-label="Dashboard summary">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="summary-card" key={card.label}>
            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.note}</p>
            </div>
            <Icon size={22} />
          </article>
        );
      })}
    </section>
  );
}

function AssessmentPanel({
  scores,
  onScoreChange
}: {
  scores: Record<string, number>;
  onScoreChange: (skill: string, value: number) => void;
}) {
  return (
    <section className="app-panel" id="assessment">
      <PanelTitle
        icon={<BarChart3 size={18} />}
        eyebrow="Skill Assessment"
        title="Profil skill awal"
        action="Auto-save"
      />
      <div className="skill-list">
        {skills.map((skill) => (
          <label className="skill-row" key={skill}>
            <span>
              <strong>{skill}</strong>
              <em>{scores[skill]}%</em>
            </span>
            <input
              aria-label={`${skill} score`}
              max="100"
              min="0"
              type="range"
              value={scores[skill]}
              onChange={(event) => onScoreChange(skill, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function MatchingPanel({ dominantSkill }: { dominantSkill: string }) {
  return (
    <section className="app-panel">
      <PanelTitle
        icon={<Sparkles size={18} />}
        eyebrow="AI Team Matching"
        title="Rekomendasi Team Orion"
        action="92% fit"
      />
      <div className="member-list">
        {memberData.map((member) => (
          <article className="member-row" key={member.name}>
            <div className="member-avatar">{member.name.slice(0, 1)}</div>
            <div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
              <p>{member.reason}</p>
            </div>
            <em>{member.score}</em>
          </article>
        ))}
      </div>
      <div className="ai-note">
        <Sparkles size={18} />
        Tim ini menempatkan kamu sebagai penggerak {dominantSkill.toLowerCase()} dan
        menutup kelemahan lewat backend, UI/UX, serta project management.
      </div>
    </section>
  );
}

function TeamRoomPanel() {
  return (
    <section className="app-panel team-room" id="team-room">
      <PanelTitle
        icon={<UsersRound size={18} />}
        eyebrow="Team Room"
        title="Mini E-Learning Dashboard"
        action="14 day sprint"
      />
      <div className="team-room-grid">
        <div>
          <h3>Project brief</h3>
          <p>
            Bangun dashboard e-learning sederhana dengan login, daftar kelas, detail
            kelas, progress belajar, task board, dan portfolio otomatis.
          </p>
          <div className="deliverables">
            {["Responsive web", "Task evidence", "AI feedback", "Portfolio"].map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="timeline-box">
          <div>
            <Clock3 size={18} />
            <span>Week 1</span>
            <strong>Foundation + dashboard</strong>
          </div>
          <div>
            <Clock3 size={18} />
            <span>Week 2</span>
            <strong>Feedback + portfolio review</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskBoard({
  tasks,
  onMoveTask
}: {
  tasks: Task[];
  onMoveTask: (taskId: number, direction: 1 | -1) => void;
}) {
  return (
    <section className="app-panel" id="task-board">
      <PanelTitle
        icon={<KanbanSquare size={18} />}
        eyebrow="Task Board"
        title="Pembagian tugas berdasarkan role"
        action={`${tasks.length} tasks`}
      />
      <div className="board-grid">
        {statuses.map((status) => (
          <div className="task-column" key={status}>
            <header>
              <strong>{status}</strong>
              <span>{tasks.filter((task) => task.status === status).length}</span>
            </header>
            {tasks.filter((task) => task.status === status).length === 0 ? (
              <div className="empty-task">Belum ada task di tahap ini.</div>
            ) : (
              tasks
                .filter((task) => task.status === status)
                .map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="task-topline">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span>{task.role}</span>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.assignee}</p>
                  <div className="task-actions">
                    <button
                      aria-label={`Move ${task.title} left`}
                      disabled={status === "To Do"}
                      onClick={() => onMoveTask(task.id, -1)}
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      aria-label={`Move ${task.title} right`}
                      disabled={status === "Done"}
                      onClick={() => onMoveTask(task.id, 1)}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </article>
                ))
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressPanel({
  progress,
  blocker,
  nextPlan,
  feedback,
  onProgress,
  onBlocker,
  onNextPlan,
  feedbackMeta,
  isLoading,
  isSignedIn,
  onGenerateFeedback
}: {
  progress: string;
  blocker: string;
  nextPlan: string;
  feedback: string;
  onProgress: (value: string) => void;
  onBlocker: (value: string) => void;
  onNextPlan: (value: string) => void;
  feedbackMeta: string;
  isLoading: boolean;
  isSignedIn: boolean;
  onGenerateFeedback: () => void;
}) {
  return (
    <section className="app-panel">
      <PanelTitle
        icon={<Send size={18} />}
        eyebrow="Progress Update"
        title="Laporan harian siswa"
        action="AI ready"
      />
      <div className="form-stack">
        <label>
          Progress hari ini
          <textarea value={progress} onChange={(event) => onProgress(event.target.value)} />
        </label>
        <label>
          Kendala
          <textarea value={blocker} onChange={(event) => onBlocker(event.target.value)} />
        </label>
        <label>
          Rencana berikutnya
          <textarea value={nextPlan} onChange={(event) => onNextPlan(event.target.value)} />
        </label>
      </div>
      <button
        className="generate-feedback-btn"
        disabled={isLoading}
        onClick={onGenerateFeedback}
      >
        <Sparkles size={16} />
        {isLoading
          ? "Generating..."
          : isSignedIn
            ? "Generate feedback"
            : "Login untuk feedback"}
      </button>
      <div className="feedback-box">
        <Sparkles size={18} />
        <div>
          <strong>{feedbackMeta}</strong>
          <p>{feedback}</p>
        </div>
      </div>
    </section>
  );
}

function PortfolioPanel({
  doneCount,
  progressPercent,
  dominantSkill
}: {
  doneCount: number;
  progressPercent: number;
  dominantSkill: string;
}) {
  return (
    <section className="app-panel" id="portfolio">
      <PanelTitle
        icon={<Trophy size={18} />}
        eyebrow="Portfolio Otomatis"
        title="Kontribusi yang tercatat"
        action={`${progressPercent}%`}
      />
      <div className="portfolio-preview">
        <div className="portfolio-cover">
          <FileText size={30} />
          <span>Mini E-Learning Dashboard</span>
        </div>
        <div className="portfolio-details">
          <p>
            Role utama: <strong>{dominantSkill} Contributor</strong>
          </p>
          <p>
            Task selesai: <strong>{doneCount} task</strong>
          </p>
          <p>
            Skill terbukti: <strong>React, UI flow, teamwork, documentation</strong>
          </p>
        </div>
      </div>
      <div className="portfolio-actions">
        <button>
          <Upload size={16} />
          Add evidence
        </button>
        <button>
          <ShieldCheck size={16} />
          Submit review
        </button>
      </div>
    </section>
  );
}

function PanelTitle({
  icon,
  eyebrow,
  title,
  action
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <header className="panel-title">
      <div className="panel-icon">{icon}</div>
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <em>{action}</em>
    </header>
  );
}
