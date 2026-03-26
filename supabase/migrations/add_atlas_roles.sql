CREATE TABLE IF NOT EXISTS atlas_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'course_creator', 'wiki_admin')),
  brand TEXT, -- NULL = global (TC), or specific DMC brand name
  granted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, role, brand)
);
CREATE INDEX IF NOT EXISTS idx_atlas_roles_email ON atlas_roles(email);
