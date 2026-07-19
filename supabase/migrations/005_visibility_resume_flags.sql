-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Add Website Visibility & Include in Resume Flags
-- Migration 005
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add is_visible column to applicable tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE skill_categories ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE education ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE external_links ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

-- 2. Add include_in_resume column to applicable tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE skill_categories ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE education ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE external_links ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS include_in_resume boolean NOT NULL DEFAULT true;

-- 3. Populate any existing rows with true defaults
UPDATE projects SET is_visible = true WHERE is_visible IS NULL;
UPDATE projects SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE skill_categories SET is_visible = true WHERE is_visible IS NULL;
UPDATE skill_categories SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE skills SET is_visible = true WHERE is_visible IS NULL;
UPDATE skills SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE education SET is_visible = true WHERE is_visible IS NULL;
UPDATE education SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE achievements SET is_visible = true WHERE is_visible IS NULL;
UPDATE achievements SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE external_links SET is_visible = true WHERE is_visible IS NULL;
UPDATE external_links SET include_in_resume = true WHERE include_in_resume IS NULL;

UPDATE social_links SET is_visible = true WHERE is_visible IS NULL;
UPDATE social_links SET include_in_resume = true WHERE include_in_resume IS NULL;
