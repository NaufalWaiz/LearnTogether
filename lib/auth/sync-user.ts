import { getSupabaseAdmin } from "@/lib/supabase/server";

export type AppRole = "student" | "mentor" | "admin";

type ClerkEmail = {
  id: string;
  emailAddress: string;
};

export type ClerkIdentity = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string;
  primaryEmailAddressId: string | null;
  emailAddresses: ClerkEmail[];
  publicMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
};

export type AppUser = {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: AppRole;
  bio: string | null;
  learning_goal: string | null;
  preferred_role: string | null;
  availability: string | null;
  skill_interests: unknown;
  created_at: string;
  updated_at: string;
};

const userSelect = [
  "id",
  "clerk_id",
  "email",
  "full_name",
  "username",
  "avatar_url",
  "role",
  "bio",
  "learning_goal",
  "preferred_role",
  "availability",
  "skill_interests",
  "created_at",
  "updated_at"
].join(",");

function normalizeRole(value: unknown): AppRole | null {
  if (value === "student" || value === "mentor" || value === "admin") {
    return value;
  }

  return null;
}

function getPrimaryEmail(user: ClerkIdentity) {
  return (
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user.emailAddresses[0]?.emailAddress ||
    ""
  );
}

export async function syncClerkUserToSupabase(
  user: ClerkIdentity,
  requestedRole?: unknown
) {
  const supabase = getSupabaseAdmin();
  const email = getPrimaryEmail(user);
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    email.split("@")[0] ||
    "Learner";
  const metadataRole =
    normalizeRole(requestedRole) ||
    normalizeRole(user.publicMetadata?.role) ||
    normalizeRole(user.unsafeMetadata?.role) ||
    "student";

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: user.id,
        email,
        full_name: fullName,
        username: user.username,
        avatar_url: user.imageUrl,
        role: metadataRole,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "clerk_id"
      }
    )
    .select(userSelect)
    .single<AppUser>();

  if (error) {
    throw new Error(`Supabase user sync failed: ${error.message}`);
  }

  return data;
}

export async function getAppUserByClerkId(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select(userSelect)
    .eq("clerk_id", clerkId)
    .single<AppUser>();

  if (error) return null;

  return data;
}
