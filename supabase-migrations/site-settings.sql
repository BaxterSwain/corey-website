-- Site settings table for global site metadata
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Corey McCullough | Motorsport Racer',
  meta_description TEXT,
  favicon_url TEXT DEFAULT '/favicon.ico',
  theme_primary_color TEXT DEFAULT '#2a6dc7',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default row
INSERT INTO site_settings (id, site_title, meta_description, favicon_url, theme_primary_color)
SELECT uuid_generate_v4(), 'Corey McCullough | Motorsport Racer', 'Official website of Corey McCullough - professional motorsport racer pushing the limits of speed, precision, and performance.', '/favicon.ico', '#2a6dc7'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);
