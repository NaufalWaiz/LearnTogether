import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const decisionSchema = z.object({
  action: z.enum(["approve", "reject"])
});

type TeamOwnerRow = {
  created_by: string | null;
};

type JoinRequestRow = {
  id: string;
  team_id: string;
  user_id: string;
  requested_role: string | null;
  status: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ teamId: string; requestId: string }> }
) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  const { teamId, requestId } = await context.params;
  const uuid = z.string().uuid();

  if (!uuid.safeParse(teamId).success || !uuid.safeParse(requestId).success) {
    return NextResponse.json({ error: "Id request tidak valid." }, { status: 400 });
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

  const parsed = decisionSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data approval tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("created_by")
      .eq("id", teamId)
      .single<TeamOwnerRow>();

    if (teamError) {
      throw new Error(teamError.message);
    }

    if (team.created_by !== appUser.id) {
      return NextResponse.json(
        { error: "Hanya owner team yang bisa memproses request join." },
        { status: 403 }
      );
    }

    const { data: joinRequest, error: requestError } = await supabase
      .from("team_join_requests")
      .select("id,team_id,user_id,requested_role,status")
      .eq("id", requestId)
      .eq("team_id", teamId)
      .single<JoinRequestRow>();

    if (requestError) {
      throw new Error(requestError.message);
    }

    if (parsed.data.action === "approve") {
      const { error: memberError } = await supabase.from("team_members").upsert(
        {
          team_id: teamId,
          user_id: joinRequest.user_id,
          role_in_team: joinRequest.requested_role || "Contributor",
          member_status: "active"
        },
        { onConflict: "team_id,user_id" }
      );

      if (memberError) {
        throw new Error(memberError.message);
      }
    }

    const nextStatus = parsed.data.action === "approve" ? "approved" : "rejected";
    const { data, error: updateError } = await supabase
      .from("team_join_requests")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", requestId)
      .select("id,status")
      .single<{ id: string; status: string }>();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ request: data });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal memproses request join. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
