import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type TeamPortfolioRow = {
  id: string;
  name: string;
  created_by: string | null;
  project_goal: string | null;
  team_members: {
    user_id: string;
    role_in_team: string | null;
    member_status: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    tasks: {
      id: string;
      assignee_id: string | null;
      title: string;
      description: string | null;
      status: string;
      evidence_url: string | null;
    }[];
  }[];
};

export async function POST(
  _request: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  const { teamId } = await context.params;

  if (!z.string().uuid().safeParse(teamId).success) {
    return NextResponse.json({ error: "Team id tidak valid." }, { status: 400 });
  }

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select(
        [
          "id",
          "name",
          "created_by",
          "project_goal",
          "team_members(user_id,role_in_team,member_status)",
          "projects(id,title,description,tasks(id,assignee_id,title,description,status,evidence_url))"
        ].join(",")
      )
      .eq("id", teamId)
      .single<TeamPortfolioRow>();

    if (teamError) {
      throw new Error(teamError.message);
    }

    const member = team.team_members.find(
      (item) => item.user_id === appUser.id && item.member_status === "active"
    );

    if (!member && team.created_by !== appUser.id) {
      return NextResponse.json(
        { error: "Kamu belum menjadi member team ini." },
        { status: 403 }
      );
    }

    const project = team.projects[0];

    if (!project) {
      return NextResponse.json(
        { error: "Team ini belum punya project. Generate task dulu." },
        { status: 400 }
      );
    }

    const userTasks = project.tasks.filter((task) => task.assignee_id === appUser.id);
    const doneTasks = userTasks.filter((task) => task.status === "done");
    const referenceTasks = doneTasks.length ? doneTasks : userTasks;
    const taskTitles = referenceTasks.map((task) => task.title);
    const skillsProven = Array.from(
      new Set([
        member?.role_in_team || "Contributor",
        ...taskTitles
          .join(" ")
          .split(/\W+/)
          .filter((word) => word.length > 4)
          .slice(0, 5)
      ])
    );
    const contributionSummary = referenceTasks.length
      ? `Berperan sebagai ${member?.role_in_team || "Contributor"} di ${team.name}. Kontribusi utama: ${taskTitles.join(", ")}.`
      : `Berperan sebagai ${member?.role_in_team || "Contributor"} di ${team.name}. Portfolio draft dibuat dari project goal dan akan semakin kuat setelah task selesai.`;

    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert({
        user_id: appUser.id,
        project_id: project.id,
        title: `${project.title} - ${member?.role_in_team || "Contributor"} Portfolio`,
        description:
          project.description ||
          team.project_goal ||
          "Portfolio kontribusi project LearnTogether.",
        contribution_summary: contributionSummary,
        skills_proven: skillsProven
      })
      .select(
        "id,title,description,contribution_summary,skills_proven,demo_url,repository_url,created_at"
      )
      .single<{
        id: string;
        title: string;
        description: string | null;
        contribution_summary: string | null;
        skills_proven: string[];
        demo_url: string | null;
        repository_url: string | null;
        created_at: string;
      }>();

    if (portfolioError) {
      throw new Error(portfolioError.message);
    }

    return NextResponse.json({
      portfolio,
      task_count: referenceTasks.length,
      done_task_count: doneTasks.length
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal membuat portfolio draft. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
