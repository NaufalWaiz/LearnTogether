"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Mail,
  Plus,
  UsersRound
} from "lucide-react";
import { expertiseFields } from "@/lib/onboarding-options";

export default function NewTeamPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [name, setName] = useState("Team Orion");
  const [description, setDescription] = useState(
    "Team belajar project web app dari planning, design, development, sampai portfolio."
  );
  const [projectGoal, setProjectGoal] = useState(
    "Membangun dashboard e-learning sederhana dengan auth, task board, dan portfolio."
  );
  const [ownerRole, setOwnerRole] = useState("Frontend");
  const [neededRoles, setNeededRoles] = useState<string[]>([
    "Backend",
    "UI/UX",
    "Project Management"
  ]);
  const [inviteEmails, setInviteEmails] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function toggleNeededRole(role: string) {
    setNeededRoles((current) => {
      if (current.includes(role)) {
        return current.filter((item) => item !== role);
      }

      return [...current, role];
    });
  }

  async function createTeam() {
    if (neededRoles.length === 0) {
      setStatus("Pilih minimal satu role yang dibutuhkan.");
      return;
    }

    const emails = inviteEmails
      .split(/[\n,]/)
      .map((email) => email.trim())
      .filter(Boolean);

    setIsSaving(true);
    setStatus("Membuat team...");

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          project_goal: projectGoal,
          owner_role: ownerRole,
          needed_roles: neededRoles,
          invite_emails: emails
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal membuat team.");
      }

      router.push("/teams");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal membuat team.");
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
          <UsersRound size={30} />
          <h1>Create Team</h1>
          <p>Login dulu untuk membuat team dan invite member.</p>
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
        <Link className="ghost-action" href="/teams">
          <ArrowLeft size={17} />
          Teams
        </Link>
        <UserButton />
      </header>

      <section className="flow-hero">
        <span>Create Team</span>
        <h1>Buat team baru dan tentukan kebutuhan role.</h1>
      </section>

      <section className="flow-grid single">
        <div className="flow-card">
          <div className="form-heading">
            <UsersRound size={21} />
            <div>
              <span>Team setup</span>
              <h2>Informasi dasar team</h2>
            </div>
          </div>

          <div className="form-two">
            <label className="field-label">
              Nama team
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="field-label">
              Role kamu
              <select
                value={ownerRole}
                onChange={(event) => setOwnerRole(event.target.value)}
              >
                {expertiseFields.map((field) => (
                  <option key={field}>{field}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field-label">
            Deskripsi team
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="field-label">
            Project goal
            <textarea
              value={projectGoal}
              onChange={(event) => setProjectGoal(event.target.value)}
            />
          </label>

          <div className="form-heading subtle">
            <div>
              <span>Role yang dicari</span>
              <h2>Member yang ingin diundang atau direkrut</h2>
            </div>
          </div>

          <div className="chip-selector">
            {expertiseFields.map((role) => (
              <button
                className={neededRoles.includes(role) ? "selected" : ""}
                key={role}
                onClick={() => toggleNeededRole(role)}
                type="button"
              >
                {neededRoles.includes(role) && <Check size={14} />}
                {role}
              </button>
            ))}
          </div>

          <label className="field-label">
            Invite email
            <textarea
              placeholder="Pisahkan dengan koma atau baris baru"
              value={inviteEmails}
              onChange={(event) => setInviteEmails(event.target.value)}
            />
          </label>

          <div className="invite-note">
            <Mail size={17} />
            <span>
              Invite disimpan di database sebagai pending invite. Link dan email
              automation bisa ditambahkan setelah MVP ini stabil.
            </span>
          </div>

          <button
            className="primary-action wide"
            disabled={isSaving}
            onClick={createTeam}
            type="button"
          >
            {isSaving ? <Loader2 className="spin" size={17} /> : <Plus size={17} />}
            Create Team
          </button>
          {status && <p className="form-status">{status}</p>}
        </div>
      </section>
    </main>
  );
}
