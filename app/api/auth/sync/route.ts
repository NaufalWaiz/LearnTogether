import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";

const syncSchema = z
  .object({
    role: z.enum(["student", "mentor", "admin"]).optional()
  })
  .optional();

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "User belum login." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = undefined;
  }

  const parsed = syncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Role tidak valid. Gunakan student, mentor, atau admin." },
      { status: 400 }
    );
  }

  try {
    const user = await syncClerkUserToSupabase(clerkUser, parsed.data?.role);

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal sinkronisasi user ke Supabase. Pastikan schema database sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
