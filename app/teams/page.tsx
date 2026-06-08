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
    return <main className="flow-page">Loading...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="flow-page auth-required">
        <div className="flow-card compact">
          <UsersRound size={30} />
          <h1>Find Team</h1>
          <p>Login dulu untuk melihat team dan mengirim request join.</p>
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
        <Link className="ghost-action" href="/">
          <ArrowLeft size={17} />
          Home
        </Link>
        <div className="top-actions">
          <Link className="ghost-action" href="/onboarding">
            Onboarding
          </Link>
          <UserButton />
        </div>
      </header>

      <section className="flow-hero split">
        <div>
          <span>Team Matching</span>
          <h1>Pilih team yang cocok dengan skill kamu.</h1>
        </div>
        <Link className="primary-action" href="/teams/new">
          <Plus size={17} />
          Create Team
        </Link>
      </section>

      {status && <p className="page-status">{status}</p>}

      <section className="team-list">
        {teams.map((team) => {
          const requestPending = team.my_request_status === "pending";

          return (
            <article className="team-card" key={team.id}>
              <header>
                <div>
                  <span>{team.status}</span>
                  <h2>{team.name}</h2>
                </div>
                <strong>{team.member_count} member</strong>
              </header>

              <p>{team.description}</p>
              <div className="goal-box">
                <CheckCircle2 size={17} />
                <span>{team.project_goal}</span>
              </div>

              <div className="needed-role-list">
                {team.needed_roles.map((role) => (
                  <button
                    className={
                      (selectedRoles[team.id] || team.needed_roles[0]) === role
                        ? "selected"
                        : ""
                    }
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

              <footer>
                <span>Invite code: {team.invite_code}</span>
                <div className="team-card-actions">
                  <Link className="ghost-action" href={`/teams/${team.id}`}>
                    Room
                  </Link>
                  <button
                    className="primary-action"
                    disabled={requestPending || loadingTeamId === team.id}
                    onClick={() => requestJoin(team)}
                    type="button"
                  >
                    {loadingTeamId === team.id ? (
                      <Loader2 className="spin" size={16} />
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
