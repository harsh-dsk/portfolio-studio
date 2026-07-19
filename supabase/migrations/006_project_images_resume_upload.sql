-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio CMS — Project Images & Resume PDF Storage Extension
-- Migration 006
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Extend project_images table
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS storage_path text;
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS is_cover boolean NOT NULL DEFAULT false;
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS project_images_project_id_idx ON project_images(project_id);

-- 2. Extend resume_settings table
ALTER TABLE resume_settings ADD COLUMN IF NOT EXISTS resume_mode text NOT NULL DEFAULT 'dynamic';
ALTER TABLE resume_settings ADD COLUMN IF NOT EXISTS resume_pdf_url text;
ALTER TABLE resume_settings ADD COLUMN IF NOT EXISTS resume_storage_path text;
ALTER TABLE resume_settings ADD COLUMN IF NOT EXISTS uploaded_at timestamptz;

-- 3. Create Storage Buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('project-images', 'project-images', true),
  ('resume-files',   'resume-files',   true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Bucket RLS Policies for resume-files
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read resume-files') THEN
    CREATE POLICY "Public read resume-files"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'resume-files' );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated upload resume-files') THEN
    CREATE POLICY "Authenticated upload resume-files"
      ON storage.objects FOR INSERT
      WITH CHECK ( bucket_id = 'resume-files' AND auth.role() = 'authenticated' );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated update resume-files') THEN
    CREATE POLICY "Authenticated update resume-files"
      ON storage.objects FOR UPDATE
      USING ( bucket_id = 'resume-files' AND auth.role() = 'authenticated' );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated delete resume-files') THEN
    CREATE POLICY "Authenticated delete resume-files"
      ON storage.objects FOR DELETE
      USING ( bucket_id = 'resume-files' AND auth.role() = 'authenticated' );
  END IF;
END $$;
