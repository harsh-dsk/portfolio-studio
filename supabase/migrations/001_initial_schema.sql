-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Initial Schema
-- Migration 001
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable pgcrypto for gen_random_uuid() if not already enabled
create extension if not exists "pgcrypto";

-- ── Updated-at trigger function ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ────────────────────────────────────────────────────────────────────────────
-- Table: profiles
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null default '',
  title        text not null default '',
  photo_url    text,
  phone        text not null default '',
  email        text not null default '',
  location     text not null default '',
  college      text not null default '',
  objective    text not null default '',
  availability text not null default 'available',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Authenticated users can manage profiles"
  on profiles for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: social_links
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists social_links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on update cascade on delete cascade,
  platform   text not null,
  label      text not null,
  url        text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists social_links_profile_id_idx on social_links(profile_id);
alter table social_links enable row level security;
create policy "Public social_links are viewable by everyone"
  on social_links for select using (true);
create policy "Authenticated users can manage social_links"
  on social_links for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: education
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists education (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on update cascade on delete cascade,
  institution text not null,
  degree      text not null,
  field       text not null,
  period      text not null,
  location    text not null default '',
  gpa         text,
  coursework  text[],
  description text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists education_profile_id_idx on education(profile_id);
alter table education enable row level security;
create policy "Public education is viewable by everyone"
  on education for select using (true);
create policy "Authenticated users can manage education"
  on education for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: skill_categories
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists skill_categories (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on update cascade on delete cascade,
  name       text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists skill_categories_profile_id_idx on skill_categories(profile_id);
alter table skill_categories enable row level security;
create policy "Public skill_categories are viewable by everyone"
  on skill_categories for select using (true);
create policy "Authenticated users can manage skill_categories"
  on skill_categories for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: skills
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists skills_category_id_idx on skills(category_id);
alter table skills enable row level security;
create policy "Public skills are viewable by everyone"
  on skills for select using (true);
create policy "Authenticated users can manage skills"
  on skills for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: projects
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists projects (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references profiles(id) on update cascade on delete cascade,
  title             text not null,
  short_description text not null default '',
  full_description  text not null default '',
  tech_stack        text[] not null default '{}',
  live_url          text,
  github_url        text,
  sort_order        int  not null default 0,
  placeholder_from  text not null default 'oklch(0.15 0.04 250)',
  placeholder_to    text not null default 'oklch(0.11 0.03 270)',
  placeholder_accent text not null default 'oklch(0.63 0.19 251)',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger projects_updated_at
  before update on projects
  for each row execute procedure set_updated_at();

create index if not exists projects_profile_id_idx on projects(profile_id);
alter table projects enable row level security;
create policy "Public projects are viewable by everyone"
  on projects for select using (true);
create policy "Authenticated users can manage projects"
  on projects for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: project_images
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists project_images (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url        text not null,
  alt_text   text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_id_idx on project_images(project_id);
alter table project_images enable row level security;
create policy "Public project_images are viewable by everyone"
  on project_images for select using (true);
create policy "Authenticated users can manage project_images"
  on project_images for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: achievements
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists achievements (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on update cascade on delete cascade,
  title       text not null,
  description text not null default '',
  date        text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists achievements_profile_id_idx on achievements(profile_id);
alter table achievements enable row level security;
create policy "Public achievements are viewable by everyone"
  on achievements for select using (true);
create policy "Authenticated users can manage achievements"
  on achievements for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: external_links
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists external_links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on update cascade on delete cascade,
  label       text not null,
  url         text not null,
  description text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists external_links_profile_id_idx on external_links(profile_id);
alter table external_links enable row level security;
create policy "Public external_links are viewable by everyone"
  on external_links for select using (true);
create policy "Authenticated users can manage external_links"
  on external_links for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────────────────────
-- Table: resume_settings
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists resume_settings (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null unique references profiles(id) on update cascade on delete cascade,
  selected_template text not null default 'modern',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger resume_settings_updated_at
  before update on resume_settings
  for each row execute procedure set_updated_at();

alter table resume_settings enable row level security;
create policy "Public resume_settings are viewable by everyone"
  on resume_settings for select using (true);
create policy "Authenticated users can manage resume_settings"
  on resume_settings for all using (auth.role() = 'authenticated');
