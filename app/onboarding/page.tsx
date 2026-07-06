/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Loader2,
  Plus,
  UsersRound,
  GraduationCap,
  Sparkles,
  Smartphone,
  Database,
  Palette,
  ShieldAlert,
  Target,
  Lightbulb,
  Laptop,
  BookOpen,
  Brain,
  Shield,
  FolderOpen
} from "lucide-react";
import {
  availabilityOptions,
  expertiseCatalog,
  expertiseFields,
  skillLevels
} from "@/lib/onboarding-options";

type TeamPreference = "join" | "create";

const goalOptions = [
  { id: "career_switch", label: "Pindah Karir (Career Switch)", desc: "Ingin beralih profesi ke bidang baru." },
  { id: "get_job", label: "Mendapat Pekerjaan", desc: "Mempersiapkan diri untuk siap kerja dan interview." },
  { id: "build_portfolio", label: "Membangun Portfolio", desc: "Membuat project nyata bersama tim untuk portfolio." },
  { id: "up-skilling", label: "Up-skilling / Iseng", desc: "Mengisi waktu luang atau sekadar memperdalam hobi." }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  const [selectedField, setSelectedField] = useState(expertiseFields[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    expertiseCatalog.Frontend[0],
    expertiseCatalog.Frontend[1]
  ]);
  const [skillLevel, setSkillLevel] = useState<(typeof skillLevels)[number]>(
    "Beginner"
  );
  const [selectedGoal, setSelectedGoal] = useState<string>("build_portfolio");
  const [availability, setAvailability] = useState<string>(availabilityOptions[1]);
  const [teamPreference, setTeamPreference] = useState<TeamPreference>("join");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const availableSkills = useMemo(() => {
    return (
      expertiseCatalog[selectedField as keyof typeof expertiseCatalog] ||
      expertiseCatalog.Frontend
    );
  }, [selectedField]);

  function changeField(field: string) {
    setSelectedField(field);
    setSelectedSkills([
      ...expertiseCatalog[field as keyof typeof expertiseCatalog]
    ].slice(0, 2));
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((current) => {
      if (current.includes(skill)) {
        return current.filter((item) => item !== skill);
      }
      return [...current, skill];
    });
  }

  const nextStep = () => {
    if (currentStep === 2 && selectedSkills.length === 0) {
      setStatus("Pilih minimal satu skill atau software.");
      return;
    }
    setStatus("");
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStatus("");
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  async function submitOnboarding() {
    setIsSaving(true);
    setStatus("Menyimpan profil skill...");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          expertise_field: selectedField,
          skill_level: skillLevel,
          availability,
          skills: selectedSkills,
          learning_goal: selectedGoal,
          team_preference: teamPreference
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Onboarding gagal disimpan.");
      }

      router.push(data.next);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Onboarding gagal disimpan."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isLoaded) {
    return <main className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-sm w-full text-center flex flex-col items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
            <Code2 size={30} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Lengkapi Profil Skill</h1>
          <p className="text-sm text-gray-500 leading-relaxed">Login dulu untuk menyimpan skill dan membuat atau join team.</p>
          <SignInButton mode="modal">
            <button className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md">
              Login <ArrowRight size={17} />
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  const stepMeta = [
    { title: "Apa bidang yang ingin kamu pelajari?", desc: "Pilih bidang yang paling sesuai dengan minatmu agar kami dapat menyesuaikan roadmap belajar dan rekomendasi tim yang paling keren buat kamu!" },
    { title: "Skill apa yang sudah kamu kuasai?", desc: "Beri tahu kami skill, tools, atau framework yang pernah atau sedang kamu pelajari saat ini." },
    { title: "Sesuaikan dengan level kemampuanmu", desc: "Pilih level yang paling merepresentasikan dirimu sekarang agar pencarian partner tim jadi seimbang." },
    { title: "Apa tujuan utama kamu bergabung?", desc: "Sesuaikan ekspektasi akhirmu agar program atau tim yang terbentuk berjalan dengan visi yang sama." }
  ];

  return (
    <main className="relative min-h-screen w-full bg-gray-50/60 overflow-x-hidden flex flex-col justify-between" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        main::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <GraduationCap size={120} className="absolute top-[15%] left-[-2%] text-gray-200/40 -rotate-12 hidden md:block" />
        <Lightbulb size={100} className="absolute top-[45%] right-[-1%] text-yellow-200/30 rotate-12 hidden md:block" />
        <Laptop size={110} className="absolute bottom-[10%] left-[3%] text-orange-200/30 rotate-6 hidden md:block" />
        <Brain size={90} className="absolute top-[8%] right-[5%] text-pink-200/30 -rotate-12 hidden md:block" />
        <BookOpen size={95} className="absolute bottom-[20%] right-[4%] text-emerald-200/30 -rotate-6 hidden md:block" />
        <Sparkles size={40} className="absolute top-[30%] left-[12%] text-amber-200/50 hidden md:block" />
      </div>

      <header className="relative z-10 w-full px-4 py-3 bg-transparent">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" 
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-5">
            <span className="text-sm text-gray-400 hidden sm:inline cursor-pointer hover:text-gray-600 transition-colors">
              Help Center
            </span>
            <button 
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" 
              onClick={() => router.push("/dashboard")}
            >
              Skip
            </button>
            <div className="pl-1 border-l border-gray-200 h-4 flex items-center justify-center hidden sm:block" /> {/* Divider halus */}
            <UserButton />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 py-8">
        
        <section className="text-center w-full max-w-2xl mx-auto mb-8 flex flex-col items-center">
          <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs mb-3">
            START YOUR JOURNEY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-xl">
            {stepMeta[currentStep - 1].title}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mt-2 max-w-lg">
            {stepMeta[currentStep - 1].desc}
          </p>
        </section>
        
        <div className="flex items-center justify-center w-full max-w-md mx-auto mb-10 px-4">
          {[1, 2, 3, 4].map((step, idx) => (
            <div key={step} className="flex items-center w-full last:w-auto">
              <div className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border transition-all duration-300 ${
                  currentStep === step 
                    ? "bg-amber-400 border-amber-400 text-gray-900 ring-4 ring-amber-100" 
                    : currentStep > step 
                      ? "bg-amber-400 border-amber-400 text-gray-900" // Diubah menjadi Background Kuning Centang Hitam
                      : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {currentStep > step ? <Check size={16} className="text-gray-900 font-extrabold" /> : step}
                </div>
                <span className={`text-[11px] font-medium mt-2 absolute -bottom-6 tracking-wide transition-colors ${currentStep === step ? "text-gray-900 font-bold" : "text-gray-400"}`}>
                  {step === 1 ? "Bidang" : step === 2 ? "Skill" : step === 3 ? "Level" : "Tujuan"}
                </span>
              </div>
              {idx < 3 && (
                <div className={`h-1 w-full mx-3 rounded-full transition-all duration-300 ${currentStep > step ? "bg-amber-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[380px] flex flex-col justify-between mt-6 transition-all duration-300">
          
          {currentStep === 1 && (
            <div className="w-full">
              <div className="text-center sm:text-left mb-6">
                <h3 className="text-lg font-bold text-gray-900">Pilih Bidang Utama</h3>
                <p className="text-xs text-gray-400 mt-0.5">Klik salah satu kartu di bawah ini yang paling sesuai dengan minatmu.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {expertiseFields.map((field) => {
                  let cardBg = "bg-gray-50/50";
                  let selectedBorder = "border-gray-400 ring-2 ring-gray-100";
                  let iconColor = "text-gray-600";
                  let IconComponent = Sparkles; 

                  if (field.includes("Frontend")) {
                    cardBg = "bg-[#edf5ff]"; 
                    selectedBorder = "border-orange-500 ring-4 ring-orange-100";
                    iconColor = "text-orange-500";
                    IconComponent = Code2;
                  } else if (field.includes("Backend")) {
                    cardBg = "bg-[#eefdf5]";
                    selectedBorder = "border-emerald-500 ring-4 ring-emerald-100";
                    iconColor = "text-emerald-500";
                    IconComponent = Database;
                  } else if (field.includes("UI/UX")) {
                    cardBg = "bg-[#f5f0ff]"; 
                    selectedBorder = "border-pink-500 ring-4 ring-pink-100";
                    iconColor = "text-pink-500";
                    IconComponent = Palette;
                  } else if (field.includes("Mobile")) {
                    cardBg = "bg-[#fff7eb]";
                    selectedBorder = "border-amber-500 ring-4 ring-amber-100";
                    iconColor = "text-amber-500";
                    IconComponent = Smartphone;
                  } else if (field.includes("Data")) {
                    cardBg = "bg-[#fff0f5]"; 
                    selectedBorder = "border-pink-500 ring-4 ring-pink-100";
                    iconColor = "text-pink-500";
                    IconComponent = Brain;
                  } else if (field.includes("DevOps")) {
                    cardBg = "bg-[#f1f3f5]"; 
                    selectedBorder = "border-slate-500 ring-4 ring-slate-100";
                    iconColor = "text-slate-600";
                    IconComponent = Shield;
                  } else if (field.includes("Project")) {
                    cardBg = "bg-[#f0f9ff]"; 
                    selectedBorder = "border-orange-500 ring-4 ring-orange-100";
                    iconColor = "text-orange-500";
                    IconComponent = FolderOpen;
                  }

                  const isSelected = selectedField === field;

                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() => changeField(field)}
                      className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 group relative ${cardBg} ${
                        isSelected 
                          ? selectedBorder 
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="inline-block">
                        <IconComponent size={24} className={iconColor} />
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{field}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {field.includes("Frontend") && "Bangun antarmuka modern dengan React & Tailwind."}
                          {field.includes("Backend") && "Kelola server, database, dan arsitektur sistem."}
                          {field.includes("UI/UX") && "Rancang pengalaman pengguna yang memukau."}
                          {field.includes("Mobile") && "Ciptakan aplikasi mobile (iOS & Android)."}
                          {field.includes("Data") && "Eksplorasi big data dan machine learning."}
                          {field.includes("DevOps") && "Proteksi aset digital dan infrastruktur IT."}
                          {field.includes("Project") && "Proteksi aset digital dan infrastruktur IT."}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="absolute top-4 right-4 text-[9px] font-bold text-orange-600 bg-white/80 backdrop-blur-xs border border-orange-200 dst px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Check size={10} /> TERPILIH
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
          <div className="w-full">
            <div className="text-center sm:text-left mb-6">
              <h3 className="text-lg font-bold text-gray-900">Pilih Tech Stack / Tools</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pilih skill atau software yang setidaknya sudah pernah kamu gunakan atau mengerti dasarnya.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-8">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                      isSelected 
                        ? "bg-orange-50 border-orange-600 text-orange-700 font-semibold shadow-sm" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-orange-600" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        )}

          {currentStep === 3 && (
            <div className="w-full">
              <div className="text-center sm:text-left mb-6">
                <h3 className="text-lg font-bold text-gray-900">Level Kemampuan & Ketersediaan</h3>
                <p className="text-xs text-gray-400 mt-0.5">Jujur pada diri sendiri membantu kita mencarikan kecocokan tim yang solid.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-700 mb-1">Level Kamu Sekarang</label>
                  {skillLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSkillLevel(level)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-0.5 ${
                        skillLevel === level 
                          ? "border-orange-500 bg-orange-50/30 font-semibold" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="text-sm font-bold text-gray-900">{level}</div>
                      <span className="text-xs text-gray-400 font-normal leading-normal">
                        {level === "Beginner" && "Baru belajar sintaks dasar & belum pernah buat full project."}
                        {level === "Intermediate" && "Sudah paham logic, terbiasa slicing design & membaca API."}
                        {level === "Advanced" && "Bisa arsitektur kode clean, deployment, & optimasi performa."}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Komitmen Waktu (Availability)</label>
                    <select
                      className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm bg-white text-gray-700 transition-all cursor-pointer"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      {availabilityOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50/60 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-xs leading-relaxed">
                    <GraduationCap size={20} className="shrink-0 text-amber-600 mt-0.5" />
                    <p>Sistem pencari tim kami akan mencocokkan waktu luang yang kamu pilih dengan kandidat lain.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="w-full">
              <div className="text-center sm:text-left mb-6">
                <h3 className="text-lg font-bold text-gray-900">Apa tujuan utamamu saat ini?</h3>
                <p className="text-xs text-gray-400 mt-0.5">Bantu kami menyeimbangkan arah gerak tim barumu nanti.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      selectedGoal === goal.id
                        ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <Target size={18} className={`mt-0.5 shrink-0 ${selectedGoal === goal.id ? "text-orange-600" : "text-gray-400"}`} />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{goal.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{goal.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-bold text-gray-700 text-center sm:text-left mb-4">
                  Lalu, kamu mau langsung join ke tim yang ada atau bangun tim sendiri?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className={`flex-1 p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      teamPreference === "join" 
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setTeamPreference("join")}
                  >
                    <UsersRound size={16} /> Join Team yang Tersedia
                  </button>
                  <button
                    type="button"
                    className={`flex-1 p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      teamPreference === "create" 
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setTeamPreference("create")}
                  >
                    <Plus size={16} /> Buat / Owner Team Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {status && (
            <div className="w-full text-xs text-center font-medium mt-4 text-rose-500 bg-rose-50/80 p-3 rounded-xl border border-rose-100 animate-pulse">
              {status}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSaving}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition-all ${
                currentStep === 1 
                  ? "opacity-30 cursor-not-allowed border-gray-200 text-gray-400" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95"
              }`}
            >
              <ArrowLeft size={16} /> Kembali
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-full bg-[#5562AD] text-white hover:opacity-95 text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              >
                Lanjut <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitOnboarding}
                disabled={isSaving}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#1d63dd] via-[#0f3769] to-[#0a1f3d] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Menyimpan...
                  </                  >
                ) : (
                  <>
                    Finish & {teamPreference === "join" ? "Cari Team" : "Buat Team"} <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>

      <footer className="w-full py-4 text-center text-[11px] text-gray-400 relative z-10 select-none">
        &copy; {new Date().getFullYear()} CollabTeam Platform. All rights reserved.
      </footer>
    </main>
  );
}