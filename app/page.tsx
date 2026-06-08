"use client";

import {
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";
import {
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
  UsersRound
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
      <section className="hero-page" id="home">
        <Header displayName={displayName} isSignedIn={Boolean(isSignedIn)} />
        <LeftRail />
        <RightRail />

        <div className="course-badge">
          <Sparkles size={15} />
          Online Course
        </div>

        <div className="hero-title">
          <span>Connecting Learners to</span>
          <strong>a World of Possibilities.</strong>
        </div>

        <div className="star star-one">+</div>
        <div className="star star-two">+</div>
        <div className="social-arc">
          <span>Social Media</span>
        </div>
        <div className="mentor-arc">
          <span>Mentors</span>
        </div>

        <div className="mentor-strip">
          <div className="mentor-photo mentor-one" />
          <div className="mentor-photo mentor-two" />
          <p>Join us on a journey of discovery, growth, and achievement.</p>
        </div>

        <HeroMosaic />

        <aside className="hero-copy">
          <div className="chip-row">
            {lessonChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
          <p>
            We believe in the limitless potential of{" "}
            <mark>online education</mark> to break down geographical barriers
            and enable individuals to learn at their own pace.
          </p>
          <h2>The First Project is Free</h2>
          <a className="outline-cta" href="/onboarding">
            Mulai onboarding <ArrowUpRight size={14} />
          </a>
        </aside>
      </section>

      <section className="product-app" id="dashboard">
        <div className="section-heading">
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
        </div>
      </section>

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
  return (
    <header className="topbar">
      <a className="logo" href="#home">
        <span>Learn</span>Together<span className="dot">.</span>
      </a>
      <label className="search-pill">
        <Search size={14} />
        <input aria-label="Search" placeholder="Search" />
      </label>
      <button className="mic-button" aria-label="Voice search">
        <Mic size={16} />
      </button>
      <div className="mentor-pill">
        <span className="mini-avatar avatar-a" />
        <span className="mini-avatar avatar-b" />
        <span className="mini-avatar avatar-c" />
        <strong>+1.2k Mentors</strong>
      </div>
      {isSignedIn ? (
        <div className="user-session">
          <UserButton />
          <strong>{displayName}</strong>
        </div>
      ) : (
        <>
          <SignInButton mode="modal">
            <button className="login-btn">Login</button>
          </SignInButton>
          <a className="join-btn" href="/onboarding">
            Mulai <ArrowUpRight size={15} />
          </a>
        </>
      )}
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
