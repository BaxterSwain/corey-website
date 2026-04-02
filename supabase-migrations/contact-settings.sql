-- Contact settings table for admin management
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL DEFAULT 'contact@coreymccullough.com',
  phone TEXT,
  instagram TEXT DEFAULT '@coreymcculloughmotorsport',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default row if not exists
INSERT INTO contact_settings (id, email, phone, instagram, location)
SELECT uuid_generate_v4(), 'contact@coreymccullough.com', '', '@coreymcculloughmotorsport', ''
WHERE NOT EXISTS (SELECT 1 FROM contact_settings LIMIT 1);
