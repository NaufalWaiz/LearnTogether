'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

export async function markLessonComplete(courseSlug: string, lessonId: string) {
  try {
    const clerkUser = await currentUser();
    
    // Cookie Fallback Strategy (Works even if not logged in)
    const cookieStore = await cookies();
    const cookieProgressStr = cookieStore.get(`progress_${courseSlug}`)?.value;
    const cookieProgress: string[] = cookieProgressStr ? JSON.parse(cookieProgressStr) : [];
    if (!cookieProgress.includes(lessonId)) {
      cookieProgress.push(lessonId);
      cookieStore.set(`progress_${courseSlug}`, JSON.stringify(cookieProgress));
    }

    if (clerkUser) {
      try {
        const supabase = getSupabaseAdmin();
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkUser.id)
          .single();
        
      if (user) {
        const { data: progress } = await supabase
          .from('user_course_progress')
          .select('completed_lessons')
          .eq('user_id', user.id)
          .eq('course_slug', courseSlug)
          .single();
          
        const completedLessons: string[] = progress?.completed_lessons || [];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
          await supabase.from('user_course_progress').upsert({
            user_id: user.id,
            course_slug: courseSlug,
            completed_lessons: completedLessons,
            last_accessed: new Date().toISOString()
          }, { onConflict: 'user_id, course_slug' });
        }
      }
      } catch {
        console.warn("DB offline, using cookie fallback only.");
      }
    }
    
    revalidatePath(`/pembelajaran/${courseSlug}`);
    revalidatePath(`/pembelajaran/${courseSlug}/${lessonId}/video`);
    revalidatePath(`/pembelajaran/${courseSlug}/${lessonId}/ringkasan`);
    return { success: true };
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return { success: false, error: 'Failed to update progress' };
  }
}
