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
  Lock
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
            <div className="inline-flex items-center py-1.5 text-md font-light tracking-widest text-orange-600 uppercase">
              New Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your next <br />
              <span className="relative inline-block">
                Online School
                <span className="absolute -bottom-4 left-0 w-full h-[20px] border-t-[3px] md:border-t-[4px] border-amber-400 rounded-[50%] rotate-[-2deg]"></span>
              </span>
            </h1>

            <p className="max-w-md text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Learn new skills from the comfort of your home or anywhere anytime.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                className="inline-flex items-center gap-2 rounded-full bg-[#0f9d8a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-md" 
                href="/onboarding"
              >
                Enroll Now <ArrowRight size={24} />
              </a>
              
              
              <button 
                className="inline-flex items-center gap-2 rounded-xl bg-transparent px-4 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                onClick={() => {/* handler video */}}
              >
                <div className="rounded-full p-4 bg-red-700">
                  <Play size={16} className="fill-current text-white" />
                </div>
                <span className="underline underline-offset-4">Play Video</span>
              </button>
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

      <section className="w-full bg-[#FCF8FA] py-10 px-4 md:px-24 relative overflow-hidden" id="dashboard">
        <div className="bg-[#EDF7FC] py-16 px-4 sm:px-8 rounded-[40px] md:rounded-[60px] relative overflow-hidden">
          
          {/* Dekorasi Estetik */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 text-slate-300 text-4xl font-light pointer-events-none select-none hidden md:block">
            ✦ 
          </div>
          <div className="absolute bottom-4 right-1/4 translate-x-1/2 pointer-events-none select-none hidden md:block opacity-30">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-slate-400" />
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="text-sm">✪</span> Learning Journey
            </div>

            <h2 className="text-2xl md:text-5xl font-extrabold text-[#0F1E36] mb-4 tracking-tight-2">
              Bagaimana LearningTogether Bekerja?
            </h2>
            <p className="text-xs md:text-base text-slate-500 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-normal">
              Mulai perjalanan belajarmu dalam empat langkah sederhana, mulai dari mengenali minat hingga membangun proyek nyata bersama komunitas.
            </p>

            {/* Perubahan Utama di Sini: grid-cols-2 sebagai default (HP) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100/50 flex flex-col justify-between min-h-[280px] sm:min-h-[340px] transition-transform hover:-translate-y-1 duration-300"
                >
                  <div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${step.iconBg} flex items-center justify-center mb-4 sm:mb-6`}>
                      {step.icon}
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 line-clamp-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal line-clamp-4 sm:line-clamp-none">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    {step.hasProgress ? (
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-900 mb-1.5">
                          <span>Progress</span>
                          <span>80%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full w-[80%]" />
                        </div>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="section-heading">
          <span>LearnTogether AI Workspace</span>
          <h2>Skill profile, matching, team room, feedback, and portfolio in one flow.</h2>
          <p className="integration-status">{syncStatus}</p>
        </div>

        <OnboardingEntry isSignedIn={Boolean(isSignedIn)} />

        <div className="workspace-shell">
          <aside className="workspace-nav" aria-label="App navigation">
            <div className="workspace-brand">
              <div className="brand-mark">L</div>
              <div>
                <strong>Team Orion</strong>
                <span>Web Development Sprint</span>
              </div>
            </div>
            <a href="#dashboard" className="active">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="#assessment">
              <BarChart3 size={18} />
              Assessment
            </a>
            <a href="#team-room">
              <UsersRound size={18} />
              Team Room
            </a>
            <a href="#task-board">
              <KanbanSquare size={18} />
              Task Board
            </a>
            <a href="#portfolio">
              <Trophy size={18} />
              Portfolio
            </a>
            <a href="/onboarding">
              <GraduationCap size={18} />
              Onboarding
            </a>
            <a href="/teams">
              <UsersRound size={18} />
              Teams
            </a>
          </aside>

          <div className="workspace-content">
            <DashboardSummary
              averageScore={averageScore}
              dominantSkill={dominantSkill}
              progressPercent={progressPercent}
            />

            <div className="grid-two">
              <AssessmentPanel scores={scores} onScoreChange={updateScore} />
              <MatchingPanel dominantSkill={dominantSkill} />
            </div>

            <TeamRoomPanel />
            <TaskBoard tasks={tasks} onMoveTask={moveTask} />

            <div className="grid-two">
              <ProgressPanel
                progress={progress}
                blocker={blocker}
                nextPlan={nextPlan}
                feedback={aiFeedback}
                onProgress={setProgress}
                onBlocker={setBlocker}
                onNextPlan={setNextPlan}
                feedbackMeta={feedbackMeta}
                isLoading={isFeedbackLoading}
                isSignedIn={Boolean(isSignedIn)}
                onGenerateFeedback={generateFeedback}
              />
              <PortfolioPanel
                doneCount={doneCount}
                progressPercent={progressPercent}
                dominantSkill={dominantSkill}
              />
            </div>
          </div>
        </div> */}
      </section>

      <section className="w-full bg-[#0B1528] py-10 px-4 md:px-24 relative overflow-hidden" id="leaderboard">
          <div className="w-full bg-[#0B1528] rounded-[40px] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none hidden lg:block">
              <Trophy size={240} className="text-white" />
            </div>

            <div className="lg:col-span-6 space-y-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                  Top Learners Minggu Ini
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
                  Kumpulkan XP dan raih lencana eksklusif dengan menyelesaikan tantangan mingguan kami.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#13223C] border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-amber-400 font-bold text-lg w-6">#1</span>
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                      alt="Rakha Sayiddina Al Habsy Waiz Rifqi Sanhenry Agustian Khairunnisa" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">Rakha Sayiddina Al Habsy Waiz Rifqi Sanhenry Agustian Khairunnisa</h4>
                      <p className="text-xs text-slate-400">Frontend Architect</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-extrabold text-sm md:text-base">12,450 XP</div>
                    <span className="inline-block bg-[#0A362A] text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                      Master
                    </span>
                  </div>
                </div>

                <div className="bg-[#13223C] border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-bold text-lg w-6">#2</span>
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                      alt="King Nasir" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">King Nasir</h4>
                      <p className="text-xs text-slate-400">UI Design Specialist</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-extrabold text-sm md:text-base">11,200 XP</div>
                    <span className="inline-block bg-[#1E293B] text-[#38BDF8] text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                      Elite
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#13223C] border border-slate-800/60 rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl">
              <div className="w-20 h-20 bg-amber-400 text-[#0B1528] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-400/10">
                <Medal className="w-10 h-10" strokeWidth={2.5} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Koleksi Lencana</h3>
              <p className="text-slate-400 text-xs md:text-sm max-w-xs mb-8">
                Selesaikan kursus untuk membuka koleksi ini
              </p>

              <div className="grid grid-cols-3 gap-8 md:gap-12 mb-8 w-full max-w-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#1A2E4C] border border-slate-700/50 flex items-center justify-center opacity-40">
                    <Lock className="w-5 h-5 text-slate-300" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Sprint</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-[#0B1528] flex items-center justify-center shadow-md shadow-amber-400/20">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Top 5%</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#1A2E4C] border border-slate-700/50 flex items-center justify-center opacity-40">
                    <Flame className="w-5 h-5 text-slate-300" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Streak</span>
                </div>
              </div>

              <button className="w-full py-3 px-6 rounded-xl border border-slate-700 bg-[#1A2E4C] text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors duration-200">
                Lihat Semua Reward
              </button>
            </div>
          </div>
        </section>

        <section className="w-full bg-white py-24 px-4 md:px-24" id="testimony">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1E36] mb-3 tracking-tight">
              Apa Kata Pengguna
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-normal">
              Cerita sukses dari mereka yang telah bergabung.
            </p>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 mb-16">
            
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-100 border border-slate-50 w-full md:w-[32%] min-h-[280px] flex flex-col justify-between md:scale-90 md:translate-x-4 z-10">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" 
                    alt="Maya Pratiwi" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Maya Pratiwi</h4>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Student
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5 mb-4 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-slate-600 text-sm italic font-medium leading-relaxed">
                  &ldquo;Materi sangat mudah dipahami bahkan untuk pemula seperti saya.&rdquo;
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                {['HTML', 'CSS', 'JS'].map((tech) => (
                  <span key={tech} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0F172A] text-white rounded-[40px] p-10 shadow-2xl shadow-slate-900/20 w-full md:w-[36%] min-h-[320px] flex flex-col justify-between relative z-20 md:scale-105">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
                    alt="Robby Hermawan" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="font-bold text-white text-lg">Robby Hermawan</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-[#00A884] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Top Mentor
                      </span>
                      <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                        100+ Session
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                  &ldquo;Melihat antusiasme para pelajar di sini membuat saya semakin semangat berbagi ilmu. Ekosistem belajarnya sangat mendukung pertumbuhan karir.&rdquo;
                </p>
              </div>
              <div className="w-full h-[3px] bg-gradient-to-r from-amber-400 to-transparent rounded-full mt-6" />
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-100 border border-slate-50 w-full md:w-[32%] min-h-[280px] flex flex-col justify-between md:scale-90 md:-translate-x-4 z-10">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80" 
                    alt="Dimas Saputra" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Dimas Saputra</h4>
                    <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Alumni
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5 mb-4 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-slate-600 text-sm italic font-medium leading-relaxed">
                  &ldquo;Berkat portofolio yang saya bangun di sini, saya berhasil mendapatkan pekerjaan pertama saya.&rdquo;
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                {['React', 'Next.js'].map((tech) => (
                  <span key={tech} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-[#EDF2FE] border border-blue-200/50 rounded-full py-4 px-6 flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-2xl font-black text-blue-600 tracking-tight">5.000+</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mt-0.5">Pelajar Aktif</span>
            </div>

            <div className="bg-[#FFF7ED] border border-amber-200/50 rounded-full py-4 px-6 flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-2xl font-black text-amber-600 tracking-tight">100+</span>
              <span className="text-[10px] font-bold text-amber-500/80 tracking-wider uppercase mt-0.5">Mentor</span>
            </div>

            <div className="bg-[#E6F7F4] border border-teal-200/50 rounded-full py-4 px-6 flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-2xl font-black text-teal-600 tracking-tight">300+</span>
              <span className="text-[10px] font-bold text-teal-500 tracking-wider uppercase mt-0.5">Tim Proyek</span>
            </div>

            <div className="bg-[#FCE8F3] border border-pink-200/50 rounded-full py-4 px-6 flex flex-col items-center justify-center text-center">
              <span className="text-xl md:text-2xl font-black text-pink-600 tracking-tight">20.000+</span>
              <span className="text-[10px] font-bold text-pink-400 tracking-wider uppercase mt-0.5">XP Dibagikan</span>
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
    { name: "Home", href: "#home" },
    { name: "Trending", href: "#trending" },
    { name: "Courses", href: "#courses" },
    { name: "Teachers", href: "#teachers" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="w-full h-16 bg-[#FCF8FA] border-b border-gray-100 target-navbar">
      <div className="mx-auto max-w-[1180px] w-full h-full flex items-center justify-between px-6">
        <a className="text-3xl font-extrabold text-black tracking-tight whitespace-nowrap" href="#home">
          LearnTogether
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
                    ? "text-black border-b-2 border-black font-semibold" 
                    : "text-gray-600 border-b-2 border-transparent"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-gray-400 transition-all">
            <Search size={14} className="text-gray-400 mr-2" />
            <input 
              aria-label="Search" 
              placeholder="Search..." 
              className="bg-transparent text-sm text-black outline-none w-40 md:w-48 placeholder-gray-400"
            />
          </div>

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
