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
  UsersRound
} from "lucide-react";
import {
  availabilityOptions,
  expertiseCatalog,
  expertiseFields,
  skillLevels
} from "@/lib/onboarding-options";

type TeamPreference = "join" | "create";

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [selectedField, setSelectedField] = useState(expertiseFields[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    expertiseCatalog.Frontend[0],
    expertiseCatalog.Frontend[1]
  ]);
  const [skillLevel, setSkillLevel] = useState<(typeof skillLevels)[number]>(
    "Beginner"
  );
  const [availability, setAvailability] = useState<string>(
    availabilityOptions[1]
  );
  const [learningGoal, setLearningGoal] = useState(
    "Saya ingin belajar membangun project bersama team dan punya portfolio."
  );
  const [teamPreference, setTeamPreference] =
    useState<TeamPreference>("join");
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

  async function submitOnboarding() {
    if (selectedSkills.length === 0) {
      setStatus("Pilih minimal satu skill atau software.");
      return;
    }

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
          learning_goal: learningGoal,
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
    return <main className="flow-page">Loading...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="flow-page auth-required">
        <div className="flow-card compact">
          <Code2 size={30} />
          <h1>Lengkapi Profil Skill</h1>
          <p>Login dulu untuk menyimpan skill dan membuat atau join team.</p>
          <SignInButton mode="modal">
            <button className="primary-action">
              Login <ArrowRight size={17} />
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flow-page">
      <header className="flow-topbar">
        <button className="ghost-action" onClick={() => router.push("/")}>
          <ArrowLeft size={17} />
          Home
        </button>
        <UserButton />
      </header>

      <section className="flow-hero">
        <span>Onboarding</span>
        <h1>Lengkapi profil skill sebelum masuk team.</h1>
      </section>

      <section className="flow-grid">
        <div className="flow-card">
          <div className="form-heading">
            <Code2 size={21} />
            <div>
              <span>Bidang utama</span>
              <h2>Keahlian yang ingin kamu bawa</h2>
            </div>
          </div>

          <div className="option-grid">
            {expertiseFields.map((field) => (
              <button
                className={selectedField === field ? "selected" : ""}
                key={field}
                onClick={() => changeField(field)}
                type="button"
              >
                {field}
              </button>
            ))}
          </div>

          <div className="form-heading subtle">
            <div>
              <span>Skill/software</span>
              <h2>Pilih yang sudah kamu kuasai</h2>
            </div>
          </div>

          <div className="chip-selector">
            {availableSkills.map((skill) => (
              <button
                className={selectedSkills.includes(skill) ? "selected" : ""}
                key={skill}
                onClick={() => toggleSkill(skill)}
                type="button"
              >
                {selectedSkills.includes(skill) && <Check size={14} />}
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="flow-card">
          <div className="form-heading">
            <UsersRound size={21} />
            <div>
              <span>Preferensi belajar</span>
              <h2>Level, waktu, dan arah team</h2>
            </div>
          </div>

          <label className="field-label">
            Level kemampuan
            <select
              value={skillLevel}
              onChange={(event) =>
                setSkillLevel(event.target.value as typeof skillLevel)
              }
            >
              {skillLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Availability
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              {availabilityOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Learning goal
            <textarea
              value={learningGoal}
              onChange={(event) => setLearningGoal(event.target.value)}
            />
          </label>

          <div className="team-choice">
            <button
              className={teamPreference === "join" ? "selected" : ""}
              onClick={() => setTeamPreference("join")}
              type="button"
            >
              <UsersRound size={18} />
              Join Team
            </button>
            <button
              className={teamPreference === "create" ? "selected" : ""}
              onClick={() => setTeamPreference("create")}
              type="button"
            >
              <Plus size={18} />
              Create Team
            </button>
          </div>

          <button
            className="primary-action wide"
            disabled={isSaving}
            onClick={submitOnboarding}
            type="button"
          >
            {isSaving ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />}
            {teamPreference === "join" ? "Simpan & cari team" : "Simpan & buat team"}
          </button>
          {status && <p className="form-status">{status}</p>}
        </div>
      </section>
    </main>
  );
}
