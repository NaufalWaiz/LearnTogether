import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const requestSchema = z.object({
  requested_role: z.string().trim().min(2).max(80),
  message: z.string().trim().max(400).optional().default("")
});

export async function POST(
  request: Request,
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

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body harus berupa JSON." },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data request tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();

    const { data: existingMember, error: memberLookupError } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", appUser.id)
      .maybeSingle<{ id: string }>();

    if (memberLookupError) {
      throw new Error(memberLookupError.message);
    }

    if (existingMember) {
      return NextResponse.json(
        { error: "Kamu sudah menjadi member team ini." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("team_join_requests")
      .upsert(
        {
          team_id: teamId,
          user_id: appUser.id,
          requested_role: parsed.data.requested_role,
          message: parsed.data.message || null,
          status: "pending",
          updated_at: new Date().toISOString()
        },
        { onConflict: "team_id,user_id" }
      )
      .select("id,status")
      .single<{ id: string; status: string }>();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ request: data });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal mengirim request join. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
