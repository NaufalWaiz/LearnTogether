"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  UserCheck,
  UserX,
  UsersRound
} from "lucide-react";

type TeamDetail = {
  id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  project_goal: string | null;
  needed_roles: string[];
  status: string;
  invite_code: string;
  matching_reason: string | null;
  team_members: {
    id: string;
    user_id: string;
    role_in_team: string | null;
    member_status: string;
    joined_at: string;
    users: {
      full_name: string | null;
      email: string | null;
      avatar_url: string | null;
    } | null;
  }[];
  team_join_requests: {
    id: string;
    user_id: string;
    requested_role: string | null;
    message: string | null;
    status: string;
    created_at: string;
    users: {
      full_name: string | null;
      email: string | null;
      avatar_url: string | null;
    } | null;
  }[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    level: string | null;
    status: string;
    ai_generated: boolean;
    created_at: string;
    tasks: {
      id: string;
      assignee_id: string | null;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      deadline: string | null;
      evidence_url: string | null;
      ai_feedback: string | null;
      users: {
        full_name: string | null;
        avatar_url: string | null;
      } | null;
    }[];
  }[];
};

type PortfolioDraft = {
  id: string;
  title: string;
  description: string | null;
  contribution_summary: string | null;
  skills_proven: string[];
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done"
};

export default function TeamRoomPage() {
  const router = useRouter();
  const params = useParams<{ teamId: string }>();
  const { isLoaded, isSignedIn } = useUser();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [status, setStatus] = useState("Memuat team room...");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioDraft | null>(null);

  useEffect(() => {
    if (!isSignedIn || !params.teamId) return;
    fetchTeam();
  }, [isSignedIn, params.teamId]);

  const pendingRequests = useMemo(() => {
    return team?.team_join_requests.filter((request) => request.status === "pending") || [];
  }, [team]);

  const activeMembers = useMemo(() => {
    return team?.team_members.filter((member) => member.member_status === "active") || [];
  }, [team]);

  const project = team?.projects[0] || null;
  const tasks = project?.tasks || [];

  async function fetchTeam() {
    setStatus("Memuat team room...");

    try {
      const response = await fetch(`/api/teams/${params.teamId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal memuat team room.");
      }

      setTeam(data.team);
      setIsOwner(Boolean(data.access?.is_owner));
      setIsMember(Boolean(data.access?.is_member));
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal memuat team room.");
    }
  }

  async function decideRequest(requestId: string, action: "approve" | "reject") {
    setBusyAction(`${action}-${requestId}`);

    try {
      const response = await fetch(`/api/teams/${params.teamId}/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal memproses request.");
      }

      await fetchTeam();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal memproses request.");
    } finally {
      setBusyAction(null);
    }
  }

  async function generateTasks() {
    setBusyAction("generate-tasks");
    setStatus("Membuat task dari project goal dan role team...");

    try {
      const response = await fetch(`/api/teams/${params.teamId}/tasks/generate`, {
        method: "POST"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal generate task.");
      }

      setStatus(`${data.tasks.length} task baru dibuat.`);
      await fetchTeam();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal generate task.");
    } finally {
      setBusyAction(null);
    }
  }

  async function buildPortfolio() {
    setBusyAction("build-portfolio");
    setStatus("Menyusun draft portfolio dari kontribusi kamu...");

    try {
      const response = await fetch(`/api/teams/${params.teamId}/portfolio`, {
        method: "POST"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal membuat portfolio.");
      }

      setPortfolio(data.portfolio);
      setStatus("Draft portfolio berhasil dibuat.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal membuat portfolio.");
    } finally {
      setBusyAction(null);
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
          <h1 className="text-xl font-bold text-slate-900">Team Room</h1>
          <p className="text-sm text-slate-500">Login dulu untuk membuka team room.</p>
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
        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition" onClick={() => router.push("/teams")}>
          <ArrowLeft size={17} />
          Teams
        </button>
        <UserButton />
      </header>

      <section className="max-w-6xl mx-auto px-6 mt-12 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">Team Room</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">{team?.name || "Memuat team..."}</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!team || busyAction === "generate-tasks"}
            onClick={generateTasks}
            type="button"
          >
            {busyAction === "generate-tasks" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} className="text-amber-500" />
            )}
            Generate Task
          </button>
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 border border-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!team || busyAction === "build-portfolio"}
            onClick={buildPortfolio}
            type="button"
          >
            {busyAction === "build-portfolio" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <FileText size={16} />
            )}
            Build Portfolio
          </button>
        </div>
      </section>

      {status && <p className="max-w-6xl mx-auto px-6 text-sm text-amber-600 font-medium mb-6">{status}</p>}

      {team && (
        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <article className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="mb-8">
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md mb-2">{team.status}</span>
                <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{team.project_goal || team.name}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{team.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <strong className="text-2xl font-black text-slate-800">{activeMembers.length}</strong>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Member aktif</span>
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <strong className="text-2xl font-black text-slate-800">{pendingRequests.length}</strong>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Request pending</span>
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <strong className="text-2xl font-black text-slate-800">{tasks.length}</strong>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Task project</span>
                </div>
              </div>
            </article>

            <article className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Project Tasks</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{project?.title || "Belum ada project"}</h2>
                </div>
              </div>

              {tasks.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada task. Klik Generate Task untuk membuat pembagian kerja otomatis.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {tasks.map((task) => (
                    <article className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition" key={task.id}>
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded mb-1.5 ${task.priority.toLowerCase() === 'high' ? 'bg-rose-100 text-rose-700' : task.priority.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>{task.priority}</span>
                        <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                      </div>
                      <aside className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                        <strong className="text-xs font-bold text-slate-700">{statusLabels[task.status] || task.status}</strong>
                        <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{task.users?.full_name || "Unassigned"}</span>
                      </aside>
                    </article>
                  ))}
                </div>
              )}
            </article>

            {portfolio && (
              <article className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Portfolio Draft</span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{portfolio.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{portfolio.contribution_summary}</p>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills_proven.map((skill) => (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200" key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="lg:col-span-1 flex flex-col gap-6">
            <article className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <div className="flex items-start gap-3 pb-5 border-b border-slate-100 mb-5">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <UsersRound size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Members</span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">Role aktif</h2>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {activeMembers.map((member) => (
                  <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition" key={member.id}>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {(member.users?.full_name || "M").slice(0, 1)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <strong className="text-sm font-bold text-slate-900 truncate">{member.users?.full_name || member.users?.email}</strong>
                      <span className="text-xs text-slate-500 truncate">{member.role_in_team || "Contributor"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {isOwner && (
              <article className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 pb-5 border-b border-slate-100 mb-5">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Owner Review</span>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">Request join</h2>
                  </div>
                </div>

                {pendingRequests.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada request join baru.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {pendingRequests.map((request) => (
                      <article className="flex flex-col gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50" key={request.id}>
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-sm font-bold text-slate-900 truncate">
                            {request.users?.full_name || request.users?.email || "Student"}
                          </strong>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm shrink-0 border border-slate-200">{request.requested_role || "Contributor"}</span>
                        </div>
                        <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100 mt-1">&quot;{request.message || "Tidak ada pesan."}&quot;</p>
                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-200">
                          <button
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition disabled:opacity-50"
                            disabled={Boolean(busyAction)}
                            onClick={() => decideRequest(request.id, "approve")}
                            type="button"
                          >
                            <UserCheck size={14} />
                            Approve
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold shadow-sm transition disabled:opacity-50"
                            disabled={Boolean(busyAction)}
                            onClick={() => decideRequest(request.id, "reject")}
                            type="button"
                          >
                            <UserX size={14} />
                            Reject
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>
            )}

            {!isMember && !isOwner && (
              <article className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-center">
                <h2 className="text-base font-bold text-slate-900">Belum menjadi member</h2>
                <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
                  Kamu bisa request join dari halaman Teams sebelum mengakses fitur kerja team.
                </p>
                <Link className="flex items-center justify-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition" href="/teams">
                  Cari Team
                </Link>
              </article>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}
