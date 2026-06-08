import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(120).optional(),
  bio: z.string().trim().max(500).optional().nullable(),
  learning_goal: z.string().trim().max(240).optional().nullable(),
  preferred_role: z.string().trim().max(120).optional().nullable(),
  availability: z.string().trim().max(160).optional().nullable(),
  skill_interests: z.array(z.string().trim().min(1).max(60)).max(20).optional()
});

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  try {
    const user = await syncClerkUserToSupabase(clerkUser);

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal mengambil profil dari Supabase." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body harus berupa JSON." },
      { status: 400 }
    );
  }

  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data profil tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("users")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal memperbarui profil di Supabase." },
      { status: 500 }
    );
  }
}
