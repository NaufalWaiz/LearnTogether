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
    return <main className="flow-page">Loading...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="flow-page auth-required">
        <div className="flow-card compact">
          <UsersRound size={30} />
          <h1>Team Room</h1>
          <p>Login dulu untuk membuka team room.</p>
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
        <button className="ghost-action" onClick={() => router.push("/teams")}>
          <ArrowLeft size={17} />
          Teams
        </button>
        <UserButton />
      </header>

      <section className="flow-hero split">
        <div>
          <span>Team Room</span>
          <h1>{team?.name || "Memuat team..."}</h1>
        </div>
        <div className="top-actions">
          <button
            className="ghost-action"
            disabled={!team || busyAction === "generate-tasks"}
            onClick={generateTasks}
            type="button"
          >
            {busyAction === "generate-tasks" ? (
              <Loader2 className="spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            Generate Task
          </button>
          <button
            className="primary-action"
            disabled={!team || busyAction === "build-portfolio"}
            onClick={buildPortfolio}
            type="button"
          >
            {busyAction === "build-portfolio" ? (
              <Loader2 className="spin" size={16} />
            ) : (
              <FileText size={16} />
            )}
            Build Portfolio
          </button>
        </div>
      </section>

      {status && <p className="page-status">{status}</p>}

      {team && (
        <section className="team-room-layout">
          <div className="team-main-column">
            <article className="flow-card team-overview-card">
              <div>
                <span>{team.status}</span>
                <h2>{team.project_goal || team.name}</h2>
                <p>{team.description}</p>
              </div>
              <div className="team-meta-grid">
                <div>
                  <strong>{activeMembers.length}</strong>
                  <span>Member aktif</span>
                </div>
                <div>
                  <strong>{pendingRequests.length}</strong>
                  <span>Request pending</span>
                </div>
                <div>
                  <strong>{tasks.length}</strong>
                  <span>Task project</span>
                </div>
              </div>
            </article>

            <article className="flow-card">
              <div className="form-heading">
                <CheckCircle2 size={21} />
                <div>
                  <span>Project Tasks</span>
                  <h2>{project?.title || "Belum ada project"}</h2>
                </div>
              </div>

              {tasks.length === 0 ? (
                <p className="empty-state">
                  Belum ada task. Klik Generate Task untuk membuat pembagian kerja otomatis.
                </p>
              ) : (
                <div className="team-task-list">
                  {tasks.map((task) => (
                    <article className="team-task-row" key={task.id}>
                      <div>
                        <span className={`priority ${task.priority}`}>{task.priority}</span>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                      </div>
                      <aside>
                        <strong>{statusLabels[task.status] || task.status}</strong>
                        <span>{task.users?.full_name || "Unassigned"}</span>
                      </aside>
                    </article>
                  ))}
                </div>
              )}
            </article>

            {portfolio && (
              <article className="flow-card portfolio-draft-card">
                <div className="form-heading">
                  <FileText size={21} />
                  <div>
                    <span>Portfolio Draft</span>
                    <h2>{portfolio.title}</h2>
                  </div>
                </div>
                <p>{portfolio.contribution_summary}</p>
                <div className="chip-selector static">
                  {portfolio.skills_proven.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="team-side-column">
            <article className="flow-card">
              <div className="form-heading">
                <UsersRound size={21} />
                <div>
                  <span>Members</span>
                  <h2>Role aktif</h2>
                </div>
              </div>
              <div className="member-list compact-list">
                {activeMembers.map((member) => (
                  <div className="member-row" key={member.id}>
                    <div className="member-avatar">
                      {(member.users?.full_name || "M").slice(0, 1)}
                    </div>
                    <div>
                      <strong>{member.users?.full_name || member.users?.email}</strong>
                      <span>{member.role_in_team || "Contributor"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {isOwner && (
              <article className="flow-card">
                <div className="form-heading">
                  <UserCheck size={21} />
                  <div>
                    <span>Owner Review</span>
                    <h2>Request join</h2>
                  </div>
                </div>

                {pendingRequests.length === 0 ? (
                  <p className="empty-state">Belum ada request join baru.</p>
                ) : (
                  <div className="request-list">
                    {pendingRequests.map((request) => (
                      <article className="request-card" key={request.id}>
                        <strong>
                          {request.users?.full_name || request.users?.email || "Student"}
                        </strong>
                        <span>{request.requested_role || "Contributor"}</span>
                        <p>{request.message || "Tidak ada pesan."}</p>
                        <div>
                          <button
                            className="primary-action"
                            disabled={Boolean(busyAction)}
                            onClick={() => decideRequest(request.id, "approve")}
                            type="button"
                          >
                            <UserCheck size={15} />
                            Approve
                          </button>
                          <button
                            className="ghost-action"
                            disabled={Boolean(busyAction)}
                            onClick={() => decideRequest(request.id, "reject")}
                            type="button"
                          >
                            <UserX size={15} />
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
              <article className="flow-card">
                <h2>Belum menjadi member</h2>
                <p>
                  Kamu bisa request join dari halaman Teams sebelum mengakses fitur kerja team.
                </p>
                <Link className="primary-action wide" href="/teams">
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
