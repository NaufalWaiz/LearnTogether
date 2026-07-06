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
    return <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full text-center flex flex-col items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <UsersRound size={30} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Create Team</h1>
          <p className="text-sm text-slate-500">Login dulu untuk membuat team dan invite member.</p>
          <SignInButton mode="modal">
            <button className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
              Login <ArrowRight size={17} />
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition" href="/teams">
          <ArrowLeft size={17} />
          Teams
        </Link>
        <UserButton />
      </header>

      <section className="max-w-2xl mx-auto px-6 mt-12 mb-10 text-center">
        <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">Create Team</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Buat team baru dan tentukan kebutuhan role.</h1>
      </section>

      <section className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
              <UsersRound size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Team setup</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Informasi dasar team</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
              Nama team
              <input 
                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-normal bg-slate-50"
                value={name} 
                onChange={(event) => setName(event.target.value)} 
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
              Role kamu
              <select
                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-normal bg-slate-50 cursor-pointer"
                value={ownerRole}
                onChange={(event) => setOwnerRole(event.target.value)}
              >
                {expertiseFields.map((field) => (
                  <option key={field}>{field}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            Deskripsi team
            <textarea
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-normal bg-slate-50 min-h-[100px] resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            Project goal
            <textarea
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-normal bg-slate-50 min-h-[100px] resize-y"
              value={projectGoal}
              onChange={(event) => setProjectGoal(event.target.value)}
            />
          </label>

          <div className="pt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role yang dicari</span>
            <h2 className="text-lg font-bold text-slate-900 mt-1 mb-4">Member yang ingin diundang atau direkrut</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {expertiseFields.map((role) => (
              <button
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                  neededRoles.includes(role)
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
                key={role}
                onClick={() => toggleNeededRole(role)}
                type="button"
              >
                {neededRoles.includes(role) && <Check size={14} />}
                {role}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700 mt-4">
            Invite email
            <textarea
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-normal bg-slate-50 min-h-[80px] resize-y"
              placeholder="Pisahkan dengan koma atau baris baru"
              value={inviteEmails}
              onChange={(event) => setInviteEmails(event.target.value)}
            />
          </label>

          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-800 text-xs leading-relaxed">
            <Mail size={18} className="shrink-0 text-blue-600 mt-0.5" />
            <span>
              Invite disimpan di database sebagai pending invite. Link dan email
              automation bisa ditambahkan setelah MVP ini stabil.
            </span>
          </div>

          <button
            className="mt-4 w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSaving}
            onClick={createTeam}
            type="button"
          >
            {isSaving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />}
            Create Team
          </button>
          {status && <p className="text-center text-sm font-semibold text-rose-500 bg-rose-50 p-3 rounded-xl">{status}</p>}
        </div>
      </section>
    </main>
  );
}
