-- Run this in Supabase SQL Editor to set up the database

-- ============================================
-- 1. Users table
-- ============================================
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL
);

-- ============================================
-- 2. Site Content table
-- ============================================
CREATE TABLE site_content (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section text NOT NULL,
  key text NOT NULL,
  value text DEFAULT '',
  UNIQUE(section, key)
);

-- ============================================
-- 3. Stats table
-- ============================================
CREATE TABLE stats (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label text,
  value text,
  suffix text DEFAULT '',
  "order" int DEFAULT 0
);

-- ============================================
-- 4. Highlights table
-- ============================================
CREATE TABLE highlights (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text,
  subtitle text DEFAULT '',
  duration text DEFAULT '',
  views text DEFAULT '',
  "videoUrl" text DEFAULT '',
  badge text DEFAULT '',
  "badgeColor" text DEFAULT '',
  gradient text DEFAULT '',
  featured boolean DEFAULT false,
  "order" int DEFAULT 0
);

-- ============================================
-- 5. Gallery table
-- ============================================
CREATE TABLE gallery (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text DEFAULT '',
  category text DEFAULT '',
  "imageUrl" text DEFAULT '',
  gradient text DEFAULT '',
  span text DEFAULT '',
  "order" int DEFAULT 0
);

-- ============================================
-- 6. Contacts table
-- ============================================
CREATE TABLE contacts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "firstName" text DEFAULT '',
  "lastName" text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  "enquiryType" text DEFAULT '',
  message text DEFAULT '',
  read boolean DEFAULT false,
  "createdAt" timestamptz DEFAULT now()
);

-- ============================================
-- Enable Row Level Security on all tables
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow all operations (app uses service_role key)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on stats" ON stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on highlights" ON highlights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Seed admin user
-- ============================================
INSERT INTO users (email, "passwordHash")
VALUES (
  'admin@coreymotorsport.com',
  '$2a$10$rOzBBhNpkMKHJ5QxKq5Xje8ZmGKYnFpOBKDLMFGjOe5eK1bLXmMbG'
);

-- ============================================
-- Storage bucket
-- ============================================
-- NOTE: Create a 'media' bucket in the Supabase Storage dashboard.
-- Storage buckets cannot be created via SQL. Go to:
--   Supabase Dashboard > Storage > New Bucket > Name: "media"
-- Set it to public if images need to be served without auth.
