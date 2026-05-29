-- WeView DB 스키마
-- Supabase 대시보드 → SQL Editor 에서 실행하세요

-- 교사 프로필 (auth.users와 연결)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null default '',
  school text not null default '',
  created_at timestamptz default now()
);

-- 활동 (교사가 만든 평가 활동)
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  criteria jsonb not null default '[]',
  settings jsonb not null default '{"commentsEnabled": true, "anonymous": true}',
  groups jsonb not null default '[]',
  session_id text,  -- 현재 진행 중인 세션 ID (in-memory KV와 연결)
  created_at timestamptz default now()
);

-- 제출 (학생이 제출한 평가)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  session_id text not null,
  student_name text not null default '',
  from_group_id text not null,
  to_group_id text not null,
  scores jsonb not null default '{}',
  comment text not null default '',
  submitted_at timestamptz default now()
);

-- Row Level Security 활성화
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.submissions enable row level security;

-- profiles 정책: 본인만 조회/수정
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- activities 정책: 본인 활동만 조회/수정
create policy "activities_own" on public.activities
  for all using (auth.uid() = teacher_id);

-- submissions 정책: 해당 활동 소유 교사만 조회 + 누구나 삽입
create policy "submissions_read_own" on public.submissions
  for select using (
    exists (
      select 1 from public.activities
      where activities.id = submissions.activity_id
        and activities.teacher_id = auth.uid()
    )
  );

create policy "submissions_insert_all" on public.submissions
  for insert with check (true);

-- 새 유저 가입 시 profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
