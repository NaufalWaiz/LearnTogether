"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  Send,
  UsersRound
} from "lucide-react";

type Team = {
  id: string;
  name: string;
  description: string | null;
  project_goal: string | null;
  needed_roles: string[];
  status: string;
  invite_code: string;
  member_count: number;
  my_request_status: string | null;
  team_members: {
    role_in_team: string | null;
    users: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
};

export default function TeamsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Memuat daftar team...");
  const [loadingTeamId, setLoadingTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    fetchTeams();
  }, [isSignedIn]);

  async function fetchTeams() {
    setStatus("Memuat daftar team...");

    try {
      const response = await fetch("/api/teams");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal memuat team.");
      }

      setTeams(data.teams);
      setStatus(data.teams.length ? "" : "Belum ada team yang sedang forming.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal memuat team.");
    }
  }

  async function requestJoin(team: Team) {
    const role = selectedRoles[team.id] || team.needed_roles[0] || "Contributor";
    setLoadingTeamId(team.id);

    try {
      const response = await fetch(`/api/teams/${team.id}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requested_role: role,
          message:
            messages[team.id] ||
            `Saya ingin join sebagai ${role} dan berkontribusi ke project ini.`
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Request join gagal.");
      }

      setTeams((current) =>
        current.map((item) =>
          item.id === team.id ? { ...item, my_request_status: "pending" } : item
        )
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Request join gagal.");
    } finally {
      setLoadingTeamId(null);
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
          <h1 className="text-xl font-bold text-slate-900">Find Team</h1>
          <p className="text-sm text-slate-500">Login dulu untuk melihat team dan mengirim request join.</p>
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
        <Link className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition" href="/">
          <ArrowLeft size={17} />
          Home
        </Link>
        <div className="flex items-center gap-6">
          <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition" href="/onboarding">
            Onboarding
          </Link>
          <UserButton />
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 mt-12 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">Team Matching</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Pilih team yang cocok dengan skill kamu.</h1>
        </div>
        <Link className="shrink-0 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm" href="/teams/new">
          <Plus size={17} />
          Create Team
        </Link>
      </section>

      {status && <p className="max-w-6xl mx-auto px-6 text-sm text-amber-600 font-medium mb-6">{status}</p>}

      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const requestPending = team.my_request_status === "pending";

          return (
            <article className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow" key={team.id}>
              <header className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md mb-2">{team.status}</span>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{team.name}</h2>
                </div>
                <strong className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{team.member_count} member</strong>
              </header>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{team.description}</p>
              <div className="flex items-start gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-4">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-amber-800 leading-relaxed">{team.project_goal}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {team.needed_roles.map((role) => (
                  <button
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors border ${
                      (selectedRoles[team.id] || team.needed_roles[0]) === role
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                    key={role}
                    onClick={() =>
                      setSelectedRoles((current) => ({
                        ...current,
                        [team.id]: role
                      }))
                    }
                    type="button"
                  >
                    {role}
                  </button>
                ))}
              </div>

              <textarea
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none mb-4 resize-none bg-slate-50"
                rows={2}
                aria-label={`Join request message for ${team.name}`}
                placeholder="Pesan singkat untuk owner team"
                value={messages[team.id] || ""}
                onChange={(event) =>
                  setMessages((current) => ({
                    ...current,
                    [team.id]: event.target.value
                  }))
                }
              />

              <footer className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4">
                <span className="text-[10px] font-semibold text-slate-400">Invite code: {team.invite_code}</span>
                <div className="flex items-center gap-3">
                  <Link className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition" href={`/teams/${team.id}`}>
                    Room
                  </Link>
                  <button
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      requestPending || loadingTeamId === team.id
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                    }`}
                    disabled={requestPending || loadingTeamId === team.id}
                    onClick={() => requestJoin(team)}
                    type="button"
                  >
                    {loadingTeamId === team.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : requestPending ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {requestPending ? "Requested" : "Request Join"}
                  </button>
                </div>
              </footer>
            </article>
          );
        })}
      </section>
    </main>
  );
}
