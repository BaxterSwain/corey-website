-- Add gallery_id column to highlights table
ALTER TABLE IF EXISTS highlights
ADD COLUMN IF NOT EXISTS gallery_id INTEGER;

-- Add foreign key constraint from highlights.gallery_id to gallery.id
ALTER TABLE IF EXISTS highlights
ADD CONSTRAINT IF NOT EXISTS highlights_gallery_id_fkey
FOREIGN KEY (gallery_id)
REFERENCES gallery(id)
ON DELETE SET NULL;
