import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const onboardingSchema = z.object({
  expertise_field: z.string().trim().min(2).max(80),
  skill_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  availability: z.string().trim().min(2).max(160),
  skills: z.array(z.string().trim().min(1).max(80)).min(1).max(20),
  learning_goal: z.string().trim().max(240).optional().default(""),
  team_preference: z.enum(["join", "create"])
});

const levelScore = {
  Beginner: 45,
  Intermediate: 70,
  Advanced: 90
} as const;

type SkillRow = {
  id: string;
  name: string;
};

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

  const parsed = onboardingSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data onboarding tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const body = parsed.data;
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const uniqueSkills = Array.from(new Set(body.skills));

    const { error: profileError } = await supabase
      .from("users")
      .update({
        preferred_role: body.expertise_field,
        availability: body.availability,
        learning_goal: body.learning_goal || null,
        skill_interests: uniqueSkills,
        updated_at: new Date().toISOString()
      })
      .eq("id", appUser.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { error: skillUpsertError } = await supabase.from("skills").upsert(
      uniqueSkills.map((skill) => ({
        name: skill,
        category: body.expertise_field
      })),
      { onConflict: "name" }
    );

    if (skillUpsertError) {
      throw new Error(skillUpsertError.message);
    }

    const { data: skills, error: skillSelectError } = await supabase
      .from("skills")
      .select("id,name")
      .in("name", uniqueSkills)
      .returns<SkillRow[]>();

    if (skillSelectError) {
      throw new Error(skillSelectError.message);
    }

    const { error: userSkillError } = await supabase.from("user_skills").upsert(
      skills.map((skill) => ({
        user_id: appUser.id,
        skill_id: skill.id,
        score: levelScore[body.skill_level],
        source: "onboarding",
        updated_at: new Date().toISOString()
      })),
      { onConflict: "user_id,skill_id" }
    );

    if (userSkillError) {
      throw new Error(userSkillError.message);
    }

    // Set Clerk publicMetadata to indicate onboarding is complete
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        onboardingComplete: true
      }
    });

    return NextResponse.json({
      saved: true,
      next: "/dashboard" // changed from /teams so they go to dashboard which has everything
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal menyimpan onboarding. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
