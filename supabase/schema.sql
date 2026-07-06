create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  email text not null unique,
  full_name text,
  username text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'mentor', 'admin')),
  bio text,
  learning_goal text,
  preferred_role text,
  availability text,
  skill_interests jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  source text not null default 'self_assessment',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  category text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  name text not null,
  description text,
  project_goal text,
  needed_roles jsonb not null default '[]'::jsonb,
  invite_code text not null default encode(gen_random_bytes(8), 'hex') unique,
  status text not null default 'forming' check (status in ('forming', 'active', 'completed')),
  matching_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.teams
add column if not exists created_by uuid references public.users(id) on delete set null;

alter table if exists public.teams
add column if not exists project_goal text;

alter table if exists public.teams
add column if not exists needed_roles jsonb not null default '[]'::jsonb;

alter table if exists public.teams
add column if not exists invite_code text not null default encode(gen_random_bytes(8), 'hex');

create unique index if not exists teams_invite_code_key on public.teams(invite_code);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role_in_team text,
  member_status text not null default 'active' check (member_status in ('active', 'invited')),
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

alter table if exists public.team_members
add column if not exists member_status text not null default 'active'
check (member_status in ('active', 'invited'));

create table if not exists public.team_join_requests (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  requested_role text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.team_invites (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  invited_by uuid references public.users(id) on delete set null,
  email text not null,
  role_in_team text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
  created_at timestamptz not null default now(),
  unique (team_id, email)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  title text not null,
  description text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  deadline timestamptz,
  status text not null default 'planning' check (status in ('planning', 'active', 'review', 'completed')),
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  assignee_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  deadline timestamptz,
  evidence_url text,
  ai_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  content text not null,
  blocker text,
  next_plan text,
  attachment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  progress_update_id uuid references public.progress_updates(id) on delete set null,
  feedback_type text not null default 'learning' check (feedback_type in ('technical', 'teamwork', 'learning', 'timeline')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.peer_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.users(id) on delete cascade,
  reviewee_id uuid not null references public.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  contribution_score integer not null check (contribution_score between 1 and 5),
  communication_score integer not null check (communication_score between 1 and 5),
  responsibility_score integer not null check (responsibility_score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  contribution_summary text,
  skills_proven jsonb not null default '[]'::jsonb,
  demo_url text,
  repository_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('task', 'feedback', 'deadline', 'team')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_user_skills_updated_at on public.user_skills;
create trigger set_user_skills_updated_at
before update on public.user_skills
for each row execute function public.set_updated_at();

drop trigger if exists set_classes_updated_at on public.classes;
create trigger set_classes_updated_at
before update on public.classes
for each row execute function public.set_updated_at();

drop trigger if exists set_teams_updated_at on public.teams;
create trigger set_teams_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists set_team_join_requests_updated_at on public.team_join_requests;
create trigger set_team_join_requests_updated_at
before update on public.team_join_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_portfolios_updated_at on public.portfolios;
create trigger set_portfolios_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();
-- Create the progress tracking table
create table if not exists public.user_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_slug text not null,
  completed_lessons jsonb not null default '[]'::jsonb,
  last_accessed timestamptz not null default now(),
  unique (user_id, course_slug)
);

-- Enable RLS (Row Level Security)
alter table public.user_course_progress enable row level security;

-- Policy: Users can read their own progress
create policy "Users can read own progress"
  on public.user_course_progress for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own progress
create policy "Users can insert own progress"
  on public.user_course_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_course_progress for update
  using (auth.uid() = user_id);
