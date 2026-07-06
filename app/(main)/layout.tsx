import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import ClientLayout from "./ClientLayout";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const clerkUser = await currentUser();
  
  if (clerkUser) {
    const supabase = getSupabaseAdmin();
    // Check if user has completed onboarding by checking if they are in users table and have preferred_role
    const { data: user } = await supabase
      .from("users")
      .select("preferred_role")
      .eq("clerk_id", clerkUser.id)
      .single();

    // If no user found or preferred_role is null, redirect to onboarding
    if (!user || !user.preferred_role) {
      redirect("/onboarding");
    }
  }

  return <ClientLayout>{children}</ClientLayout>;
}
