import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

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

export async function GET(
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
    const { data: team, error } = await supabase
      .from("teams")
      .select(
        [
          "id",
          "created_by",
          "name",
          "description",
          "project_goal",
          "needed_roles",
          "status",
          "invite_code",
          "matching_reason",
          "team_members(id,user_id,role_in_team,member_status,joined_at,users(full_name,email,avatar_url))",
          "team_join_requests(id,user_id,requested_role,message,status,created_at,users(full_name,email,avatar_url))",
          "projects(id,title,description,level,status,ai_generated,created_at,tasks(id,assignee_id,title,description,status,priority,deadline,evidence_url,ai_feedback,users(full_name,avatar_url)))"
        ].join(",")
      )
      .eq("id", teamId)
      .single<TeamDetail>();

    if (error) {
      throw new Error(error.message);
    }

    const isOwner = team.created_by === appUser.id;
    const isMember = team.team_members.some(
      (member) => member.user_id === appUser.id && member.member_status === "active"
    );

    if (!isOwner && !isMember && team.status !== "forming") {
      return NextResponse.json(
        { error: "Kamu belum menjadi member team ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      team,
      access: {
        is_owner: isOwner,
        is_member: isMember,
        user_id: appUser.id
      }
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal mengambil detail team. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
