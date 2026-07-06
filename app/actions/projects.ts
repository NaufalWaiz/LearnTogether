/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getUserProjects() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: 'Unauthorized' };

    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', clerkUser.id).single();
    if (!user) return { success: false, error: 'User not found in DB' };

    // Get teams the user is in
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id);
      
    if (!teamMembers || teamMembers.length === 0) return { success: true, data: [] };

    const teamIds = teamMembers.map(tm => tm.team_id);

    // Get projects for those teams
    const { data: projects } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        deadline,
        team_id,
        teams (
          name,
          team_members (
            users (
              avatar_url
            )
          )
        )
      `)
      .in('team_id', teamIds);

    if (!projects) return { success: true, data: [] };

    // Calculate progress for each project (mocked or from tasks if available)
    const formattedProjects = await Promise.all(projects.map(async (p: any) => {
      // Get tasks to calculate progress
      const { data: tasks } = await supabase.from('tasks').select('status').eq('project_id', p.id);
      let progress = 0;
      if (tasks && tasks.length > 0) {
        const done = tasks.filter(t => t.status === 'done').length;
        progress = Math.round((done / tasks.length) * 100);
      } else {
        progress = Math.floor(Math.random() * 50) + 10; // Random fallback if no tasks
      }

      // Extract member avatars
      const members = p.teams?.team_members?.map((tm: any) => tm.users?.avatar_url || '') || [];

      return {
        id: p.id,
        name: p.title,
        teamName: p.teams?.name || 'Unknown Team',
        progress,
        dueDate: p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Deadline',
        members: members
      };
    }));

    return { success: true, data: formattedProjects };
  } catch (error) {
    console.error("DB Error in getUserProjects:", error);
    return { success: false, error: 'DB Fetch failed' };
  }
}

export async function createProjectAndTeam(projectName: string, teamName: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: 'Unauthorized' };
    
    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', clerkUser.id).single();
    if (!user) throw new Error("User not found");

    // 1. Create team
    const { data: team, error: teamErr } = await supabase.from('teams').insert({
      name: teamName || 'General Team',
      created_by: user.id,
      status: 'active'
    }).select('id').single();

    if (teamErr || !team) throw teamErr;

    // 2. Add user to team
    await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: user.id,
      role_in_team: 'Lead',
      member_status: 'active'
    });

    // 3. Create project
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + 1); // 1 month from now

    const { data: project, error: projErr } = await supabase.from('projects').insert({
      team_id: team.id,
      title: projectName,
      status: 'planning',
      deadline: deadline.toISOString()
    }).select('id').single();

    if (projErr || !project) throw projErr;

    revalidatePath('/tim-proyek');
    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: 'Failed to create' };
  }
}

export async function getProjectDetail(projectId: string) {
  try {
    const supabase = getSupabaseAdmin();
    // Fetch project
    const { data: project } = await supabase
      .from('projects')
      .select(`
        id, title, description, deadline, created_at,
        teams (
          name,
          team_members (
            role_in_team,
            users ( id, full_name, avatar_url )
          )
        )
      `)
      .eq('id', projectId)
      .single();

    if (!project) return { success: false, error: 'Project not found' };

    // Fetch tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    return { success: true, project, tasks: tasks || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch details' };
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function addTask(projectId: string, taskData: any) {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('tasks').insert({
      project_id: projectId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee_id: taskData.assignee_id || null,
      deadline: new Date().toISOString()
    }).select('id').single();
    
    return { success: true, taskId: data?.id };
  } catch (error) {
    return { success: false };
  }
}

export async function updateProjectDescription(projectId: string, newDescription: string) {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('projects').update({ description: newDescription }).eq('id', projectId);
    revalidatePath(`/tim-proyek/${projectId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update description' };
  }
}
