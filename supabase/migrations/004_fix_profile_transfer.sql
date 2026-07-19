-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Fix Profile Ownership Transfer Migration
-- Migration 004
--
-- Safely migrates all portfolio data from seed UUID:
--   a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- to the authenticated user's UUID:
--   0204ed66-18db-4f98-9f10-be5f21a6e7e6
--
-- Safety Features:
-- 1. Deduplicates skill_categories by name and re-links skills to prevent duplicates.
-- 2. Merges duplicate social_links and resume_settings rows.
-- 3. Performs explicit pre-deletion validation checking every child table.
-- 4. Only deletes the seed profile row if ALL child tables have 0 references.
-- 5. Validates post-migration integrity for skills, categories, and project images.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

DO $$
DECLARE
  v_seed_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_target_id uuid := '0204ed66-18db-4f98-9f10-be5f21a6e7e6';
  v_orphaned_count int := 0;
  r_seed_cat RECORD;
  v_target_cat_id uuid;
BEGIN
  -- 1. Check if seed profile exists. If not, exit safely.
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_seed_id) THEN
    RAISE NOTICE 'Seed profile % does not exist. Migration already completed.', v_seed_id;
    RETURN;
  END IF;

  RAISE NOTICE 'Starting ownership transfer from % to %...', v_seed_id, v_target_id;

  -- 2. PROFILES: Ensure target profile row exists with complete content.
  IF EXISTS (SELECT 1 FROM profiles WHERE id = v_target_id) THEN
    UPDATE profiles
    SET
      name         = CASE WHEN NULLIF(profiles.name, '') IS NOT NULL THEN profiles.name ELSE s.name END,
      title        = CASE WHEN NULLIF(profiles.title, '') IS NOT NULL THEN profiles.title ELSE s.title END,
      photo_url    = COALESCE(profiles.photo_url, s.photo_url),
      phone        = CASE WHEN NULLIF(profiles.phone, '') IS NOT NULL THEN profiles.phone ELSE s.phone END,
      email        = CASE WHEN NULLIF(profiles.email, '') IS NOT NULL THEN profiles.email ELSE s.email END,
      location     = CASE WHEN NULLIF(profiles.location, '') IS NOT NULL THEN profiles.location ELSE s.location END,
      college      = CASE WHEN NULLIF(profiles.college, '') IS NOT NULL THEN profiles.college ELSE s.college END,
      objective    = CASE WHEN NULLIF(profiles.objective, '') IS NOT NULL THEN profiles.objective ELSE s.objective END,
      availability = COALESCE(profiles.availability, s.availability),
      updated_at   = NOW()
    FROM profiles s
    WHERE profiles.id = v_target_id AND s.id = v_seed_id;
  ELSE
    INSERT INTO profiles (id, name, title, photo_url, phone, email, location, college, objective, availability, created_at, updated_at)
    SELECT v_target_id, name, title, photo_url, phone, email, location, college, objective, availability, created_at, NOW()
    FROM profiles
    WHERE id = v_seed_id;
  END IF;

  -- 3. RESUME SETTINGS: Merge duplicate resume_settings rows
  IF EXISTS (SELECT 1 FROM resume_settings WHERE profile_id = v_target_id) THEN
    DELETE FROM resume_settings WHERE profile_id = v_seed_id;
  ELSE
    UPDATE resume_settings SET profile_id = v_target_id WHERE profile_id = v_seed_id;
  END IF;

  -- 4. SOCIAL LINKS: Merge duplicate social_links rows
  DELETE FROM social_links s1
  WHERE s1.profile_id = v_seed_id
    AND EXISTS (
      SELECT 1 FROM social_links s2
      WHERE s2.profile_id = v_target_id
        AND LOWER(s2.platform) = LOWER(s1.platform)
    );

  UPDATE social_links SET profile_id = v_target_id WHERE profile_id = v_seed_id;

  -- 5. SKILL CATEGORIES & SKILLS: Merge duplicate categories and preserve all skills
  FOR r_seed_cat IN
    SELECT id, name, sort_order FROM skill_categories WHERE profile_id = v_seed_id
  LOOP
    -- Check if target profile already has a category with the same name (case-insensitive)
    SELECT id INTO v_target_cat_id
    FROM skill_categories
    WHERE profile_id = v_target_id AND LOWER(name) = LOWER(r_seed_cat.name)
    LIMIT 1;

    IF v_target_cat_id IS NOT NULL THEN
      -- Target already has this category: re-link all skills to target category, then remove seed category
      UPDATE skills SET category_id = v_target_cat_id WHERE category_id = r_seed_cat.id;
      DELETE FROM skill_categories WHERE id = r_seed_cat.id;
    ELSE
      -- Target does not have this category: transfer category profile_id to target_id
      UPDATE skill_categories SET profile_id = v_target_id WHERE id = r_seed_cat.id;
    END IF;
  END LOOP;

  -- 6. EDUCATION: Re-link all rows to target UUID
  UPDATE education SET profile_id = v_target_id WHERE profile_id = v_seed_id;

  -- 7. PROJECTS: Re-link all rows to target UUID (preserves all child project_images)
  UPDATE projects SET profile_id = v_target_id WHERE profile_id = v_seed_id;

  -- 8. ACHIEVEMENTS: Re-link all rows to target UUID
  UPDATE achievements SET profile_id = v_target_id WHERE profile_id = v_seed_id;

  -- 9. EXTERNAL LINKS: Re-link all rows to target UUID
  UPDATE external_links SET profile_id = v_target_id WHERE profile_id = v_seed_id;

  -- 10. PRE-DELETION SAFETY VERIFICATION
  -- Explicitly verify that every single child table has 0 remaining references to seed_id.
  SELECT (
    (SELECT count(*) FROM social_links      WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM education         WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM skill_categories  WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM projects          WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM achievements      WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM external_links    WHERE profile_id = v_seed_id) +
    (SELECT count(*) FROM resume_settings  WHERE profile_id = v_seed_id)
  ) INTO v_orphaned_count;

  IF v_orphaned_count > 0 THEN
    RAISE EXCEPTION 'SAFETY ABORT: % child record(s) still reference seed UUID %. Seed profile deletion cancelled.', v_orphaned_count, v_seed_id;
  END IF;

  -- 11. DELETE SEED PROFILE ROW: Only executed after 0 child references remain!
  DELETE FROM profiles WHERE id = v_seed_id;

  RAISE NOTICE 'Ownership transfer and validation completed successfully!';
END $$;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION & AUDIT REPORT
-- Run these queries after applying the migration to verify exact counts
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 'profiles'         AS table_name, count(*) AS total_rows FROM profiles WHERE id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'projects'         AS table_name, count(*) AS total_rows FROM projects WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'project_images'   AS table_name, count(*) AS total_rows FROM project_images
UNION ALL
SELECT 'skill_categories' AS table_name, count(*) AS total_rows FROM skill_categories WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'skills'           AS table_name, count(*) AS total_rows FROM skills WHERE category_id IN (SELECT id FROM skill_categories WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6')
UNION ALL
SELECT 'education'        AS table_name, count(*) AS total_rows FROM education WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'achievements'     AS table_name, count(*) AS total_rows FROM achievements WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'external_links'   AS table_name, count(*) AS total_rows FROM external_links WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'social_links'     AS table_name, count(*) AS total_rows FROM social_links WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6'
UNION ALL
SELECT 'resume_settings'   AS table_name, count(*) AS total_rows FROM resume_settings WHERE profile_id = '0204ed66-18db-4f98-9f10-be5f21a6e7e6';

-- Pre-Deletion & Orphan Audits (All MUST be 0):
SELECT 'orphaned_profiles'         AS check_item, count(*) AS count FROM profiles WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_projects'         AS check_item, count(*) AS count FROM projects WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_education'        AS check_item, count(*) AS count FROM education WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_skill_categories' AS check_item, count(*) AS count FROM skill_categories WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_achievements'     AS check_item, count(*) AS count FROM achievements WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_external_links'   AS check_item, count(*) AS count FROM external_links WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_social_links'     AS check_item, count(*) AS count FROM social_links WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_resume_settings'  AS check_item, count(*) AS count FROM resume_settings WHERE profile_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'orphaned_skills'           AS check_item, count(*) AS count FROM skills WHERE category_id NOT IN (SELECT id FROM skill_categories);
