import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { syncClerkUserToSupabase } from "@/lib/auth/sync-user";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const AI_TIMEOUT_MS = 6500;

type TeamRow = {
  id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  project_goal: string | null;
  needed_roles: string[];
  team_members: {
    user_id: string;
    role_in_team: string | null;
    member_status: string;
    users: {
      full_name: string | null;
    } | null;
  }[];
  projects: {
    id: string;
    title: string;
  }[];
};

type GeneratedTask = {
  title: string;
  description: string;
  role: string;
  priority: "low" | "medium" | "high";
};

function fallbackTasks(team: TeamRow): GeneratedTask[] {
  const roles = team.needed_roles.length
    ? team.needed_roles
    : team.team_members.map((member) => member.role_in_team || "Contributor");
  const uniqueRoles = Array.from(new Set(roles)).slice(0, 6);
  const baseGoal = team.project_goal || team.description || team.name;
  const tasks: GeneratedTask[] = [
    {
      title: "Susun scope dan acceptance criteria project",
      description: `Ubah goal "${baseGoal}" menjadi checklist fitur, batasan MVP, dan kriteria selesai.`,
      role: "Project Management",
      priority: "high"
    },
    ...uniqueRoles.map((role, index) => ({
      title: `Kerjakan deliverable utama untuk role ${role}`,
      description: `Buat output awal sesuai tanggung jawab ${role}, lalu siapkan bukti kerja berupa catatan, screenshot, atau link PR.`,
      role,
      priority: (index < 2 ? "high" : "medium") as GeneratedTask["priority"]
    }))
  ];

  return tasks.slice(0, 8);
}

function parseTaskJson(rawText: string, team: TeamRow) {
  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { tasks?: GeneratedTask[] };
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];

    return tasks
      .filter((task) => task.title && task.description)
      .map((task) => ({
        title: String(task.title).slice(0, 160),
        description: String(task.description).slice(0, 500),
        role: String(task.role || "Contributor").slice(0, 80),
        priority:
          task.priority === "low" || task.priority === "medium" || task.priority === "high"
            ? task.priority
            : "medium"
      }))
      .slice(0, 8);
  } catch {
    return fallbackTasks(team);
  }
}

async function generateTasksWithTimeout(team: TeamRow) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return fallbackTasks(team);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = [
    `Nama team: ${team.name}`,
    `Deskripsi team: ${team.description || "-"}`,
    `Project goal: ${team.project_goal || "-"}`,
    `Role yang dibutuhkan: ${team.needed_roles.join(", ") || "-"}`,
    `Member aktif: ${team.team_members
      .map((member) => `${member.users?.full_name || "Member"} (${member.role_in_team || "Contributor"})`)
      .join(", ")}`
  ].join("\n");

  const aiPromise = ai.models
    .generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: [
          "Anda adalah mentor project learning.",
          "Buat task MVP yang konkret untuk team belajar.",
          "Balas hanya JSON valid dengan bentuk {\"tasks\":[{\"title\":\"...\",\"description\":\"...\",\"role\":\"...\",\"priority\":\"high|medium|low\"}]}",
          "Maksimal 6 task, setiap task harus punya output yang bisa dibuktikan."
        ].join(" "),
        temperature: 0.35,
        maxOutputTokens: 900
      }
    })
    .then((response) => parseTaskJson(response.text || "", team));

  const timeoutPromise = new Promise<GeneratedTask[]>((resolve) => {
    setTimeout(() => resolve(fallbackTasks(team)), AI_TIMEOUT_MS);
  });

  return Promise.race([aiPromise, timeoutPromise]);
}

export async function POST(
  _request: Request,
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

  try {
    const appUser = await syncClerkUserToSupabase(clerkUser);
    const supabase = getSupabaseAdmin();
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select(
        [
          "id",
          "created_by",
          "name",
          "description",
          "project_goal",
          "needed_roles",
          "team_members(user_id,role_in_team,member_status,users(full_name))",
          "projects(id,title)"
        ].join(",")
      )
      .eq("id", teamId)
      .single<TeamRow>();

    if (teamError) {
      throw new Error(teamError.message);
    }

    const isOwner = team.created_by === appUser.id;
    const isMember = team.team_members.some(
      (member) => member.user_id === appUser.id && member.member_status === "active"
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "Hanya member team yang bisa generate task." },
        { status: 403 }
      );
    }

    let projectId = team.projects[0]?.id;

    if (!projectId) {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          team_id: teamId,
          title: team.project_goal || `${team.name} Project`,
          description: team.description,
          status: "planning",
          ai_generated: true
        })
        .select("id")
        .single<{ id: string }>();

      if (projectError) {
        throw new Error(projectError.message);
      }

      projectId = project.id;
    }

    const generatedTasks = await generateTasksWithTimeout(team);
    const activeMembers = team.team_members.filter(
      (member) => member.member_status === "active"
    );

    const taskRows = generatedTasks.map((task, index) => {
      const assignee =
        activeMembers.find((member) =>
          (member.role_in_team || "").toLowerCase().includes(task.role.toLowerCase())
        ) || activeMembers[index % Math.max(activeMembers.length, 1)];

      return {
        project_id: projectId,
        assignee_id: assignee?.user_id || null,
        title: task.title,
        description: `${task.description}\n\nRole target: ${task.role}`,
        priority: task.priority,
        status: "todo",
        ai_feedback: "Task dibuat otomatis dari project goal dan komposisi role team."
      };
    });

    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .insert(taskRows)
      .select("id,title,description,status,priority,assignee_id")
      .returns<
        {
          id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          assignee_id: string | null;
        }[]
      >();

    if (taskError) {
      throw new Error(taskError.message);
    }

    return NextResponse.json({
      project_id: projectId,
      tasks,
      source: process.env.GEMINI_API_KEY ? "ai-or-timeout-fallback" : "fallback"
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal generate task. Pastikan schema Supabase terbaru sudah dijalankan."
      },
      { status: 500 }
    );
  }
}
