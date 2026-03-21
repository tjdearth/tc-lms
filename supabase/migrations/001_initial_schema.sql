-- TC Wiki/LMS Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================
-- 1. wiki_nodes — Tree structure for wiki/knowledge base
-- ============================================================
CREATE TABLE IF NOT EXISTS wiki_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES wiki_nodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  sort_order INTEGER DEFAULT 0,
  node_type TEXT NOT NULL DEFAULT 'heading' CHECK (node_type IN ('heading', 'article')),
  html_content TEXT,
  search_text TEXT,
  brand TEXT NOT NULL DEFAULT 'tc',
  icon TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wiki_nodes_parent ON wiki_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_nodes_brand ON wiki_nodes(brand);
CREATE INDEX IF NOT EXISTS idx_wiki_nodes_slug ON wiki_nodes(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_nodes_search ON wiki_nodes USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(search_text, '')));

-- ============================================================
-- 2. calendar_events — DMC brand holidays and festivals
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_start DATE NOT NULL,
  date_end DATE,
  event_type TEXT NOT NULL DEFAULT 'public_holiday' CHECK (event_type IN ('public_holiday', 'festival', 'peak_season', 'low_season', 'office_closure', 'custom')),
  impact_notes TEXT,
  country TEXT,
  recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_brand ON calendar_events(brand);
CREATE INDEX IF NOT EXISTS idx_calendar_dates ON calendar_events(date_start, date_end);
CREATE INDEX IF NOT EXISTS idx_calendar_country ON calendar_events(country);
CREATE INDEX IF NOT EXISTS idx_calendar_event_type ON calendar_events(event_type);

-- ============================================================
-- 3. Row Level Security
-- ============================================================

-- Enable RLS
ALTER TABLE wiki_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- wiki_nodes policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'wiki_nodes_select_all' AND tablename = 'wiki_nodes') THEN
    CREATE POLICY wiki_nodes_select_all ON wiki_nodes FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'wiki_nodes_insert_authenticated' AND tablename = 'wiki_nodes') THEN
    CREATE POLICY wiki_nodes_insert_authenticated ON wiki_nodes FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'wiki_nodes_update_authenticated' AND tablename = 'wiki_nodes') THEN
    CREATE POLICY wiki_nodes_update_authenticated ON wiki_nodes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'wiki_nodes_delete_authenticated' AND tablename = 'wiki_nodes') THEN
    CREATE POLICY wiki_nodes_delete_authenticated ON wiki_nodes FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- calendar_events policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calendar_events_select_all' AND tablename = 'calendar_events') THEN
    CREATE POLICY calendar_events_select_all ON calendar_events FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calendar_events_insert_authenticated' AND tablename = 'calendar_events') THEN
    CREATE POLICY calendar_events_insert_authenticated ON calendar_events FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calendar_events_update_authenticated' AND tablename = 'calendar_events') THEN
    CREATE POLICY calendar_events_update_authenticated ON calendar_events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calendar_events_delete_authenticated' AND tablename = 'calendar_events') THEN
    CREATE POLICY calendar_events_delete_authenticated ON calendar_events FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ============================================================
-- 4. Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS wiki_nodes_updated_at ON wiki_nodes;
CREATE TRIGGER wiki_nodes_updated_at
  BEFORE UPDATE ON wiki_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS calendar_events_updated_at ON calendar_events;
CREATE TRIGGER calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
