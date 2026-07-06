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
  ChevronDown,
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
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";

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
      image: '/images/frontend-icon.png'
    },
    {
      id: 'backend',
      title: 'Backend Dev',
      icon: Database,
      contentTitle: 'Jelajahi Dunia Backend Dev',
      description: 'Backend Dev mengelola logika di balik layar, database, dan server aplikasi. Kamu akan belajar membangun API yang aman, arsitektur database, dan memastikan performa sistem berjalan lancar dan optimal.',
      image: '/images/backend-icon.png'
    },
    {
      id: 'mobile',
      title: 'Mobile Developer',
      icon: Smartphone,
      contentTitle: 'Jelajahi Dunia Mobile Dev',
      description: 'Mobile Dev berfokus pada pengembangan aplikasi untuk perangkat smartphone (Android & iOS). Pelajari bahasa dan framework populer untuk menciptakan aplikasi mobile yang cepat dan fungsional.',
      image: '/images/mobile-icon.png'
    },
    {
      id: 'datascience',
      title: 'Data Science',
      icon: PieChart,
      contentTitle: 'Jelajahi Dunia Data Science',
      description: 'Data Science adalah ilmu mengolah data mentah menjadi wawasan berharga menggunakan statistik dan machine learning. Pelajari cara menganalisis data besar untuk membantu pengambilan keputusan strategis.',
      image: '/images/data-science-icon.png'
    },
    {
      id: 'cybersecurity',
      title: 'Cyber Security',
      icon: Shield,
      contentTitle: 'Jelajahi Dunia Cyber Security',
      description: 'Cyber Security berfokus pada perlindungan sistem, jaringan, dan data dari serangan digital. Pelajari teknik pengamanan data, analisis celah keamanan, dan mitigasi risiko ancaman siber.',
      image: '/images/security-icon.png'
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
    <main className="font-sans antialiased bg-[#FFF5F1] text-slate-900 selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden" id="home">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-300/30 blur-[120px] mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-300/30 blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-amber-200/30 blur-[120px] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]"></div>
        </div>

        <div className="absolute top-0 w-full z-50">
          <Header displayName={displayName} isSignedIn={Boolean(isSignedIn)} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-16 md:py-32 flex flex-col md:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left md:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-semibold text-sm shadow-sm backdrop-blur-md">
              <Sparkles size={16} />
              <span>Platform E-Learning Kolaboratif #1</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Saatnya mulai <br/>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-emerald-600">
                Perjalanan Belajarmu
                <motion.svg 
                  className="absolute w-full h-[30px] -bottom-2 left-0" 
                  viewBox="0 0 300 20" 
                  preserveAspectRatio="none"
                >
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                    d="M0,10 Q150,20 300,5" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
              Pelajari UI/UX, Web Development, Cyber Security, AI, dan bidang teknologi lainnya melalui kurikulum interaktif berbasis proyek nyata.
            </p>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-wrap items-center pt-4"
            >
              <a 
                className="group relative inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-full overflow-hidden shadow-xl shadow-orange-900/20 transition-all hover:shadow-orange-900/40 hover:bg-slate-800" 
                href="/onboarding"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="text-lg font-bold relative z-10">
                  Mulai Belajar Sekarang
                </span>
                <div className="flex items-center justify-center rounded-full bg-white/20 p-2 relative z-10 group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </a>
            </motion.div>  
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center md:w-1/2 w-full mt-12 md:mt-0"
          >
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Animated decorative ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-orange-200/50 scale-[1.15] z-0 pointer-events-none"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-orange-100/50 scale-[1.1] z-0 pointer-events-none"
              ></motion.div>

              {/* Soft glowing blob behind the image for elegance */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-300/30 to-emerald-300/30 blur-[80px] rounded-full scale-90 pointer-events-none"></div>
              
              <motion.img 
                animate={{ y: [-12, 12, -12] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                src="/images/orang-homepage.png" 
                alt="Learning Illustration" 
                className="w-[95%] h-[95%] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />

              {/* Floating Badge 1 - Top Left */}
              <motion.div 
                animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }} 
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} 
                className="absolute top-[15%] -left-[5%] bg-white/80 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-orange-900/5 border border-white z-20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Top Mentor</p>
                  <p className="text-[10px] font-medium text-slate-500">4.9/5 Rating</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Bottom Left */}
              <motion.div 
                animate={{ y: [15, -15, 15], x: [5, -5, 5] }} 
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }} 
                className="absolute bottom-[20%] -left-[10%] bg-white p-4 rounded-3xl shadow-2xl shadow-orange-900/10 z-20 flex items-end gap-1.5 h-[80px] border border-slate-50"
              >
                <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2.5 bg-orange-500 rounded-full"></motion.div>
                <motion.div animate={{ height: ["70%", "30%", "70%"] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-2.5 bg-emerald-500 rounded-full"></motion.div>
                <motion.div animate={{ height: ["30%", "100%", "30%"] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-2.5 bg-amber-500 rounded-full"></motion.div>
                <motion.div animate={{ height: ["100%", "50%", "100%"] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-2.5 bg-emerald-500 rounded-full"></motion.div>
              </motion.div>

              {/* Floating Badge 3 - Middle Right */}
              <motion.div 
                animate={{ y: [-15, 15, -15] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} 
                className="absolute top-[40%] -right-[12%] bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-2xl shadow-orange-900/10 border border-white z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">50K+ Active</span>
                </div>
                <div className="flex -space-x-3">
                   <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white shadow-sm"></div>
                   <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white shadow-sm"></div>
                   <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white shadow-sm"></div>
                   <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">+99</div>
                </div>
              </motion.div>
              
              {/* Little floating orbs */}
              <motion.div animate={{ y: [-20, 20, -20], x: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[10%] right-[10%] w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 z-20"></motion.div>
              <motion.div animate={{ y: [20, -20, 20], x: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-[10%] right-[20%] w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 z-20"></motion.div>
              
            </div>
          </motion.div>
        </div>
        
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="relative w-full bg-white py-24 rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]" id="dashboard">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 md:px-12 w-full" id="bidang"
        >
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:w-5/12 flex justify-center"
            >
              <div className="relative w-full max-w-sm aspect-square">
                <div className="absolute inset-0 bg-orange-500/10 rounded-[3rem] rotate-6 scale-105"></div>
                <div className="absolute inset-0 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex items-center justify-center p-8 z-10">
                  <Image 
                    src="/images/logo.png"
                    alt="Logo LearningTogether" 
                    width={300}
                    height={300}
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
            
            <div className="md:w-7/12 space-y-8">
              <div className="inline-block px-4 py-1.5 bg-orange-50 rounded-full">
                <p className="text-orange-600 font-bold text-sm tracking-wide uppercase">Tentang Kami</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
                Revolusi Cara Kamu <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-emerald-600">Belajar Teknologi</span>
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                LearningTogether bukan sekadar platform e-learning biasa. Kami menggabungkan 
                materi berkualitas dengan <strong className="text-slate-900">kolaborasi tim berbasis AI</strong>. 
                Temukan partner belajarmu, kerjakan proyek nyata, dan bangun portofolio 
                yang diakui industri.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "Materi Terstruktur", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
                  { title: "AI Team Matching", icon: UsersRound, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { title: "Project Based", icon: KanbanSquare, color: "text-amber-500", bg: "bg-amber-50" },
                  { title: "Auto Portfolio", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* --- CATEGORIES TABS SECTION --- */}
      <section className="w-full bg-slate-50 py-24 relative overflow-hidden" id="karir">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-orange-700 text-sm font-bold tracking-widest uppercase mb-4">
              <span>Eksplorasi</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Pilih Jalur <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-emerald-500">Karirmu</span></h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Berbagai bidang spesialisasi yang dirancang khusus mengikuti standar industri teknologi masa kini.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300
                    ${isActive ? 'text-white shadow-lg shadow-orange-200 bg-orange-600 scale-105' : 'text-slate-600 bg-white hover:bg-slate-100 hover:scale-105 border border-slate-200'}`}
                >
                  <IconComponent size={18} className={isActive ? 'text-orange-100' : 'text-slate-400'} />
                  {cat.title}
                </button>
              );
            })}
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            {/* The Main Elegant Card */}
            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-100 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              
              {/* Soft background accents inside the card */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-50 via-white to-white rounded-full blur-3xl opacity-70 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
                
                {/* Content Section */}
                <div className="w-full md:w-1/2 space-y-8 text-left order-2 md:order-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl text-orange-700 text-sm font-bold tracking-wide shadow-sm border border-orange-100/50">
                    <currentCategory.icon size={18} />
                    <span>Jalur Spesialisasi</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.15]">
                    {currentCategory.contentTitle}
                  </h3>
                  
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {currentCategory.description}
                  </p>
                  
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button className="group flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-orange-200 hover:-translate-y-1">
                      Lihat Silabus <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="relative w-full max-w-[340px] aspect-square rounded-[2.5rem] overflow-hidden bg-[#0F172A] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-white group"
                  >
                    <Image 
                      src={currentCategory.image}
                      alt={currentCategory.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none rounded-[2rem]"></div>
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CARA MEMULAI SECTION --- */}
      <section className="w-full bg-slate-50 pt-28 pb-24 relative overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 z-20" id="cara">

        <div className="max-w-7xl mx-auto px-6 text-center relative z-20 pt-10">
          
          {/* Flying Plane Marquee Improved (Right to Left) */}
          <div className="w-full relative h-32 mb-4 overflow-hidden flex items-center z-30 opacity-90 pointer-events-none">
            <motion.div 
              initial={{ x: "100vw" }}
              animate={{ x: "-50vw", y: [-15, 15, -15] }}
              transition={{ 
                x: { repeat: Infinity, duration: 25, ease: "linear" },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
              }}
              className="absolute left-0"
            >
              <Image 
                src="/images/plane.png" 
                alt="Flying plane" 
                width={250}
                height={120}
                className="h-20 md:h-24 w-auto object-contain drop-shadow-xl"
              />
            </motion.div>
          </div>

          <div className="inline-block px-4 py-1.5 bg-amber-100 rounded-full mb-6">
            <p className="text-amber-700 font-bold text-sm tracking-wide uppercase">Cara Kerja</p>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Memulai Sangatlah Mudah
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-20"
          >
            Ikuti 4 langkah sederhana ini untuk mentransformasi karirmu di bidang teknologi. Mulai dari belajar dasar hingga portofolio siap kerja.
          </motion.p>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 items-start">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[4rem] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
            
            {[
              {
                step: 1,
                title: "Pilih Bidang",
                desc: "Pilih bidang teknologi sesuai minatmu, dari UI/UX hingga Cyber Security.",
                img: "/images/dokumen.png",
                delay: 0.1
              },
              {
                step: 2,
                title: "Pelajari Materi",
                desc: "Akses materi terstruktur dan selesaikan tantangan harian.",
                img: "/images/book.png",
                delay: 0.3
              },
              {
                step: 3,
                title: "Bangun Tim & Proyek",
                desc: "AI akan mencocokkanmu dengan tim untuk membuat proyek nyata.",
                img: "/images/quiz.png",
                delay: 0.5
              },
              {
                step: 4,
                title: "Dapatkan Portofolio",
                desc: "Sistem otomatis merangkum kontribusimu menjadi portofolio profesional.",
                img: "/images/scroll.png",
                delay: 0.7
              }
            ].map((item) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="flex flex-col items-center relative group z-10"
              >
                <div className="relative mb-8">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-20 group-hover:bg-orange-600 transition-colors">
                    {item.step}
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }} 
                    className="w-32 h-32 bg-white rounded-full border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center p-6 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image 
                      src={item.img} 
                      alt={item.title} 
                      width={80} 
                      height={80} 
                      className="w-full h-full object-contain relative z-10 drop-shadow-md" 
                    />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="w-full bg-[#FFF5F1]/60 py-32 relative overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 z-20" id="faq">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-700 text-sm font-bold tracking-widest uppercase mb-4">
              <span>Bantuan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Punya Pertanyaan?
            </h2>
            <p className="text-slate-500 text-lg">Temukan jawaban untuk pertanyaan umum tentang platform kami.</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`rounded-3xl transition-all duration-300 overflow-hidden border ${isOpen ? 'bg-white border-orange-200 shadow-xl shadow-orange-900/5 scale-[1.02]' : 'bg-white/60 border-slate-200 hover:bg-white hover:border-orange-100'}`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between text-left p-6 md:p-8 focus:outline-none"
                  >
                    <span className={`font-bold text-lg md:text-xl pr-8 ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>{faq.question}</span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                      <ChevronRight className={`w-5 h-5 ${isOpen ? 'text-white transform rotate-90' : 'text-slate-500'}`} />
                    </div>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 md:p-8 pt-0 text-slate-600 text-base md:text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#2D2F3F] pt-28 pb-12 px-6 md:px-12 relative z-20 rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 overflow-hidden">
        {/* Soft abstract shapes in footer */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center bg-white p-3 rounded-2xl w-max shadow-lg">
              <Image 
                src="/images/learntogether.png"
                alt="LearnTogether Logo" 
                width={180} 
                height={36} 
              />
            </div>
            <p className="leading-relaxed text-slate-300 text-lg">
              Platform e-learning kolaboratif berbasis AI yang mengubah cara individu belajar dan membangun karir di dunia teknologi.
            </p>
            <div className="flex items-center gap-4 text-slate-300 pt-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:-translate-y-1 transition-all shadow-lg"><Linkedin size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:-translate-y-1 transition-all shadow-lg"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.6a10 10 0 01-2.9.7 5 5 0 002.2-2.7c-1 .6-2 1-3.1 1.2a5 5 0 00-8.4 4.5A14 14 0 011.6 3.2 5 5 0 003.2 10a5 5 0 01-2.3-.6v.1a5 5 0 004 4.9c-.4.1-.9.1-1.3.1l-1.1-.1a5 5 0 004.7 3.5A10 10 0 010 19.5a14 14 0 007.6 2.2c9.1 0 14-7.6 14-14v-.6A10 10 0 0024 4.6z"/></svg></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:-translate-y-1 transition-all shadow-lg"><svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-white font-bold text-xl mb-6">Program</h4>
            <ul className="flex flex-col gap-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Web Development</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Data Science</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Cyber Security</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-xl mb-6">Perusahaan</h4>
            <ul className="flex flex-col gap-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Karir</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Blog</a></li>
              <li><a href="#" className="hover:text-orange-400 hover:translate-x-1 inline-block transition-transform">Kontak</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xl mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-6 leading-relaxed font-medium">
              Dapatkan informasi terbaru mengenai kursus, beasiswa, dan event teknologi dari kami.
            </p>
            <div className="flex w-full rounded-2xl overflow-hidden bg-white/5 p-1.5 border border-white/10 focus-within:border-orange-500/50 transition-colors shadow-inner">
              <input 
                type="email" 
                placeholder="Alamat Email" 
                className="bg-transparent px-4 py-3 w-full text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
              />
              <button className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-md">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium relative z-10">
          <p>&copy; 2026 LearningTogether AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
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
        <Link className="primary-action" href="/onboarding">
          <GraduationCap size={17} />
          {isSignedIn ? "Mulai Onboarding" : "Login & Onboarding"}
        </Link>
        <Link className="secondary-action" href="/teams">
          <UsersRound size={17} />
          Join Team
        </Link>
        <Link className="secondary-action" href="/teams/new">
          <Plus size={17} />
          Create Team
        </Link>
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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl h-20 bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full z-50 transition-all duration-300">
      <div className="mx-auto w-full h-full flex items-center justify-between px-6 md:px-8">
        <a className="flex items-center" href="#home">
          <Image 
            src="/images/learntogether.png"
            alt="LearnTogether Logo" 
            width={180} 
            height={36} 
            loading="eager"
            className="drop-shadow-sm"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 h-full">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveNav(item.name)}
                className={`relative flex items-center h-full transition-colors duration-300 hover:text-orange-600 ${
                  isActive ? "text-orange-600" : "text-slate-500"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div layoutId="navIndicator" className="absolute bottom-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full"></motion.div>
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <UserButton />
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{displayName}</span>
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-orange-500 text-white text-sm font-bold px-7 py-3 rounded-full hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 transition-all whitespace-nowrap">
                Mulai Belajar
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
