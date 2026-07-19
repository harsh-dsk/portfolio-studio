-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Ownership Transfer RPC
-- Migration 003
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function transfer_portfolio_ownership(
  old_id uuid,
  new_id uuid,
  new_email text default null
)
returns boolean
language plpgsql
security definer
as $$
begin
  -- 1. If IDs are identical, nothing to do
  if old_id = new_id then
    return true;
  end if;

  -- 2. If new_id profile already exists, migration is already done
  if exists (select 1 from profiles where id = new_id) then
    return true;
  end if;

  -- 3. Check if old_id profile exists
  if not exists (select 1 from profiles where id = old_id) then
    return false;
  end if;

  -- 4. Copy seed profile to new user_id profile row
  insert into profiles (
    id, name, title, photo_url, phone, email, location, college, objective, availability, created_at, updated_at
  )
  select
    new_id, name, title, photo_url, phone, coalesce(new_email, email), location, college, objective, availability, created_at, now()
  from profiles
  where id = old_id;

  -- 5. Re-link foreign key rows across all child tables
  update social_links      set profile_id = new_id where profile_id = old_id;
  update education         set profile_id = new_id where profile_id = old_id;
  update skill_categories  set profile_id = new_id where profile_id = old_id;
  update projects          set profile_id = new_id where profile_id = old_id;
  update achievements      set profile_id = new_id where profile_id = old_id;
  update external_links    set profile_id = new_id where profile_id = old_id;
  update resume_settings  set profile_id = new_id where profile_id = old_id;

  -- 6. Delete old seed profile
  delete from profiles where id = old_id;

  return true;
exception when others then
  raise;
end;
$$;
