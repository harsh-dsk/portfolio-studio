-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Storage Buckets
-- Migration 002
-- ═══════════════════════════════════════════════════════════════════════════

-- Create storage buckets
insert into storage.buckets (id, name, public)
values
  ('profile-images',  'profile-images',  true),
  ('project-images',  'project-images',  true),
  ('resume-assets',   'resume-assets',   true)
on conflict (id) do nothing;

-- ── Storage Policies ────────────────────────────────────────────────────────

-- profile-images: public read, authenticated write
create policy "Public read profile-images"
  on storage.objects for select
  using ( bucket_id = 'profile-images' );

create policy "Authenticated upload profile-images"
  on storage.objects for insert
  with check ( bucket_id = 'profile-images' and auth.role() = 'authenticated' );

create policy "Authenticated update profile-images"
  on storage.objects for update
  using ( bucket_id = 'profile-images' and auth.role() = 'authenticated' );

create policy "Authenticated delete profile-images"
  on storage.objects for delete
  using ( bucket_id = 'profile-images' and auth.role() = 'authenticated' );

-- project-images: public read, authenticated write
create policy "Public read project-images"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

create policy "Authenticated upload project-images"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated update project-images"
  on storage.objects for update
  using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated delete project-images"
  on storage.objects for delete
  using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

-- resume-assets: public read, authenticated write
create policy "Public read resume-assets"
  on storage.objects for select
  using ( bucket_id = 'resume-assets' );

create policy "Authenticated upload resume-assets"
  on storage.objects for insert
  with check ( bucket_id = 'resume-assets' and auth.role() = 'authenticated' );

create policy "Authenticated update resume-assets"
  on storage.objects for update
  using ( bucket_id = 'resume-assets' and auth.role() = 'authenticated' );

create policy "Authenticated delete resume-assets"
  on storage.objects for delete
  using ( bucket_id = 'resume-assets' and auth.role() = 'authenticated' );
