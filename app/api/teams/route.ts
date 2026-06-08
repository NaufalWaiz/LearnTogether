import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const teamSchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().min(8).max(500),
  project_goal: z.string().trim().min(8).max(260),
  owner_role: z.string().trim().min(2).max(80),
  needed_roles: z.array(z.string().trim().min(2).max(80)).min(1).max(12),
  invite_emails: z.array(z.string().trim().email()).max(10).optional().default([])
});

type TeamRow = {
  id: string;
  name: string;
  description: string | null;
  project_goal: string | null;
  needed_roles: string[];
  status: string;
  invite_code: string;
  created_at: string;
  team_members: {
    role_in_team: string | null;
    users: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
  team_join_requests?: {
    user_id: string;
    status: string;
  }[];
};

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("teams")
      .select(
        [
          "id",
          "name",
          "description",
          "project_goal",
          "needed_roles",
          "status",
          "invite_code",
          "created_at",
          "team_members(role_in_team, users(full_name, avatar_url))",
          "team_join_requests(user_id, status)"
        ].join(",")
      )
      .eq("status", "forming")
      .order("created_at", { ascending: false })
      .returns<TeamRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      teams: data.map((team) => ({
        ...team,
        member_count: team.team_members.length,
        my_request_status:
          team.team_join_requests?.find((request) => request.user_id === appUser.id)
            ?.status || null
      }))
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal mengambil daftar team. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body harus berupa JSON." },
      { status: 400 }
    );
  }

  const parsed = teamSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data team tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const body = parsed.data;
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const neededRoles = Array.from(new Set(body.needed_roles));
    const inviteEmails = Array.from(new Set(body.invite_emails));

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        created_by: appUser.id,
        name: body.name,
        description: body.description,
        project_goal: body.project_goal,
        needed_roles: neededRoles,
        matching_reason:
          "Team dibuat dari onboarding. Rekomendasi member bisa disesuaikan dari role yang dibutuhkan."
      })
      .select("id,name,invite_code")
      .single<{ id: string; name: string; invite_code: string }>();

    if (teamError) {
      throw new Error(teamError.message);
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: appUser.id,
      role_in_team: body.owner_role,
      member_status: "active"
    });

    if (memberError) {
      throw new Error(memberError.message);
    }

    if (inviteEmails.length > 0) {
      const { error: inviteError } = await supabase.from("team_invites").upsert(
        inviteEmails.map((email) => ({
          team_id: team.id,
          invited_by: appUser.id,
          email,
          status: "pending"
        })),
        { onConflict: "team_id,email" }
      );

      if (inviteError) {
        throw new Error(inviteError.message);
      }
    }

    return NextResponse.json({ team, invite_count: inviteEmails.length });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal membuat team. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
