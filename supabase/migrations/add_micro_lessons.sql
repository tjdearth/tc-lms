CREATE TABLE IF NOT EXISTS micro_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  transcript TEXT,
  key_points_html TEXT,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  brand TEXT NOT NULL DEFAULT 'tc',
  is_published BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_micro_lessons_brand ON micro_lessons(brand);
CREATE INDEX IF NOT EXISTS idx_micro_lessons_published ON micro_lessons(is_published);
