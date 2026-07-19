-- ═══════════════════════════════════════════════════════════════════════════
-- Run this AFTER applying migration 001
-- The profile UUID a1b2c3d4-e5f6-7890-abcd-ef1234567890 must be added to .env.local as NEXT_PUBLIC_PORTFOLIO_OWNER_ID
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_profile_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_cat_lang uuid;
  v_cat_front uuid;
  v_cat_back uuid;
  v_cat_db uuid;
  v_cat_tools uuid;
  v_proj1 uuid;
  v_proj2 uuid;
  v_proj3 uuid;
BEGIN
  -- Insert profile
  INSERT INTO profiles (id, name, title, phone, email, location, college, objective, availability)
  VALUES (
    v_profile_id,
    'Harshdeep Singh',
    'Full Stack Developer',
    '+91 98765 43210',
    'harshdeep@example.com',
    'Chandigarh, India',
    'Chandigarh University',
    'A passionate Full Stack Developer with hands-on experience building scalable web applications using modern JavaScript technologies. Focused on writing clean, maintainable code and delivering exceptional user experiences. Seeking opportunities to contribute to impactful products and grow as an engineer within a collaborative team environment.',
    'available'
  );

  -- Insert social links
  INSERT INTO social_links (profile_id, platform, label, url, sort_order)
  VALUES 
    (v_profile_id, 'github', 'GitHub', 'https://github.com', 0),
    (v_profile_id, 'linkedin', 'LinkedIn', 'https://linkedin.com', 1),
    (v_profile_id, 'leetcode', 'LeetCode', 'https://leetcode.com', 2);

  -- Insert education
  INSERT INTO education (profile_id, institution, degree, field, period, location, gpa, coursework, sort_order)
  VALUES (
    v_profile_id,
    'Chandigarh University',
    'Bachelor of Engineering',
    'Computer Science & Engineering',
    '2021 – 2025',
    'Chandigarh, India',
    '8.5 / 10',
    ARRAY['Data Structures & Algorithms','Database Management Systems','Operating Systems','Computer Networks','Software Engineering'],
    0
  );

  -- Insert skill categories
  INSERT INTO skill_categories (profile_id, name, sort_order) VALUES (v_profile_id, 'Languages', 0) RETURNING id INTO v_cat_lang;
  INSERT INTO skill_categories (profile_id, name, sort_order) VALUES (v_profile_id, 'Frontend', 1) RETURNING id INTO v_cat_front;
  INSERT INTO skill_categories (profile_id, name, sort_order) VALUES (v_profile_id, 'Backend', 2) RETURNING id INTO v_cat_back;
  INSERT INTO skill_categories (profile_id, name, sort_order) VALUES (v_profile_id, 'Database', 3) RETURNING id INTO v_cat_db;
  INSERT INTO skill_categories (profile_id, name, sort_order) VALUES (v_profile_id, 'Tools & DevOps', 4) RETURNING id INTO v_cat_tools;

  -- Insert skills
  INSERT INTO skills (category_id, name, sort_order) VALUES
    (v_cat_lang, 'JavaScript', 0), (v_cat_lang, 'TypeScript', 1), (v_cat_lang, 'Python', 2), (v_cat_lang, 'SQL', 3),
    (v_cat_front, 'React', 0), (v_cat_front, 'Next.js', 1), (v_cat_front, 'Tailwind CSS', 2), (v_cat_front, 'HTML5', 3), (v_cat_front, 'CSS3', 4),
    (v_cat_back, 'Node.js', 0), (v_cat_back, 'Express.js', 1), (v_cat_back, 'REST APIs', 2), (v_cat_back, 'GraphQL', 3),
    (v_cat_db, 'PostgreSQL', 0), (v_cat_db, 'MongoDB', 1), (v_cat_db, 'Redis', 2), (v_cat_db, 'Supabase', 3),
    (v_cat_tools, 'Git', 0), (v_cat_tools, 'GitHub Actions', 1), (v_cat_tools, 'Vercel', 2), (v_cat_tools, 'Docker', 3), (v_cat_tools, 'Postman', 4);

  -- Insert projects
  INSERT INTO projects (profile_id, title, short_description, full_description, tech_stack, live_url, github_url, sort_order, placeholder_from, placeholder_to, placeholder_accent)
  VALUES (
    v_profile_id,
    'DevFlow',
    'AI-powered developer productivity platform...',
    'A comprehensive productivity platform designed for developers. Includes features like task tracking, code snippet management, and AI-assisted debugging.',
    ARRAY['Next.js 15','TypeScript','Supabase','OpenAI API','Tailwind CSS'],
    'https://devflow.example.com',
    'https://github.com/example/devflow',
    0,
    'oklch(0.15 0.07 258)',
    'oklch(0.11 0.05 278)',
    'oklch(0.63 0.19 251)'
  ) RETURNING id INTO v_proj1;

  INSERT INTO project_images (project_id, url, alt_text, sort_order) VALUES
    (v_proj1, '', 'DevFlow dashboard overview 1', 0),
    (v_proj1, '', 'DevFlow dashboard overview 2', 1),
    (v_proj1, '', 'DevFlow dashboard overview 3', 2);

  INSERT INTO projects (profile_id, title, short_description, full_description, tech_stack, live_url, github_url, sort_order, placeholder_from, placeholder_to, placeholder_accent)
  VALUES (
    v_profile_id,
    'Lumina DS',
    'A modern design system built from the ground up...',
    'Lumina DS is a comprehensive design system featuring highly customizable components, accessible patterns, and robust documentation.',
    ARRAY['React','Storybook','Framer Motion','Tailwind CSS'],
    'https://luminads.example.com',
    'https://github.com/example/luminads',
    1,
    'oklch(0.15 0.05 195)',
    'oklch(0.11 0.04 215)',
    'oklch(0.70 0.17 195)'
  ) RETURNING id INTO v_proj2;

  INSERT INTO project_images (project_id, url, alt_text, sort_order) VALUES
    (v_proj2, '', 'Lumina DS screenshot 1', 0),
    (v_proj2, '', 'Lumina DS screenshot 2', 1),
    (v_proj2, '', 'Lumina DS screenshot 3', 2),
    (v_proj2, '', 'Lumina DS screenshot 4', 3);

  -- Insert projects
  INSERT INTO projects (profile_id, title, short_description, full_description, tech_stack, live_url, github_url, sort_order, placeholder_from, placeholder_to, placeholder_accent)
  VALUES (
    v_profile_id,
    'Pathfinder',
    'Interactive algorithm visualizer for pathfinding and sorting...',
    'Pathfinder helps students and developers understand complex algorithms visually. Features A*, Dijkstra, QuickSort, and MergeSort animations.',
    ARRAY['JavaScript','React','Redux','CSS3'],
    'https://pathfinder.example.com',
    'https://github.com/example/pathfinder',
    2,
    'oklch(0.14 0.06 38)',
    'oklch(0.11 0.04 22)',
    'oklch(0.72 0.18 38)'
  ) RETURNING id INTO v_proj3;

  INSERT INTO project_images (project_id, url, alt_text, sort_order) VALUES
    (v_proj3, '', 'Pathfinder screenshot 1', 0),
    (v_proj3, '', 'Pathfinder screenshot 2', 1),
    (v_proj3, '', 'Pathfinder screenshot 3', 2);

  -- Insert achievements
  INSERT INTO achievements (profile_id, title, description, date, sort_order) VALUES
    (v_profile_id, 'LeetCode — 500+ Problems Solved', '', '2024', 0),
    (v_profile_id, 'Hackathon Winner — DevHack 2024', '', 'Mar 2024', 1),
    (v_profile_id, 'Open Source Contributor', '', '2023 – Present', 2),
    (v_profile_id, 'Google Cloud Certified — Associate Cloud Engineer', '', 'Nov 2023', 3);

  -- Insert external links
  INSERT INTO external_links (profile_id, label, url, description, sort_order) VALUES
    (v_profile_id, 'Personal Blog', 'https://blog.example.com', '', 0),
    (v_profile_id, 'GitHub Profile', 'https://github.com/example', '', 1),
    (v_profile_id, 'Dev.to Articles', 'https://dev.to/example', '', 2);

  -- Insert resume settings
  INSERT INTO resume_settings (profile_id, selected_template)
  VALUES (v_profile_id, 'modern');

END $$;
