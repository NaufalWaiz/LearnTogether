import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getAppUserByClerkId,
  syncClerkUserToSupabase
} from "@/lib/auth/sync-user";

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const existingUser = await getAppUserByClerkId(clerkUser.id);
    const user = existingUser || (await syncClerkUserToSupabase(clerkUser));

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal mengambil user dari Supabase." },
      { status: 500 }
    );
  }
}
