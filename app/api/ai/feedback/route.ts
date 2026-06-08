import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const AI_TIMEOUT_MS = 6500;

const feedbackSchema = z.object({
  team_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  task_id: z.string().uuid().optional(),
  progress: z.string().trim().min(8).max(2000),
  blocker: z.string().trim().max(1000).optional().default(""),
  nextPlan: z.string().trim().max(1000).optional().default("")
});

type FeedbackRequest = z.infer<typeof feedbackSchema>;

function localFeedback({ progress, blocker, nextPlan }: FeedbackRequest) {
  const progressText = progress?.trim() || "progress belum dijelaskan";
  const blockerText = blocker?.trim();
  const nextText = nextPlan?.trim();

  return [
    `Laporanmu sudah menunjukkan progres utama: ${progressText}.`,
    blockerText
      ? `Kendala "${blockerText}" perlu ditutup dengan satu keputusan kecil atau bantuan dari anggota tim yang relevan.`
      : "Tambahkan kendala jika ada, supaya mentor bisa melihat risiko yang mungkin menghambat task.",
    nextText
      ? `Langkah berikutnya sudah jelas: ${nextText}; lengkapi dengan bukti singkat seperti screenshot, link PR, atau catatan testing.`
      : "Tutup laporan dengan rencana berikutnya yang terukur dan bukti yang akan dikumpulkan."
  ].join(" ");
}

function normalizeFeedback(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/^["'`]+|["'`]+$/g, "")
    .trim();
}

async function generateMentorFeedback(body: FeedbackRequest, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const aiPromise = ai.models
    .generateContent({
      model: MODEL,
      contents: [
        [
          `Laporan progress siswa: ${body.progress}`,
          `Kendala yang ditulis siswa: ${body.blocker || "-"}`,
          `Rencana berikutnya dari siswa: ${body.nextPlan || "-"}`
        ].join("\n")
      ],
      config: {
        systemInstruction: [
          "Anda adalah mentor project learning yang meninjau laporan harian siswa.",
          "Tulis feedback natural dalam bahasa Indonesia, seperti catatan mentor ke siswa.",
          "Jangan memakai pujian generik seperti 'hebat sekali', 'luar biasa', atau 'mantap'.",
          "Rujuk isi laporan siswa secara spesifik: progres, kendala, dan rencana berikutnya.",
          "Beri satu arahan praktis yang bisa dilakukan besok dan satu evidence yang perlu dikumpulkan.",
          "Format satu paragraf, 2 sampai 3 kalimat, maksimal 80 kata."
        ].join(" "),
        temperature: 0.45,
        maxOutputTokens: 180
      }
    })
    .then((response) => ({
      feedback: normalizeFeedback(response.text || localFeedback(body)),
      source: "gemini" as const
    }));
  const timeoutPromise = new Promise<{
    feedback: string;
    source: "fallback";
    timedOut: true;
  }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          feedback: localFeedback(body),
          source: "fallback",
          timedOut: true
        }),
      AI_TIMEOUT_MS
    );
  });

  return Promise.race([aiPromise, timeoutPromise]);
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

  const parsed = feedbackSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data progress tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const apiKey = process.env.GEMINI_API_KEY;
  let appUserId: string | null = null;
  let progressUpdateId: string | null = null;
  let persistenceWarning: string | null = null;

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    appUserId = appUser.id;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("progress_updates")
      .insert({
        user_id: appUser.id,
        team_id: body.team_id,
        project_id: body.project_id,
        task_id: body.task_id,
        content: body.progress,
        blocker: body.blocker,
        next_plan: body.nextPlan
      })
      .select("id")
      .single<{ id: string }>();

    if (error) {
      throw new Error(error.message);
    }

    progressUpdateId = data.id;
  } catch (error) {
    console.warn("Supabase progress persistence failed", error);
    persistenceWarning =
      "Progress belum tersimpan ke Supabase. Pastikan schema database sudah dijalankan.";
  }

  if (!apiKey) {
    const feedback = localFeedback(body);
    await saveFeedback({
      appUserId,
      progressUpdateId,
      feedback,
      persistenceWarning
    });

    return NextResponse.json({
      feedback,
      model: "local-fallback",
      source: "fallback",
      progress_update_id: progressUpdateId,
      saved: Boolean(progressUpdateId),
      warning: persistenceWarning
    });
  }

  try {
    const result = await generateMentorFeedback(body, apiKey);
    const feedback = result.feedback;

    await saveFeedback({
      appUserId,
      progressUpdateId,
      feedback,
      persistenceWarning
    });

    return NextResponse.json({
      feedback,
      model: MODEL,
      source: result.source,
      progress_update_id: progressUpdateId,
      saved: Boolean(progressUpdateId),
      warning:
        "timedOut" in result && result.timedOut
          ? "Gemini terlalu lama merespons, memakai review lokal agar siswa tidak menunggu."
          : persistenceWarning
    });
  } catch (error) {
    console.error("Gemini feedback error", error);
    const feedback = localFeedback(body);

    await saveFeedback({
      appUserId,
      progressUpdateId,
      feedback,
      persistenceWarning
    });

    return NextResponse.json(
      {
        feedback,
        model: MODEL,
        source: "fallback",
        progress_update_id: progressUpdateId,
        saved: Boolean(progressUpdateId),
        warning: persistenceWarning,
        error: "Gemini gagal merespons, memakai fallback lokal."
      },
      { status: 200 }
    );
  }
}

async function saveFeedback({
  appUserId,
  progressUpdateId,
  feedback,
  persistenceWarning
}: {
  appUserId: string | null;
  progressUpdateId: string | null;
  feedback: string;
  persistenceWarning: string | null;
}) {
  if (!appUserId || persistenceWarning) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("ai_feedbacks").insert({
      user_id: appUserId,
      progress_update_id: progressUpdateId,
      feedback_type: "learning",
      content: feedback
    });

    if (error) {
      console.warn("Supabase AI feedback persistence failed", error);
    }
  } catch (error) {
    console.warn("Supabase AI feedback persistence failed", error);
  }
}
